import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapStakeContract } from 'hooks/useContract'
import { BIG_TEN } from 'utils/bigNumber'
import { Token } from 'config/constants/types'
import { ZSWAP_ZERO_ADDRESS } from 'config/constants/zswap/address'
import { getAddress } from 'utils/addressHelpers'

const useHarvestPool = (token: Token) => {
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()
  const handleHarvest = useCallback(
    async () => {
      await stakeContract.harvest(
        isUsingDEX ? ZSWAP_ZERO_ADDRESS : tokenAddress
      )
    },
    [isUsingDEX, stakeContract],
  )

  return { onReward: handleHarvest }
}

export default useHarvestPool
