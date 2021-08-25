import { Text, Button, useModal } from 'zswap-uikit'
import { LayoutProps, SpaceProps } from 'styled-system'
import ConnectWalletButton from 'components/ConnectWalletButton'
import BuyTicketsModal from './BuyTicketsModal'

import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface btnProps extends LayoutProps, SpaceProps {
  accountTip?: string
  noAccountTip?: string
  onDismiss?: () => void
}

const BuyTicketsButton: React.FC<btnProps> = ({ onDismiss, accountTip, noAccountTip, ...props }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [useBuyTicketsModal] = useModal(<BuyTicketsModal onDismiss={onDismiss} />)

  return (
    <>
      {(accountTip || noAccountTip) && (
        <Text textAlign="center" mb="20px">
          {account ? accountTip : noAccountTip}
        </Text>
      )}
      {account ? (
        <Button width="210px" {...props} onClick={useBuyTicketsModal}>
          {t('Buy Tickets')}
        </Button>
      ) : (
        <ConnectWalletButton {...props} />
      )}
    </>
  )
}

export default BuyTicketsButton
