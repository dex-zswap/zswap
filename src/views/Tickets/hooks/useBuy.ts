import { useCallback, useMemo, useState } from 'react'
import { hexlify } from '@ethersproject/bytes'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract } from 'hooks/useContract'
import reporter from 'reporter'

export default function useBuy(onDismiss: () => void) {
  const [buying, setBuying] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const { chainId, account } = useActiveWeb3React()

  const buyTickets = useCallback(
    async (numbers, lotteryNum) => {
      try {
        setBuying(true)
        const tickets = numbers.map(hexlify)
        const tx = await lotteryContract.batchBuyLottoTicket(tickets)
        await tx.wait()
        reporter.cacheHash(tx.hash, {
          hash: tx.hash,
          from: account,
          chainId,
          summary: '',
          reportData: {
            from: 'ticket',
            lottery: numbers.map((nums) => nums.join('')).join(','),
            lotteryNum,
          },
        })
        reporter.recordHash(tx.hash)

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
