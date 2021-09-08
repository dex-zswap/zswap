import { useTranslation } from 'contexts/Localization'

import { Text, Flex, Button } from 'zswap-uikit'
import LearMoreBtn from 'components/LearMoreBtn'
import styled from 'styled-components'

const Line = styled.div`
  width: 100%;
  max-width: 1100px;
  border-top: 3px dashed #fff;
  margin: 80px auto;
`

const QaWrap = styled(Flex)`
  position: relative;
  overflow: hidden;
  div,
  button {
    position: relative;
    z-index: 99;
  }
  img {
    position: absolute;
    right: 80px;
    bottom: 60px;
  }
  &::before {
    content: '';
    width: 50%;
    height: 100%;
    border-radius: 50%;
    background: #0050fe;
    filter: blur(200px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }

  &::after {
    content: '';
    width: 50%;
    height: 100%;
    border-radius: 50%;
    background: #f866ff;
    filter: blur(200px);
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
  }
`

const LotteryHeader = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" alignItems="center">
      <Text fontSize="48px" bold>
        {t('How to play')}
      </Text>
      <Text fontSize="16px" bold>
        {t('If the digits on your tickets match the winning numbers in the correct order,')}
      </Text>
      <Text mb="80px" fontSize="16px" bold>
        {t('you win a portion of the prize pool.')}
      </Text>
      <Flex>
        <Flex width="220px" flexDirection="column" alignItems="center">
          <Text fontSize="16px" color="blue" mb="18px" bold>
            {t('Step 1')}
          </Text>
          <Flex height="72px" alignItems="center" mb="20px">
            <img width="94px" src="/images/tickets/footer_1.png" />
          </Flex>
          <Text fontSize="24px" bold>
            {t('Buy ticket')}
          </Text>
          <Text textAlign="center">{t('The fare is 6.25 ZBST')}</Text>
        </Flex>
        <img
          style={{ margin: '80px 40px 0', height: 'fit-content' }}
          width="61px"
          src="/images/tickets/footer_arrow.png"
        />
        <Flex width="220px" flexDirection="column" alignItems="center">
          <Text fontSize="16px" color="blue" mb="18px" bold>
            {t('Step 2')}
          </Text>
          <Flex height="72px" alignItems="center" mb="20px">
            <img width="69px" src="/images/tickets/footer_2.png" />
          </Flex>
          <Text fontSize="24px" bold>
            {t('Wait for the draw')}
          </Text>
          <Text textAlign="center">{t('One draw every day at 2pm')}</Text>
        </Flex>
        <img
          style={{ margin: '80px 40px 0', height: 'fit-content' }}
          width="61px"
          src="/images/tickets/footer_arrow.png"
        />
        <Flex width="220px" flexDirection="column" alignItems="center">
          <Text fontSize="16px" color="blue" mb="18px" bold>
            {t('Step 3')}
          </Text>
          <Flex height="72px" alignItems="center" mb="20px">
            <img width="69px" src="/images/tickets/footer_3.png" />
          </Flex>
          <Text fontSize="24px" bold>
            {t('Check for prizes')}
          </Text>
          <Text textAlign="center">{t('Once the round’s over, check this page to see if you’ve won!')}</Text>
        </Flex>
      </Flex>
      <Line />
      <Flex justifyContent="center" mb="130px">
        <Flex mr="100px" width="580px" flexDirection="column">
          <Text fontSize="36px" mb="22px" bold>
            {t('Winning Criteria')}
          </Text>
          <Text fontSize="16px">
            {t(
              'Each ticket contains a total of six lottery balls, from digit 0 to 9, on each ticket (Digits can be repeated).',
            )}
          </Text>
          <Text fontSize="16px" mb="30px">
            {t(
              'To win, your numbers need to match the drawn numbers in the same order as the lottery balls, starting from the left of the ticket.',
            )}
          </Text>
          <Text fontSize="16px">{t('1st Prize - Match all 6 digits in the correct order')}</Text>
          <Text fontSize="16px">{t('2st Prize - Match the first 5 digits in the correct order')}</Text>
          <Text fontSize="16px">{t('3rd Prize - Match the first 4 digits in the correct order')}</Text>
          <Text fontSize="16px">{t('4th Prize - Match the first 3 digits in the correct order')}</Text>
          <Text fontSize="16px">{t('5th Prize - Match the first 2 digits in the correct order')}</Text>
          <Text fontSize="16px" mb="30px">
            {t('6th Prize - Match the first or the last digit (Higher chances of winning the 6th prize!)')}
          </Text>
          <Text fontSize="16px" mb="30px">
            {t(
              'Prize brackets don’t ‘stack’. For example, if you win the 2nd Prize, you’ll not get the 3rd, 4th, 5th or the 6th Prize.',
            )}
          </Text>
          <Text fontSize="16px" mb="45px">
            {t(
              'The amount won by each ticket will depend on how many other tickets won in the same prize bracket. For example, if the prize pool for the 3rd Prize is 1000 ZBST, there are five people won the 3rd Prize, the 1000 ZBST will be split between the five winning tickets, meaning every winning ticket will receive 200 ZBST.',
            )}
          </Text>
          <Text fontSize="36px" mb="22px" bold>
            {t('Draw Times')}
          </Text>
          <Text fontSize="16px" mb="45px">
            {t('One draw every day at 2pm.')}
          </Text>

          <Text fontSize="36px" mb="22px" bold>
            {t('Prize Funds')}
          </Text>
          <Text fontSize="16px" mb="30px">
            {t('The prizes for each lottery round come from three sources :')}
          </Text>
          <Text fontSize="16px">{t('-  10% (144000 ZBST) of the ZBST released in the block every day.')}</Text>
          <Text fontSize="16px">
            {t('-  The total amount of ZBST paid by the users buying ticket in the lottery round.')}
          </Text>
          <Text fontSize="16px" mb="45px">
            {t('-  The total amount of ZBST from the previous lottery round that was not won;')}
          </Text>

          <Text fontSize="36px" mb="22px" bold>
            {t('Prizes Allocation in each Brackets')}
          </Text>
          <Text fontSize="16px" mb="34px">
            {t(
              `Each bracket's prize pool is a portion of the total amount of ZBST in each Lottery round at a fixed ratio.`,
            )}
          </Text>
          <Text fontSize="16px">{t('1st Prize - 40%')}</Text>
          <Text fontSize="16px">{t('2st Prize - 20%')}</Text>
          <Text fontSize="16px">{t('3st Prize - 10%')}</Text>
          <Text fontSize="16px">{t('4st Prize - 5%')}</Text>
          <Text fontSize="16px">{t('5st Prize - 3%')}</Text>
          <Text fontSize="16px">{t('6st Prize - 2%')}</Text>
          <Text fontSize="16px" mb="45px">
            {t('Burn - 20%')}
          </Text>

          <Text fontSize="36px" mb="22px" bold>
            {t('Ticket Price')}
          </Text>
          <Text fontSize="16px" mb="45px">
            {t(
              'Price is 6.25 ZBST worth in ZBST per ticket. You can only buy a maximum of 100 tickets in one purchase, but you can make unlimited purchases. Once purchased you will not be able to convert your ticket back to ZBST.',
            )}
          </Text>

          <Text fontSize="36px" mb="22px" bold>
            {t('Source of Winning Numbers')}
          </Text>
          <Text fontSize="16px">
            {t(
              'The winning number consists of the last 6 pure numbers of the hash value of the last BTC block before the draw. The hash value of the BTC chain block is traceable, unpredictable, and non-tamperable, ensuring that the source of the ZSwap winning numbers is fair and can be verified.',
            )}
          </Text>
        </Flex>
        <Flex flexDirection="column" alignItems="flex-end">
          <img style={{ marginBottom: '350px' }} width="419px" src="/images/tickets/footer_img_1.png" />
          <img width="292px" src="/images/tickets/footer_img_2.png" />
        </Flex>
      </Flex>
      <QaWrap width="100%" height="300px" justifyContent="center" alignItems="center" flexDirection="column">
        <Text fontSize="24px" mb="20px" bold>
          {t('Still got question?')}
        </Text>
        <LearMoreBtn width="150px" href="https://www.baidu.com" />
        <img width="405px" src="/images/home/obj_3.png" />
      </QaWrap>
    </Flex>
  )
}

export default LotteryHeader
