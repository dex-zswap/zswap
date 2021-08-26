import styled from 'styled-components'
import { Text, Flex, Button, NextArrowIcon, EndArrowIcon, PreArrowIcon } from 'zswap-uikit'
import Card from './Card'
import BuyTicketsButton from './BuyTicket/BuyTicketsButton'
import PriceRule from './PriceRule'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import useLotteryReward from 'views/Tickets/hooks/useLotteryReward'
import useWinTime from 'views/Tickets/hooks/useWinTime'
import { useWinNumbers } from 'views/Tickets/hooks/usePrizes'
import useTimeRange from 'views/Tickets/hooks/useTimeRange'
import dayjs from 'dayjs'

const TicketDrawWrap = styled.div`
  position: relative;
  margin-bottom: 200px;
  &::before {
    content: '';
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(200px);
    position: absolute;
    right: 250px;
    top: 0;
    z-index: 0;
  }

  &::after {
    content: '';
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: #f866ff;
    filter: blur(180px);
    position: absolute;
    left: 400px;
    top: 250px;
    z-index: 0;
  }
  > img {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    &:first-child {
      top: 100px;
      transform: translateX(-430px);
    }
    &:nth-child(2) {
      top: 50px;
      transform: translateX(-520px);
    }
    &:nth-child(3) {
      top: 20px;
      transform: translateX(400px);
    }
  }
`

const NumWrap = styled.div`
  width: 58px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  margin-right: 16px;
  background: linear-gradient(135deg, #f866ff 0%, #0050ff 100%);
  border-radius: 16px;
`

const ButtonWrap = styled.div`
  width: 312px;
  height: 50px;
  margin: 0 auto 50px;
  border: 2px solid #0050ff;
  border-radius: 25px;
  > button {
    width: 50%;
    height: 100%;
    font-size: 16px;
    font-weight: bold;
    padding: 0;
    border-radius: 25px;
  }
`
const BallWrap = styled(Flex)`
  align-items: center;
  > div {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 23px;
    font-weight: bold;
    color: #fff;
    margin-right: 15px;
    &:first-child,
    &:nth-child(6) {
      background: url(/images/tickets/ball_1.png) center / contain no-repeat;
    }
    &:nth-child(2),
    &:nth-child(4) {
      background: url(/images/tickets/ball_2.png) center / contain no-repeat;
    }
    &:nth-child(3),
    &:nth-child(5) {
      background: url(/images/tickets/ball_3.png) center / contain no-repeat;
    }
    &:nth-child(6) {
      margin-right: 0;
    }
  }
`

const RightContentWrap = styled(Flex)`
  .zswap-button--disabled > svg {
    fill: #999 !important;
  }
`

