import React from 'react'
import styled from 'styled-components'
import { CogIcon } from '../../../components/Svg'
import { ShareIcon } from '../../../components/Svg'
import { LangIcon } from '../../../components/Svg'
import IconButton from '../../../components/Button/IconButton'
import { MENU_ENTRY_HEIGHT } from '../config'
import { PanelProps, PushedProps } from '../types'
import CakePrice from './CakePrice'
import ThemeSwitcher from './ThemeSwitcher'
import SocialLinks from './SocialLinks'
import LangSelector from './LangSelector'

interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  padding: 30px 0;
  flex: none;
  background-color: ${({ theme }) => theme.nav.background};
`

const SettingsEntry = styled.div`
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 16px;
  > svg {
    margin-right: 40px;
  }
  > div {
    cursor: pointer;
  }
`

// const SettingsEntry = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   height: ${MENU_ENTRY_HEIGHT}px;
//   padding: 0 8px;
// `

// const SocialEntry = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   height: ${MENU_ENTRY_HEIGHT}px;
//   padding: 0 16px;
// `

const PanelFooter: React.FC<Props> = ({
  isPushed,
  pushNav,
  toggleTheme,
  isDark,
  cakePriceUsd,
  currentLang,
  langs,
  setLang,
}) => {
  if (!isPushed) {
    return (
      <Container>
        <IconButton variant="text" onClick={() => pushNav(true)}>
          <CogIcon />
        </IconButton>
      </Container>
    )
  }
  return (
    <Container>
      <SettingsEntry>
        <ShareIcon width="16" color="textSubtle" />
        <SocialLinks />
      </SettingsEntry>
      <SettingsEntry>
        <LangIcon width="16" color="textSubtle" />
        <LangSelector currentLang={currentLang} langs={langs} setLang={setLang} />
      </SettingsEntry>
    </Container>
  )

  // return (
  //   <Container>
  //     <SocialEntry>
  //       <CakePrice cakePriceUsd={cakePriceUsd} />
  //       <SocialLinks />
  //     </SocialEntry>
  //     <SettingsEntry>
  //       <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
  //       <LangSelector currentLang={currentLang} langs={langs} setLang={setLang} />
  //     </SettingsEntry>
  //   </Container>
  // )
}

export default PanelFooter
