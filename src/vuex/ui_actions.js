/*global DZ*/
import {updateSongsFromDate} from './algo_actions'

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
export function setCurrentModal ({dispatch}, modal) {
    dispatch('SET_CURRENTMODAL', modal)
}
export function toggleShowNav ({dispatch, state}) {
    dispatch('SET_SHOWNAV', !state.showNav)
}
export function toggleSelectedEvent ({dispatch}, evId) {
    dispatch('TOGGLE_SELECTEDEVENT', evId)
}
export function resetSelectedEvents ({dispatch}) {
    dispatch('RESET_SELECTEDEVENTS')
}

export function initState ({dispatch}) {
    return new Promise(function (resolve, reject) {
        dispatch('SET_SHOWNAV', false)
        dispatch('SET_MOVING', false)
        dispatch('SET_APPLOADING', false)
        dispatch('SET_EVENTLOADING', false)
        dispatch('SET_CURRENTMODAL', false)
        dispatch('SET_CURRENTEVENT', {})
        dispatch('SET_PLAYING', false)
        dispatch('SET_CURRENTSONGID', 0)
        if (DZ.player) {
            DZ.player.playTracks(DZ.player.getTrackList()[0])
            DZ.player.pause()
        }
        resolve()
    })
}

export function clickEvent ({dispatch, state}, event) {
    if (!state.moving) {
        dispatch('SET_MOVING', true)
        dispatch('SET_CURRENTEVENT', event)
        dispatch('SET_CURRENTDATE', event.date)
        dispatch('SET_SHOWNAV', false)
        dispatch('RESET_CURRENTSONGS')
        updateSongsFromDate({dispatch, state}, event.date)
        if (state.playing) {
            dispatch('SET_PLAYING', false)
            DZ.player.pause()
        }
    }
}

export function chooseEvent ({dispatch, state}, event) {

}

export function chooseDate ({dispatch, state}, event) {

}
