import { useCallback, useMemo, useState } from 'react'
import { hexlify } from '@ethersproject/bytes'
import BigNumber from 'bignumber.js'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTranslation } from 'contexts/Localization'
import useInterval from 'hooks/useInterval'

const DISABLE_BUY_TIME = 30 * 1000

export default function useBuy(onDismiss: () => void, cb?: () => void) {
  const { t } = useTranslation()

  let now = Date.now()
  const waitCanBuyTime = localStorage.getItem('nextCanBuyTime') ?? '0'

  const [disableBuy, setDisableBuy] = useState(waitCanBuyTime !== '0' ? Number(waitCanBuyTime) > now : false)
  const [buying, setBuying] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const addTransaction = useTransactionAdder()

  useInterval(() => {
    now = Date.now()
    if (waitCanBuyTime && now < Number(waitCanBuyTime) && !disableBuy) {
      setDisableBuy(true)
    }
  }, 1000)

  const buyTickets = useCallback(
    async (numbers, lotteryNum) => {
      try {
        setBuying(true)
        const { length } = numbers
        const tickets = numbers.map(hexlify)
        const tx = await lotteryContract.batchBuyLottoTicket(tickets)

        localStorage.setItem('nextCanBuyTime', `${Date.now() + DISABLE_BUY_TIME}`)

        await tx.wait()

        addTransaction(tx, {
          summary: t(`Buy %assets% ${length > 1 ? 'Tickets' : 'Ticket'}`, { assets: length }),
          reportData: {
            from: 'ticket',
            args: {
              lottery: numbers.map((nums) => nums.join('')).join(','),
              lotteryNum,
            },
          },
        })

        setBuying(false)
        onDismiss()
        cb()
      } catch (e) {
        setBuying(false)
      }
    },
    [lotteryContract],
  )

  return {
    buyTickets,
    buying,
    disableBuy,
  }
}

export function useCurrentLotteryId() {
  const lotteryContract = useZSwapLotteryContract()
  const lotteryId = useContractCall(lotteryContract, 'lotteryId', [])
  return useMemo(() => {
    if (!lotteryId.result) {
      return null
    }
    return new BigNumber(lotteryId.result.toString()).toNumber()
  }, [lotteryId])
}
