'use strict'

// const child = require('child_process')
const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')

const readDir = Promise.promisify(fs.readdir)
const fsStat = Promise.promisify(fs.lstat)

// getAllRepos('.').then(stdout => console.log(stdout))

// function getAllRepos (path) {
//   return new Promise((resolve, reject) => {
//     child.exec(`find ${path} -type d -name .git`, (error, stdout, stderr) => {
//       if (error) reject(new Error({ error, stderr }))
//       resolve(stdout)
//     })
//   })
// }

function isGitRepo (currentPath) {
  return listFolders(currentPath).then(folders => folders.includes('.git'))
}

function listFolders (currentPath, filterSet) {
  return readDir(currentPath)
    .filter(fileOrDirectory => {
      return fsStat(path.join(currentPath, fileOrDirectory))
        .then(stat => stat.isDirectory() && !stat.isSymbolicLink())
    })
    .then(list => filterSet
      ? list.filter(name => !filterSet.includes(name))
      : list
    )
    .catch(error => {
      console.log(error)
      throw error
    })
  // .map(directory => listfolders(path.join(currentPath, directory)));
}

function getAllRepos (aPath) {
  return listFolders(aPath, ['node_modules']).then(dat => {
    console.log('list folders', dat)
    return dat
  }).then((folders) =>
    folders
      .map(currentPath => path.join(aPath, currentPath))
      .filter(isGitRepo))
    .then(gitRepos => {
      console.log('repos', gitRepos)
    })
}

getAllRepos('.')
