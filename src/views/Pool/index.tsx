import React from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from 'zswap-uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Dots from 'components/Loader/Dots'
import { AppHeader, AppBody } from 'components/App'
import SwapAndLiquidityPage from 'components/SwapAndLiquidityPage'
import { useUserPairs } from './hooks'
import WrappedPositionCard from './components/card'
import ConnectWalletButton from 'components/ConnectWalletButton'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.background};
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const { loading, pairs } = useUserPairs()

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('No liquidity found.')}
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
        <WrappedPositionCard key={pair.pair} pair={pair} mb={index < pairs.length - 1 ? '16px' : 0} />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <SwapAndLiquidityPage>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body marginBottom="20px">
          {renderBody()}
          {/* {account && !loading && !pairs?.length && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button id="import-pool-link" variant="secondary" scale="sm" as={Link} to="/find">
                {t('Find other LP tokens')}
              </Button>
            </Flex>
          )} */}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          {!account ? (
            <ConnectWalletButton style={{ width: '100%' }} />
          ) : (
            <Button id="join-pool-button" as={Link} to="/add" width="100%">
              {t('Add Liquidity')}
            </Button>
          )}
        </CardFooter>
      </AppBody>
    </SwapAndLiquidityPage>
  )
}
