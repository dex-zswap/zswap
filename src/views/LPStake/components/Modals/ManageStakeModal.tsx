import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button } from 'zswap-uikit'
import StakeModalContent from './StakeModalContent'
import { Modal } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'

const TabWrap = styled(Flex)`
  align-items: center;
  font-size: 16px;
  font-weigth: bold;
  > button {
    padding: 0;
    margin-right: 30px;
    &:last-child {
      margin-right: 0;
    }
  }
`
interface FarmProps extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
  [key: string]: any
}

interface ManageStakeModalProps {
  farm: FarmProps
  isRemovingStake?: boolean
  handleStake: (amount: string) => void
  handleUnstake: (amount: string) => void
  onDismiss?: () => void
}

const HeaderTabWrap = ({ getBtnColor, tabChange }) => {
  const { t } = useTranslation()

  return (
    <TabWrap>
      <Button style={{ color: getBtnColor('add') }} variant="text" onClick={() => tabChange('add')}>
        {t('Add')}
      </Button>
      <Button style={{ color: getBtnColor('withdraw') }} variant="text" onClick={() => tabChange('withdraw')}>
        {t('Withdraw')}
      </Button>
      <Button style={{ color: getBtnColor('reward') }} variant="text" onClick={() => tabChange('reward')}>
        {t('Reward')}
      </Button>
    </TabWrap>
  )
}

const ManageStakeModal: React.FC<ManageStakeModalProps> = ({ farm, handleStake, handleUnstake, onDismiss }) => {
  const { theme } = useTheme()
  const [tabType, setTabType] = useState('add')

  const isWithdraw = 'withdraw' === tabType
  const isReward = 'reward' === tabType

  const tabChange = useCallback((type: string) => setTabType(type), [])

  const getBtnColor = (type: string) => (type == tabType ? '#FF66FF' : '#fff')

  return (
    <Modal
      style={{ width: '640px' }}
      headerChildren={<HeaderTabWrap getBtnColor={getBtnColor} tabChange={tabChange} />}
      minWidth="640px"
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <StakeModalContent
        tabType={tabType}
        farm={farm}
        isRemovingStake={isWithdraw}
        isReward={isReward}
        handleStake={handleStake}
        handleUnstake={handleUnstake}
        onDismiss={onDismiss}
      />
    </Modal>
  )
}

export default ManageStakeModal
