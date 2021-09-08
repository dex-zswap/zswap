import React from 'react'
import useLinks from './useLinks'
import { useTranslation } from 'contexts/Localization'

import Flex from '../../../components/Box/Flex'
import Link from '../../../components/Link/Link'

const localeToLinkLangKey = {
  'en-US': 'enUrl',
  'zh-CN': 'url',
  'zh-TW': 'tcUrl',
}

const SocialLinks: React.FC = () => {
  const { currentLanguage } = useTranslation()
  const { locale } = currentLanguage
  const links = useLinks()

  return (
    <Flex>
      {links.map((link, index) => {
        const mr = index < links.length - 1 ? '20px' : 0
        return (
          <Link external key={link.title} href={link[localeToLinkLangKey[locale]]} aria-label={link.title} mr={mr}>
            <img style={{ cursor: 'pointer' }} width="24px" src={link.desc} />
          </Link>
        )
      })}
    </Flex>
  )
}

export default React.memo(SocialLinks, () => true)
