import React from 'react'
import LinkIcon from '../zswap-uikit/components/Svg/Icons/Link'
import { Button, useWalletModal } from 'zswap-uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button
      minWidth="200px"
      onClick={onPresentConnectModal}
      startIcon={props.hasIcon ? <LinkIcon width="30px" color="text" mr="2px" fontWeight="bold" /> : null}
      {...props}
    >
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
