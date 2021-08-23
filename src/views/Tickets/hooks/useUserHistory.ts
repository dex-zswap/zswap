import { useEffect, useState } from 'react'

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
          const {
            data: { currPage, totalCount, list },
          } = res

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

export function useUserLotteryIds() {
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
          srcAddr: account,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          const ids = []
          let findIndex

          res.data.forEach(({ lotteryNum, lottery }) => {
            console.log(lotteryNum, lottery)
            if (lotteryNum) {
              findIndex = ids.findIndex(({ id }) => id === lotteryNum)
              if (findIndex === -1) {
                ids.push({
                  id: lotteryNum,
                  numbers: lottery.split(','),
                })
              } else {
                ids[findIndex] = {
                  id: lotteryNum,
                  numbers: ids[findIndex].numbers.concat(lottery.split(',')),
                }
              }
            }
          })

          setlotteryIds(() => ids)
        })
    }

    if (account) {
      fetchLotteryIds()
    }
  }, [account])

  return lotteryIds
}
