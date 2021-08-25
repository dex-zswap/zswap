import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { ETHER } from 'zswap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useZSwapStakeContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useCurrency, useToken } from 'hooks/Tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useZUSDPrice, { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useStakedTokenBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { useContractCall } from 'hooks/useContractCall'
import { BIG_TEN, BIG_ZERO, BIG_HUNDERED, BIG_ONE_YEAR } from 'utils/bigNumber'
import { Pool } from 'state/types'
import { ZSWAP_DEX_ADDRESS, ZSWAP_ZERO_ADDRESS } from 'config/constants/zswap/address'
import getStakeReward from 'config/reward/stake'

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

  const stakedTokenBalance = useCurrencyBalance(account ?? undefined, isDEX ? ETHER : stakedCurrency)
  const earningTokenBalance = useCurrencyBalance(account ?? undefined, earningCurrency)
  const totalWeight = useContractCall(stakeContract, 'total_weight', [])
  const currentWeight = useContractCall(stakeContract, 'weights', [stakingTokenAddress])

  const zbstPrice = useZBSTZUSTPrice()
  const stakingTokenPrice = useZUSDPrice(stakedToken)

  const allowance = useTokenAllowance(stakedToken, account, contractAddress)
  const stakingBalance = useStakedTokenBalance(stakingTokenAddress, contractAddress, isDEX)

  const userShare = useSingleCallResult(stakeContract, 'getUserShare', [
    isDEX ? ZSWAP_ZERO_ADDRESS : stakingTokenAddress,
    account,
  ])

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
    () => [userShare, pendingReward, currentWeight].some(({ loading }) => loading),
    [userShare, pendingReward, totalWeight, currentWeight],
  )

  const stakeTokenPrice = useMemo(() => {
    if (!stakingTokenPrice || !stakedToken) {
      return BIG_ZERO
    }

    return new BigNumber(stakingTokenPrice.toSignificant(stakedToken.decimals))
  }, [stakingTokenPrice, stakedToken])

  const stakedUSDTValue = useMemo(() => {
    return userStakedBalance.multipliedBy(stakeTokenPrice)
  }, [userStakedBalance, stakeTokenPrice])

  const totalStakedBalance = useMemo(() => {
    if (!stakingBalance.balance || !stakedToken) {
      return BIG_ZERO
    }

    return stakingBalance.balance.multipliedBy(stakeTokenPrice).dividedBy(BIG_TEN.pow(stakedToken.decimals))
  }, [stakingBalance, stakedToken, stakeTokenPrice])

  const currentWeightBigNumber = useMemo(() => {
    if (!currentWeight.result) {
      return BIG_ZERO
    }

    return new BigNumber(currentWeight.result.toString())
  }, [currentWeight])

  const apr = useMemo(() => {
    if (!totalWeight.result || !stakingBalance.balance || !zbstPrice || !stakedCurrency) {
      return 0
    }

    const totalWeightBigNumber = new BigNumber(totalWeight.result.toString())
    const priceBigNumber = new BigNumber(zbstPrice.toSignificant(stakedCurrency.decimals))
    const reward = getStakeReward(currentWeightBigNumber.dividedBy(totalWeightBigNumber))
    const rewardUsdtValue = priceBigNumber.multipliedBy(reward)

    return rewardUsdtValue
      .dividedBy(totalStakedBalance)
      .multipliedBy(BIG_ONE_YEAR)
      .multipliedBy(BIG_HUNDERED)
      .toNumber()
  }, [totalWeight, currentWeightBigNumber, stakingBalance, zbstPrice, stakedCurrency, stakeTokenPrice, totalStakedBalance])

  return {
    ...pool,
    apr,
    stakingTokenPrice: stakeTokenPrice.toNumber(),
    earningTokenBalance: new BigNumber(earningTokenBalance?.toSignificant(6) ?? 0).toNumber(),
    weight: currentWeightBigNumber.toNumber(),
    userData: anyLoading
      ? null
      : {
          stakedCurrency,
          earningCurrency,
          totalStakedBalance,
          allowance: allowance ? new BigNumber(allowance.toSignificant(stakedToken.decimals)) : BIG_ZERO,
          stakedUSDTValue,
          stakedBalance: userStakedBalance,
          stakingTokenBalance: stakedTokenBalance ? new BigNumber(stakedTokenBalance.toSignificant(10)) : BIG_ZERO,
          pendingReward: pendingReward.result,
          stakedPercent: `${userSharePercent.multipliedBy(BIG_HUNDERED).toFixed(2)}%`,
        },
  }
}

export default usePoolInfo
