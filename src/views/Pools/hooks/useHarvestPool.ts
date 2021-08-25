import { useCallback } from 'react'
import { useZSwapStakeContract } from 'hooks/useContract'
import { Token } from 'config/constants/types'
import { ZSWAP_ZERO_ADDRESS } from 'config/constants/zswap/address'
import { getAddress } from 'utils/addressHelpers'

const useHarvestPool = (token: Token) => {
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()
  const handleHarvest = useCallback(async () => {
    const tx = await stakeContract.harvest(isUsingDEX ? ZSWAP_ZERO_ADDRESS : tokenAddress)
    const receipt = await tx.wait()
    return Boolean(receipt.status)
  }, [isUsingDEX, stakeContract])

  return { onReward: handleHarvest }
}

export default useHarvestPool
