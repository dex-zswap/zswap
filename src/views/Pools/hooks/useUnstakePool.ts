import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapStakeContract } from 'hooks/useContract'
import { BIG_TEN } from 'utils/bigNumber'
import { Token } from 'config/constants/types'
import { ZSWAP_ZERO_ADDRESS } from 'config/constants/zswap/address'
import { getAddress } from 'utils/addressHelpers'

const useUnstakePool = (token: Token) => {
  const tokenAddress = getAddress(token.address)
  const isUsingDEX = token.symbol === 'DEX'
  const stakeContract = useZSwapStakeContract()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      const tx = await stakeContract.withdrawToken(
        isUsingDEX ? ZSWAP_ZERO_ADDRESS : tokenAddress,
        new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(),
      )
      const receipt = await tx.wait()
      return Boolean(receipt.status)
    },
    [isUsingDEX, stakeContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
