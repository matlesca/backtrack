/*global DZ*/
import moment from 'moment'

// DEEZER INIT :
export function initApp ({dispatch}) {
    return new Promise(function (resolve, reject) {
        DZ.init({
            appId: '172545',
            channelUrl: 'http://localhost:8080/index.html'
        })
        var r = Math.round(40 + Math.round(Math.random()) * 40 + Math.random() * 40)
        var g = Math.round(40 + Math.round(Math.random()) * 40 + Math.random() * 40)
        var b = Math.round(40 + Math.round(Math.random()) * 40 + Math.random() * 40)
        dispatch('SET_BCKCOL', 'rgb(' + r + ',' + g + ',' + b + ')')
        dispatch('SET_RANDKEY', Math.random())
        dispatch('SET_INITAPP', true)
        // Check if already connected :
        DZ.getLoginStatus(function (response) {
            if (response.authResponse) {
                dispatch('SET_AUTH', response)
                if (response.status === 'connected') {
                    dispatch('SET_ALLOWFULLSONGS', true)
                } else {
                    dispatch('SET_ALLOWFULLSONGS', false)
                }
            } else {
                dispatch('SET_AUTH', {})
                dispatch('SET_ALLOWFULLSONGS', false)
            }
        })
        resolve()
    })
}
export function initPlayer ({dispatch, state}) {
    return new Promise(function (resolve, reject) {
        DZ.init({
            appId: '172545',
            channelUrl: 'http://localhost:8080/index.html',
            player: {
                onload: () => {
                    dispatch('SET_INITPLAYER', true)
                    DZ.Event.subscribe('current_track', (track) => {
                        dispatch('SET_CURRENTSONGID', track.track.id)
                    })
                    resolve()
                }
            }
        })
    })
}

// DEEZER AUTH :
export function login ({dispatch}) {
    return new Promise(function (resolve, reject) {
        DZ.login(function (response) {
            if (response.authResponse) {
                if (response.status === 'connected') {
                    dispatch('SET_ALLOWFULLSONGS', true)
                } else {
                    dispatch('SET_ALLOWFULLSONGS', false)
                }
                DZ.api('/user/me', function (response) {
                    dispatch('SET_AUTH', response)
                    resolve(response)
                })
            } else {
                dispatch('SET_AUTH', {})
                dispatch('SET_ALLOWFULLSONGS', false)
                reject({type: 'auth', message: 'Couldn\'t connect, please try to log-in again'})
            }
        }, {perms: 'basic_access, email, listening_history'})
    })
}
export function logout ({dispatch}, router) {
    DZ.logout(() => {
        console.log('User logged-out')
        router.go('/')
        dispatch('SET_AUTH', {})
    })
}
export function isAuth () {
    return new Promise(function (resolve, reject) {
        DZ.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                resolve(true)
            } else {
                reject(false)
            }
        })
    })
}

// FETCH SONGS :
function getAPISongsHisto (index, limit, strict, delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            if (typeof index === 'number' && typeof limit === 'number' && (index % 1) === 0 && (limit % 1) === 0) {
                DZ.api('/user/me/history&index=' + index + '&limit=' + limit, function (response) {
                    if (response.data) {
                        if (response.data.length === 0) {
                            if (strict) {
                                reject({code: 800, message: 'Empty results array', content: response, 'index': index, 'limit': limit})
                            } else {
                                resolve({'index': index, 'limit': limit, 'data': []})
                            }
                        } else {
                            resolve({'index': index, 'limit': limit, 'data': response.data})
                        }
                    } else if (response.error) {
                        reject({'message': response.error, 'index': index, 'limit': limit})
                    } else {
                        reject({message: 'No response', 'index': index, 'limit': limit})
                    }
                })
            } else {
                reject({message: 'The index & limit should be integers', 'index': index, 'limit': limit})
            }
        }, delay)
    })
}
export function getAPISongInfo (songId, delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            DZ.api('/track/' + songId, function (response) {
                if (response.id) {
                    resolve(response)
                } else if (response.error) {
                    reject(response.error)
                } else {
                    reject({message: 'No response'})
                }
            })
        }, delay)
    })
}

