/*global DZ*/
import moment from 'moment'
import {getAPISongInfo} from './dz_actions'

// APP STATE :
export function toggleAppLoading ({dispatch, state}) {
    dispatch('SET_APPLOADING', !state.appLoading)
}
export function setAppLoading ({dispatch}, loading) {
    dispatch('SET_APPLOADING', loading)
}
export function setEventLoading ({dispatch}, loading) {
    dispatch('SET_EVENTLOADING', loading)
}
export function setMoving ({dispatch}, moving) {
    dispatch('SET_MOVING', moving)
}

export function clickEvent ({dispatch, state}, event) {
    if (!state.moving) {
        dispatch('SET_MOVING', true)
        dispatch('SET_CURRENTEVENT', event)
        if (state.playing) {
            dispatch('SET_PLAYING', false)
            DZ.player.pause()
        }
    }
}

// ALGO :
// function getIntervalSongs (state, stateEvDate, days) {
//     var retObj = {}
//     var evDate = moment(stateEvDate)
//     retObj.date = evDate.format('YYYY-MM-DD')
//     retObj.tab = []
//     retObj.nb = 0
//     // Populate tabSongs with songs listenend to, after/before the event
//     for (var ss = 0; ss < state.songs.length; ss++) {
//         var songDate = moment.unix(state.songs[ss].timestamp)
//         if (Math.abs(songDate.diff(evDate, 'days')) < days) {
//             var tabUpdated = false
//             retObj.nb += 1
//             retObj.tab.forEach(val => {
//                 if (val.id === state.songs[ss].id) {
//                     val.nb += 1
//                     tabUpdated = true
//                 }
//             })
//             if (!tabUpdated) {
//                 var tempObj = JSON.parse(JSON.stringify(state.songs[ss]))
//                 tempObj.nb = 1
//                 retObj.tab.push(tempObj)
//             }
//         }
//     }
//     retObj.tab.sort((a, b) => b.nb - a.nb)
//     return retObj
// }

function getIntervalDailySongs (state, stateEvDate, days) {
    var retObj = {}
    var evDate = moment(stateEvDate, 'YYYY-MM-DD')
    retObj.date = evDate.format('YYYY-MM-DD')
    retObj.tab = []
    // Populate retObj.tab with songs listenend to, after/before the event
    for (var cc = -days; cc <= days; cc++) {
        var testDate
        testDate = evDate.clone().add(cc, 'days').format('YYYY-MM-DD')
        if (state.dailySongs[testDate]) {
            for (var idKey in state.dailySongs[testDate]) {
               if (state.dailySongs[testDate].hasOwnProperty(idKey)) {
                   var tabUpdated = false
                   retObj.tab.forEach(val => {
                       if (val.id === idKey) {
                           val.nb += state.dailySongs[testDate][idKey]
                           tabUpdated = true
                       }
                   })
                   if (!tabUpdated) {
                       retObj.tab.push({id: idKey, nb: state.dailySongs[testDate][idKey]})
                   }
               }
            }
        }
    }
    // Sort tabSongs and keep only the top 10 songs, with max 4 songs per artist
    retObj.tab.sort((a, b) => b.nb - a.nb)
    retObj.tab = retObj.tab.slice(0, 30)
    return retObj
}

function addDateEventSongs (dispatch, state, resolve, reject, objIntervals, startMissing = 0) {
    console.log('start analysis at rank : ', startMissing)
    console.log(objIntervals)
    var proms = []
    var promDates = []
    var firstMissed = 0
    var currentIndex = 0
    var checkLength = 0
    objIntervals.forEach(objInterval => {
        for (var pp = 0; pp < objInterval.tab.length; pp++) {
            if (currentIndex < startMissing) {
                proms.push(Promise.resolve(1))
            } else {
                proms.push(getAPISongInfo(objInterval.tab[pp].id, state.delayRequests))
                checkLength += 1
            }
            promDates.push(objInterval.date)
            currentIndex += 1
        }
    })
    console.log('curIndex : ', currentIndex, 'promsLength : ', proms.length, 'check real proms length : ', checkLength)
    // console.log(promDates)
    var allProms = proms.reduce((lastProm, currentProm, promIndex) => {
        return new Promise((resProm, rejProm) => {
            lastProm.then(() => {
                currentProm.then(song => {
                    if (song.id) {
                        dispatch('RESET_TIMESFAILED')
                        dispatch('ADD_DATEEVENTSONG', {
                            id: song.id,
                            title: song.title,
                            artist: {id: song.artist.id, name: song.artist.name},
                            preview: song.preview,
                            date: promDates[promIndex]
                        })
                        console.log(promDates[promIndex])
                    }
                    resProm()
                }).catch(error => {
                    console.log('error at rank : ', promIndex)
                    // If quota exceeded => remember missing index and stop all the next indexes by rejecting promise
                    dispatch('INC_DELAYREQUESTS')
                    firstMissed = promIndex + 1
                    rejProm(error)
                })
            }).catch(error => {
                rejProm(error)
            })
        })
    }, Promise.resolve(1))

    allProms.then(() => {
        resolve()
        console.log(state.dateEventSongs)
    }).catch(error => {
        if (firstMissed > 0) {
            if (state.timesFailed > 10) {
                reject({message: 'Failed 10 times in a row, try again later please.', code: 4})
                console.log('Failed 10 times in a row, try again later please.')
            } else {
                // If some indexes are missing try again a bit later
                dispatch('INC_TIMESFAILED')
                dispatch('INC_DELAYREQUESTS')
                console.log('Failed at prom rank', firstMissed - 1, '.. trying again in a bit.')
                setTimeout(() => {
                    addDateEventSongs(dispatch, state, resolve, reject, objIntervals, firstMissed - 1)
                }, state.delayRequests)
            }
        } else {
            reject(error)
        }
    })
}

export function analyseSongEvents ({dispatch, state}, paramId) {
    return new Promise(function (resolve, reject) {
        var objIntervals = []
        for (var ee = 0; ee < state.events.length; ee++) {
            if (state.events[ee].id === paramId || paramId === 'all' || paramId === undefined) {
                var objInterval = getIntervalDailySongs(state, state.events[ee].date, 3)
                if (objInterval.tab.length < 15) {
                    objInterval = getIntervalDailySongs(state, state.events[ee].date, 6)
                    if (objInterval.tab.length < 15) {
                        objInterval = getIntervalDailySongs(state, state.events[ee].date, 12)
                    }
                }
                if (objInterval.tab.length >= 15) {
                    objIntervals.push(objInterval)
                } else {
                    console.log('Not enough listening history at date :', objInterval.date)
                    dispatch('SET_EVENTVISIBLE', {id: state.events[ee].id, visible: false})
                }
            }
        }
        addDateEventSongs(dispatch, state, resolve, reject, objIntervals)
    })
}

export function getSong ({state}, songId) {
    for (var ss = 0; ss < state.songs.length; ss++) {
        if (state.songs[ss].id === songId) {
            return state.songs[ss]
        }
    }
}
