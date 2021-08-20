import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import Grid from '../../components/Box/Grid'
import Box from '../../components/Box/Box'
import getThemeValue from '../../util/getThemeValue'
import Text from '../../components/Text/Text'
import Heading from '../../components/Heading/Heading'
import { Button } from '../../components/Button'
import { ModalBody, ModalCloseButton, ModalContainer, ModalHeader, ModalTitle } from '../Modal'
import WalletCard, { MoreWalletCard } from './WalletCard'
import config, { walletLocalStorageKey } from './config'
import { Config, Login } from './types'

interface Props {
  login: Login
  onDismiss?: () => void
  displayCount?: number
}

/**
 * Checks local storage if we have saved the last wallet the user connected with
 * If we find something we put it at the top of the list
 *
 * @returns sorted config
 */
const getPreferredConfig = (walletConfig: Config[]) => {
  const preferredWalletName = localStorage.getItem(walletLocalStorageKey)
  const sortedConfig = walletConfig.sort((a: Config, b: Config) => a.priority - b.priority)

  if (!preferredWalletName) {
    return sortedConfig
  }

  const preferredWallet = sortedConfig.find((sortedWalletConfig) => sortedWalletConfig.title === preferredWalletName)

  if (!preferredWallet) {
    return sortedConfig
  }

  return [
    preferredWallet,
    ...sortedConfig.filter((sortedWalletConfig) => sortedWalletConfig.title !== preferredWalletName),
  ]
}

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null, displayCount = 3 }) => {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const theme = useTheme()
  const sortedConfig = getPreferredConfig(config)
  // const displayListConfig = showMore ? sortedConfig : sortedConfig.slice(0, displayCount)
  const displayListConfig = sortedConfig

  return (
    <ModalContainer minWidth="320px">
      <ModalHeader background={getThemeValue('colors.gradients.bubblegum')(theme)}>
        <ModalTitle>
          <Heading>{t('Connect to a wallet')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody width={['320px', null, '340px']}>
        <Box p="10px 0 24px" maxHeight="453px" overflowY="auto">
          <Grid>
            {displayListConfig.map((wallet) => (
              <Box key={wallet.title}>
                <WalletCard walletConfig={wallet} login={login} onDismiss={onDismiss} />
              </Box>
            ))}
            {/* {!showMore && <MoreWalletCard onClick={() => setShowMore(true)} />} */}
          </Grid>
        </Box>
        {/* <Box p="24px">
          <Text textAlign="center" color="textSubtle" as="p" mb="16px">
            Haven&#39;t got a crypto wallet yet?
          </Text>
          <Button
            as="a"
            href="https://docs.pancakeswap.finance/get-started/connection-guide"
            variant="subtle"
            width="100%"
            {...getExternalLinkProps()}
          >
            Learn How to Connect
          </Button>
        </Box> */}
      </ModalBody>
    </ModalContainer>
  )
}

export default ConnectModal
