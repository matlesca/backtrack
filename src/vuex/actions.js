// ACTIONS :
export function toggleAppLoading ({dispatch, state}) {
    dispatch('SET_APPLOADING', !state.appLoading)
}
export function setEventLoading ({dispatch}, loading) {
    dispatch('SET_EVENTLOADING', loading)
}
export function setAnimating ({dispatch}, animating) {
    dispatch('SET_ANIMATING', animating)
}

export function clickEvent ({dispatch, state}, event) {
    if (state.animating) {
        console.log('Wait for animation to complete to choose another date..')
    } else {
        dispatch('SET_CURRENTEVENT', event)
    }
}
