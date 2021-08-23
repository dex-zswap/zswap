import { useCallback, useMemo } from 'react'
import { hexlify } from '@ethersproject/bytes'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract } from 'hooks/useContract'
import reporter from 'reporter'

export default function useBuy() {
  const lotteryContract = useZSwapLotteryContract()
  const lotteryNum = useCurrentLotteryId()
  const { chainId, account } = useActiveWeb3React()

  const buyTickets = useCallback(
    async (numbers) => {
      const tickets = numbers.map(hexlify)

      const { hash } = await lotteryContract.batchBuyLottoTicket(tickets)

      reporter.cacheHash(hash, {
        hash,
        from: account,
        chainId,
        summary: '',
        reportData: {
          from: 'ticket',
          lottery: numbers.map((nums) => nums.join('')).join(','),
          lotteryNum,
        },
      })

      reporter.recordHash(hash)
    },
    [lotteryContract],
  )

  return {
    buyTickets,
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
