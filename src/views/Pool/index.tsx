import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from 'zswap-sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from 'zswap-uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { usePairs } from 'hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import Dots from 'components/Loader/Dots'
import { AppHeader, AppBody } from 'components/App'
import Page from 'views/Page'
import { useUserPairs } from './hooks'
import WrappedPositionCard from './components/card'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const { loading, pairs } = useUserPairs()

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (loading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    if (pairs?.length > 0) {
      return pairs.map((pair, index) => (
        <WrappedPositionCard key={pair.pair} pair={pair} mb={index < pairs.length ? '16px' : 0} />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
          {account && !loading && !pairs?.length && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button id="import-pool-link" variant="secondary" scale="sm" as={Link} to="/find">
                {t('Find other LP tokens')}
              </Button>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Button id="join-pool-button" as={Link} to="/add" width="100%" startIcon={<AddIcon color="white" />}>
            {t('Add Liquidity')}
          </Button>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
