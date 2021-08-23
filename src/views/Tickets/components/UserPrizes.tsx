import styled from 'styled-components'
import { Text, Flex } from 'zswap-uikit'
import Card from './Card'

import { useTranslation } from 'contexts/Localization'

const UserPrizes = () => {
  const { t } = useTranslation()

  return (
    <Flex mb="260px" alignItems="center" flexDirection="column">
      <Text textAlign="center" fontSize="48px" bold>
        {t('Your Prizes')}
      </Text>
      <Text mb="100px" fontSize="24px" bold>
        {t('Ready to see if you have won a prize?')}
      </Text>
      <Card width="420px" title={t('Your Prizes')}></Card>
    </Flex>
  )
}

export default UserPrizes
