import { useCallback } from 'react'
import { useZSwapLPContract } from 'hooks/useContract'

const useHarvestFarm = (farmPid: string | number) => {
  const lpContract = useZSwapLPContract()
  const handleHarvest = useCallback(async () => {
    await lpContract.getlpReward(farmPid)
  }, [farmPid, lpContract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
