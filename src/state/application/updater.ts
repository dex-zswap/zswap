import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useDebounce from 'hooks/useDebounce'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{
    chainId: number | undefined
    blockTime: number | null
    blockNumber: number | null
  }>({
    chainId,
    blockTime: null,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      library.getBlock(blockNumber).then((response) => {
        const blockTime = response.timestamp * 1000
        setState((prev) => {
          if (chainId === prev.chainId) {
            if (typeof prev.blockNumber !== 'number') return { chainId, blockNumber, blockTime }
            return {
              chainId,
              blockTime,
              blockNumber: Math.max(blockNumber, prev.blockNumber),
            }
          }
          return prev
        })
      })
    },
    [chainId, setState],
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null, blockTime: null })

    const interval = setInterval(() => {
      library
        .getBlockNumber()
        .then(blockNumberCallback)
        .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    }, 3000)

    library.on('block', blockNumberCallback)
    return () => {
      clearInterval(interval)
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
        blockTime: debouncedState.blockTime,
      }),
    )
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}
