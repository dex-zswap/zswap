import { useState, useEffect } from 'react'

import useActiveWeb3React from 'hooks/useActiveWeb3React'

const apiBase = process.env.REACT_APP_API_BASE

export function useAllTickets() {
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

          res.data
            .filter(({ tranState }) => tranState === 1)
            .forEach(({ lotteryNum, lottery }) => {
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
