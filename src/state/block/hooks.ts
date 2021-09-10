import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { simpleRpcProvider } from 'utils/providers'
import { setBlock } from '.'
import { State } from 'state/types'

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const blockNumber = await simpleRpcProvider.getBlockNumber()
        dispatch(setBlock(blockNumber))
      } catch (e) {}
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
