import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { JSBI, Percent } from 'zswap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { formatUnits } from '@ethersproject/units'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useToken } from 'hooks/Tokens'
import { useLPTokenBalance } from 'hooks/useTokenBalance'
import { useZSwapLPContract, usePairContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { usePair } from 'hooks/usePairs'
import useZUSDPrice from 'hooks/useZUSDPrice'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokenBalance } from 'state/wallet/hooks'
import { BIG_TEN, BIG_ZERO, BIG_HUNDERED } from 'utils/bigNumber'
import { ZERO_PERCENT } from 'config/constants'
import { ONE_YEAR_BLOCK_COUNT } from 'config'

type PairsInfo = {
  pair: string
  weight: number
  token0: string
  token1: string
}

export function usePairInfo(pair: PairsInfo): any {
  const { chainId, account } = useActiveWeb3React()
  const lpContract = useZSwapLPContract()

  const pairContract = usePairContract(pair.pair, true)

  const token0 = useToken(pair.token0)
  const token1 = useToken(pair.token1)

  const currency0 = wrappedCurrency(token0, chainId)
  const currency1 = wrappedCurrency(token1, chainId)

  const currency0USDTPrice = useZUSDPrice(token0)
  const currency1USDTPrice = useZUSDPrice(token1)

  const token0Amount = useLPTokenBalance(pair.token0, pair.pair)
  const token1Amount = useLPTokenBalance(pair.token1, pair.pair)

  const lpShareReward = useContractCall(lpContract, 'lp_pershare_reward', [pair.pair])
  const userShares = useContractCall(lpContract, 'getUserShare', [pair.pair, account])

  const allowance = useContractCall(pairContract, 'allowance', [account, pair.pair])

  const [, pairInfo] = usePair(currency0, currency1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pairInfo?.liquidityToken)
  const totalPoolTokens = useTotalSupply(pairInfo?.liquidityToken)

  const [reward, setReward] = useState({
    loading: true,
    result: BIG_ZERO,
  })

  // const reward = useContractCall(lpContract, 'predReward', [pair.pair])

  // FIXME: 不知道为啥checkReward总是调用不起来所以用这种方式先完成功能
  useEffect(() => {
    const fetchReward = async () => {
      try {
        const res = await lpContract.predReward(pair.pair)
        setReward(() => ({
          loading: false,
          result: new BigNumber(res.toString())
            .dividedBy(BIG_TEN.pow(pairInfo?.liquidityToken?.decimals))
            .integerValue(BigNumber.ROUND_DOWN),
        }))
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
  }, [pair])

  const [token0Deposited, token1Deposited] =
    !!totalPoolTokens && !!userPoolBalance && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pairInfo.getLiquidityValue(pairInfo.token0, totalPoolTokens, userPoolBalance, false),
          pairInfo.getLiquidityValue(pairInfo.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const tokenLpAmount = useMemo(() => {
    return {
      token0: token0Amount.balance ? token0Amount.balance.div(BIG_TEN.pow(token0?.decimals)) : BIG_ZERO,
      token1: token1Amount.balance ? token1Amount.balance.div(BIG_TEN.pow(token0?.decimals)) : BIG_ZERO,
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
  }, [userShares, pairInfo])

  const lpTotalTokens = useMemo(() => {
    return tokenLpAmount.token0
      .multipliedBy(tokenPrice.token0)
      .plus(tokenLpAmount.token1.multipliedBy(tokenPrice.token1))
      .toFixed(4)
  }, [tokenLpAmount, tokenPrice])

  const tokenBalance = useMemo(() => {
    if (!userPoolBalance) {
      return BIG_ZERO
    }

    const userPoolBalanceBigNumber = new BigNumber(userPoolBalance.toFixed(4))
    return userPoolBalanceBigNumber.minus(userSharesBigNumber)
  }, [userPoolBalance, userSharesBigNumber])

  const apr = useMemo(() => {
    if (!lpShareReward.result || !pairInfo) {
      return ZERO_PERCENT
    }

    const rewardPerblock = new BigNumber(formatUnits(lpShareReward.result, pairInfo.liquidityToken.decimals))
    const aprRate = JSBI.BigInt(parseInt(`${ONE_YEAR_BLOCK_COUNT.multipliedBy(rewardPerblock).toNumber()}`))

    return new Percent(aprRate, JSBI.BigInt(BIG_HUNDERED))
  }, [userShares, lpShareReward, pairInfo])

  return {
    lpSymbol: `${token0?.symbol}-${token1?.symbol} LP`,
    displayApr: apr.toSignificant(4),
    pair,
    pairInfo,
    lpTotalTokens: `$${lpTotalTokens}`,
    lpAddresses: {
      [chainId]: pair.pair,
    },
    userData: {
      earnings: reward.result,
      allowance: allowance.result?.toString(),
      tokenBalance: tokenBalance.toFixed(4),
      stakedBalance: userSharesBigNumber.toString(),
    },
    tokenAmount: token0Deposited?.toSignificant(4),
    quoteTokenAmount: token1Deposited?.toSignificant(4),
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
