import styled from 'styled-components'
import LotteryHeader from './components/LotteryHeader'
import UserHistory from './components/UserHistory'
import UserPrizes from './components/UserPrizes'
import TicketDraw from './components/TicketDraw'
import LotteryFooter from './components/LotteryFooter'

const LotteryPage = styled.div`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(200px);
    position: absolute;
    left: 20%;
    top: 30%;
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
    right: 30%;
    top: 20%;
    z-index: 0;
  }
`

const Ticket = () => {
  return (
    <LotteryPage>
      <LotteryHeader />
      <UserHistory />
      <TicketDraw />
      <UserPrizes />
      <LotteryFooter />
    </LotteryPage>
  )
}

export default Ticket
