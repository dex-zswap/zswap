import { useCallback } from 'react'
import { useZSwapLPContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

const useHarvestFarm = (farmPid: string | number, lpSymbol: string = '') => {
  const lpContract = useZSwapLPContract()
  const addTransaction = useTransactionAdder()
  const handleHarvest = useCallback(async () => {
    const tx = await lpContract.getlpReward(farmPid)
    if (lpSymbol) {
      addTransaction(tx, {
        summary: `Claim ${lpSymbol} Stake Rewards`
      })
    }
    const receipt = await tx.wait()
    return Boolean(receipt.status)
  }, [farmPid, lpContract, addTransaction])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
