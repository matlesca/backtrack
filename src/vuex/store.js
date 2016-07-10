import Vue from 'vue'
import Vuex from 'vuex'
import loadEvents from '../events.json'

Vue.use(Vuex)

const state = {
    events: loadEvents,
    auth: {},
    isInit: false,
    currentEvent: {},
    moving: false,
    appLoading: false,
    eventLoading: false
}

const mutations = {
    SET_CURRENTEVENT (state, event) {
        state.currentEvent = event
    },
    SET_INIT (state, init) {
        state.isInit = init
    },
    SET_AUTH (state, auth) {
        state.auth = auth
    },
    SET_MOVING (state, moving) {
        state.moving = moving
    },
    SET_APPLOADING (state, loading) {
        state.appLoading = loading
    },
    SET_EVENTLOADING (state, loading) {
        state.eventLoading = loading
    },
    SET_BCKCOL (state, col) {
        state.bckCol = col
    },
    SET_RANDKEY (state, rand) {
        state.randKey = rand
    }
}

export default new Vuex.Store({
    state,
    mutations
})
