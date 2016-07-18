import moment from 'moment'

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
    if (state.moving) {
        console.log('Wait for animation to complete to choose another date..')
    } else {
        dispatch('SET_CURRENTEVENT', event)
    }
}

// ALGO :
function getIntervalSongs (state, stateEvDate, days) {
    var retObj = {}
    var evDate = moment(stateEvDate)
    retObj.date = evDate.format('YYYY-MM-DD')
    retObj.tab = []
    retObj.nb = 0
    // Populate tabSongs with songs listenend to, after/before the event
    for (var ss = 0; ss < state.songs.length; ss++) {
        var songDate = moment.unix(state.songs[ss].timestamp)
        if (Math.abs(songDate.diff(evDate, 'days')) < days) {
            var tabUpdated = false
            retObj.nb += 1
            retObj.tab.forEach(val => {
                if (val.id === state.songs[ss].id) {
                    val.nb += 1
                    tabUpdated = true
                }
            })
            if (!tabUpdated) {
                var tempObj = JSON.parse(JSON.stringify(state.songs[ss]))
                tempObj.nb = 1
                retObj.tab.push(tempObj)
            }
        }
    }
    // Sort tabSongs and keep only the top 10 songs, with max 4 songs per artist
    retObj.tab.sort((a, b) => b.nb - a.nb)
    return retObj
}

export function analyseSongEvents ({dispatch, state}, paramId) {
    return new Promise(function (resolve, reject) {
        var nbEvAll = 0
        var nbEvOk = 0
        for (var ee = 0; ee < state.events.length; ee++) {
            if (state.events[ee].id === paramId || paramId === 'all' || paramId === undefined) {
                nbEvAll += 1
                var objInterval = getIntervalSongs(state, state.events[ee].date, 3)
                if (objInterval.nb < 30 || objInterval.tab.length < 10) {
                    objInterval = getIntervalSongs(state, state.events[ee].date, 6)
                    if (objInterval.nb < 30 || objInterval.tab.length < 10) {
                        objInterval = getIntervalSongs(state, state.events[ee].date, 12)
                    }
                }
                if (objInterval.nb >= 30 && objInterval.tab.length >= 10) {
                    var finalTab = []
                    var nbArtists = 0
                    for (var tt = 0; tt < objInterval.tab.length; tt++) {
                        var sameArtist = finalTab.filter(val => val.artist.id === objInterval.tab[tt].artist.id)
                        if (sameArtist.length < 4 && finalTab.length < 10 && (sameArtist.length > 0 || nbArtists < 3)) {
                            finalTab.push(objInterval.tab[tt])
                            if (sameArtist.length === 0) {
                                nbArtists += 1
                            }
                        }
                    }
                    nbEvOk += 1
                    dispatch('SET_DATESONGS', {date: objInterval.date, tab: finalTab})
                } else {
                    console.log('Not enough listening history at date :', objInterval.date)
                    dispatch('SET_EVENTVISIBLE', {id: state.events[ee].id, visible: false})
                }
            }
        }
        if (nbEvOk === 0) {
            reject(paramId)
        } else {
            resolve({nbAll: nbEvAll, nbOk: nbEvOk})
        }
    })
}

export function getSong ({state}, songId) {
    for (var ss = 0; ss < state.songs.length; ss++) {
        if (state.songs[ss].id === songId) {
            return state.songs[ss]
        }
    }
}
