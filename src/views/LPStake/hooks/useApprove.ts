import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'

import { ZSWAP_LP_ADDRESS } from 'config/constants/zswap/address'

const useApproveLp = (lpContract: Contract) => {
  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(ZSWAP_LP_ADDRESS, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      return Boolean(receipt.status)
    } catch (e) {
      return false
    }
  }, [lpContract])

  return { onApprove: handleApprove }
}

export default useApproveLp
