import { useCallback, useMemo, useState } from 'react'
import { hexlify } from '@ethersproject/bytes'
import BigNumber from 'bignumber.js'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function useBuy(onDismiss: () => void) {
  const [buying, setBuying] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const addTransaction = useTransactionAdder()

  const buyTickets = useCallback(
    async (numbers, lotteryNum) => {
      try {
        setBuying(true)
        const { length } = numbers
        const tickets = numbers.map(hexlify)
        const tx = await lotteryContract.batchBuyLottoTicket(tickets)
        await tx.wait()

        addTransaction(tx, {
          summary: `Buy ${length} ${length > 1 ? 'Ticket' : 'Tickets'} `,
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
      } catch (e) {
        setBuying(false)
      }
    },
    [lotteryContract],
  )

  return {
    buyTickets,
    buying,
  }
}

export function useCurrentLotteryId() {
  const lotteryContract = useZSwapLotteryContract()
  const lotteryId = useContractCall(lotteryContract, 'lotteryId', [])
  return useMemo(() => {
    if (!lotteryId.result) {
      return '1'
    }
    return new BigNumber(lotteryId.result.toString()).toString()
  }, [lotteryId])
}
