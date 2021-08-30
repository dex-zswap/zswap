import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { useZBToken, useZBSTCurrency } from 'hooks/Tokens'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export default function useTicketPrice() {
  const lotteryContract = useZSwapLotteryContract()

  const costPerTicket = useContractCall(lotteryContract, 'costPerTicket', [])
  const zbst = useZBToken()

  return useMemo(() => {
    if (!costPerTicket.result || !zbst) {
      return BIG_ZERO
    }

    return new BigNumber(costPerTicket.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
  }, [costPerTicket, zbst])
}

export function useZBSTBalance() {
  const { account } = useActiveWeb3React()
  const zbst = useZBSTCurrency()
  return useCurrencyBalance(account, zbst)
}
