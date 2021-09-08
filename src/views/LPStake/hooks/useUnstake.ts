import { useCallback } from 'react'
import { Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { useTransactionAdder } from 'state/transactions/hooks'
import { BIG_TEN } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'

const useUnstake = (pair: string, lpContract: Contract | null | any, decimals = 18, lpSymbol: string = '') => {
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const handleUnstake = useCallback(
    async (amount: string) => {
      const tx = await lpContract.removeLpShare(pair, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
      if (lpSymbol) {
        addTransaction(tx, {
          summary: t(`Withdraw %assets%`, { assets: `${amount} ${lpSymbol}` }),
        })
      }
      const receipt = await tx.wait()
      return Boolean(receipt.status)
    },
    [useTransactionAdder, lpSymbol],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
