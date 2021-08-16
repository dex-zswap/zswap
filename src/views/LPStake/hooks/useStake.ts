import { useCallback } from 'react'
import { Contract } from 'ethers'

const useStake = (pair: string, lpContract: Contract | null | any) => {
  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await lpContract.addLpShare(pair, amount)
    },
    [lpContract],
  )

  return { onStake: handleStake }
}

export default useStake

