import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text'
import MoreHorizontal from '../../components/Svg/Icons/MoreHorizontal'
import { ButtonProps } from '../../components/Button'
import { connectorLocalStorageKey, walletLocalStorageKey } from './config'
import { Login, Config, ConnectorNames } from './types'
import { Flex } from '@pancakeswap/uikit'

interface Props {
  walletConfig: Config
  login: Login
  onDismiss: () => void
}

const WalletButton = styled(Button).attrs({
  width: 'calc(100% - 48px)',
  variant: 'text',
  py: '16px',
})`
  display: flex;
  align-items: center;
  height: auto;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  background: #2b2b2b;
  margin-bottom: 12px;
`

export const MoreWalletCard: React.FC<ButtonProps> = (props) => {
  return (
    <WalletButton variant="tertiary" {...props}>
      <MoreHorizontal width="40px" mb="8px" color="textSubtle" />
      <Text>More</Text>
    </WalletButton>
  )
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss }) => {
  const { title, icon: Icon } = walletConfig

  return (
    <WalletButton
      variant="tertiary"
      onClick={() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

        // Since iOS does not support Trust Wallet we fall back to WalletConnect
        if (walletConfig.title === 'Trust Wallet' && isIOS) {
          login(ConnectorNames.WalletConnect)
        } else {
          login(walletConfig.connectorId)
        }

        localStorage.setItem(walletLocalStorageKey, walletConfig.title)
        localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId)
        onDismiss()
      }}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      <Icon width="40px" mb="8px" />
      <Text>{title}</Text>
    </WalletButton>
  )
}

export default WalletCard
