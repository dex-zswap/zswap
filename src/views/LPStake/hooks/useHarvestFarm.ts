import { useCallback } from 'react'
import { useZSwapLPContract } from 'hooks/useContract'

const useHarvestFarm = (farmPid: string | number) => {
  const lpContract = useZSwapLPContract()
  const handleHarvest = useCallback(async () => {
    const tx = await lpContract.getlpReward(farmPid)
    const receipt = await tx.wait()

    return Boolean(receipt.status)
  }, [farmPid, lpContract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
