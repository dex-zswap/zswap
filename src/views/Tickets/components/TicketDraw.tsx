import styled from 'styled-components'
import { Text, Flex, Button, ArrowRightIcon } from 'zswap-uikit'
import Card from './Card'
import BuyTicketsButton from './BuyTicket/BuyTicketsButton'
import PriceRule from './PriceRule'

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import useLotteryReward from 'views/Tickets/hooks/useLotteryReward'
import useWinTime from 'views/Tickets/hooks/useWinTime'
import { useWinNumbers } from 'views/Tickets/hooks/usePrizes'

const TicketDrawWrap = styled.div`
  position: relative;
  margin-bottom: 200px;
  img {
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
    &:last-child {
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
    &:last-child {
      margin-right: 0;
    }
  }
`

const TicketDraw = () => {
  const { t } = useTranslation()
  const lotteryId = useCurrentLotteryId()
  const [currentLotteryId, setCurrentLotteryId] = useState(Number(lotteryId))
  const winNumbers = useWinNumbers(currentLotteryId)
  const { zustValue, zbRewards } = useLotteryReward(currentLotteryId)
  const winTime = useWinTime(currentLotteryId)
  const [untilDrawTime, setUntilDrawTime] = useState({ h: '00', m: '00' })

  const [showPreView, setShowPreView] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setUntilDrawTime(() => {
        const date = new Date()
        let hour = date.getHours() - 1
        hour = hour > 13 ? 36 - hour : 13 - hour
        let min = 60 - date.getMinutes()
        const h = hour > 10 ? hour + '' : '0' + hour
        const m = min > 10 ? min + '' : '0' + min
        return { h, m }
      })
    })
    return () => {
      clearInterval(timer)
    }
  }, [])

  const rightContent = useMemo(() => {
    if (!showPreView || Number(lotteryId) < 3) return false
    return (
      <Flex alignItems="center">
        <Button disabled={currentLotteryId == Number(lotteryId) - 1} mr="18px" height="15px" padding="0" variant="text">
          <ArrowRightIcon style={{ transform: 'rotate(180deg)' }} width="15px" color="text" />
        </Button>
        <Button disabled={currentLotteryId == 1} height="15px" padding="0" variant="text">
          <ArrowRightIcon width="15px" color="text" />
        </Button>
      </Flex>
    )
  }, [showPreView, lotteryId, currentLotteryId])

  return (
    <TicketDrawWrap>
      <img width="65px" src="/images/tickets/obj_3_1.png" />
      <img width="22px" src="/images/tickets/obj_2_2.png" />
      <img width="197px" src="/images/tickets/obj_3_2.png" />
      <Text textAlign="center" fontSize="48px" margin="0 auto 75px" bold>
        {t('Get your tickets now!')}
      </Text>
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
      <ButtonWrap>
        <Button
          style={{ color: showPreView ? '#0050FF' : '#fff' }}
          variant={showPreView ? 'text' : 'primary'}
          onClick={() => {
            setShowPreView(false)
            setCurrentLotteryId(Number(lotteryId))
          }}
        >
          {t('Current Draw')}
        </Button>
        <Button
          style={{ color: showPreView ? '#fff' : '#0050FF' }}
          variant={showPreView ? 'primary' : 'text'}
          disabled={'1' == lotteryId}
          onClick={() => {
            setShowPreView(true)
            setCurrentLotteryId(Number(lotteryId) - 1)
          }}
        >
          {t('Previous Draw')}
        </Button>
      </ButtonWrap>
      <Card
        title={`${t('Round')} ${currentLotteryId}`}
        subTitle={showPreView ? '' : `${t('Draw')}: ${winTime}`}
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
              </BallWrap>
            ) : (
              <BuyTicketsButton />
            )}
          </Flex>
          <PriceRule lotteryId={currentLotteryId} />
        </>
      </Card>
    </TicketDrawWrap>
  )
}

export default TicketDraw
