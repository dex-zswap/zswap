import styled from 'styled-components'
import { Text, Flex } from 'zswap-uikit'
import Card from './Card'

import { useTranslation } from 'contexts/Localization'
import useUserHistory from 'views/Tickets/hooks/useUserHistory'

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
  const history = useUserHistory()

  return (
    <HistoryWrap>
      <img width="191px" src="/images/tickets/obj_2_1.png" />
      <img width="22px" src="/images/tickets/obj_2_2.png" />
      <img width="109px" src="/images/tickets/obj_2_3.png" />
      <Text textAlign="center" fontSize="48px" margin="0 auto 75px" bold>
        {t('Your History')}
      </Text>
      <Card title={t('Your History')}></Card>
    </HistoryWrap>
  )
}

export default UserHistory
