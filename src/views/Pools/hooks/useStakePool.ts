import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stakeFarm } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useMasterchef, useSousChef, useZSwapStakeContract } from 'hooks/useContract'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const stake = async (contract, address, amount, decimals = 18) => {
  const tx = await contract.depositToken(address, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
  const receipt = await tx.wait()
  return receipt.status
}

const stakeDEX = async (contract, address, amount, decimals = 18) => {
  try {
    // const tx = await contract.depositDEX(address, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
    const tx = await contract.depositDEX({
      value: new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()
    })
    const receipt = await tx.wait()
    return receipt.status
  } catch (e) {
    console.log(e)
  }
}

const useStakePool = (token: Token) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingDEX) {
        await stakeDEX(stakeContract, tokenAddress, amount, token.decimals)
      } else {
        await stake(stakeContract, tokenAddress, amount, token.decimals)
      }
    },
    [account, dispatch, isUsingDEX],
  )

  return { onStake: handleStake }
}

export default useStakePool
