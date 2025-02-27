import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading, Skeleton, Flex, Text } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useCakeVault } from 'state/pools/hooks'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import HelpButton from 'components/HelpButton'
import { ViewMode } from './components/ToggleView/ToggleView'
import WrapperedCard from './components/WrappedCard'
import useAllPools from './hooks/usePools'
import { useTotalValueLocked } from './hooks/useTotalValueLocked/state'

const CardLayout = styled(Flex)`
  flex-wrap: wrap;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
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

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const totalLocked = useTotalValueLocked()
  const allPools = useAllPools()
  const [stakedOnly, setStakedOnly] = usePersistState(false, {
    localStorageKey: 'pancake_pool_staked',
  })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.CARD, {
    localStorageKey: 'pancake_pool_view',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault()
  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
          if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
            return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
          }
          return poolsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  // const showFinishedPools = location.pathname.includes('history')

  // const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(event.target.value)
  // }

  // const handleSortOptionChange = (option: OptionProps): void => {
  //   setSortOption(option.value)
  // }

  // const sortPools = (poolsToSort: Pool[]) => {
  //   switch (sortOption) {
  //     case 'apr':
  //       // Ternary is needed to prevent pools without APR (like MIX) getting top spot
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
  //         'desc',
  //       )
  //     case 'earned':
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => {
  //           if (!pool.userData || !pool.earningTokenPrice) {
  //             return 0
  //           }
  //           return pool.isAutoVault
  //             ? getCakeVaultEarnings(
  //                 account,
  //                 cakeAtLastUserAction,
  //                 userShares,
  //                 pricePerFullShare,
  //                 pool.earningTokenPrice,
  //               ).autoUsdToDisplay
  //             : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
  //         },
  //         'desc',
  //       )
  //     case 'totalStaked':
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
  //         'desc',
  //       )
  //     default:
  //       return poolsToSort
  //   }
  // }

  return (
    <>
      <HeaderWrap>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="lg" color="secondary" mb="10px">
              {t('Earn ZBST by staking assets for market making')}
              <HelpButton href="https://zswap.gitbook.io/zswap/chan-p/untitled/ru-he-jin-hang-dan-bi-zhi-ya" />
            </Heading>
            <Heading scale="xxl" color="pink">
              {['0.00', 0].includes(totalLocked) ? (
                <Skeleton width="300px" height="70px" margin="10px 0" />
              ) : (
                '$' + totalLocked
              )}
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
        {/* <PoolControls>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <FilterContainer>
            <LabelWrapper>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
            </LabelWrapper>
          </FilterContainer>
        </PoolControls> */}
        {/* {showFinishedPools && (
          <Text fontSize="20px" color="failure" pb="32px">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )} */}
        <CardLayout>
          {allPools.map((pool) => (
            <WrapperedCard key={pool.sousId} pool={pool} account={account} />
          ))}
        </CardLayout>
        <div ref={loadMoreRef} />
        {/* <Image
          mx="auto"
          mt="12px"
          src="/images/decorations/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        /> */}
      </Page>
    </>
  )
}

export default Pools
