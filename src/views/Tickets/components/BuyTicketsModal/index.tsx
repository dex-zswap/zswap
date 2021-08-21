import React, { useState, useCallback } from 'react'

import { Text, Flex, Modal } from 'zswap-uikit'
import useTicketPrice, { useZBSTBalance } from 'views/Tickets/hooks/useTicketPrice'

import useRandomNumbers from 'views/Tickets/hooks/useRandomNumbers'

const BuyTicketModal = () => {
  const [ step, setStep ] = useState('buy')
  const [ count, setCount ] = useState('')

  const zbstBalance = useZBSTBalance()
  const ticketPrice = useTicketPrice()

  return (
    <Modal title="Round 38" minWidth="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Text>You will buy:</Text>
        <Text>Tickets</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>You will Pay:</Text>
        <Text>Tickets</Text>
      </Flex>
    </Modal>
  )
}

export default BuyTicketModal
