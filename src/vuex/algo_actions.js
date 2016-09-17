import moment from 'moment'
import {getAPISongInfo} from './dz_actions'

export function updateSongsFromDate ({dispatch, state}, start, end, gap) {
    return new Promise(function (resolve, reject) {
        let intervalSongs = getIntervalSongs({state}, start, end, gap)
        if (intervalSongs.length < 10) {
            // If less than 10 songs try with a larger date interval
            intervalSongs = getIntervalSongs({state}, start, end, 6)
            if (intervalSongs.length < 10) {
                // If less than 10 songs try with a larger date interval
                intervalSongs = getIntervalSongs({state}, start, end, 12)
            }
        }
        if (intervalSongs.length >= 10) {
            addCurrentSongsData(dispatch, state, resolve, reject, intervalSongs)
        } else {
            reject({message: 'Not enough listening history at this date'})
        }
    })
}

export function getIntervalSongs ({state}, start, end, gap) {
    // Get all songs listened to after/before the chosen date, and keep only the 30 most listened ones
    let retTab = []
    let dateStart = moment(start, 'YYYY-MM-DD')
    let dateEnd = moment(end, 'YYYY-MM-DD')
    let diff = dateEnd.diff(dateStart, 'days')
    if (diff < 0) {
        dateStart = moment(end, 'YYYY-MM-DD')
        dateEnd = moment(start, 'YYYY-MM-DD')
        diff = -diff
    }
    // Populate retObj.tab with songs listenend to, after/before the date
    for (let cc = -gap; cc <= diff + gap; cc++) {
        let testDate
        testDate = dateStart.clone().add(cc, 'days').format('YYYY-MM-DD')
        if (state.dailySongs[testDate]) {
            for (let idKey in state.dailySongs[testDate]) {
               if (state.dailySongs[testDate].hasOwnProperty(idKey)) {
                   let tabUpdated = false
                   retTab.forEach(val => {
                       if (val.id === idKey) {
                           val.nb += state.dailySongs[testDate][idKey]
                           tabUpdated = true
                       }
                   })
                   if (!tabUpdated) {
                       retTab.push({id: idKey, nb: state.dailySongs[testDate][idKey]})
                   }
               }
            }
        }
    }
    // Sort tabSongs and keep only the top 30 songs
    retTab.sort((a, b) => b.nb - a.nb)
    retTab = retTab.slice(0, 30)
    return retTab
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
                            album: {id: song.album.id, name: song.album.title},
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