// LOOP FETCHING :
function loopBounds (dispatch, state, resolve, reject) {
    var delta
    getAPISongsHisto(state.histoBound, 50, true, state.delayRequests).then(result => {
        dispatch('RESET_TIMESFAILED')
        if (result.data.length >= 50) {
            // 50 results, try with a higher bound
            if (state.lastHistoBound > state.histoBound) {
                delta = Math.round((state.lastHistoBound - state.histoBound) / 2)
            } else {
                delta = state.histoBound - state.lastHistoBound
            }
            dispatch('SET_LASTHISTOBOUND', state.histoBound)
            dispatch('SET_HISTOBOUND', state.histoBound + delta)
            loopBounds(dispatch, state, resolve, reject)
        } else {
            // Gotcha !
            dispatch('SET_HISTOBOUND', state.histoBound + result.data.length)
            if (state.histoBound > 100) {
                resolve(result.data)
            } else {
                reject({type: 'histo', message: 'Your listening history is too short, try again in a few days !'})
            }
        }
    }).catch(error => {
        if (error.code === 200) {
            // Not enough permissions
            reject({type: 'perm', message: 'Permission error, please try to log-in again'})
        } else if (error.code === 800) {
            // No data found, try with a lower bound
            dispatch('INC_TIMESFAILED')
            if (state.histoBound < 100 && state.timesFailed > 10) {
                reject({type: 'histo', message: 'Your listening history is too short, try again in a few days !'})
            } else {
                if (state.lastHistoBound > state.histoBound) {
                    delta = state.lastHistoBound - state.histoBound
                } else {
                    delta = Math.round((state.histoBound - state.lastHistoBound) / 2)
                }
                dispatch('SET_LASTHISTOBOUND', state.histoBound)
                dispatch('SET_HISTOBOUND', state.histoBound - delta)
                loopBounds(dispatch, state, resolve, reject)
            }
        } else {
            // API calls quota exceeded or other error.. try again a few times
            if (state.timesFailed > 10) {
                reject({type: 'server', message: 'No answer from server, please try again later'})
            } else {
                dispatch('INC_TIMESFAILED')
                setTimeout(() => {
                    loopBounds(dispatch, state, resolve, reject)
                }, 200)
            }
        }
    })
}
// function loopSongsHisto (numbProm, dispatch, state, resolve, reject) {
//     // var proms = []
//     var promsBatches = []
//     var numBatches = Math.ceil(state.histoBound / (numbProm * 50))
//     for (var bb = 0; bb < numBatches; bb++) {
//         promsBatches.push([])
//         for (var pp = 0; pp < numbProm; pp++) {
//             promsBatches[bb].push(getAPISongsHisto(50 * (bb * numbProm + pp), 50, false))
//         }
//     }
//     var allProm = promsBatches.reduce((lastBatch, currentBatch) => {
//         return new Promise((resBatch, rejBatch) => {
//             lastBatch.then(() => {
//                 setTimeout(() => {
//                     Promise.all(currentBatch).then((values) => {
//                         dispatch('RESET_TIMESFAILED')
//                         values.forEach((val) => {
//                             val.forEach((song) => {
//                                 dispatch('ADD_SONG', {
//                                     id: song.id, title: song.title,
//                                     timestamp: song.timestamp,
//                                     preview: song.preview,
//                                     artist: {id: song.artist.id, name: song.artist.name}
//                                 })
//                             })
//                             dispatch('INC_SONGINDEX', val.length)
//                         })
//                         resBatch()
//                     }).catch(error => {
//                         rejBatch(error)
//                     })
//                 }, state.delayRequests)
//             }).catch((error) => {
//                 rejBatch(error)
//             })
//         })
//     }, Promise.resolve())
//
//     allProm.then(() => {
//         dispatch('INC_SONGINDEX', state.currentSongIndex - state.histoBound - 1)
//         console.log(JSON.stringify(state.songs))
//         resolve()
//     }).catch(error => {
//         dispatch('INC_DELAYREQUESTS')
//         reject(error)
//     })
// }

function loopDailySongsHisto (dispatch, state, resolve, reject, indexesTab) {
    var proms = []
    var missedIndexes = []
    if (indexesTab) {
        indexesTab.forEach(ind => {
            proms.push(getAPISongsHisto(50 * ind, 50, false, state.delayRequests))
        })
    } else {
        for (var pp = 0; pp < Math.ceil(state.histoBound / 50); pp++) {
            proms.push(getAPISongsHisto(50 * pp, 50, false, state.delayRequests))
        }
    }
    var allProms = proms.reduce((lastProm, currentProm, promIndex) => {
        return new Promise((resProm, rejProm) => {
            lastProm.then(() => {
                currentProm.then(result => {
                    dispatch('RESET_TIMESFAILED')
                    dispatch('INC_SONGINDEX', result.data.length)
                    result.data.forEach(song => {
                        dispatch('ADD_DAILYSONG', {
                            date: moment.unix(song.timestamp).format('YYYY-MM-DD'),
                            id: song.id
                        })
                    })
                    resProm()
                }).catch(error => {
                    // If quota exceeded => remember missing index to try it again later, and continue loading histo
                    missedIndexes.push(error.index)
                    resProm()
                })
            }).catch(error => {
                rejProm(error)
            })
        })
    }, Promise.resolve())
    // Once all proms have resolved :
    allProms.then(() => {
        if (missedIndexes.length) {
            dispatch('INC_TIMESFAILED')
            if (state.timesFailed > 10) {
                reject({message: 'Failed 10 times in a row, try again later please.', code: 4})
            } else {
                // If some indexes are missing try again a bit later
                dispatch('INC_DELAYREQUESTS')
                console.log('Failed to load', missedIndexes.length, 'batches.. trying again in a bit.')
                setTimeout(() => {
                    loopDailySongsHisto(dispatch, state, resolve, reject, missedIndexes)
                }, state.delayRequests)
            }
        } else {
            dispatch('INC_SONGINDEX', state.currentSongIndex - state.histoBound - 1)
            resolve()
        }
    }).catch(error => {
        reject(error)
    })
}

// APP API FETCHING DATA
export function getHistoBound ({dispatch, state}) {
    return new Promise(function (resolve, reject) {
        if (state.histoBound === 0) {
            dispatch('SET_HISTOBOUND', 10000)
        }
        loopBounds(dispatch, state, resolve, reject)
    })
}
export function getAllSongs ({dispatch, state}) {
    return new Promise(function (resolve, reject) {
        if (state.histoBound === 0) {
            reject({message: 'please setup the histo bound before running getAllSongs'})
        } else {
            // Define the number of requests to be sent at once to the server
            // var minNumbProm = Math.min(state.parallelRequests, Math.max(Math.floor(state.histoBound / 50), 1))
            // loopSongsHisto(minNumbProm, dispatch, state, resolve, reject)
            loopDailySongsHisto(dispatch, state, resolve, reject)
        }
    })
}
export function resetSongs ({dispatch, state}) {
    return new Promise(function (resolve, reject) {
        dispatch('RESET_SONGS')
        resolve()
    })
}
