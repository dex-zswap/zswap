const REACT_APP_REPORT_URL = process.env.REACT_APP_REPORT_URL

export enum TransactionType {
  TRANSFER_IN = 1,
  TRANSFER_OUT = 2,
}

export enum TransactionStatus {
  SUCCESS = 1,
  FAILURE = 2,
}

enum TransactionCategory {
  SWAP = 1,
  LP_PLEDGE = 2,
  SINGLE_PLEDGE = 3,
  ADD_LIQUIDITY = 4,
  REMOVE_LIQUIDITY = 5,
  APPROVE = 6,
  TICKET = 7,
}

export declare type ReportFrom =
  | 'swap'
  | 'approve'
  | 'addLiquidity'
  | 'removeLiquidity'
  | 'LPPledge'
  | 'singlePledge'
  | 'ticket'

type TransactionRecord = Partial<{
  retryCount: number
  txId: string
  srcAddr: string
  dstAddr: string
  coinType: string
  tranAmt: number
  tranFee: number
  tranType: TransactionType
  tranState: TransactionStatus
  createTime: number
  updateTime: number
  bak: string
  nonce: string
  gasLimit: string
  gwei: string
  mainCoinType: string
  lottery: string
  lotteryNum: string
  category: TransactionCategory
}>

type FreeType = {
  [key: string]: any
}

type HashInfoBaseStructure = {
  hash: string
  from: string
  chainId: number
  summary: string
  reportData?: {
    from: ReportFrom
  } & FreeType
}

interface ReporterInterface {
  cacheHash(hash: string, hashInfo: HashInfoBaseStructure): void
  recordHash(hash: string, transitionInfo: TransactionRecord): void
}

class Reporter implements ReporterInterface {
  private cachedHashMaps = {}

  private reportTransaction(hash: string) {
    const body: TransactionRecord = this.cachedHashMaps[hash]
    const { retryCount } = body
    delete body.retryCount

    fetch(REACT_APP_REPORT_URL, {
      mode: 'cors',
      credentials: 'omit',
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(
        (res) => {
          delete this.cachedHashMaps[hash]
          return res.json()
        },
        () => {
          if (retryCount > 3) {
            this.cachedHashMaps[hash] = Object.assign({}, body, {
              retryCount: retryCount + 1,
            })
            this.reportTransaction(hash)
          }
        },
      )
      .then((res) => {
        if (200 != res.code) {
          console.error(res.msg)
        }
      })
  }

  private makeInfoFromReportData(hashInfo: HashInfoBaseStructure): TransactionRecord {
    const { hash, from, chainId, reportData } = hashInfo
    const info: TransactionRecord = {
      retryCount: 1,
      txId: hash,
      srcAddr: from,
      createTime: Date.now(),
      mainCoinType: `${chainId}`,
      gasLimit: reportData.gas?.toString(),
      gwei: '0',
      nonce: '0',
    }

    switch (reportData.from) {
      case 'approve':
        info.tranType = TransactionType.TRANSFER_OUT
        info.category = TransactionCategory.APPROVE
        break
      case 'addLiquidity':
        info.tranType = TransactionType.TRANSFER_OUT
        info.category = TransactionCategory.ADD_LIQUIDITY
        break
      case 'removeLiquidity':
        info.tranType = TransactionType.TRANSFER_IN
        info.category = TransactionCategory.REMOVE_LIQUIDITY
        break
      case 'LPPledge':
        info.tranType = TransactionType.TRANSFER_OUT
        info.category = TransactionCategory.LP_PLEDGE
        break
      case 'singlePledge':
        info.tranType = TransactionType.TRANSFER_OUT
        info.category = TransactionCategory.SINGLE_PLEDGE
        break
      case 'swap':
        info.tranType = TransactionType.TRANSFER_OUT
        info.category = TransactionCategory.SWAP
        switch (reportData.methodName) {
          case 'swapExactETHForTokensSupportingFeeOnTransferTokens':
            break
          case 'swapExactETHForTokens':
            break
        }
        break
      case 'ticket':
        info.tranType = TransactionType.TRANSFER_OUT
        info.category = TransactionCategory.TICKET
        info.lottery = reportData.lottery
        info.lotteryNum = reportData.lotteryNum
        break
    }

    return info
  }

  public cacheHash(hash: string, hashInfo: HashInfoBaseStructure): void {
    this.cachedHashMaps[hash] = this.makeInfoFromReportData(hashInfo)
  }

  public recordHash(hash: string, transitionInfo: TransactionRecord = {}): void {
    if (!this.cachedHashMaps[hash]) {
      return
    }
    const storagedHash: TransactionRecord = this.cachedHashMaps[hash]
    this.cachedHashMaps[hash] = Object.assign(storagedHash, transitionInfo, {
      updateTime: Date.now(),
    })
    this.reportTransaction(hash)
  }
}

const reporter: Reporter = new Reporter()

export default reporter
