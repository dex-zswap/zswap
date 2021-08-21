import { useEffect, useState } from 'react'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useWinNumbers } from './usePrizes'

const apiBase = process.env.REACT_APP_API_BASE

export default function useUserHistory(page: number = 1) {
  const [ history, setHistory ] = useState({
    page,
    pages: 0,
    list: []
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
          srcAddr: account,
          current: page,
          size: 5
        }),
      }).then((response) => response.json())
        .then((res) => {
          const { data: {
            currPage,
            totalCount,
            list
          } } = res

          setHistory(() => ({
            list,
            page: currPage,
            pages: Math.ceil(totalCount / 5)
          }))
        })
    }

    if (page && account) {
      fetchHistory()
    }
  }, [page, account])
}
