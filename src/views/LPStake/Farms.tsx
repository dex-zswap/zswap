import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from 'zswap-uikit'
import Select from 'components/Select/Select'
import { Spinner } from 'zswap-uikit'
import HelpButton from 'components/HelpButton'
import { ChainId } from 'zswap-sdk'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsData, usePriceCakeBusd } from 'state/farms/hooks'
import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
// import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly } from 'state/user/hooks'
import PageHeader from 'components/PageHeader'
import { OptionProps } from 'components/Select/Select'
import { FarmWithStakedValue } from './components/FarmCard/FarmCard'
// import Table from './components/FarmTable/FarmTable'
import WrapperedCard from './components/FarmCard/WrappedCard'
import { ViewMode } from './components/types'
import { useAllPairs } from './hooks/useAllPairs'
import { useTotalValueLocked } from './hooks/useTotalValueLocked/state'
import FarmTabButtons from './components/FarmTabButtons'
import SearchInput from 'components/SearchInput'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0 40px;
  padding: 0 8px;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 60px;
`

const LabelWrapper = styled.div``

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: -24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const HeaderWrap = styled(PageHeader)`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    width: 350px;
    height: 150px;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(200px);
    position: absolute;
    bottom: -100px;
    left: 0;
    right: 0;
    margin: auto;
    transform: translateX(-50%);
    z-index: 0;
  }

  &::after {
    content: '';
    width: 350px;
    height: 150px;
    border-radius: 50%;
    background: #f866ff;
    filter: blur(140px);
    position: absolute;
    bottom: -100px;
    left: 0;
    right: 0;
    margin: auto;
    transform: translateX(50%);
    z-index: 0;
  }
`

const PairCardWrap = styled.div`
  min-width: 360px;
  height: 535px;
  background: #292929;
  box-shadow: 0px 0px 32px 0px rgba(19, 53, 93, 0.51);
  border-radius: 30px;
  margin: 0 8px 24px;
`

const CardContainer = styled(Flex)`
  flex-wrap: wrap;
`
const NUMBER_OF_FARMS_VISIBLE = 12

const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = usePersistState(ViewMode.CARD, {
    localStorageKey: 'pancake_farm_view',
  })
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const chosenFarmsLength = useRef(0)
  const { loading, pairs } = useAllPairs()

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived
  const totalLocked = useTotalValueLocked()

  usePollFarmsData(isArchived)

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyFarms = farmsLP.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = farmsLP.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = farmsLP.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity, farm.lpAddresses[ChainId.MAINNET])
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return {
          ...farm,
          apr: cakeRewardsApr,
          lpRewardsApr,
          liquidity: totalLiquidity,
        }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
          if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
            return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
          }
          return farmsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [chosenFarmsMemoized, observerIsSet])

  const renderContent = (): JSX.Element => {
    return (
      <CardContainer>
        <Route exact path={`${path}`}>
          {pairs.map((pair) => (
            <PairCardWrap key={pair.pair}>
              <WrapperedCard pair={pair} pairs={pairs} />
            </PairCardWrap>
          ))}
        </Route>
        <Route exact path={`${path}/history`}>
          {pairs.map((pair) => (
            <PairCardWrap key={pair.pair}>
              <WrapperedCard pair={pair} pairs={pairs} />
            </PairCardWrap>
          ))}
        </Route>
        <Route exact path={`${path}/archived`}>
          {pairs.map((pair) => (
            <PairCardWrap key={pair.pair}>
              <WrapperedCard pair={pair} pairs={pairs} />
            </PairCardWrap>
          ))}
        </Route>
      </CardContainer>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      <HeaderWrap>
        {/* <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Farms')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Stake LP tokens to earn.')}
        </Heading>
        <NavLink exact activeClassName="active" to="/farms/auction" id="lottery-pot-banner">
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('Community Auctions')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </NavLink> */}
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="lg" color="secondary" mb="10px">
              {t('Earn ZBST by staking assets for market making')}
              <HelpButton />
            </Heading>
            <Heading scale="xxl" color="pink">
              ${totalLocked}
            </Heading>
            <Heading scale="md" color="text">
              {t('Total Value Locked (TVL)')}
            </Heading>
          </Flex>
          {/* <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
              <HelpButton />
              <BountyCard />
            </Flex> */}
        </Flex>
      </HeaderWrap>
      <Page>
        <ControlContainer>
          <FilterContainer>
            <LabelWrapper style={{ marginRight: 20 }}>
              <Text mb="5px" bold>
                {t('Search')}
              </Text>
              <SearchInput onChange={handleChangeQuery} placeholder="Search Pools by name or pool address" />
            </LabelWrapper>
            <LabelWrapper>
              <Text mb="5px" bold>
                {t('Sort by')}
              </Text>
              <Select
                options={[
                  {
                    label: t('APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Weight'),
                    value: 'weight',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Liquidity'),
                    value: 'liquidity',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
          </FilterContainer>
          <Flex justifyContent="center" alignItems="center">
            <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
            <ToggleWrapper>
              <Text mr="10px" bold>
                {' '}
                {t('Your Liquidity Only')}
              </Text>
              <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
            </ToggleWrapper>
          </Flex>
        </ControlContainer>
        {renderContent()}
        {account && loading && (
          <Flex height="400px" alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        )}
        <div ref={loadMoreRef} />
        {!loading && pairs.length === 0 && (
          // <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
          <Text>{t('You are not currently providing liquidity for any LP pools.')}</Text>
        )}
      </Page>
    </>
  )
}

export default Farms
