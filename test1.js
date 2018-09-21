'use strict'

const fs = require('fs')
const { getRepos } = require('./git-tools')
const pathname = process.argv[2] || '.'

function isReadableDir (pathname) {
  return new Promise((resolve) => {
    fs.access(pathname, fs.constants.X_OK, (err) => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

;(async () => {
  const canBeRead = await isReadableDir(pathname)
  if (!canBeRead) {
    throw new Error(`can not read ${pathname}`)
  }
  const repos = await getRepos(pathname)
  console.log(repos)
})()
