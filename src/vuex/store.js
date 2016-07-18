import Vue from 'vue'
import Vuex from 'vuex'
import loadEvents from '../events.json'

Vue.use(Vuex)

const state = {
    // Deezer auth, init
    auth: {},
    isInitApp: false,
    isInitPlayer: false,
    bckCol: 'rgb(70, 40, 60)',
    dateSongs: {},
    // Deezer history
    songs: [],
    histoBound: 0,
    lastHistoBound: 0,
    currentSongIndex: 0,
    timesFailed: 0,
    parallelRequests: 1,
    delayRequests: 0,
    // Events
    events: loadEvents,
    currentEvent: {},
    moving: false,
    appLoading: false,
    eventLoading: false
}

const mutations = {
    SET_CURRENTEVENT (state, event) {
        state.currentEvent = event
    },
    SET_INITAPP (state, init) {
        state.isInitApp = init
    },
    SET_INITPLAYER (state, init) {
        state.isInitPlayer = init
    },
    SET_AUTH (state, auth) {
        state.auth = auth
    },
    SET_HISTOBOUND (state, bound) {
        state.histoBound = bound
    },
    SET_LASTHISTOBOUND (state, bound) {
        state.lastHistoBound = bound
    },
    INC_TIMESFAILED (state) {
        state.timesFailed += 1
    },
    ADD_SONG (state, song) {
        state.songs.push(song)
    },
    INC_SONGINDEX (state, val) {
        state.currentSongIndex += val
    },
    RESET_TIMESFAILED (state) {
        state.timesFailed = 0
    },
    RESET_SONGS (state) {
        state.timesFailed = 0
        state.songs = []
        state.currentSongIndex = 0
        state.histoBound = 0
        state.lastHistoBound = 0
    },
    SET_DATESONGS (state, obj) {
        state.dateSongs[obj.date] = obj.tab
    },
    SET_EVENTVISIBLE (state, obj) {
        state.events.forEach(ev => {
            if (ev.id === obj.id) {
                ev.visible = obj.visible
            }
        })
    },
    INC_DELAYREQUESTS (state) {
        state.delayRequests += 100
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
