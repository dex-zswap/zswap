import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { JSBI } from 'zswap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { formatUnits } from '@ethersproject/units'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useToken, useZBSTToken } from 'hooks/Tokens'
import { useLPTokenBalance } from 'hooks/useTokenBalance'
import { useZSwapLPContract, usePairContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { usePair } from 'hooks/usePairs'
import useZUSDPrice, { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokenBalance } from 'state/wallet/hooks'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import { BIG_TEN, BIG_ONE, BIG_ZERO, BIG_HUNDERED, BIG_ONE_YEAR } from 'utils/bigNumber'
import getLpReward from 'config/reward/lp'
import { addLockedValue } from './useTotalValueLocked/state'

const JSBI_ZERO = JSBI.BigInt(0)

type PairsInfo = {
  pair: string
  weight: number
  token0: string
  token1: string
}

export function usePairInfo(pair: PairsInfo, allWeights: number[]): any {
  const dispatch = useAppDispatch()
  const { slowRefresh, fastRefresh } = useRefresh()
  const { chainId, account } = useActiveWeb3React()
  const lpContract = useZSwapLPContract()
  const pairToken = useToken(pair.pair)
  const zbstPrice = useZBSTZUSTPrice()

  const lpReward = getLpReward(allWeights, pair.weight)
  const zbstToken = useZBSTToken()

  const [allowance, setAllowance] = useState({
    loading: true,
    result: null,
  })

  const pairContract = usePairContract(pair.pair, true)

  const token0 = useToken(pair.token0)
  const token1 = useToken(pair.token1)

  const currency0 = wrappedCurrency(token0, chainId)
  const currency1 = wrappedCurrency(token1, chainId)

  const currency0USDTPrice = useZUSDPrice(token0)
  const currency1USDTPrice = useZUSDPrice(token1)

  const token0Amount = useLPTokenBalance(pair.token0, pair.pair)
  const token1Amount = useLPTokenBalance(pair.token1, pair.pair)

  const userShares = useContractCall(lpContract, 'getUserShare', [pair.pair, account])

  const [pairState, pairInfo] = usePair(currency0, currency1)

  const pairBalanceOf = useTokenBalance(lpContract.address, pairToken)
  const userPoolBalance = useTokenBalance(account ?? undefined, pairInfo?.liquidityToken)
  const totalPoolTokens = useTotalSupply(pairInfo?.liquidityToken)

  const [reward, setReward] = useState({
    loading: true,
    result: BIG_ZERO,
  })

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        const result = await pairContract.allowance(account, lpContract.address)
        setAllowance((state) => ({
          loading: false,
          result,
        }))
      } catch (e) {
        setAllowance((state) => ({
          loading: false,
          result: null,
        }))
      }
    }

    if (account && pair.pair) {
      fetchAllowance()
    }
  }, [slowRefresh, account, pair.pair])

  // FIXME: 不知道为啥checkReward总是调用不起来所以用这种方式先完成功能
  useEffect(() => {
    const fetchReward = async () => {
      try {
        const res = await lpContract.predReward(pair.pair)
        if (res) {
          setReward(() => ({
            loading: false,
            result: new BigNumber(res.toString())
              .dividedBy(BIG_TEN.pow(pairInfo?.liquidityToken?.decimals))
              .integerValue(BigNumber.ROUND_DOWN),
          }))
        } else {
          setReward(() => ({
            loading: false,
            result: BIG_ZERO,
          }))
        }
      } catch (e) {
        setReward(() => ({
          loading: false,
          result: BIG_ZERO,
        }))
      }
    }

    if (pair) {
      fetchReward()
    }
  }, [pair, fastRefresh])

  const rewardZustValue = useMemo(() => {
    if (!zbstPrice || !zbstToken) {
      return BIG_ZERO
    }

    return lpReward.multipliedBy(new BigNumber(zbstPrice.toSignificant(zbstToken.decimals)))
  }, [zbstPrice, lpReward, zbstToken])

  const [token0Deposited, token1Deposited] =
    totalPoolTokens &&
    userPoolBalance &&
    JSBI.greaterThan(totalPoolTokens.raw, JSBI_ZERO) &&
    JSBI.greaterThan(userPoolBalance.raw, JSBI_ZERO) &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pairInfo.getLiquidityValue(pairInfo.token0, totalPoolTokens, userPoolBalance, false),
          pairInfo.getLiquidityValue(pairInfo.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const tokenRate = useMemo(() => {
    if (!pairInfo || !token0 || !token1) {
      return BIG_ZERO
    }

    return new BigNumber(pairInfo.reserve0.toExact()).dividedBy(
      new BigNumber(pairInfo.reserve1.toExact()),
    )
  }, [pairInfo, token0, token1])

  const tokenLpAmount = useMemo(() => {
    return {
      token0: token0Amount.balance ? token0Amount.balance.div(BIG_TEN.pow(token0?.decimals)) : BIG_ZERO,
      token1: token1Amount.balance ? token1Amount.balance.div(BIG_TEN.pow(token1?.decimals)) : BIG_ZERO,
    }
  }, [token0Amount, token1Amount, token0, token1])

  const tokenPrice = useMemo(() => {
    return {
      token0: currency0USDTPrice ? new BigNumber(currency0USDTPrice.toSignificant(4)) : BIG_ZERO,
      token1: currency1USDTPrice ? new BigNumber(currency1USDTPrice.toSignificant(4)) : BIG_ZERO,
    }
  }, [currency0USDTPrice, currency1USDTPrice])

  const userSharesBigNumber = useMemo(() => {
    if (!userShares.result || !pairInfo) {
      return BIG_ZERO
    }

    return new BigNumber(formatUnits(userShares.result, pairInfo.liquidityToken.decimals))
  }, [userShares, pairInfo, tokenLpAmount])

  const userSharePercent = useMemo(() => {
    if (!totalPoolTokens) {
      return '0.00'
    }

    const balance = new BigNumber(totalPoolTokens.toExact())
    return userSharesBigNumber.dividedBy(balance).multipliedBy(BIG_HUNDERED).toFixed(4, BigNumber.ROUND_DOWN)
  }, [userSharesBigNumber, totalPoolTokens])

  const lpTotalTokens = useMemo(() => {
    return tokenLpAmount.token0
      .multipliedBy(tokenPrice.token0)
      .plus(tokenLpAmount.token1.multipliedBy(tokenPrice.token1))
      .toFixed(4, BigNumber.ROUND_DOWN)
  }, [tokenLpAmount, tokenPrice])

  const tokenBalance = useMemo(() => {
    if (!userPoolBalance) {
      return BIG_ZERO
    }

    const userPoolBalanceBigNumber = new BigNumber(userPoolBalance.toFixed(4))
    return userPoolBalanceBigNumber
  }, [userPoolBalance, userSharesBigNumber, tokenLpAmount])

  const liquidityInfo = useMemo(() => {
    if (!token0Deposited || !token1Deposited || !token0 || !token1 || !pairBalanceOf) {
      return {
        tokenAmount: 0,
        quoteTokenAmount: 0,
        userSharePercent: '0.00',
        zustValue: 0,
        lockedValue: 0,
        staked: 0,
        userAvaliableZust: 0,
      }
    }

    const lpTokenBigNumber = new BigNumber(lpTotalTokens)
    const userSharePercentBigNumber = new BigNumber(userSharePercent)
    const stakedPercent = lpTokenBigNumber.isEqualTo(BIG_ZERO)
      ? BIG_ZERO
      : userSharesBigNumber.dividedBy(lpTokenBigNumber)
    const token0DepositedBigNumber = new BigNumber(token0Deposited.toExact())
    const token1DepositedBigNumber = new BigNumber(token1Deposited.toExact())

    const token0RealDeposited = tokenLpAmount.token0.multipliedBy(userSharePercentBigNumber).dividedBy(BIG_HUNDERED)
    const token1RealDeposited = tokenLpAmount.token1.multipliedBy(userSharePercentBigNumber).dividedBy(BIG_HUNDERED)

    const userAvaliableZust = token0DepositedBigNumber
      .multipliedBy(tokenPrice.token0)
      .plus(token1DepositedBigNumber.multipliedBy(tokenPrice.token1))
      .multipliedBy(BIG_ONE.minus(stakedPercent))
      .toFixed(4, BigNumber.ROUND_DOWN)
    const lockedValue = tokenLpAmount.token0
      .multipliedBy(tokenPrice.token0)
      .plus(tokenLpAmount.token1.multipliedBy(tokenPrice.token1))
    const zustValue = lockedValue.multipliedBy(userSharePercentBigNumber).dividedBy(BIG_HUNDERED)

    return {
      tokenAmount: token0RealDeposited.toFixed(2, BigNumber.ROUND_DOWN),
      quoteTokenAmount: token1RealDeposited.toFixed(2, BigNumber.ROUND_DOWN),
      userSharePercent: userSharePercentBigNumber.toFixed(2, BigNumber.ROUND_DOWN),
      zustValue: zustValue.toFixed(2, BigNumber.ROUND_DOWN),
      staked: userSharesBigNumber.toFixed(4, BigNumber.ROUND_DOWN),
      lockedValue,
      userAvaliableZust,
    }
  }, [
    pairBalanceOf,
    userSharesBigNumber,
    userSharePercent,
    lpTotalTokens,
    token0,
    token1,
    tokenPrice,
    token0Deposited,
    token1Deposited,
    slowRefresh,
    tokenLpAmount,
  ])

  const displayApr = useMemo(() => {
    return liquidityInfo.lockedValue === 0 || rewardZustValue.isEqualTo(BIG_ZERO)
      ? '0.00'
      : rewardZustValue
          .dividedBy(liquidityInfo.lockedValue)
          .multipliedBy(BIG_HUNDERED)
          .multipliedBy(BIG_ONE_YEAR)
          .toFixed(2, BigNumber.ROUND_DOWN)
  }, [liquidityInfo, rewardZustValue])

  useEffect(() => {
    const lockedValue = (
      liquidityInfo.lockedValue === 0 ? BIG_ZERO : new BigNumber(liquidityInfo.lockedValue)
    ).toNumber()
    dispatch(
      addLockedValue({
        pair: pair.pair,
        lockedValue,
      }),
    )
  }, [dispatch, liquidityInfo.lockedValue.toString(), pair.pair])

  return {
    lpSymbol: token0 && token1 ? `${token0.symbol}-${token1.symbol} LP` : '',
    displayApr,
    pair,
    pairInfo,
    lpTotalTokens: `$${liquidityInfo.lockedValue.toFixed(4, BigNumber.ROUND_DOWN)}`,
    lpAddresses: {
      [chainId]: pair.pair,
    },
    userData: {
      earnings: reward.result,
      allowance: allowance.result?.toString(),
      tokenBalance: tokenBalance.toFixed(10),
      stakedBalance: liquidityInfo.zustValue,
      staked: liquidityInfo.staked,
      userSharePercent: `${liquidityInfo.userSharePercent}%`,
      userAvaliableZust: liquidityInfo.userAvaliableZust,
      userPoolBalance,
    },
    tokenAmount: liquidityInfo.tokenAmount,
    quoteTokenAmount: liquidityInfo.quoteTokenAmount,
    tokenPrice: tokenPrice.token0,
    quoteTokenPrice: tokenPrice.token1,
    tokenRate,
    token: {
      symbol: token0?.symbol,
      address: {
        [chainId]: token0?.address,
      },
      decimals: token0?.decimals,
      projectLink: 'https://pancakeswap.finance/',
    },
    quoteToken: {
      symbol: token1?.symbol,
      address: {
        [chainId]: token1?.address,
      },
      decimals: token1?.decimals,
      projectLink: 'https://pancakeswap.finance/',
    },
  }
}
