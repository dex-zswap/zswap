import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useZSwapStakeContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

const stake = async (contract, address, amount, decimals = 18) => {
  try {
    const tx = await contract.depositToken(address, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    return tx
  } catch (e) {
    return false
  }
}

const stakeDEX = async (contract, amount, decimals = 18) => {
  try {
    const tx = await contract.depositDEX({
      value: new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(),
    })
    return tx
  } catch (e) {
    return false
  }
}

const useStakePool = (token: Token) => {
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()
  const addTransaction = useTransactionAdder()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      const tx = isUsingDEX
        ? await stakeDEX(stakeContract, amount, token.decimals)
        : await stake(stakeContract, tokenAddress, amount, token.decimals)
      addTransaction(tx, {
        summary: `Stake ${amount} ${token.symbol}`
      })
      const receipt = await tx.wait()
      return Boolean(receipt.status)
    },
    [isUsingDEX, tokenAddress, stakeContract, addTransaction, token.symbol],
  )

  return { onStake: handleStake }
}

export default useStakePool
