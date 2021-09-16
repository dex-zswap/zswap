import { useCallback, useMemo, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract, useERC20 } from 'hooks/useContract'
import { ZSWAP_ZBST_ADDRESS } from 'config/constants/zswap/address'
import useRefresh from 'hooks/useRefresh'

export default function useApprove() {
  const [approving, setApproving] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const zbstContract = useERC20(ZSWAP_ZBST_ADDRESS)

  const approve = useCallback(async () => {
    try {
      setApproving(true)
      const tx = await zbstContract.approve(lotteryContract.address, ethers.constants.MaxUint256)
      await tx.await()

      setApproving(false)
    } catch (e) {
      setApproving(false)
    }
  }, [zbstContract, lotteryContract])

  return {
    approve,
    approving,
  }
}

export function useApproveStatus() {
  const { fastRefresh } = useRefresh()
  const { account } = useActiveWeb3React()
  const lotteryContract = useZSwapLotteryContract()
  const zbstContract = useERC20(ZSWAP_ZBST_ADDRESS)

  const allowance = useContractCall(zbstContract, 'allowance', [account, lotteryContract.address])

  return useMemo(() => {
    if (!allowance.result) {
      return false
    }

    return allowance.result.eq(0)
  }, [allowance, fastRefresh])
}
