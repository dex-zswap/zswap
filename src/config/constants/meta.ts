import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'ZSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by ZSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('ZSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('ZSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('ZSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('ZSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('ZSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('ZSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('ZSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('ZSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('ZSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('ZSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('ZSwap')}`,
      }
    default:
      return null
  }
}
