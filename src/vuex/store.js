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
    allowFullSongs: false,
    playing: false,
    currentSongID: 0,
    // Deezer history
    songs: [],
    dailySongs: {},
    histoBound: 0,
    lastHistoBound: 0,
    currentSongIndex: 0,
    timesFailed: 0,
    parallelRequests: 1,
    delayRequests: 0,
    // Events
    events: loadEvents,
    dateEventSongs: {},
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
    SET_ALLOWFULLSONGS (state, allow) {
        state.allowFullSongs = allow
    },
    SET_CURRENTSONGID (state, songId) {
        state.currentSongID = songId
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
    ADD_DAILYSONG (state, song) {
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
    ADD_DATEEVENTSONG (state, obj) {
        if (state.dateEventSongs[obj.date]) {
            if (state.dateEventSongs[obj.date].nb < 10) {
                var knowArtist = false
                state.dateEventSongs[obj.date].artists.forEach(artist => {
                    if (artist.id === obj.artist.id) {
                        knowArtist = true
                        var knowSong = false
                        artist.songs.forEach(song => {
                            if (song.id === obj.id) {knowSong = true}
                        })
                        if (!knowSong && artist.songs.length < 4) {
                            artist.songs.push({id: obj.id, title: obj.title, preview: obj.preview})
                            state.dateEventSongs[obj.date].nb += 1
                        }
                    }
                })
                if (!knowArtist && state.dateEventSongs[obj.date].artists.length < 3) {
                    state.dateEventSongs[obj.date].artists.push({id: obj.artist.id, name: obj.artist.name, songs: [{id: obj.id, title: obj.title, preview: obj.preview}]})
                    state.dateEventSongs[obj.date].nb += 1
                }
            }
        } else {
            state.dateEventSongs[obj.date] = {nb: 1, artists: [{id: obj.artist.id, name: obj.artist.name, songs: [{id: obj.id, title: obj.title, preview: obj.preview}]}]}
        }
    },
    SET_EVENTVISIBLE (state, obj) {
        state.events.forEach(ev => {
            if (ev.id === obj.id) {
                ev.visible = obj.visible
            }
        })
    },
    INC_DELAYREQUESTS (state) {
        state.delayRequests += 40
    },
    SET_MOVING (state, moving) {
        state.moving = moving
    },
    SET_PLAYING (state, play) {
        state.playing = play
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
