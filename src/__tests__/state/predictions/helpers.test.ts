import {
  makeFutureRoundResponse,
  numberOrNull,
  transformBetResponse,
  transformTotalWonResponse,
  transformUserResponse,
} from 'state/predictions/helpers'

describe('numberOrNull', () => {
  it.each([
    ['2', 2],
    ['7.308', 7.308],
    [null, null],
    ['test', null],
  ])('return %s correctly as number, null, or NaN', (value, expected) => {
    expect(numberOrNull(value)).toEqual(expected)
  })
})

describe('makeFutureRoundResponse', () => {
  it('returns a correctly transformed future round response', () => {
    expect(makeFutureRoundResponse(200, 500)).toEqual({
      epoch: 200,
      startBlock: 500,
      lockBlock: null,
      endBlock: null,
      lockPrice: null,
      closePrice: null,
      totalAmount: { hex: '0x00', type: 'BigNumber' },
      bullAmount: { hex: '0x00', type: 'BigNumber' },
      bearAmount: { hex: '0x00', type: 'BigNumber' },
      rewardBaseCalAmount: { hex: '0x00', type: 'BigNumber' },
      rewardAmount: { hex: '0x00', type: 'BigNumber' },
      oracleCalled: false,
    })
  })
})

describe('transformUserResponse', () => {
  const userResponse = {
    averageBNB: '0.0101753905736882928',
    block: '9316304',
    createdAt: '1626767110',
    id: '0x54f292760e248cfe64191c7d85260f9ddaa01f2b',
    netBNB: '0.057914277602874121',
    totalBNB: '0.050876952868441464',
    totalBNBBear: '0.050876952868441464',
    totalBNBBull: '0',
    totalBNBClaimed: '0.119668183339757049',
    totalBets: '5',
    totalBetsBear: '3',
    totalBetsBull: '2',
    totalBetsClaimed: '1',
    updatedAt: '1626770557',
    winRate: '20',
  }

  it('transforms user response correctly', () => {
    expect(transformUserResponse(userResponse)).toEqual({
      averageBNB: 0.0101753905736882928,
      block: 9316304,
      createdAt: 1626767110,
      id: '0x54f292760e248cfe64191c7d85260f9ddaa01f2b',
      netBNB: 0.057914277602874121,
      totalBNB: 0.050876952868441464,
      totalBNBBear: 0.050876952868441464,
      totalBNBBull: 0,
      totalBNBClaimed: 0.119668183339757049,
      totalBets: 5,
      totalBetsBear: 3,
      totalBetsBull: 2,
      totalBetsClaimed: 1,
      updatedAt: 1626770557,
      winRate: 20,
    })
  })
})

describe('transformBetResponse', () => {
  const userResponse = {
    averageBNB: '0.005',
    block: '9315031',
    createdAt: '1626763291',
    id: '0x335d6a2c3dd0c04a21f41d30c9ee75e640a87890',
    netBNB: '-0.0055',
    totalBNB: '0.005',
    totalBNBBear: '0.005',
    totalBNBBull: '0',
    totalBNBClaimed: '0.0045',
    totalBets: '1',
    totalBetsBear: '0',
    totalBetsBull: '1',
    totalBetsClaimed: '1',
    updatedAt: '1626763291',
    winRate: '100',
  }

  it('returns a correctly transformed betresponse without round', () => {
    const betResponseWithoutRound = {
      id: 'id',
      hash: 'hash',
      amount: '500',
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      user: userResponse,
    }

    expect(transformBetResponse(betResponseWithoutRound)).toEqual({
      id: 'id',
      hash: 'hash',
      amount: 500,
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      user: {
        averageBNB: 0.005,
        block: 9315031,
        createdAt: 1626763291,
        id: '0x335d6a2c3dd0c04a21f41d30c9ee75e640a87890',
        netBNB: -0.0055,
        totalBNB: 0.005,
        totalBNBBear: 0.005,
        totalBNBBull: 0,
        totalBets: 1,
        totalBNBClaimed: 0.0045,
        totalBetsBear: 0,
        totalBetsBull: 1,
        totalBetsClaimed: 1,
        updatedAt: 1626763291,
        winRate: 100,
      },
    })
  })

  it('returns a correctly transformed betresponse with round', () => {
    const betResponseWithRound = {
      id: 'id',
      hash: 'hash',
      amount: '500',
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      user: userResponse,
      round: {
        id: '200',
        epoch: '200',
        failed: false,
        startBlock: '500',
        startAt: '1000',
        lockAt: '1000',
        lockBlock: '500',
        lockPrice: '200',
        endBlock: '500',
        closePrice: '201',
        totalBets: '2',
        totalAmount: '100',
        bullBets: '1',
        bearBets: '1',
        bearAmount: '50',
        bullAmount: '50',
        position: null,
        bets: [],
      },
    }

    expect(transformBetResponse(betResponseWithRound)).toEqual({
      id: 'id',
      hash: 'hash',
      amount: 500,
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      round: {
        id: '200',
        epoch: 200,
        failed: false,
        startBlock: 500,
        startAt: 1000,
        lockAt: 1000,
        lockBlock: 500,
        lockPrice: 200,
        endBlock: 500,
        closePrice: 201,
        totalBets: 2,
        totalAmount: 100,
        bullBets: 1,
        bearBets: 1,
        bearAmount: 50,
        bullAmount: 50,
        position: null,
        bets: [],
      },
      user: {
        averageBNB: 0.005,
        block: 9315031,
        createdAt: 1626763291,
        id: '0x335d6a2c3dd0c04a21f41d30c9ee75e640a87890',
        netBNB: -0.0055,
        totalBNB: 0.005,
        totalBNBBear: 0.005,
        totalBNBBull: 0,
        totalBets: 1,
        totalBNBClaimed: 0.0045,
        totalBetsBear: 0,
        totalBetsBull: 1,
        totalBetsClaimed: 1,
        updatedAt: 1626763291,
        winRate: 100,
      },
    })
  })
})

describe('transformTotalWonResponse', () => {
  it('returns a correctly transformed total won response', () => {
    const totalWonMarketResponse = {
      totalBNB: '200',
      totalBNBTreasury: '100',
    }
    const roundResponse = [{ totalAmount: '5' }, { totalAmount: '2' }]
    expect(transformTotalWonResponse(totalWonMarketResponse, roundResponse)).toEqual(93)
  })
})
