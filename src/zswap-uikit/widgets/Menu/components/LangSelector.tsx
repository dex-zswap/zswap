import React from 'react'
import { Text, Flex } from 'zswap-uikit'
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
 <Flex justifyContent="center" alignItems="center">
    {langs.map((lang, index) => <Flex key={lang.locale} alignItems="center">
    {0 != index && <span style={{color:'#fff', fontWeight:'bold',margin:"0 6px"}}>/</span>}
    <Button style={{color: currentLang == lang.code ? '#0050ff' : '#fff'}} height="fit-content" padding="0" variant="text" onClick={() => setLang(lang)}>{lang.code}</Button>
    </Flex>
    )}
   </Flex>
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
