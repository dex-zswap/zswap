import React from 'react'
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from 'zswap-uikit'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import DexLogo from 'components/Logo/tokens/DEX.png'
import ZbstLogo from 'components/Logo/tokens/ZBST.png'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken?: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
  if (token.symbol === 'DEX') return DexLogo
  if (token.symbol === 'ZBST') return ZbstLogo
  return `/images/tokens/${getAddress(token.address)}.png`
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ secondaryToken, ...props }) => {
  return <UIKitTokenPairImage secondarySrc={getImageUrlFromToken(secondaryToken)} {...props} />
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}
