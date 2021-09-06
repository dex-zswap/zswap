import { useCallback } from 'react'
import { Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { useTransactionAdder } from 'state/transactions/hooks'
import { BIG_TEN } from 'utils/bigNumber'

const useUnstake = (pair: string, lpContract: Contract | null | any, decimals = 18, lpSymbol: string = '') => {
  const addTransaction = useTransactionAdder()
  const handleUnstake = useCallback(async (amount: string) => {
    const tx = await lpContract.removeLpShare(pair, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    if (lpSymbol) {
      addTransaction(tx, {
        summary: `Withdraw ${amount} ${lpSymbol}`
      })
    }
    const receipt = await tx.wait()
    return Boolean(receipt.status)
  }, [useTransactionAdder])

  return { onUnstake: handleUnstake }
}

export default useUnstake
