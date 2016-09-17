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
export function setShowSongsTab ({dispatch}, show) {
    dispatch('SET_SHOWSONGSTAB', show)
}
export function toggleSongsTab ({dispatch, state}) {
    dispatch('SET_SHOWSONGSTAB', !state.showSongsTab)
}
export function setGroupBy ({dispatch}, group) {
    dispatch('SET_GROUPBY', group)
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

export function clickCard ({dispatch, state}, obj) {
    if (!state.moving) {
        dispatch('SET_MOVING', true)
        if (obj.tags) {
            dispatch('SET_CURRENTEVENT', obj)
        } else {
            dispatch('SET_CURRENTEVENT', {})
        }
        dispatch('SET_CURRENTDATE', obj.start || obj.date)
        dispatch('SET_CURRENTMODAL', false)
        if (state.playing) {
            dispatch('SET_PLAYING', false)
            DZ.player.pause()
        }
        setTimeout(() => {
            dispatch('RESET_CURRENTSONGS')
            dispatch('SET_SONGSDATALOADING', true)
            updateSongsFromDate({dispatch, state}, obj.start || obj.date, obj.end || obj.date, obj.gap || 3).then(() => dispatch('SET_SONGSDATALOADING', false))
        }, 500)
    }
}

export function chooseDate ({dispatch, state}, event) {

}
