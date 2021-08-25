import styled from 'styled-components'
import { Text, Flex, Button } from 'zswap-uikit'
import Card from './Card'
import TicketsRecords from './TicketsRecords'
import BuyTicketsButton from './BuyTicket/BuyTicketsButton'

import { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useUserLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'

const Line = styled.div`
  width: 100%;
  border-top: 3px dashed #fff;
  margin: 30px 0 20px;
`

const UserPrizes = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const lotteryIds = useUserLotteryIds()
  const currentLotteryId = useCurrentLotteryId()
  const lastDrawPriceHistory = useMemo(
    () => !!lotteryIds.filter((d) => d.id == Number(currentLotteryId) - 1).length,
    [lotteryIds, currentLotteryId],
  )

  return (
    <Flex mb="260px" alignItems="center" flexDirection="column">
      <Text textAlign="center" fontSize="48px" bold>
        {t('Your Prizes')}
      </Text>
      <Text mb="100px" fontSize="24px" bold>
        {t('Ready to see if you have won a prize?')}
      </Text>
      <Card width="420px" title={t('Your Prizes')}>
        {!account || !lastDrawPriceHistory ? (
          <Flex height="238px" flexDirection="column" alignItems="center" justifyContent="center">
            {!account && <Text mb="20px">{t('Connect your wallet to check your prizes')}</Text>}
            {account && !lastDrawPriceHistory && (
              <>
                {'1' != currentLotteryId && <Text mb="5px">{t('You have not won any prizes last round.')}</Text>}
                <Text mb="20px">{t('Buy tickets for this draw!')}</Text>
              </>
            )}
            <BuyTicketsButton />
          </Flex>
        ) : (
          <>
            <TicketsRecords onlyShowWin />
            <Line />
            <Flex justifyContent="space-between" alignItems="center">
              <div>
                <Text fontSize="16px" bold>
                  {t('Amount of your')}
                </Text>
                <Text fontSize="16px" bold>
                  {t('winning prizes')}
                </Text>
              </div>
              <div>
                <Text color="blue" fontSize="36px" bold>
                  $66000
                </Text>
                <Text>25000 ZBst</Text>
              </div>
            </Flex>
            <Flex justifyContent="center">
              <Button width="210px" mt="28px">
                {t('Collect Prizes')}
              </Button>
            </Flex>
          </>
        )}
      </Card>
    </Flex>
  )
}

export default UserPrizes
