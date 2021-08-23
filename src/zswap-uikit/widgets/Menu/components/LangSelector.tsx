import React from 'react'
import Text from '../../../components/Text/Text'
import Dropdown from '../../../components/Dropdown/Dropdown'
import Button from '../../../components/Button/Button'
import LanguageIcon from '../../../components/Svg/Icons/Language'
import { Language } from '../types'
import MenuButton from './MenuButton'

interface Props {
  currentLang: string
  langs: Language[]
  setLang: (lang: Language) => void
}

const LangSelector: React.FC<Props> = ({ currentLang, langs, setLang }) => (
  <Text color="textSubtle" fontWeight="bold">
    {currentLang?.toUpperCase()}
  </Text>
  // <Dropdown
  //   position="top-right"
  //   target={
  //     <Text color="textSubtle" fontWeight="bold">
  //       {currentLang?.toUpperCase()}
  //     </Text>
  //   }
  // >
  //   {langs.map((lang) => (
  //     <MenuButton
  //       key={lang.locale}
  //       fullWidth
  //       onClick={() => setLang(lang)}
  //       // Safari fix
  //       style={{ minHeight: '32px', height: 'auto' }}
  //     >
  //       {lang.language}
  //     </MenuButton>
  //   ))}
  // </Dropdown>
)

export default React.memo(LangSelector, (prev, next) => prev.currentLang === next.currentLang)
