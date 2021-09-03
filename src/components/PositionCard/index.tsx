import React, { useState } from 'react'
import { JSBI, Pair, Percent } from 'zswap-sdk'
import { Button, Text, ChevronUpIcon, ChevronDownIcon, Card, Flex, CardProps } from 'zswap-uikit'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTotalSupply from 'hooks/useTotalSupply'

import { useTokenBalance } from 'state/wallet/hooks'
import { currencyId } from 'utils/currencyId'
import { unwrappedToken } from 'utils/wrappedCurrency'

import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { BIG_INT_ZERO } from 'config/constants'
import Dots from 'components/Loader/Dots'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {
        userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
          <AutoColumn
            style={{
              padding: '24px',
              width: '100%',
              background: '#1A1A1A',
              zIndex: 99,
              borderRadius: '20px',
            }}
            gap="16px"
          >
            {/* <FixedHeightRow>
              <RowFixed>
                <Text color="secondary" bold>
                  {t('LP tokens in your wallet')}
                </Text>
              </RowFixed>
            </FixedHeightRow> */}

            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="textSubtle" small bold>
                  {t('Pooled %asset%', { asset: currency0.symbol })}
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text ml="6px" bold>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="textSubtle" small bold>
                  {t('Pooled %asset%', { asset: currency1.symbol })}
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text ml="6px" bold>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                <RowFixed>
                  {/* <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} /> */}
                  {/* <Text small color="textSubtle">
                  {currency0.symbol}-{currency1.symbol} LP
                </Text> */}
                  <Text small color="textSubtle" bold>
                    {t('Your pool tokens')}
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Text bold>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="textSubtle" small bold>
                  {t('Your pool share')}
                </Text>
                <Text bold>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        ) : null
        // (
        //   <LightCard>
        //     <Text  style={{ textAlign: 'center' }}>
        //       <span role="img" aria-label="pancake-icon">
        //         🥞
        //       </span>{' '}
        //       {t(
        //         "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
        //       )}
        //     </Text>
        //   </LightCard>
        // )
      }
    </>
  )
}

export default function FullPositionCard({ pair, ...props }: PositionCardProps) {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <Card {...props}>
      <Flex
        background="#2F2F2F"
        justifyContent="space-between"
        role="button"
        onClick={() => setShowMore(!showMore)}
        p="16px"
      >
        {/* <Flex flexDirection="column">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text fontSize="20px" bold ml="8px">
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
          <Text fontSize="20px" color="textSubtle" bold>
            {userPoolBalance?.toSignificant(4)}
          </Text>
        </Flex> */}
        <Flex alignItems="center">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <Text fontSize="20px" bold ml="8px">
            {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
          </Text>
        </Flex>
        <Flex alignItems="center">
          <Text color="textSubtle" marginRight="10px" bold>
            {t('Manage')}
          </Text>
          {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      </Flex>

      {showMore && (
        <AutoColumn gap="8px" style={{ padding: '16px' }}>
          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency0} />
              <Text color="textSubtle" ml="4px" bold>
                {t('Pooled %asset%', { asset: currency0.symbol })}
              </Text>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <Text ml="6px" bold>
                  {token0Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency1} />
              <Text color="textSubtle" ml="4px" bold>
                {t('Pooled %asset%', { asset: currency1.symbol })}
              </Text>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <Text ml="6px" bold>
                  {token1Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <Text color="textSubtle" bold>
              {t('Your pool tokens')}
            </Text>
            <Text bold>{userPoolBalance?.toSignificant(4)}</Text>
          </FixedHeightRow>

          <FixedHeightRow>
            <Text color="textSubtle" bold>
              {t('Your pool share')}
            </Text>
            <Text bold>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
            <Flex marginTop="30px">
              <Button
                style={{ marginRight: '10px' }}
                scale="medium"
                as={Link}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="secondary"
                width="100%"
                mb="8px"
              >
                {t('Remove')}
              </Button>
              <Button
                scale="medium"
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
              >
                {t('Add Liquidity')}
              </Button>
            </Flex>
          )}
        </AutoColumn>
      )}
    </Card>
  )
}
