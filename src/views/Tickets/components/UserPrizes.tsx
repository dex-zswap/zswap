import { useContext, useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { LotteryContext } from 'contexts/Lottery'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useUserAllLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import { useCollectReward, useUserCollected } from 'views/Tickets/hooks/useUserPrize'
import { useAllWinNumbers } from 'views/Tickets/hooks/usePrizes'
import { useAllRewards } from 'views/Tickets/hooks/useLotteryReward'
import { useHasOpened } from 'views/Tickets/hooks/useWinTime'
import { BIG_ZERO, BIG_ONE } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'

import styled from 'styled-components'
import { Text, Flex, Button } from 'zswap-uikit'
import Card from './Card'
import TicketsRecords from './TicketsRecords'
import BuyTicketsButton from './BuyTicket/BuyTicketsButton'
import Dots from 'components/Loader/Dots'

const Line = styled.div`
  width: 100%;
  border-top: 3px dashed #fff;
  margin: 30px 0 20px;
`

const REWARD_RATE = [0.4, 0.2, 0.1, 0.05, 0.03, 0.02]

const getPrizesLevels = (prizes, filterUser = true) => {
  const result = {
    1: {
      total: 0,
      user: 0,
    },
    2: {
      total: 0,
      user: 0,
    },
    3: {
      total: 0,
      user: 0,
    },
    4: {
      total: 0,
      user: 0,
    },
    5: {
      total: 0,
      user: 0,
    },
    6: {
      total: 0,
      user: 0,
    },
  }

  prizes.forEach((prize) => {
    result[prize.level].total++
    if (prize.isSelf) {
      result[prize.level].user++
    }
  })

  if (filterUser) {
    Object.keys(result).forEach((key) => {
      if (Boolean(result[key].user)) {
        result[key].percent = result[key].user / result[key].total
      } else {
        delete result[key]
      }
    })
  }

  return result
}

const UserPrizes = () => {
  const { t } = useTranslation()
  const { currentLotteryId } = useContext(LotteryContext)

  const { fastRefresh } = useRefresh()
  const { account } = useActiveWeb3React()
  const lotteryIds = useUserAllLotteryIds()
  const allWinNumbers = useAllWinNumbers(currentLotteryId)
  const { collectReward, collecting } = useCollectReward()
  const userCollected = useUserCollected()
  const allPrizes = useMemo(() => {
    const prizes = {}
    let level = -1

    lotteryIds.forEach(({ id, isSelf, numbers }) => {
      const winNumbersStr = allWinNumbers[`lottery${id}`]?.join('')
      if (winNumbersStr) {
        numbers.forEach((num) => {
          level = -1
          if (num == winNumbersStr) {
            level = 1
          }
          if (num.slice(0, 5) == winNumbersStr.slice(0, 5) && level === -1) {
            level = 2
          }
          if (num.slice(0, 4) == winNumbersStr.slice(0, 4) && level === -1) {
            level = 3
          }
          if (num.slice(0, 3) == winNumbersStr.slice(0, 3) && level === -1) {
            level = 4
          }
          if (num.slice(0, 2) == winNumbersStr.slice(0, 2) && level === -1) {
            level = 5
          }
          if ((num[0] == winNumbersStr[0] || num[5] == winNumbersStr[5]) && level === -1) {
            level = 6
          }

          if (level > -1) {
            if (!prizes[`lottery${id}`]) {
              prizes[`lottery${id}`] = []
            }

            prizes[`lottery${id}`].push({
              lotteryId: id,
              winedNumber: num,
              isSelf,
              level,
            })
          }
        })
      }
    })

    return prizes
  }, [lotteryIds, allWinNumbers, fastRefresh])

  const lotteryRewardIds = useMemo(() => Object.keys(allPrizes).map((key) => key.substr(7)), [allPrizes])
  const hasOpened = useHasOpened(currentLotteryId)

  const isLastDrawReward = useMemo(
    () => lotteryRewardIds.includes(hasOpened ? currentLotteryId + '' : currentLotteryId - 1 + ''),
    [lotteryRewardIds],
  )

  const allRewardInfo = useAllRewards(lotteryRewardIds)

  const userTotalRewardInfo = useMemo(() => {
    let zbstEarnedReward = BIG_ZERO
    let zustEarnedReward = BIG_ZERO

    Object.keys(allPrizes).forEach((key) => {
      const rewardInfo = allRewardInfo[key]
      const [ZUST, ZBST] = rewardInfo ? [rewardInfo.zustValue, rewardInfo.zbstValue] : [BIG_ZERO, BIG_ZERO]
      const currentRound = getPrizesLevels(allPrizes[key])

      Object.keys(currentRound).forEach((key) => {
        const [zustPool, zbstPool] = [
          ZUST.times(REWARD_RATE[Number(key) - 1]),
          ZBST.times(REWARD_RATE[Number(key) - 1]),
        ]
        zbstEarnedReward = zbstEarnedReward.plus(
          zbstPool.times(currentRound[key].percent).toFixed(2, BigNumber.ROUND_DOWN),
        )
        zustEarnedReward = zustEarnedReward.plus(
          zustPool.times(currentRound[key].percent).toFixed(2, BigNumber.ROUND_DOWN),
        )
      })
    })

    if (userCollected.lt(zbstEarnedReward)) {
      const originalZbstAMount = zbstEarnedReward
      const canCliamiedPercent = BIG_ONE.minus(userCollected.dividedBy(originalZbstAMount))
      zbstEarnedReward = originalZbstAMount.multipliedBy(canCliamiedPercent)
      zustEarnedReward = zustEarnedReward.multipliedBy(canCliamiedPercent)
    } else {
      zbstEarnedReward = BIG_ZERO
      zustEarnedReward = BIG_ZERO
    }

    return {
      hasPrizes: zbstEarnedReward.gt(BIG_ZERO),
      zbst: zbstEarnedReward.toFixed(2, BigNumber.ROUND_DOWN),
      zust: zustEarnedReward.toFixed(2, BigNumber.ROUND_DOWN),
    }
  }, [allRewardInfo, allPrizes, userCollected])

  return (
    <Flex mb="260px" alignItems="center" flexDirection="column">
      <Text textAlign="center" fontSize="48px" bold>
        {t('Your Prizes')}
      </Text>
      <Text mb="100px" fontSize="24px" bold>
        {t('Ready to see if you have won a prize?')}
      </Text>
      <Card width="420px" title={t('Your Prizes')}>
        {!account || !isLastDrawReward ? (
          <Flex height="100px" flexDirection="column" alignItems="center" justifyContent="center">
            {!account && <Text mb="20px">{t('Connect your wallet to check your prizes')}</Text>}
            {account && !isLastDrawReward && <Text mb="20px">{t('Buy tickets for this draw!')}</Text>}
            <BuyTicketsButton />
          </Flex>
        ) : (
          <TicketsRecords currentLotteryId={currentLotteryId} onlyShowWin />
        )}
        <Line />
        <Flex justifyContent="space-between" alignItems="center">
          <div>
            <Text fontSize="16px" bold>
              {t('Amount of your')}
            </Text>
            <Text fontSize="16px" bold>
              {t('winning prizes')}
            </Text>
          </div>
          <div>
            <Text color="blue" fontSize="36px" bold>
              ${userTotalRewardInfo.zust}
            </Text>
            <Text>{userTotalRewardInfo.zbst} ZBST</Text>
          </div>
        </Flex>
        <Flex justifyContent="center">
          <Button
            width="210px"
            mt="28px"
            onClick={collectReward}
            disabled={collecting || '0.00' == userTotalRewardInfo.zbst}
          >
            {collecting ? <Dots>{t('Collecting')}</Dots> : t('Collect Prizes')}
          </Button>
        </Flex>
      </Card>
    </Flex>
  )
}

export default UserPrizes
