import React, { createContext, useEffect, useMemo, useReducer } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBunnyFactoryContract } from 'utils/contractHelpers'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { MINT_COST, REGISTER_COST, ALLOWANCE_MULTIPLIER } from 'views/Profile/ProfileCreation/config'
import { Actions, State, ContextType } from './types'

const totalCost = MINT_COST + REGISTER_COST
const allowance = totalCost * ALLOWANCE_MULTIPLIER

const initialState: State = {
  isInitialized: false,
  currentStep: 0,
  teamId: null,
  selectedNft: {
    nftAddress: null,
    tokenId: null,
  },
  userName: '',
  minimumCakeRequired: new BigNumber(totalCost).multipliedBy(DEFAULT_TOKEN_DECIMAL),
  allowance: new BigNumber(allowance).multipliedBy(DEFAULT_TOKEN_DECIMAL),
}

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        isInitialized: true,
        currentStep: action.step,
      }
    case 'next_step':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      }
    case 'set_team':
      return {
        ...state,
        teamId: action.teamId,
      }
    case 'set_selected_nft':
      return {
        ...state,
        selectedNft: {
          tokenId: action.tokenId,
          nftAddress: action.nftAddress,
        },
      }
    case 'set_username':
      return {
        ...state,
        userName: action.userName,
      }
    default:
      return state
  }
}

export const ProfileCreationContext = createContext<ContextType>(null)

const ProfileCreationProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account } = useWeb3React()

  // Initial checks
  useEffect(() => {
    let isSubscribed = true

    const fetchData = async () => {
      const bunnyFactoryContract = getBunnyFactoryContract()
      const canMint = await bunnyFactoryContract.canMint(account)
      dispatch({ type: 'initialize', step: canMint ? 0 : 1 })

      // When changing wallets quickly unmounting before the hasClaim finished causes a React error
      if (isSubscribed) {
        dispatch({ type: 'initialize', step: canMint ? 0 : 1 })
      }
    }

    if (account) {
      fetchData()
    }

    return () => {
      isSubscribed = false
    }
  }, [account, dispatch])

  const actions: ContextType['actions'] = useMemo(
    () => ({
      nextStep: () => dispatch({ type: 'next_step' }),
      setTeamId: (teamId: number) => dispatch({ type: 'set_team', teamId }),
      setSelectedNft: (tokenId: number, nftAddress: string) =>
        dispatch({ type: 'set_selected_nft', tokenId, nftAddress }),
      setUserName: (userName: string) => dispatch({ type: 'set_username', userName }),
    }),
    [dispatch],
  )

  return <ProfileCreationContext.Provider value={{ ...state, actions }}>{children}</ProfileCreationContext.Provider>
}

export default ProfileCreationProvider
