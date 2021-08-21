import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { Text, Flex, Modal, Button } from 'zswap-uikit'
import useTicketPrice, { useZBSTBalance } from 'views/Tickets/hooks/useTicketPrice'
import useApprove, { useApproveStatus } from 'views/Tickets/hooks/useApprove'
import useBuy from 'views/Tickets/hooks/useBuy'
import useRandomNumbers from 'views/Tickets/hooks/useRandomNumbers'

enum Steps {
  INPUT_COUNT = 1,
  VIEW_EDIT_NUMBER = 2
}

const zeroPadOrder = (num) => {
  return ['#', num < 10 ? `00${num}` : num < 100 ? `0${num}` : num].join('')
}

const ViewEditNumbers = ({ count, numbersChange }) => {
  const randomNumber = useRandomNumbers(count)
  const [ numbers, setNumbers ] = useState([])

  const numberChange = useCallback((e, index, numIndex) => {
    const value = e.target.value.trim()
    const nums = numbers.map((nums, wrapIndex) => {
      if (index === wrapIndex) {
        nums.splice(numIndex, 1, value ? Number(value) : '')
      }
      return nums
    })
    setNumbers(nums)
  }, [numbers])

  useEffect(() => {
    if (numbers.length !== count) {
      setNumbers(randomNumber)
    }
  }, [randomNumber, count, numbers])

  useEffect(() => {
    numbersChange(numbers)
  }, [numbers])

  return (
    <div>
      {
        numbers.map((nums, wrapperIndex) => {
          return (
            <div key={nums.join('')}>
              {zeroPadOrder(wrapperIndex + 1)}
              {
                nums.map((num, numIndex) => {
                  return <input key={`${num}-${numIndex}`} maxLength={1} value={num} onChange={(e) => numberChange(e, wrapperIndex, numIndex)} />
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}

const BuyTicketModal = () => {
  const [ step, setStep ] = useState(Steps.INPUT_COUNT)
  const [ count, setCount ] = useState<number | string>(1)
  const [ numbers, setNumbers ] = useState([])

  const needApprove = useApproveStatus()
  const { approve } = useApprove()
  const { buyTickets } = useBuy()
  const zbstBalance = useZBSTBalance()
  const ticketPrice = useTicketPrice()

  const countChange = useCallback((e) => {
    let count = parseInt(e.target.value.trim()) as number
    if (count === Number(count)) {
      if (count > 100) {
        count = 100
        e.target.value = count
      }
      setCount(count)
    } else {
      setCount('')
      e.target.value = ''
    }
  }, [])

  const numbersChange = useCallback((nums) => {
    setNumbers(nums)
  }, [])

  const buy = useCallback(() => {
    console.log(numbers)
    buyTickets(numbers)
  }, [buyTickets, numbers])

  const viewTickets = useCallback(() => {
    setStep(Steps.VIEW_EDIT_NUMBER)
  }, [])

  const FooterButtons = useMemo(() => {
    if (needApprove) {
      return <Button onClick={approve}>Arrrove</Button>
    }

    if (step === Steps.INPUT_COUNT) {
      return (
        <Button onClick={viewTickets}>View Edit Numbers</Button>
      )
    }

    return (
      <Button onClick={buy}>Confirm Buy</Button>
    )
  }, [step, needApprove, buy, viewTickets, approve])

  return (
    <Modal title="Round 38" minWidth="600px">
      {
        step === Steps.INPUT_COUNT &&
        (
          <>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>You will buy:</Text>
              <Text>Tickets</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>You will Pay:</Text>
              <input value={count} onChange={countChange} />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>{zbstBalance?.toFixed(2)}</Text>
              <Text>{count && ticketPrice?.multipliedBy(count)?.toFixed(2)}</Text>
            </Flex>
          </>
        )
      }
      {
        step === Steps.VIEW_EDIT_NUMBER &&
        <ViewEditNumbers count={count} numbersChange={numbersChange}/>
      }
      {FooterButtons}
    </Modal>
  )
}

export default BuyTicketModal
