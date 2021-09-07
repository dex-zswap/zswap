import { useCallback } from 'react'
import { Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useTransactionAdder } from 'state/transactions/hooks'

const useStake = (pair: string, lpContract: Contract | null | any, decimals = 18, lpSymbol: string = '') => {
  const addTransaction = useTransactionAdder()
  const handleStake = useCallback(
    async (amount: string) => {
      const tx = await lpContract.addLpShare(pair, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
      if (lpSymbol) {
        addTransaction(tx, {
          summary: `Stake ${amount} ${lpSymbol}`,
        })
      }
      const receipt = await tx.wait()
      return Boolean(receipt.status)
    },
    [lpContract, addTransaction, lpSymbol],
  )

  return { onStake: handleStake }
}

export default useStake
