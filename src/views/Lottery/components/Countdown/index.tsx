import React from 'react'
import { Flex, Heading, Skeleton } from 'zswap-uikit'
import getTimePeriods from 'utils/getTimePeriods'
import useNextEventCountdown from 'views/Lottery/hooks/useNextEventCountdown'
import Timer from './Timer'

interface CountdownProps {
  nextEventTime: number
  preCountdownText?: string
  postCountdownText?: string
}

const Countdown: React.FC<CountdownProps> = ({ nextEventTime, preCountdownText, postCountdownText }) => {
  const secondsRemaining = useNextEventCountdown(nextEventTime)
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return (
    <>
      {secondsRemaining ? (
        <Flex display="inline-flex" justifyContent="flex-end" alignItems="flex-end">
          {preCountdownText && (
            <Heading mr="12px" color="#ffff">
              {preCountdownText}
            </Heading>
          )}
          <Timer
            minutes={minutes + 1} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
            hours={hours}
            days={days}
          />
          {postCountdownText && <Heading color="#ffff">{postCountdownText}</Heading>}
        </Flex>
      ) : (
        <Skeleton height="41px" width="250px" />
      )}
    </>
  )
}

export default Countdown
