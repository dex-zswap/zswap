import { useCallback } from 'react'
import { useZSwapLPContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTranslation } from 'contexts/Localization'

const useHarvestFarm = (farmPid: string | number, lpSymbol: string = '') => {
  const { t } = useTranslation()
  const lpContract = useZSwapLPContract()
  const addTransaction = useTransactionAdder()
  const handleHarvest = useCallback(async () => {
    const tx = await lpContract.getlpReward(farmPid)
    if (lpSymbol) {
      addTransaction(tx, {
        summary: t(`Claim %assets% Stake Rewards`, { assets: lpSymbol }),
      })
    }
    const receipt = await tx.wait()
    return Boolean(receipt.status)
  }, [farmPid, lpContract, addTransaction, lpSymbol])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
