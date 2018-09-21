'use strict'

const moment = require('moment')
const opn = require('opn')
const timetable = require('./timetable')
const {
  getUnmergedBranches,
  getOrigin,
  getRepos
} = require('./git-tools')

const DELAY = 6000


console.log(__dirname)
;(async function () {
  const repos = await getRepos('.')
  const promises = repos.map((pathname) => {
    console.log(pathname)
    console.log('before process path', __dirname)
    process.chdir(__dirname)
    process.chdir(pathname)
    console.log('after process path', __dirname)
    return getRemoteBranches()
  })
  Promise.all(promises).then((branches) => console.log(branches))
})()

setInterval(() => {
  getPassedKeys(timetable).forEach((key) => {
    opn(timetable[key].resource).then(() =>
      (timetable[key].open = true)
    )
  })
}, DELAY)

// This should be a module
async function getRemoteBranches () {
  const remote = (await getOrigin()).stdout
  // C'est con. Faire autrement :
  const remoteHttp = transformOrigin(remote)
  const { stdout } = await getUnmergedBranches('master')
  return formatStdoutBranches(stdout, remoteHttp)

  function formatStdoutBranches (stdout, remoteHttp) {
    return stdout.split('\n').map((branch) =>
      `${remoteHttp}/tree/${branch.replace(/^(\s+\*)?\s+/g, '')}`)
  }

  function transformOrigin (remote) {
    return remote.replace(':', '/')
      .replace('git@', 'https://')
      .replace(/\.git$/, '')
  }
}

function getPassedKeys (timetable) {
  return Object.keys(timetable).filter((strDate) =>
    moment().diff(moment(strDate), 'seconds') > 0 &&
    !timetable[strDate].open
  )
}
