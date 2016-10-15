import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    // App globals
    isInitApp: false,
    appLoading: false,
    bckCol: 'rgb(70, 40, 60)',
    randKey: 0,
    momentLocale: window.navigator.userLanguage || window.navigator.language,
    locale: (window.navigator.userLanguage || window.navigator.language).substring(0, 2),
    country: (window.navigator.userLanguage || window.navigator.language).substring(0, 2).toUpperCase(),
    // Deezer auth, init
    auth: {},
    isInitPlayer: false,
    allowFullSongs: false,
    playing: false,
    currentSongID: 0,
    // Deezer history fetching
    dailySongs: {},
    dateBounds: {first: '2016-01-04', last: '2016-04-10'},
    histoBound: 0,
    lastHistoBound: 0,
    loadingSongsIndex: 0,
    timesFailed: 0,
    delayRequests: 0,
    // Events
    events: [],
    dateCards: [],
    // SongsTab
    currentSongsData: [],
    songsDataLoading: false,
    groupBy: 'track',
    // Show event page state
    currentEvent: {},
    currentDate: false,
    moving: false,
    eventLoading: false,
    // UI components
    showNav: false,
    currentModal: false,
    showSongsTab: true
}

const mutations = {
    SET_CURRENTEVENT: (state, event) => {
        state.currentEvent = event
    },
    SET_CURRENTDATE: (state, date) => {
        state.currentDate = date
    },
    SET_INITAPP: (state, init) => {
        state.isInitApp = init
    },
    SET_INITPLAYER: (state, init) => {
        state.isInitPlayer = init
    },
    SET_ALLOWFULLSONGS: (state, allow) => {
        state.allowFullSongs = allow
    },
    SET_CURRENTSONGID: (state, songId) => {
        state.currentSongID = songId
    },
    SET_AUTH: (state, auth) => {
        state.auth = auth
    },
    SET_COUNTRY: (state, country) => {
        state.country = country
    },
    SET_HISTOBOUND: (state, bound) => {
        state.histoBound = bound
    },
    SET_LASTHISTOBOUND: (state, bound) => {
        state.lastHistoBound = bound
    },
    SET_CURRENTMODAL: (state, modal) => {
        state.currentModal = modal
    },
    INC_TIMESFAILED: (state) => {
        state.timesFailed += 1
    },
    ADD_DAILYSONG: (state, song) => {
        if (state.dailySongs[song.date]) {
            if (state.dailySongs[song.date][song.id]) {
                state.dailySongs[song.date][song.id] += 1
            } else {
                state.dailySongs[song.date][song.id] = 1
            }
        } else {
            state.dailySongs[song.date] = {}
            state.dailySongs[song.date][song.id] = 1
        }
    },
    SET_DATEBOUNDS: (state, bounds) => {
        if (bounds.first) {
            state.dateBounds.first = bounds.first
        }
        if (bounds.last) {
            state.dateBounds.last = bounds.last
        }
    },
    INC_LOADINGSONGSINDEX: (state, val) => {
        state.loadingSongsIndex += val
    },
    RESET_TIMESFAILED: (state) => {
        state.timesFailed = 0
    },
    ADD_CURRENTSONGSDATA: (state, songObj) => {
        state.currentSongsData.push(songObj)
    },
    ADD_DATECARD: (state, obj) => {
        state.dateCards.push(obj)
    },
    ADD_EVENT: (state, obj) => {
        state.events.push(obj)
    },
    RESET_LOADINGPROCESS: (state) => {
        state.dailySongs = {}
        state.currentSongsData = []
        state.playing = false
        state.currentSongID = 0
        state.currentEvent = {}
        state.currentDate = false
        state.dateBounds = {first: '2015-01-04', last: '2016-01-05'}
        state.histoBound = 0
        state.lastHistoBound = 0
        state.loadingSongsIndex = 0
        state.timesFailed = 0
        state.delayRequests = 0
    },
    RESET_CURRENTSONGS: (state) => {
        state.currentSongsData = []
    },
    INC_DELAYREQUESTS: (state) => {
        state.delayRequests += 40
    },
    SET_MOVING: (state, moving) => {
        state.moving = moving
    },
    SET_SONGSDATALOADING: (state, loading) => {
        state.songsDataLoading = loading
    },
    SET_GROUPBY: (state, group) => {
        state.groupBy = group
    },
    SET_PLAYING: (state, play) => {
        state.playing = play
    },
    SET_APPLOADING: (state, loading) => {
        state.appLoading = loading
    },
    SET_EVENTLOADING: (state, loading) => {
        state.eventLoading = loading
    },
    SET_BCKCOL: (state, col) => {
        state.bckCol = col
    },
    SET_RANDKEY: (state, rand) => {
        state.randKey = rand
    },
    SET_SHOWNAV: (state, show) => {
        state.showNav = show
    },
    SET_SHOWSONGSTAB: (state, show) => {
        state.showSongsTab = show
    }
}

export default new Vuex.Store({
    state,
    mutations
})
