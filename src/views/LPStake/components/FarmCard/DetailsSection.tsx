import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton, ArrowRightIcon } from 'zswap-uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      {/* <Flex justifyContent="space-between">
        <Text>{t('Total Liquidity')}:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex> */}
      {/* {!removed && (
        <StyledLinkExternal href={addLiquidityUrl}>{t('Get %symbol%', { symbol: lpLabel })}</StyledLinkExternal>
      )} */}
      <StyledLinkExternal mb="5px" href={addLiquidityUrl} small>
        {t('Get %symbol%', { symbol: lpLabel })}
        <ArrowRightIcon width="10px" marginLeft="6px" type="blue" />
      </StyledLinkExternal>
      <StyledLinkExternal mb="5px" href={bscScanAddress} small>
        {t('View Contract')}
        <ArrowRightIcon width="10px" marginLeft="6px" type="blue" />
      </StyledLinkExternal>
      <StyledLinkExternal mb="5px" href={infoAddress} small>
        {t('View Token Pair Info')}
        <ArrowRightIcon width="10px" marginLeft="6px" type="blue" />
      </StyledLinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
