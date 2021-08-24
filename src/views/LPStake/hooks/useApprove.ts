import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { usePairContract } from 'hooks/useContract'
import { ZSWAP_LP_ADDRESS } from 'config/constants/zswap/address'

const useApproveLp = (lpContract: Contract, lpAddress: string) => {
  const pairContract = usePairContract(lpAddress)
  const handleApprove = useCallback(async () => {
    try {
      const tx = await pairContract.approve(ZSWAP_LP_ADDRESS, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      return Boolean(receipt.status)
    } catch (e) {
      return false
    }
  }, [lpContract])

  return { onApprove: handleApprove }
}

export default useApproveLp
