'use strict'

const path = require('path')
const globby = require('globby')
const execa = require('execa')

async function getUnmergedBranches (baseBranch) {
  return execa('git', ['branch', '--no-merged', baseBranch])
}

async function getOrigin () {
  return execa('git', ['config', '--get', 'remote.origin.url'])
}

function getRepos (pathname) {
  return globby(`${pathname}/**/.git`, {
    onlyDirectories: true,
    matchBase: true
  }).then(repos => repos.map((gitDir) => path.dirname(gitDir)))
}

// function getUnmergedBranchesSync (baseBranch) {
//   return (function () {
//     const { stdout } = await getUnmergedBranches(baseBranch)
//     console.log('non merged', stdout.trim())
//     return stdout.trim()
//   })()
// }

module.exports = {
  getUnmergedBranches,
  getOrigin,
  getRepos
  // getUnmergedBranchesSync
}
