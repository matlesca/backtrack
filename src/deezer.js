/*global DZ*/

export default {
    init: function (callbackFunc) {
        DZ.init({
            appId: '172545',
            channelUrl: 'http://localhost:8080/channel/channel.html',
            player: {
                onload: callbackFunc
            }
        })
    },
    login: function () {
        return new Promise(function (resolve, reject) {
            DZ.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ' + response.authResponse.accessToken)
                    DZ.api('/user/me', function (response) {
                        console.log('Good to see you, ' + response.name + '.')
                    })
                    resolve(response)
                } else {
                    reject({'message': 'User cancelled login or did not fully authorize.'})
                }
            }, {perms: 'basic_access, email, listening_history'})
        })
    },
    isAuth: function () {
        return new Promise(function (resolve, reject) {
            DZ.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    console.log(response.authResponse)
                    resolve(response)
                } else {
                    reject({'message': 'User cancelled login or did not fully authorize.'})
                }
            })
        })
    },
    getSongs: function (index, limit) {
        return new Promise(function (resolve, reject) {
            if (typeof index === 'number' && typeof limit === 'number' && (index % 1) === 0 && (limit % 1) === 0) {
                DZ.api('/user/me/history&index=' + index + '&limit=' + limit, function (response) {
                    if (response.data) {
                        resolve(response.data)
                    } else if (response.error) {
                        reject(response.error)
                    } else {
                        reject({message: 'No response'})
                    }
                })
            } else {
                reject({message: 'The index & limit should be integers'})
            }
        })
    },
    playSong: function (songId) {
        DZ.player.playTracks([songId])
    }
}
