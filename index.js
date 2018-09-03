'use strict'

const moment = require('moment')
const opn = require('opn')
const timetable = require('./timetable')

const DELAY = 6000

setInterval(() => {
  getPassedKeys(timetable).forEach((key) => {
    opn(timetable[key].resource).then(() =>
      (timetable[key].open = true)
    )
  })
}, DELAY)

function getPassedKeys (timetable) {
  return Object.keys(timetable).filter((strDate) =>
    moment().diff(moment(strDate), 'seconds') > 0 &&
    !timetable[strDate].open
  )
}