const TicketDraw = () => {
  const { t } = useTranslation()

  const currentLotteryId = Number(useCurrentLotteryId())
  const [preLotteryId, setPreLotteryId] = useState(0)
  const [showPreView, setShowPreView] = useState(false)

  const lotteryId = showPreView ? preLotteryId : currentLotteryId

  const winNumbers = useWinNumbers(lotteryId)
  const { zustValue, zbRewards } = useLotteryReward(lotteryId)
  const winTime = useWinTime(lotteryId)

  const [untilDrawTime, setUntilDrawTime] = useState({ h: '00', m: '00' })
  const timeRange = useTimeRange()

  const currentWinTime = useMemo(() => {
    const hour = new Date().getHours()
    const date = hour > 14 ? dayjs().add(1, 'day').format('YYYY.MM.DD') : dayjs().format('YYYY.MM.DD')
    return `${date} 14:00`
  }, [timeRange])

  const getUntilDrawTime = () => {
    setUntilDrawTime(() => {
      const date = new Date()
      let hour = date.getHours() - 1
      hour = hour > 13 ? 36 - hour : 13 - hour
      let min = 60 - date.getMinutes()
      const h = hour > 10 ? hour + '' : '0' + hour
      const m = min > 10 ? min + '' : '0' + min
      return { h, m }
    })
  }

  useEffect(() => {
    getUntilDrawTime()
    const timer = setInterval(() => {
      getUntilDrawTime()
    }, 60000)
    return () => {
      setUntilDrawTime({ h: '00', m: '00' })
      clearInterval(timer)
    }
  }, [])

  const untilDrawContent = useMemo(() => {
    const date = new Date().getTime()
    const showUntilDraw = !timeRange || !(timeRange.start > date) || timeRange.end > date
    let tip: string = ''
    if (timeRange && timeRange.start && timeRange.start > date) {
      tip = t('Awards to be announced soon')
    }
    if (timeRange && timeRange.end && timeRange.end < date) {
      tip = t('Lottery tickets to go on sale')
    }
    return showUntilDraw ? (
      <Flex mb="120px" alignItems="center" justifyContent="center">
        <NumWrap>{untilDrawTime.h}</NumWrap>
        <Text fontSize="24px" mr="16px" color="blue" bold>
          HH
        </Text>
        <NumWrap>{untilDrawTime.m}</NumWrap>
        <Text fontSize="24px" mr="16px" color="blue" bold>
          MM
        </Text>
        <Text fontSize="24px" bold>
          {t('until the draw')}
        </Text>
      </Flex>
    ) : (
      <Text textAlign="center" fontSize="24px" mb="120px" color="blue" bold>
        {tip}
      </Text>
    )
  }, [timeRange])

  const changeDrawPage = useCallback(
    (num) => {
      if (!num) {
        setPreLotteryId(1)
      } else {
        setPreLotteryId(preLotteryId + num)
      }
    },
    [preLotteryId],
  )

  const rightContent = useMemo(() => {
    if (!showPreView || currentLotteryId < 3) return false
    return (
      <RightContentWrap alignItems="center">
        <Button
          mr="18px"
          height="15px"
          padding="0"
          variant="text"
          disabled={preLotteryId == currentLotteryId - 1}
          onClick={() => {
            changeDrawPage(1)
          }}
        >
          <PreArrowIcon strokeWidth="3px" width="15px" color="text" />
        </Button>
        <Button
          height="15px"
          padding="0"
          variant="text"
          disabled={preLotteryId == 1}
          onClick={() => {
            changeDrawPage(-1)
          }}
        >
          <NextArrowIcon width="15px" color="text" />
        </Button>
        <Button
          ml="18px"
          height="15px"
          padding="0"
          variant="text"
          disabled={preLotteryId == 1}
          onClick={() => {
            changeDrawPage(0)
          }}
        >
          <EndArrowIcon width="15px" color="text" />
        </Button>
      </RightContentWrap>
    )
  }, [showPreView, currentLotteryId, preLotteryId])

  return (
    <TicketDrawWrap>
      <img width="65px" src="/images/tickets/obj_3_1.png" />
      <img width="22px" src="/images/tickets/obj_2_2.png" />
      <img width="197px" src="/images/tickets/obj_3_2.png" />
      <Text textAlign="center" fontSize="48px" margin="0 auto 40px" bold>
        {t('Get your tickets now!')}
      </Text>
      {untilDrawContent}
      <ButtonWrap>
        <Button
          style={{ color: showPreView ? '#0050FF' : '#fff' }}
          variant={showPreView ? 'text' : 'primary'}
          onClick={() => {
            setShowPreView(false)
            setPreLotteryId(currentLotteryId)
          }}
        >
          {t('Current Draw')}
        </Button>
        <Button
          style={{ color: showPreView ? '#fff' : '#0050FF' }}
          variant={showPreView ? 'primary' : 'text'}
          disabled={1 == currentLotteryId}
          onClick={() => {
            setShowPreView(true)
            setPreLotteryId(currentLotteryId - 1)
          }}
        >
          {t('Previous Draw')}
        </Button>
      </ButtonWrap>
      <Card
        title={`${t('Round')} ${lotteryId}`}
        subTitle={showPreView ? '' : `${t('Draw')}: ${currentWinTime}`}
        rightContent={rightContent}
      >
        <>
          {showPreView && (
            <Text style={{ color: '#999' }} mb="40px">
              {`${t('Draw')}: ${winTime}`}
            </Text>
          )}
          <Flex mb="25px">
            <Text width="110px" mr="20px" fontSize="16px" bold>
              {t('Price Pot')}
            </Text>
            <div>
              <Text color="blue" fontSize="36px" bold>
                ${zustValue.toFixed(2)}
              </Text>
              <Text>{zbRewards.toFixed(2)} ZBst</Text>
            </div>
          </Flex>
          <Flex>
            <Text width="110px" mr="20px" fontSize="16px" bold>
              {showPreView ? t('Winning Number') : t('Yout Tickets')}
            </Text>
            {showPreView ? (
              <BallWrap>
                {winNumbers.map((d, index) => (
                  <div key={index}>{d}</div>
                ))}
                {preLotteryId == currentLotteryId - 1 && (
                  <img style={{ marginLeft: '65px' }} width="53px" src="/images/tickets/latest.png" />
                )}
              </BallWrap>
            ) : (
              <BuyTicketsButton />
            )}
          </Flex>
          <PriceRule lotteryId={lotteryId} />
        </>
      </Card>
    </TicketDrawWrap>
  )
}

export default TicketDraw
