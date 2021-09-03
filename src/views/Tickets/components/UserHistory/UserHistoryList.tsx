import styled from 'styled-components'
import { Text, Flex, ArrowRightIcon, Button } from 'zswap-uikit'
import BuyTicketsButton from '../BuyTicket/BuyTicketsButton'

import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useUserLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import { useState, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

const HistoryTable = styled.table`
  width: 100%;
  margin-top: 30px;
  th,
  td {
    width: 25%;
    font-size: 14px;
    padding: 10px;
    color: #fff;
    text-align: center;
    &:first-child {
      text-align: left;
    }
  }
`

const UserHistoryList = ({ showDetail }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [pageNum, setPageNum] = useState(1)
  const [list, setList] = useState([])
  const lotteryIds = useUserLotteryIds()
  const pages = Math.ceil(lotteryIds.length / 5)

  useEffect(() => {
    setList(lotteryIds.slice((pageNum - 1) * 5, pageNum * 5))
  }, [lotteryIds, pageNum])

  const getDrawTime = useCallback((time) => {
    const hour = new Date(time).getHours()
    const date = hour > 14 ? dayjs(time).add(1, 'day').format('YYYY.MM.DD') : dayjs(time).format('YYYY.MM.DD')
    return `${date} 14:00`
  }, [])

  if (!account || !list.length) {
    return (
      <Flex height="238px" flexDirection="column" alignItems="center" justifyContent="center">
        <BuyTicketsButton
          accountTip={t('No lottery history found. Buy tickets for this draw!')}
          noAccountTip={t('Connect your wallet to check your history')}
        />
      </Flex>
    )
  }

  return (
    <>
      <HistoryTable>
        <tbody>
          <tr>
            <th>{t('Round')}</th>
            <th>{t('Draw Time')}</th>
            <th>{t('Purchase Quantity')}</th>
            <th>{t('Details')}</th>
          </tr>
          {list.map(({ id, createTime, numbers }, index) => {
            return (
              <tr key={index}>
                <td>{id || '-'}</td>
                <td>{getDrawTime(createTime)}</td>
                <td>{numbers.length || 0}</td>
                <td>
                  <Button
                    style={{ height: 'fit-content', fontSize: '14px', fontWeight: 'normal' }}
                    endIcon={<ArrowRightIcon width="10px" marginLeft="6px" />}
                    variant="text"
                    padding="0"
                    onClick={() => {
                      showDetail(id, getDrawTime(createTime))
                    }}
                  >
                    {t('More details')}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </HistoryTable>
      {pages > 1 && (
        <Flex mt="15px" justifyContent="center" alignItems="center">
          <Button
            padding="0"
            scale="sm"
            variant="text"
            mr="8px"
            disabled={pageNum == 1}
            onClick={() => setPageNum((pageNum) => --pageNum)}
          >{`<`}</Button>
          <Text>{`Page ${pageNum} of ${pages}`}</Text>
          <Button
            padding="0"
            scale="sm"
            variant="text"
            ml="8px"
            disabled={!(pageNum < pages)}
            onClick={() => setPageNum((pageNum) => ++pageNum)}
          >{`>`}</Button>
        </Flex>
      )}
    </>
  )
}

export default UserHistoryList
