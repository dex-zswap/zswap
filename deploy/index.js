const scpClient = require('scp2')
const ora = require('ora')
const chalk = require('chalk')

// 配置进度转轮
const initSpinner = function (text, type = 'succeed') {
  const color = 'succeed' === type ? 'green' : 'fail' === type ? 'red' : 'cyan'
  return ora(chalk[color](text))[type]()
}

console.log('\r')
const spinner = initSpinner('正在发布到测试服务器...\r', 'start')

scpClient.scp(
  'build/',
  {
    host: '103.43.11.66',
    port: 17330,
    username: 'root',
    password: 'ZBTtoe14',
    path: '/var/www/html/zswap/official/',
    readyTimeout: 50000,
  },
  function (err) {
    spinner.stop()
    if (err) {
      initSpinner(`发布失败！\r${err}`, 'fail')
      throw err
    } else {
      initSpinner('Success！成功发布到测试环境！\r')
    }
  },
)
