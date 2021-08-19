import { useCallback } from 'react'
import { Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'

const useUnstake = (pair: string, lpContract: Contract | null | any, decimals = 18) => {
  const handleUnstake = useCallback(async (amount: string) => {
    const tx = await lpContract.removeLpShare(pair, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
  }, [])

  return { onUnstake: handleUnstake }
}

export default useUnstake
