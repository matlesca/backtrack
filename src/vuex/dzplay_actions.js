/*global DZ*/

// PLAY
export function setPlayerSongs ({dispatch, state}, songsTab) {
    return new Promise(function (resolve, reject) {
        // if (state.allowFullSongs) {
        //     DZ.player.playTracks(songsTab.map(song => song.id))
        // } else {
        //     DZ.player.playExternalTracks(songsTab.map(song => {
        //         return {
        //             url: song.preview,
        //             title: song.title
        //         }
        //     }))
        // }
        // dispatch('SET_PLAYING', true)
        resolve()
    })
}

export function togglePlayerPlay ({dispatch, state}) {
    if (state.playing) {
        DZ.player.pause()
        dispatch('SET_PLAYING', false)
    } else {
        // DZ.player.play()
        dispatch('SET_PLAYING', true)
    }
}

export function playerNext ({dispatch, state}) {
    DZ.player.next()
    if (!state.playing) {
        // DZ.player.play()
        dispatch('SET_PLAYING', true)
    }
}

export function playerPrevious ({dispatch, state}) {
    DZ.player.prev()
    if (!state.playing) {
        // DZ.player.play()
        dispatch('SET_PLAYING', true)
    }
}

export function playerVolume ({dispatch, state}, vol) {
    DZ.player.setVolume(Number(vol))
}
