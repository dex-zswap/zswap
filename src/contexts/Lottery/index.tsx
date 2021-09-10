import React, { createContext } from 'react'
import useTimeRange from 'views/Tickets/hooks/useTimeRange'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import usePrizes from 'views/Tickets/hooks/usePrizes'

export const LotteryContext = createContext(undefined)

export const LotteryProvider: React.FC = ({ children }) => {
  const timeRange = useTimeRange()
  const currentLotteryId = useCurrentLotteryId()
  const { currentZustValue, currentZbRewards } = usePrizes(currentLotteryId)

  return (
    <LotteryContext.Provider value={{ timeRange, currentLotteryId, currentZustValue, currentZbRewards }}>
      {children}
    </LotteryContext.Provider>
  )
}
