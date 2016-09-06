import Vue from 'vue'
import Vuex from 'vuex'
import loadEvents from '../events.json'

Vue.use(Vuex)

const state = {
    // App globals
    isInitApp: false,
    appLoading: false,
    bckCol: 'rgb(70, 40, 60)',
    // locale: window.navigator.userLanguage || window.navigator.language,
    locale: 'en',
    // Deezer auth, init
    auth: {},
    isInitPlayer: false,
    allowFullSongs: false,
    playing: false,
    currentSongID: 0,
    // Deezer history fetching
    dailySongs: {},
    dateBounds: {first: '2015-01-04', last: '2016-08-20'},
    histoBound: 0,
    lastHistoBound: 0,
    loadingSongsIndex: 0,
    timesFailed: 0,
    delayRequests: 0,
    // Events
    events: loadEvents,
    selectedEvents: {nb: 0},
    dateEventSongs: {},
    // Show event page state
    currentSongsData: {artists: []},
    currentEvent: {},
    currentDate: false,
    moving: false,
    eventLoading: false,
    // Navbar
    showNav: false,
    // Modals
    currentModal: false
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
    // ADD_DATEEVENTSONG: (state, obj) => {
    //     if (state.dateEventSongs[obj.date]) {
    //         if (state.dateEventSongs[obj.date].nb < 10) {
    //             var knowArtist = false
    //             state.dateEventSongs[obj.date].artists.forEach(artist => {
    //                 if (artist.id === obj.artist.id) {
    //                     knowArtist = true
    //                     var knowSong = false
    //                     artist.songs.forEach(song => {
    //                         if (song.id === obj.id) {knowSong = true}
    //                     })
    //                     if (!knowSong && artist.songs.length < 4) {
    //                         artist.songs.push({id: obj.id, title: obj.title, preview: obj.preview})
    //                         state.dateEventSongs[obj.date].nb += 1
    //                     }
    //                 }
    //             })
    //             if (!knowArtist && state.dateEventSongs[obj.date].artists.length < 3) {
    //                 state.dateEventSongs[obj.date].artists.push({id: obj.artist.id, name: obj.artist.name, songs: [{id: obj.id, title: obj.title, preview: obj.preview}]})
    //                 state.dateEventSongs[obj.date].nb += 1
    //             }
    //         }
    //     } else {
    //         state.dateEventSongs[obj.date] = {nb: 1, artists: [{id: obj.artist.id, name: obj.artist.name, songs: [{id: obj.id, title: obj.title, preview: obj.preview}]}]}
    //     }
    // },
    ADD_CURRENTSONGSDATA: (state, songObj) => {
        var knowArtist = false
        state.currentSongsData.artists.forEach(artist => {
            if (artist.id === songObj.artist.id) {
                knowArtist = true
                var knowSong = false
                artist.songs.forEach(song => {
                    if (song.id === songObj.id) {
                        knowSong = true
                    }
                })
                if (!knowSong) {
                    artist.songs.push({id: songObj.id, title: songObj.title, preview: songObj.preview, nb: songObj.nb})
                }
                artist.nb += songObj.nb
            }
        })
        if (!knowArtist) {
            state.currentSongsData.artists.push({id: songObj.artist.id, name: songObj.artist.name, nb: songObj.nb, songs: [{id: songObj.id, nb: songObj.nb, title: songObj.title, preview: songObj.preview}]})
        }
    },
    RESET_SELECTEDEVENTS: (state) => {
        state.selectedEvents = {nb: 0}
    },
    RESET_LOADINGPROCESS: (state) => {
        state.dailySongs = {}
        state.currentSongsData = {artists: []}
        state.playing = false
        state.currentSongID = 0
        state.dateBounds = {first: '2015-01-04', last: '2016-08-20'}
        state.histoBound = 0
        state.lastHistoBound = 0
        state.loadingSongsIndex = 0
        state.timesFailed = 0
        state.delayRequests = 0
    },
    RESET_CURRENTSONGS: (state) => {
        state.currentSongsData = {artists: []}
    },
    TOGGLE_SELECTEDEVENT: (state, evId) => {
        if (state.selectedEvents[evId]) {
            delete state.selectedEvents[evId]
        } else {
            state.selectedEvents[evId] = true
        }
        state.selectedEvents.nb = Object.keys(state.selectedEvents).length - 1
    },
    INC_DELAYREQUESTS: (state) => {
        state.delayRequests += 40
    },
    SET_MOVING: (state, moving) => {
        state.moving = moving
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
    }
}

export default new Vuex.Store({
    state,
    mutations
})
