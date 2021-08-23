import { useCallback, useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract, useERC20 } from 'hooks/useContract'
import { ZSWAP_ZBST_ADDRESS } from 'config/constants/zswap/address'
import useRefresh from 'hooks/useRefresh'

export default function useApprove() {
  const lotteryContract = useZSwapLotteryContract()
  const zbstContract = useERC20(ZSWAP_ZBST_ADDRESS)

  const approve = useCallback(async () => {
    const tx = await zbstContract.approve(lotteryContract.address, ethers.constants.MaxUint256)
  }, [zbstContract, lotteryContract])

  return {
    approve,
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
