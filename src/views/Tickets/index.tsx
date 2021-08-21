import React from 'react'

import usePrizes from './hooks/usePrizes'
import useStartTime from './hooks/useStartTime'

import UserHistory from './components/UserHistory'
import BuyTickets from './components/BuyTickets'

const Ticket = () => {
  const prizes = usePrizes()
  const startTime = useStartTime()

  return (
    <div>
      Ticket 总奖励: ${prizes.toFixed(2)}
      <UserHistory />
      <BuyTickets />
    </div>
  )
}

export default Ticket
