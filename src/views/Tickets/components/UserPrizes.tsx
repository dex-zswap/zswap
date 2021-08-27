import { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, Flex, Button } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useUserAllLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import { useCollectReward, useUserCollected } from 'views/Tickets/hooks/useUserPrize'
import { useAllWinNumbers } from 'views/Tickets/hooks/usePrizes'
import { useAllRewards } from 'views/Tickets/hooks/useLotteryReward'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import Card from './Card'
import TicketsRecords from './TicketsRecords'
import BuyTicketsButton from './BuyTicket/BuyTicketsButton'

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
  const { fastRefresh } = useRefresh()
  const { account } = useActiveWeb3React()
  const currentLotteryId = useCurrentLotteryId()
  const lotteryIds = useUserAllLotteryIds()
  const allWinNumbers = useAllWinNumbers()
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
          if (num[0] === winNumbersStr[0] && num[4] === winNumbersStr[4] && level === -1) {
            level = 2
          }
          if (num[0] === winNumbersStr[0] && num[3] === winNumbersStr[3] && level === -1) {
            level = 3
          }
          if (num[0] === winNumbersStr[0] && num[2] === winNumbersStr[2] && level === -1) {
            level = 4
          }
          if (num[0] === winNumbersStr[0] && num[1] === winNumbersStr[1] && level === -1) {
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
        zbstEarnedReward = zbstEarnedReward.plus(zbstPool.times(currentRound[key].percent)).minus(userCollected)
        zustEarnedReward = zustEarnedReward.plus(zustPool.times(currentRound[key].percent)).minus(userCollected)
      })
    })

    return {
      hasPrizes: zbstEarnedReward.gt(BIG_ZERO),
      zbst: zbstEarnedReward.toFixed(4, BigNumber.ROUND_DOWN),
      zust: zustEarnedReward.toFixed(4, BigNumber.ROUND_DOWN),
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
        {!account || !lotteryIds.length ? (
          <Flex height="238px" flexDirection="column" alignItems="center" justifyContent="center">
            {!account && <Text mb="20px">{t('Connect your wallet to check your prizes')}</Text>}
            {account && !userTotalRewardInfo.hasPrizes && (
              <>
                {'1' != currentLotteryId && <Text mb="5px">{t('You have not won any prizes last round.')}</Text>}
                <Text mb="20px">{t('Buy tickets for this draw!')}</Text>
              </>
            )}
            <BuyTicketsButton />
          </Flex>
        ) : (
          <>
            <TicketsRecords onlyShowWin />
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
                <Text>{userTotalRewardInfo.zbst} ZBst</Text>
              </div>
            </Flex>
            <Flex justifyContent="center">
              <Button width="210px" mt="28px" onClick={collectReward} isLoading={collecting}>
                {t('Collect Prizes')}
              </Button>
            </Flex>
          </>
        )}
      </Card>
    </Flex>
  )
}

export default UserPrizes
