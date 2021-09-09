import { useEffect, useState, useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useWinNumbers } from './usePrizes'

const apiBase = process.env.REACT_APP_API_BASE

export default function useUserHistory(page: number = 1) {
  const [history, setHistory] = useState({
    page,
    pages: 0,
    list: [],
  })
  const { account } = useActiveWeb3React()

  useEffect(() => {
    const fetchHistory = () => {
      fetch(`${apiBase}/walletTran/queryListPage`, {
        mode: 'cors',
        credentials: 'omit',
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 7,
          srcAddr: account,
          current: page,
          size: 5,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          const data = res?.data || { currPage: 1, totalCount: 0, list: [] }
          const { currPage, totalCount, list } = data
          setHistory(() => ({
            list,
            page: currPage,
            pages: Math.ceil(totalCount / 5),
          }))
        })
    }

    if (page && account) {
      fetchHistory()
    }
  }, [page, account])

  return history
}

export function useAllUserLotteryIdsByLotteryNum(lotteryNum: string | number) {
  const [rewardNums, setRewardNums] = useState([])
  const winNumbers = useWinNumbers(lotteryNum)
  const winNumbersStr = winNumbers.join('')
  const rewardLevelNums = new Array(6).fill(0)
  const getRewardLevel = useCallback(
    (num: string) => {
      const numArr = num.split('')
      if (num == winNumbersStr) {
        ++rewardLevelNums[0]
        return
      }
      if (num.slice(0, 5) == winNumbersStr.slice(0, 5)) {
        ++rewardLevelNums[1]
        return
      }
      if (num.slice(0, 4) == winNumbersStr.slice(0, 4)) {
        ++rewardLevelNums[2]
        return
      }
      if (num.slice(0, 3) == winNumbersStr.slice(0, 3)) {
        ++rewardLevelNums[3]
        return
      }
      if (num.slice(0, 2) == winNumbersStr.slice(0, 2)) {
        ++rewardLevelNums[4]
        return
      }
      if (numArr[0] == winNumbers[0] || numArr[5] == winNumbers[5]) {
        ++rewardLevelNums[5]
        return
      }
      return
    },
    [lotteryNum, winNumbers],
  )

  useEffect(() => {
    const getAllUserLotteryIds = async () => {
      const res = await fetch(`${apiBase}/walletTran/queryList`, {
        mode: 'cors',
        credentials: 'omit',
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lotteryNum,
          category: 7,
          srcAddr: '',
        }),
      })
      if (res.ok) {
        const { data } = await res.json()
        data
          .map((d) => d.lottery.split(','))
          .flat()
          .forEach((d) => {
            getRewardLevel(d)
          }),
          setRewardNums(rewardLevelNums)
      }
    }
    getAllUserLotteryIds()
  }, [lotteryNum, winNumbers])

  return rewardNums
}

export function useUserLotteryIds(lotteryNum: string = '') {
  const [lotteryIds, setlotteryIds] = useState([])
  const { account } = useActiveWeb3React()
  useEffect(() => {
    const fetchLotteryIds = () => {
      fetch(`${apiBase}/walletTran/queryList`, {
        mode: 'cors',
        credentials: 'omit',
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lotteryNum,
          category: 7,
          srcAddr: account,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          const ids = []
          let findIndex

          if (res?.data && res?.data?.length) {
            res.data.forEach(({ lotteryNum, lottery, createTime }) => {
              if (lotteryNum) {
                findIndex = ids.findIndex(({ id }) => id === lotteryNum)
                if (findIndex === -1) {
                  ids.push({
                    id: lotteryNum,
                    numbers: lottery.split(','),
                    createTime,
                  })
                } else {
                  ids[findIndex] = {
                    id: lotteryNum,
                    numbers: ids[findIndex].numbers.concat(lottery.split(',')),
                    createTime,
                  }
                }
              }
            })
          }

          setlotteryIds(() => ids)
        })
    }

    if (account) {
      fetchLotteryIds()
    }
  }, [account])

  return lotteryIds
}

export function useUserAllLotteryIds() {
  const [lotteryIds, setlotteryIds] = useState([])
  const { account } = useActiveWeb3React()
  useEffect(() => {
    const fetchLotteryIds = () => {
      fetch(`${apiBase}/walletTran/queryList`, {
        mode: 'cors',
        credentials: 'omit',
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 7,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          const ids = []
          let findIndex

          if (res?.data && res?.data?.length) {
            res.data.forEach(({ lotteryNum, srcAddr, lottery }) => {
              if (lotteryNum) {
                findIndex = ids.findIndex(({ id, srcAddr: addr }) => id === lotteryNum && srcAddr === addr)
                if (findIndex === -1) {
                  ids.push({
                    id: lotteryNum,
                    srcAddr,
                    isSelf: srcAddr === account,
                    numbers: lottery.split(','),
                  })
                } else {
                  ids[findIndex] = {
                    id: lotteryNum,
                    srcAddr,
                    isSelf: srcAddr === account,
                    numbers: ids[findIndex].numbers.concat(lottery.split(',')),
                  }
                }
              }
            })
          }

          setlotteryIds(() => ids)
        })
    }

    if (account) {
      fetchLotteryIds()
    }
  }, [account])

  return lotteryIds
}
