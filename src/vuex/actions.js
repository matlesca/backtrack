/*global DZ*/

// DEEZER AUTH :
export function init ({dispatch}) {
    DZ.init({
        appId: '172545',
        channelUrl: 'http://localhost:8080/index.html'
        // ,
        // player: {
        //     onload: () => {
        //         console.log('player loaded')
        //     }
        // }
    })
    var r = Math.round(40 + Math.round(Math.random()) * 40 + Math.random() * 40)
    var g = Math.round(40 + Math.round(Math.random()) * 40 + Math.random() * 40)
    var b = Math.round(40 + Math.round(Math.random()) * 40 + Math.random() * 40)
    dispatch('SET_BCKCOL', 'rgb(' + r + ',' + g + ',' + b + ')')
    dispatch('SET_RANDKEY', Math.random())
}
export function login ({dispatch}, router) {
    return new Promise(function (resolve, reject) {
        dispatch('SET_APPLOADING', true)
        DZ.login(function (response) {
            if (response.authResponse) {
                dispatch('SET_AUTH', response)
                DZ.init({
                    appId: '172545',
                    channelUrl: 'http://localhost:8080/index.html',
                    player: {
                        onload: () => {
                            console.log('player loaded')
                            dispatch('SET_INIT', true)
                        }
                    }
                })
                resolve()
            } else {
                dispatch('SET_AUTH', {})
                console.log('User cancelled login or did not fully authorize.')
                reject()
            }
        }, {perms: 'basic_access, email, listening_history'})
    })
}
export function accessPlay ({dispatch}, router) {
    dispatch('SET_APPLOADING', true)
    return new Promise(function (resolve, reject) {
        DZ.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                console.log('logged-in under the id : ', response.userID)
                dispatch('SET_AUTH', response)
                dispatch('SET_APPLOADING', false)
                router.go('/play')
                resolve()
            } else {
                dispatch('SET_AUTH', {})
                console.log('User cancelled login or did not fully authorize.')
                reject()
            }
        })
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
