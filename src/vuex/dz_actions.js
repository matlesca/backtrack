/*global DZ*/
import moment from 'moment'

// DEEZER INIT :
export function initApp ({dispatch}, http) {
    return new Promise(function (resolve, reject) {
        // DZ.init({
        //     appId: '172545',
        //     channelUrl: 'http://localhost:8080/index.html'
        // })
        // DZ.init({
        //     appId: '191362',
        //     channelUrl: 'https://matlesca.github.io/backtrack/index.html'
        // })
        DZ.init({
            appId: '191362',
            channelUrl: 'http://backtrack.cc/index.html'
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
                if (response.status === 'connected') {
                    dispatch('SET_ALLOWFULLSONGS', true)
                } else {
                    dispatch('SET_ALLOWFULLSONGS', false)
                }
                DZ.api('/user/me', function (response) {
                    dispatch('SET_AUTH', response)
                })
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
export function resetSongs ({dispatch}) {
    return new Promise(function (resolve, reject) {
        dispatch('RESET_LOADINGPROCESS', true)
        resolve()
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
                reject({type: 'auth', message: {'en': 'Couldn\'t connect, please try to log-in again', 'fr': 'Erreur de connexion à votre compte'}})
            }
        }, {perms: 'basic_access, listening_history'})
    })
}
export function logout ({dispatch}) {
    return new Promise(function (resolve, reject) {
        DZ.logout(() => {
            dispatch('SET_AUTH', {})
            resetSongs({dispatch})
            resolve()
        })
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
            loopDailySongsHisto(dispatch, state, resolve, reject)
        }
    })
}

// FETCH SONGS :
function getAPISongsHisto (index, limit, strict, delay) {
    return new Promise(function (resolve, reject) {
        if (index > 3000 && false) {
            reject({code: 800, message: 'Empty results array', 'index': index, 'limit': limit})
        } else {
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
        }
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
        if (state.histoBound >= 100) {
            dispatch('RESET_TIMESFAILED')
        }
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
                reject({type: 'histo', message: {'en': 'Your listening history is too short, try again in a few days !', 'fr': 'Pas assez d\'historique d\'écoute, réessaye dans quelques jours !'}})
            }
        }
    }).catch(error => {
        if (error.code === 200) {
            // Not enough permissions
            reject({type: 'perm', message: {'en': 'Permission error, please try to log-in again', 'fr': 'Autorisations insuffisantes, réessayer svp'}})
        } else if (error.code === 800) {
            // No data found, try with a lower bound
            dispatch('INC_TIMESFAILED')
            if (state.timesFailed > 10) {
                reject({type: 'histo', message: {'en': 'Your listening history is too short, try again in a few days !', 'fr': 'Pas assez d\'historique d\'écoute, réessaye dans quelques jours !'}})
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
                reject({type: 'server', message: {'en': 'No answer from server, please try again later', 'fr': 'Pas de réponse du serveur, réessayer plus tard svp'}})
            } else {
                dispatch('INC_TIMESFAILED')
                setTimeout(() => {
                    loopBounds(dispatch, state, resolve, reject)
                }, 200)
            }
        }
    })
}

function loopDailySongsHisto (dispatch, state, resolve, reject, indexesTab) {
    var proms = []
    var missedIndexes = []
    if (indexesTab) {
        indexesTab.forEach(ind => {
            proms.push(getAPISongsHisto(ind, 50, false, state.delayRequests))
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
                    setTimeout(() => {
                        dispatch('INC_LOADINGSONGSINDEX', result.data.length)
                        result.data.forEach(song => {
                            dispatch('ADD_DAILYSONG', {
                                date: moment.unix(song.timestamp).format('YYYY-MM-DD'),
                                id: song.id
                            })
                        })
                        if (result.index === 0) {
                            dispatch('SET_DATEBOUNDS', {last: moment.unix(result.data[0].timestamp).format('YYYY-MM-DD')})
                        }
                        dispatch('SET_DATEBOUNDS', {first: moment.unix(result.data[result.data.length - 1].timestamp).format('YYYY-MM-DD')})
                        resProm()
                    }, 0)
                }).catch(error => {
                    // If quota exceeded => remember missing index to try it again later, and continue loading histo
                    if (typeof error.index === 'number' && (error.index % 1) === 0) {
                        missedIndexes.push(error.index)
                    }
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
                setTimeout(() => {
                    loopDailySongsHisto(dispatch, state, resolve, reject, missedIndexes)
                }, state.delayRequests)
            }
        } else {
            dispatch('INC_LOADINGSONGSINDEX', state.loadingSongsIndex - state.histoBound - 1)
            resolve()
        }
    }).catch(error => {
        reject(error)
    })
}
