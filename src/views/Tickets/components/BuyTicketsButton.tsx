import { Button } from 'zswap-uikit'
import { LayoutProps, SpaceProps } from 'styled-system'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface btnProps extends LayoutProps, SpaceProps {}

const BuyTicketsButton = (btnProps) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  return (
    <>
      {account ? (
        <Button width="210px" {...btnProps}>
          {t('Buy Tickets')}
        </Button>
      ) : (
        <ConnectWalletButton {...btnProps} />
      )}
    </>
  )
}

export default BuyTicketsButton
