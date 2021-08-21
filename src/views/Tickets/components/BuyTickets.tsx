import React, { useState, useCallback } from 'react'
import { CardHeader, Text, Flex, Button, useModal } from 'zswap-uikit'

import useTotalUserCost from 'views/Tickets/hooks/useTotalUserCost'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'

import BuyTicketsModal from './BuyTicketsModal'

import { StyledCard, StyledCardInner } from './StyledCard'

const BuyTickets = () => {
  const lotteryId = useCurrentLotteryId()
  const { zbst, zusd } = useTotalUserCost()

  const [ toggleBuyModal ] = useModal(<BuyTicketsModal />)

  return (
    <>
      <StyledCard>
        <CardHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Text>Round {lotteryId}</Text>
            <Text>Draw: 24 Dec 2021  14:00</Text>
          </Flex>
        </CardHeader>
        <StyledCardInner>
          <Flex>
            <Text>Price Pot</Text>
            <div>
              <Text>${zusd}</Text>
              <Text>{zbst} ZBst</Text>
            </div>
            <Button onClick={toggleBuyModal}>Buy Tickets</Button>
          </Flex>
        </StyledCardInner>
        
      </StyledCard>
    </>
  )
}

export default BuyTickets
