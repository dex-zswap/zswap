import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { ETHER } from 'zswap-sdk'
import useZUSDPrice from 'hooks/useZUSDPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useZSwapStakeContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useCurrency, useToken } from 'hooks/Tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useStakedTokenBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { useContractCall } from 'hooks/useContractCall'
import { BIG_TEN, BIG_ZERO, BIG_HUNDERED } from 'utils/bigNumber'
import { Pool } from 'state/types'
import { ZSWAP_DEX_ADDRESS, ZSWAP_ZERO_ADDRESS } from 'config/constants/zswap/address'

const usePoolInfo = (pool: Pool) => {
  const { account } = useActiveWeb3React()
  const stakeContract = useZSwapStakeContract()
  const contractAddress = getAddress(pool.contractAddress)
  const stakingTokenAddress = getAddress(pool.stakingToken.address)
  const earningTokenAddress = getAddress(pool.earningToken.address)

  const stakedCurrency = useCurrency(stakingTokenAddress)
  const earningCurrency = useCurrency(earningTokenAddress)
  const stakedToken = useToken(stakingTokenAddress)
  const earningToken = useToken(earningTokenAddress)

  const isDEX = stakingTokenAddress === ZSWAP_DEX_ADDRESS

  const shareReward = useContractCall(stakeContract, 'token_pershare_reward', [stakingTokenAddress])
  const stakedTokenBalance = useCurrencyBalance(account ?? undefined, isDEX ? ETHER : stakedCurrency)
  const earningTokenBalance = useCurrencyBalance(account ?? undefined, earningCurrency)

  const allowance = useTokenAllowance(stakedToken, account, contractAddress)
  const stakingBalance = useStakedTokenBalance(stakingTokenAddress, contractAddress, isDEX)

  const stakingTokenPrice = useZUSDPrice(stakedToken)

  const userShare = useSingleCallResult(stakeContract, 'getUserShare', [
    isDEX ? ZSWAP_ZERO_ADDRESS : stakingTokenAddress,
    account,
  ])

  const apr = useMemo(() => {
    if (!shareReward.result || !stakedToken || !stakingBalance.balance) {
      return BIG_ZERO
    }

    const shareRewardCount = new BigNumber(shareReward.result.toString()).dividedBy(BIG_TEN.pow(stakedToken.decimals))

    return BIG_TEN
  }, [shareReward, stakedToken, stakingBalance])

  const [pendingReward, setPendingReward] = useState({
    loading: true,
    result: BIG_ZERO,
  })

  // FIXME: 不知道为啥checkReward总是调用不起来所以用这种方式先完成功能
  useEffect(() => {
    const fetchReward = async () => {
      try {
        const address = isDEX ? ZSWAP_ZERO_ADDRESS : stakingTokenAddress
        const res = await stakeContract.checkReward(address)

        setPendingReward(() => ({
          loading: false,
          result: new BigNumber(res.toString())
            .dividedBy(BIG_TEN.pow(earningToken?.decimals))
            .integerValue(BigNumber.ROUND_DOWN),
        }))
      } catch (e) {
        setPendingReward(() => ({
          loading: false,
          result: BIG_ZERO,
        }))
      }
    }

    if (ZSWAP_ZERO_ADDRESS && stakingTokenAddress) {
      fetchReward()
    }
  }, [ZSWAP_ZERO_ADDRESS, stakingTokenAddress, isDEX, stakeContract, earningToken, stakingBalance])

  const userSharePercent = useMemo(() => {
    if (!userShare.result || !stakingBalance.balance) {
      return BIG_ZERO
    }

    const percent = new BigNumber(userShare.result[0].toString()).dividedBy(stakingBalance.balance)
    return percent
  }, [userShare, stakingBalance])

  const userStakedBalance = useMemo(() => {
    if (userSharePercent.eq(0)) {
      return BIG_ZERO
    }
    return stakingBalance.balance.multipliedBy(userSharePercent).dividedBy(BIG_TEN.pow(stakedToken?.decimals))
  }, [stakedToken, stakingBalance, userSharePercent])

  const anyLoading = useMemo(
    () => [userShare, pendingReward].some(({ loading }) => loading),
    [userShare, pendingReward],
  )

  const stakeTokenPrice = useMemo(() => {
    if (!stakingTokenPrice) {
      return BIG_ZERO
    }

    return new BigNumber(stakingTokenPrice.toSignificant(6))
  }, [stakingTokenPrice])

  const stakedUSDTValue = useMemo(() => {
    return userStakedBalance.multipliedBy(stakeTokenPrice)
  }, [userStakedBalance, stakeTokenPrice])

  return {
    ...pool,
    stakingTokenPrice: stakeTokenPrice.toNumber(),
    earningTokenBalance: new BigNumber(earningTokenBalance?.toSignificant(6) ?? 0).toNumber(),
    apr: 100,
    userData: anyLoading
      ? null
      : {
          stakedCurrency,
          earningCurrency,
          totalStakedBalance: (stakingBalance.balance ?? BIG_ZERO).dividedBy(BIG_TEN.pow(stakedToken?.decimals)),
          // allowance: allowance ? new BigNumber(allowance.toSignificant(10)) : BIG_ZERO,
          allowance: BIG_ZERO,
          stakedUSDTValue,
          stakedBalance: userStakedBalance,
          stakingTokenBalance: stakedTokenBalance ? new BigNumber(stakedTokenBalance.toSignificant(10)) : BIG_ZERO,
          pendingReward: pendingReward.result,
          stakedPercent: `${userSharePercent.multipliedBy(BIG_HUNDERED).toFixed(2)}%`,
        },
  }
}

export default usePoolInfo
