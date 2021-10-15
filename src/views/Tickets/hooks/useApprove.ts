import { useCallback, useMemo, useState, useEffect } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract, useERC20 } from 'hooks/useContract'
import { ZSWAP_ZBST_ADDRESS } from 'config/constants/zswap/address'
import useRefresh from 'hooks/useRefresh'
import useInterval from 'hooks/useInterval'

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
  const [ allowance, setAllowance ] = useState(0)
  const [ time, setTime ] = useState(0)
  const { account } = useActiveWeb3React()
  const lotteryContract = useZSwapLotteryContract()
  const zbstContract = useERC20(ZSWAP_ZBST_ADDRESS)

  useInterval(() => {
    setTime(() => time + 1)
  }, 2000)

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        const res = await zbstContract.allowance(account, lotteryContract.address)
        setAllowance(res)
      } catch (e) {
        setAllowance(0)
      }
    }

    if (account) {
      fetchAllowance()
    }
  }, [
    account, lotteryContract.address, time
  ])

  return useMemo(() => {
    if (!allowance) {
      return false
    }

    if (typeof allowance === 'number') {
      return allowance === 0
    }

    return (allowance as any).eq(0)
  }, [allowance])
}
