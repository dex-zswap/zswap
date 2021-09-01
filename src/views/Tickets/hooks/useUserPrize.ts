import { useCallback, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useZSwapLotteryContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'

const apiBase = process.env.REACT_APP_API_BASE

const userGetReward = async (txId: string) => {
  await fetch(`${apiBase}lottery/getReward`, {
    mode: 'cors',
    credentials: 'omit',
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      txId,
    }),
  })
}

export function useCollectReward() {
  const { t } = useTranslation()
  const [collecting, setCollecting] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const { toastSuccess, toastError } = useToast()

  const collectReward = useCallback(async () => {
    try {
      setCollecting(true)
      const tx = await lotteryContract.claimReward()
      const receipt = await tx.wait()
      setCollecting(false)
      if (receipt.status) {
        userGetReward(tx.hash)
        toastSuccess(t('Successfully Collected'), t('You have success collected your ticket prizes'))
      } else {
        toastError(
          t('Failed Collect'),
          t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
        )
      }
    } catch (e) {
      setCollecting(false)
      toastError(
        t('Failed Collect'),
        t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      )
    }
  }, [lotteryContract, t])

  return {
    collectReward,
    collecting,
  }
}

export function useUserCollected() {
  const [totalCollected, setTotalCollected] = useState(BIG_ZERO)
  const { account } = useActiveWeb3React()

  useEffect(() => {
    const queryUserCollected = () => {
      fetch(`${apiBase}lottery/queryTotalReward`, {
        mode: 'cors',
        credentials: 'omit',
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dstAddr: account,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setTotalCollected(new BigNumber(res.data))
          }
        })
    }

    if (account) {
      queryUserCollected()
    }
  }, [account])

  return totalCollected
}
