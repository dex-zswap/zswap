import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'

import styled from 'styled-components'
import { Text } from 'zswap-uikit'
import Card from '../Card'
import UserHistoryList from './UserHistoryList'
import UserHistoryDetail from './UserHistoryDetail'

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

const UserHistory = () => {
  const { t } = useTranslation()

  const [lotteryId, setLotteryId] = useState<string | number>('')
  const showDetail = useCallback((id) => {
    setLotteryId(id)
  }, [])

  const backList = useCallback(() => {
    setLotteryId('')
  }, [])

  const renderContent = useMemo(
    () =>
      lotteryId ? (
        <Card width="850px" title={`${t('Round')} ${lotteryId}`} back={backList}>
          <UserHistoryDetail lotteryId={lotteryId} />
        </Card>
      ) : (
        <Card title={t('Your History')}>{<UserHistoryList showDetail={showDetail} />}</Card>
      ),
    [lotteryId],
  )

  return (
    <HistoryWrap>
      <img width="191px" src="/images/tickets/obj_2_1.png" />
      <img width="22px" src="/images/tickets/obj_2_2.png" />
      <img width="109px" src="/images/tickets/obj_2_3.png" />
      <Text textAlign="center" fontSize="48px" margin="0 auto 75px" bold>
        {t('Your History')}
      </Text>
      {renderContent}
    </HistoryWrap>
  )
}

export default UserHistory
