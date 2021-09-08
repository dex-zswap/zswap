import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import usePrizes from 'views/Tickets/hooks/usePrizes'

import styled from 'styled-components'
import LotteryHeader from './components/LotteryHeader'
import UserHistory from './components/UserHistory'
import UserPrizes from './components/UserPrizes'
import TicketDraw from './components/TicketDraw'
import LotteryFooter from './components/LotteryFooter'

const LotteryPage = styled.div`
  position: relative;
  overflow: hidden;
  > div {
    position: relative;
    z-index: 99;
  }

  &::before {
    content: '';
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(200px);
    position: absolute;
    left: 250px;
    top: 250px;
    z-index: 0;
  }

  &::after {
    content: '';
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #f866ff;
    filter: blur(150px);
    position: absolute;
    right: 350px;
    top: 200px;
    z-index: 0;
  }
`

const Ticket = () => {
  const currentLotteryId = useCurrentLotteryId()
  const { currentZustValue, currentZbRewards } = usePrizes(currentLotteryId)

  return (
    <LotteryPage>
      <LotteryHeader currentZustValue={currentZustValue} />
      <UserHistory
        currentLotteryId={currentLotteryId}
        currentZustValue={currentZustValue}
        currentZbRewards={currentZbRewards}
      />
      <TicketDraw
        currentLotteryId={currentLotteryId}
        currentZustValue={currentZustValue}
        currentZbRewards={currentZbRewards}
      />
      <UserPrizes currentLotteryId={currentLotteryId} />
      <LotteryFooter />
    </LotteryPage>
  )
}

export default Ticket
