import React from 'react'
import styled from 'styled-components'
import { Text, Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { Pool } from 'state/types'
import { getAprData } from 'views/Pools/helpers'
import { getAddress } from 'utils/addressHelpers'

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: #fff;
  margin: 10px 0 20px;
`

interface AprRowProps {
  pool: Pool
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ pool, performanceFee = 0 }) => {
  const { t } = useTranslation()
  const { stakingToken, earningToken, isFinished, apr, earningTokenPrice, isAutoVault } = pool

  const tooltipContent = isAutoVault
    ? t('APY includes compounding, APR doesn’t. This pool’s CAKE is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
  })

  const { apr: earningsPercentageToDisplay, roundingDecimals, compoundFrequency } = getAprData(pool, performanceFee)

  // const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'
  const apyModalLink = '/swap'

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={earningTokenPrice}
      apr={apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken?.symbol ?? '' })}
      linkHref={apyModalLink}
      earningTokenSymbol={earningToken?.symbol}
      roundingDecimals={roundingDecimals}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        {/* {tooltipVisible && tooltip} */}
        <Text fontSize="16px" mr="10px">
          {t('APR')}
        </Text>
        {/* <TooltipText ref={targetRef}>{isAutoVault ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText> */}
        {isFinished || !apr ? (
          <Skeleton width="82px" height="32px" />
        ) : (
          <Flex alignItems="center">
            <Balance
              fontSize="32px"
              isDisabled={isFinished}
              value={earningsPercentageToDisplay}
              decimals={2}
              unit="%"
            />
            {/* <IconButton onClick={onPresentApyModal} variant="text" scale="sm">
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton> */}
          </Flex>
        )}
      </Flex>
      <Line />
    </>
  )
}

export default AprRow
