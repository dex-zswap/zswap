import styled from 'styled-components'
import { Text, Flex, LinkExternal, ArrowRightIcon, Button } from 'zswap-uikit'
import Card from './Card'
import BuyTicketsButton from './BuyTicketsButton'
import { ZSWAP_EXPLORE } from 'config/constants/zswap/address'

import { useTranslation } from 'contexts/Localization'
import { format, parseISO, isValid } from 'date-fns'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useUserHistory from 'views/Tickets/hooks/useUserHistory'
import { useState } from 'react'

const HistoryWrap = styled.div`
  position: relative;
  margin-bottom: 200px;
  img {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    &:first-child {
      top: -20px;
      transform: translateX(-480px);
    }
    &:nth-child(2) {
      top: 280px;
      transform: translateX(-660px);
    }
    &:nth-child(3) {
      top: 170px;
      transform: translateX(500px);
    }
  }
`

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

const RenderHistory = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [pageNum, setPageNum] = useState(1)
  const { list, pages, page } = useUserHistory(pageNum)

  if (!account || !list.length) {
    return (
      <Flex height="238px" flexDirection="column" alignItems="center" justifyContent="center">
        <BuyTicketsButton
          accountTip={t('No lottery history found. Buy tickets for the next draw!')}
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
          {list.map(({ id, lotteryNum, createTime, lottery, txId }) => {
            return (
              <tr key={id}>
                <td>{lotteryNum || '-'}</td>
                <td>{format(new Date(createTime), 'yyyy.MM.dd HH:mm')}</td>
                <td>{lottery?.split(',').length || 0}</td>
                <td>
                  <LinkExternal style={{ margin: 'auto' }} href={`${ZSWAP_EXPLORE}/tx/${txId}`} bold={false} small>
                    {t('More details')}
                    <ArrowRightIcon width="10px" marginLeft="6px" />
                  </LinkExternal>
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
          <Text>{`Page ${page} of ${pages}`}</Text>
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

const UserHistory = () => {
  const { t } = useTranslation()

  return (
    <HistoryWrap>
      <img width="191px" src="/images/tickets/obj_2_1.png" />
      <img width="22px" src="/images/tickets/obj_2_2.png" />
      <img width="109px" src="/images/tickets/obj_2_3.png" />
      <Text textAlign="center" fontSize="48px" margin="0 auto 75px" bold>
        {t('Your History')}
      </Text>
      <Card title={t('Your History')}>{RenderHistory()}</Card>
    </HistoryWrap>
  )
}

export default UserHistory
