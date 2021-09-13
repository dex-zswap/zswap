import React, { createContext, useState, useEffect } from 'react'
import useTimeRange from 'views/Tickets/hooks/useTimeRange'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import { useUserLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import usePrizes from 'views/Tickets/hooks/usePrizes'

export const LotteryContext = createContext(undefined)

export const LotteryProvider: React.FC = ({ children }) => {
  const [userLotteryIds, setUserLotteryIds] = useState([])
  const timeRange = useTimeRange()
  const currentLotteryId = useCurrentLotteryId()
  const lotteryIds = useUserLotteryIds()

  useEffect(() => {
    setUserLotteryIds(lotteryIds)
  }, [lotteryIds])

  const { currentZustValue, currentZbRewards } = usePrizes(currentLotteryId)

  return (
    <LotteryContext.Provider
      value={{
        timeRange,
        currentLotteryId,
        currentZustValue,
        currentZbRewards,
        userLotteryIds,
        setUserLotteryIds,
      }}
    >
      {children}
    </LotteryContext.Provider>
  )
}
