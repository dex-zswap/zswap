import BigNumber from 'bignumber.js'
import { Button, useModal } from 'zswap-uikit'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useZSwapLPContract } from 'hooks/useContract'
import useUnstake from 'views/LPStake/hooks/useUnstake'
import useStake from 'views/LPStake/hooks/useStake'
import StakeModal from '../Modals/StakeModal'
import ManageStakeModal from '../Modals/ManageStakeModal'
import { Farm } from 'state/types'

interface FarmCardActionsProps {
  farm: Farm
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  addLiquidityUrl?: string
  [key: string]: any
}

const StakeAction: React.FC<FarmCardActionsProps> = ({ farm, stakedBalance, pair }) => {
  const { t } = useTranslation()
  const lpContract = useZSwapLPContract()
  const { onStake } = useStake(pair, lpContract, pair.pairInfo?.liquidityToken?.decimals, farm.lpSymbol)
  const { onUnstake } = useUnstake(pair, lpContract, pair.pairInfo?.liquidityToken?.decimals, farm.lpSymbol)
  const location = useLocation()

  const handleStake = async (amount: string) => {
    await onStake(amount)
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
  }

  const [onPresentDeposit] = useModal(<StakeModal farm={farm} handleStake={handleStake} />)
  const [onPresentManage] = useModal(
    <ManageStakeModal farm={farm} handleStake={handleStake} handleUnstake={handleUnstake} />,
  )

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button
        onClick={onPresentDeposit}
        disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
      >
        {t('Join')}
      </Button>
    ) : (
      <Button
        onClick={onPresentManage}
        disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
      >
        {t('Manage Stake')}
      </Button>
    )
  }
  return <>{renderStakingButtons()}</>
}

export default StakeAction
