import moment from 'moment'
import {getAPISongInfo} from './dz_actions'

// function addDateEventSongs (dispatch, state, resolve, reject, objIntervals, startMissing = 0) {
//     var proms = []
//     var promDates = []
//     var firstMissed = 0
//     var currentIndex = 0
//     var checkLength = 0
//     objIntervals.forEach(objInterval => {
//         for (var pp = 0; pp < objInterval.tab.length; pp++) {
//             if (currentIndex < startMissing) {
//                 proms.push(Promise.resolve(1))
//             } else {
//                 proms.push(getAPISongInfo(objInterval.tab[pp].id, state.delayRequests))
//                 checkLength += 1
//             }
//             promDates.push(objInterval.date)
//             currentIndex += 1
//         }
//     })
//     var allProms = proms.reduce((lastProm, currentProm, promIndex) => {
//         return new Promise((resProm, rejProm) => {
//             lastProm.then(() => {
//                 currentProm.then(song => {
//                     if (song.id) {
//                         dispatch('RESET_TIMESFAILED')
//                         dispatch('ADD_DATEEVENTSONG', {
//                             id: song.id,
//                             title: song.title,
//                             artist: {id: song.artist.id, name: song.artist.name},
//                             preview: song.preview,
//                             date: promDates[promIndex]
//                         })
//                     }
//                     resProm()
//                 }).catch(error => {
//                     // If quota exceeded => remember missing index and stop all the next indexes by rejecting promise
//                     dispatch('INC_DELAYREQUESTS')
//                     firstMissed = promIndex + 1
//                     rejProm(error)
//                 })
//             }).catch(error => {
//                 rejProm(error)
//             })
//         })
//     }, Promise.resolve(1))

//     allProms.then(() => {
//         resolve()
//     }).catch(error => {
//         if (firstMissed > 0) {
//             if (state.timesFailed > 10) {
//                 reject({message: 'Failed 10 times in a row, try again later please.', code: 4})
//                 console.log('Failed 10 times in a row, try again later please.')
//             } else {
//                 // If some indexes are missing try again a bit later
//                 dispatch('INC_TIMESFAILED')
//                 dispatch('INC_DELAYREQUESTS')
//                 setTimeout(() => {
//                     addDateEventSongs(dispatch, state, resolve, reject, objIntervals, firstMissed - 1)
//                 }, state.delayRequests)
//             }
//         } else {
//             reject(error)
//         }
//     })
// }

// export function analyseSongEvents ({dispatch, state}, paramId) {
//     return new Promise(function (resolve, reject) {
//         var objIntervals = []
//         for (var ee = 0; ee < state.events.length; ee++) {
//             if (state.events[ee].id === paramId || paramId === 'all' || paramId === undefined) {
//                 var objInterval = getIntervalDailySongs({state}, state.events[ee].date, 3)
//                 if (objInterval.tab.length < 15) {
//                     objInterval = getIntervalDailySongs({state}, state.events[ee].date, 6)
//                     if (objInterval.tab.length < 15) {
//                         objInterval = getIntervalDailySongs({state}, state.events[ee].date, 12)
//                     }
//                 }
//                 if (objInterval.tab.length >= 15) {
//                 } else {
//                     reject({message: 'Not enough listening history at date ' + objInterval.date})
//                 }
//             }
//         }
//         addDateEventSongs(dispatch, state, resolve, reject, objIntervals)
//     })
// }

// New algo functions :

export function updateSongsFromDate ({dispatch, state}, date) {
    return new Promise(function (resolve, reject) {
        var intervalSongs = getIntervalSongs({state}, date, 3)
        if (intervalSongs.length < 20) {
            // If less than 20 songs try with a larger date interval
            intervalSongs = getIntervalSongs({state}, date, 6)
            if (intervalSongs.length < 20) {
                // If less than 20 songs try with a larger date interval
                intervalSongs = getIntervalSongs({state}, date, 12)
            }
        }
        if (intervalSongs.length >= 20) {
            addCurrentSongsData(dispatch, state, resolve, reject, intervalSongs)
        } else {
            reject({message: 'Not enough listening history at this date '})
        }
    })
}

export function getIntervalSongs ({state}, date, days) {
    // Get all songs listened to after/before the chosen date, and keep only the 30 most listened ones
    let retObj = {}
    let evDate = moment(date, 'YYYY-MM-DD')
    retObj.date = evDate.format('YYYY-MM-DD')
    retObj.tab = []
    // Populate retObj.tab with songs listenend to, after/before the date
    for (let cc = -days; cc <= days; cc++) {
        let testDate
        testDate = evDate.clone().add(cc, 'days').format('YYYY-MM-DD')
        if (state.dailySongs[testDate]) {
            for (let idKey in state.dailySongs[testDate]) {
               if (state.dailySongs[testDate].hasOwnProperty(idKey)) {
                   let tabUpdated = false
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
    // Sort tabSongs and keep only the top 30 songs
    retObj.tab.sort((a, b) => b.nb - a.nb)
    retObj.tab = retObj.tab.slice(0, 30)
    return retObj.tab
}

function addCurrentSongsData (dispatch, state, resolve, reject, intSongsTab, specifIDs) {
    let proms = []
    let missedIDs = []
    intSongsTab.forEach(intSong => {
        if (specifIDs) {
            if (specifIDs.indexOf(intSong.id)) {
                proms.push(getAPISongInfo(intSong.id, state.delayRequests))
            } else {
                proms.push(Promise.resolve(1))
            }
        } else {
            proms.push(getAPISongInfo(intSong.id, state.delayRequests))
        }
    })
    // Note : the proms tab should always be as lengthy as intSongsTab (we use promIndex to get the nb of listens)
    var allProms = proms.reduce((lastProm, currentProm, promIndex) => {
        return new Promise((resProm, rejProm) => {
            lastProm.then(() => {
                currentProm.then(song => {
                    if (song.id) {
                        dispatch('RESET_TIMESFAILED')
                        dispatch('ADD_CURRENTSONGSDATA', {
                            id: song.id,
                            title: song.title,
                            artist: {id: song.artist.id, name: song.artist.name},
                            preview: song.preview,
                            nb: intSongsTab[promIndex].nb
                        })
                    }
                    resProm()
                }).catch(error => {
                    // If quota exceeded => remember missing index and continue searching for the next one
                    console.log(error)
                    missedIDs.push(intSongsTab[promIndex].id)
                    resProm()
                })
            })
        })
    }, Promise.resolve(1))

    allProms.then(() => {
        if (missedIDs.length > 0) {
            if (state.timesFailed > 10) {
                reject({message: 'Failed 10 times in a row, try again later please.', code: 4})
                console.log('Failed 10 times in a row, try again later please.')
            } else {
                // If some indexes are missing try again a bit later
                dispatch('INC_TIMESFAILED')
                dispatch('INC_DELAYREQUESTS')
                setTimeout(() => {
                    addCurrentSongsData(dispatch, state, resolve, reject, intSongsTab, missedIDs)
                }, state.delayRequests)
            }
            dispatch('INC_DELAYREQUESTS')
        } else {
            resolve()
        }
    })
}
