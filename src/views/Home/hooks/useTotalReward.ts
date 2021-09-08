import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useBlockNumber } from 'state/application/hooks'
import { useZSwapStakeContract, useZSwapLPContract } from 'hooks/useContract'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { useContractCall } from 'hooks/useContractCall'
import { BIG_ZERO } from 'utils/bigNumber'
import { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import { REWARD_BASE } from 'config/constants/zswap/earing-token'
import { getAddress } from 'utils/addressHelpers'
import pools from 'config/constants/zswap/pools'

// token_last_reward_block

export default function useTotalReward() {
  const lpContract = useZSwapLPContract()
  const stakeContract = useZSwapStakeContract()
  const blockNumber = useBlockNumber()
  const zbstPrice = useZBSTZUSTPrice()

  const poolIds = useMemo(() => pools.map(({ stakingToken }) => [getAddress(stakingToken.address)]), [])

  const lpBlockNumber = useContractCall(lpContract, 'OtherRewardsstartBlockNum', [])
  const stakeMinBlockNumbers = useSingleContractMultipleData(stakeContract, 'token_last_reward_block', poolIds)

  const stakeMinBlockNumber = useMemo(() => {
    if (stakeMinBlockNumbers.some(({ loading }) => loading)) {
      return BIG_ZERO
    }
    let minBlockNumber = stakeMinBlockNumbers[0].result[0]

    stakeMinBlockNumbers.forEach(({ result }) => {
      if (result[0].lt(blockNumber)) {
        minBlockNumber = result[0]
      }
    })

    return new BigNumber(minBlockNumber.toString())
  }, [stakeMinBlockNumbers])

  const lpMinBlockNumber = useMemo(() => {
    return lpBlockNumber.result ? new BigNumber(lpBlockNumber.result.toString()) : BIG_ZERO
  }, [lpBlockNumber])

  const blockNumberInfo = useMemo(() => {
    const blockBigNumber = new BigNumber(blockNumber)

    return {
      stake: blockBigNumber.minus(stakeMinBlockNumber),
      lp: blockBigNumber.minus(lpMinBlockNumber),
    }
  }, [lpMinBlockNumber, stakeMinBlockNumber, blockNumber])

  return useMemo(() => {
    if (!zbstPrice) {
      return BIG_ZERO
    }
    return blockNumberInfo.lp
      .multipliedBy(REWARD_BASE)
      .multipliedBy(zbstPrice.toSignificant(18))
      .plus(blockNumberInfo.stake.multipliedBy(REWARD_BASE).multipliedBy(zbstPrice.toSignificant(18)))
      .integerValue()
  }, [zbstPrice, blockNumberInfo])
}
