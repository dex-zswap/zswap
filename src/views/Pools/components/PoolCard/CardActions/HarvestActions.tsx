import React from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from 'zswap-uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import CollectModal from 'views/Pools/components/PoolCard/Modals/CollectModal'

interface HarvestActionsProps {
  earnings: BigNumber
  stakingToken: Token
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  stakingToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, 0)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings, 0)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = sousId === 0

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      stakingToken={stakingToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  return null
  // <Flex justifyContent="space-between" alignItems="center" mb="16px">
  //   <Flex flexDirection="column">
  //     {isLoading ? (
  //       <Skeleton width="80px" height="48px" />
  //     ) : (
  //       <>
  //         {hasEarnings ? (
  //           <>
  //             <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
  //             {earningTokenPrice > 0 && (
  //               <Balance
  //                 display="inline"
  //                 fontSize="12px"
  //                 color="textSubtle"
  //                 decimals={2}
  //                 prefix="~"
  //                 value={earningTokenDollarBalance}
  //                 unit=" USD"
  //               />
  //             )}
  //           </>
  //         ) : (
  //           <>
  //             <Heading color="textDisabled">0</Heading>
  //             <Text fontSize="12px" color="textDisabled">
  //               0 USD
  //             </Text>
  //           </>
  //         )}
  //       </>
  //     )}
  //   </Flex>
  //   <Button disabled={!hasEarnings} onClick={onPresentCollect}>
  //     {t('Harvest')}
  //   </Button>
  // </Flex>
}

export default HarvestActions
