import { useCallback } from 'react'
import { Contract } from 'ethers'

const useUnstake = (pair: string, lpContract: Contract | null | any) => {
  const handleUnstake = useCallback(async (amount: string) => {
    const tx = await lpContract.removeLpShare(pair, amount)
  }, [])

  return { onUnstake: handleUnstake }
}

export default useUnstake
