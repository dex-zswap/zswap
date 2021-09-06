import React, { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from 'zswap-uikit'
import { useLocation } from 'react-router-dom'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useLpTokenPrice } from 'state/farms/hooks'
import { useZSwapLPContract } from 'hooks/useContract'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useERC20 } from 'hooks/useContract'
import DepositModal from 'views/LPStake/components/DepositModal'
import WithdrawModal from 'views/LPStake/components/WithdrawModal'
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

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  farm,
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  pair,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()
  const lpContract = useZSwapLPContract()
  const { onStake } = useStake(pair, lpContract, pair.pairInfo?.liquidityToken?.decimals, farm.lpSymbol)
  const { onUnstake } = useUnstake(pair, lpContract, pair.pairInfo?.liquidityToken?.decimals, farm.lpSymbol)
  const location = useLocation()
  // const lpPrice = useLpTokenPrice(tokenName)

  const handleStake = async (amount: string) => {
    await onStake(amount)
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance, 0)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

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
      // <IconButtonWrapper>
      //   <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
      //     <MinusIcon color="primary" width="14px" />
      //   </IconButton>
      //   <IconButton
      //     variant="tertiary"
      //     onClick={onPresentDeposit}
      //     disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
      //   >
      //     <AddIcon color="primary" width="14px" />
      //   </IconButton>
      // </IconButtonWrapper>
    )
  }
  return <>{renderStakingButtons()}</>
}

export default StakeAction
