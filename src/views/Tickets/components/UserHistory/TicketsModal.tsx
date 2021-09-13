import React, { useState, useCallback, useContext } from 'react'
import { useTranslation } from 'contexts/Localization'

import styled from 'styled-components'
import { Text, Flex, Modal } from 'zswap-uikit'
import TicketsRecords from '../TicketsRecords'

const NumWrap = styled(Flex)`
  align-items: center;
  > div {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border-radius: 50%;
    margin-right: 10px;
    &:first-child,
    &:nth-child(4) {
      background: #ff66ff;
    }
    &:nth-child(2),
    &:nth-child(5) {
      background: #8c40ff;
    }
    &:nth-child(3),
    &:nth-child(6) {
      background: #0050ff;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`

interface TicketsModalProps {
  lotteryId: string
  onDismiss?: () => void
}

const ballArr = new Array(6).fill('')

const TicketsModal: React.FC<TicketsModalProps> = ({ lotteryId, onDismiss }) => {
  const { t } = useTranslation()

  const [winNumber, setWinNumber] = useState([])
  const [totalTickNum, setTotalTickNum] = useState(0)
  const [winTickNum, setWinTickNum] = useState(0)

  const setTickData = useCallback(
    (winNumber = [], totalTickNum = 0, winTickNum = 0) => {
      setWinNumber(winNumber)
      setTotalTickNum(totalTickNum)
      setWinTickNum(winTickNum)
    },
    [lotteryId, setWinNumber, setTotalTickNum, setWinTickNum],
  )

  return (
    <Modal onDismiss={onDismiss} title={t('Round') + lotteryId} minWidth="480px">
      <Text mb="28px">{t('Winning numbers')}</Text>
      <Flex alignItems="center" mb="35px">
        <NumWrap>
          {ballArr.map((d, index) => (
            <div key={index}>{winNumber[index] ?? '-'}</div>
          ))}
        </NumWrap>
      </Flex>
      <Text mb="30px">{t('Your tickets')}</Text>
      <Flex alignItems="center" mb="20px">
        <Text width="150px" mr="60px" bold>
          {t('Total tickets')}
        </Text>
        <Text bold>{totalTickNum}</Text>
      </Flex>
      <Flex alignItems="center" mb="46px">
        <Text width="150px" mr="60px" bold>
          {t('Winning tickets')}
        </Text>
        <Text bold>{winTickNum}</Text>
      </Flex>
      <TicketsRecords lotteryId={lotteryId} setTickData={setTickData} />
    </Modal>
  )
}

export default TicketsModal
