import { Text, Flex } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const LotteryHeader = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" alignItems="center">
      <Text fontSize="48px" bold>
        {t('How to play')}
      </Text>
      <Text fontSize="16px" bold>
        {t('If the digits on your tickets match the winning numbers in the correct order,')}
      </Text>
      <Text mb="80px" fontSize="16px" bold>
        {t('you win a portion of the prize pool.')}
      </Text>
    </Flex>
  )
}

export default LotteryHeader
