import Vue from 'vue'
import Vuex from 'vuex'
import loadEvents from '../events.json'

Vue.use(Vuex)

const state = {
    events: loadEvents,
    currentEvent: {},
    animating: false,
    appLoading: false,
    eventLoading: false
}

const mutations = {
    SET_CURRENTEVENT (state, event) {
        state.currentEvent = event
    },
    SET_ANIMATING (state, anim) {
        state.animating = anim
    },
    SET_APPLOADING (state, loading) {
        state.appLoading = loading
    },
    SET_EVENTLOADING (state, loading) {
        state.eventLoading = loading
    }
}

export default new Vuex.Store({
    state,
    mutations
})
