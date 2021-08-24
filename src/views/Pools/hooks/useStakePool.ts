import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useZSwapStakeContract } from 'hooks/useContract'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

const stake = async (contract, address, amount, decimals = 18) => {
  const tx = await contract.depositToken(address, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
  const receipt = await tx.wait()
  return receipt.status
}

const stakeDEX = async (contract, amount, decimals = 18) => {
  try {
    const tx = await contract.depositDEX({
      value: new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(),
    })
    const receipt = await tx.wait()
    return receipt.status
  } catch (e) {
    console.error(e)
  }
}

const useStakePool = (token: Token) => {
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingDEX) {
        await stakeDEX(stakeContract, amount, token.decimals)
      } else {
        await stake(stakeContract, tokenAddress, amount, token.decimals)
      }
    },
    [isUsingDEX, tokenAddress, stakeContract],
  )

  return { onStake: handleStake }
}

export default useStakePool
