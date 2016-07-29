<template>
    <div class="songs-tab-wrapper">
        <div class="artist-bloc" v-for="tab in displayTab.artists" v-bind:class="{'current': artistPlaying[$index]}" v-show="visibleTab === true">
            <div class="artist-songs-bloc">
                <em class="artist-name">{{tab.name}}</em>
                <span v-on:click="setPlayList(song.id)" class="song-line" v-bind:class="{'current': songPlaying[song.id], 'playing': playing}" v-for="song in tab.songs">
                    <svg viewBox="0 0 20 20" >
                        <rect id="pause-icon" width="7" height="20"/>
                        <rect id="pause-icon" x="13" width="7" height="20"/>
                        <polygon id="play-icon" points="0,0 20,10 0,20 "/>
                    </svg>
                    {{song.title}}
                </span>
            </div>
            <div class="artist-pic-wrap">
                <div class="artist-pic-crop">
                    <img v-bind:class="'img-artist' + tab.id" class="artist-img" v-bind:src="'https://api.deezer.com/artist/' + tab.id + '/image'"/>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {setAppLoading} from '../vuex/ui_actions'
import {setPlayerSongs, togglePlayerPlay} from '../vuex/dzplay_actions'

export default {
    replace: false,
    components: {},
    vuex: {
        getters: {
            currentEvent: state => state.currentEvent,
            dateEventSongs: state => state.dateEventSongs,
            playing: state => state.playing,
            moving: state => state.moving,
            currentSongID: state => state.currentSongID
        },
        actions: {setAppLoading, setPlayerSongs, togglePlayerPlay}
    },
    watch: {
        moving: function (newVal) {
            if (newVal) {
                this.dirtyMove = false
            }
        }
    },
    computed: {
        visibleTab: function () {
            if (!this.moving && this.dateEventSongs[this.currentEvent.date]) {
                if (!this.playing && !this.dirtyMove) {
                    this.setPlayList(this.dateEventSongs[this.currentEvent.date].artists[0].songs[0].id)
                    this.dirtyMove = true
                }
                return true
            } else {
                return false
            }
        },
        artistPlaying: function () {
            var retTab = []
            this.displayTab.artists.forEach(tab => {
                var artistBool = false
                tab.songs.forEach(song => {
                    if (String(this.currentSongID) === String(song.id)) {
                        artistBool = true
                    }
                })
                retTab.push(artistBool)
            })
            return retTab
        },
        songPlaying: function () {
            var retObj = {}
            retObj[this.currentSongID] = true
            return retObj
        },
        displayTab: function () {
            return this.dateEventSongs[this.currentEvent.date]
        }
    },
    methods: {
        setPlayList: function (startSongId) {
            if (String(this.currentSongID) === String(startSongId)) {
                this.togglePlayerPlay()
            } else {
                var tabPlay = []
                var startIndex
                this.displayTab.artists.forEach(tab => {
                    tab.songs.forEach(song => {
                        if (song.id === startSongId) {
                            startIndex = tabPlay.length
                        }
                        tabPlay.push(song)
                    })
                })
                if (startIndex > 0) {
                    var firstPartTab = tabPlay.splice(0, startIndex)
                    firstPartTab.forEach(val => {
                        tabPlay.push(val)
                    })
                }
                this.setPlayerSongs(tabPlay)
            }
        }
    },
    data () {
        return {
            dirtyMove: false
        }
    }
}
</script>

<style>
    .songs-tab-wrapper {
        position: absolute; z-index: 300;
        text-align: left; padding-left: 290px;
        width: 100%; height: 120px;
    }
    .artist-bloc {
        position: relative; display: inline-block;
        text-align: left; width: 23%; height: 100%;
        margin-right: 10px;
    }
    .artist-pic-wrap {
        position: absolute; z-index: 10; top: 0;
        margin-top: 15px;
        padding: 5px; border-radius: 50%;
        background-color: #A493C6; opacity: 0.3;
    }
    .artist-songs-bloc {
        position: absolute; overflow: hidden;
        top:0; left: 40px; right: 0;
        z-index: 0;
        margin-top: 10px;
    }
    .artist-pic-crop {
        position: relative; z-index: 1;
        width: 80px; height: 80px;
        overflow: hidden;
        border-radius: 50%;
    }
    .artist-pic-crop img {width: 100%; height: 100%;}
    .artist-name {
        display: inline-block; width: 100%;
        margin-left:35px;
        font-size: 1em; padding-left: 10px;
        font-family: 'Roboto Condensed', 'Helvetica', sans-serif;
        color: #A493C6; opacity: 0.2;
        border-bottom: solid #A493C6 2px;
    }
    .song-line {
        cursor: pointer;
        width: 90%; display: inline-block;
        padding-left: 55px; font-size: 0.8em;
        font-family: 'Roboto', 'Helvetica', sans-serif;
        color: #E0E3DA; opacity: 0;
        overflow: hidden;
    }
    .song-line svg polygon, .song-line svg rect {fill: #A493C6;}
    .song-line svg {display: none; height: 10px; width: 10px;}

    .artist-bloc:hover .artist-name {opacity: 1; color: #E0E3DA; border-bottom: solid #E0E3DA 2px;}
    .artist-bloc.current .artist-name {opacity: 1;}
    .artist-bloc:hover .artist-pic-wrap {opacity: 1; background-color: #E0E3DA;}
    .artist-bloc.current .artist-pic-wrap {opacity: 1;}
    .artist-bloc.current .song-line {opacity: 1; color: #A493C6;}
    .artist-bloc:hover .song-line {opacity: 1; color: #E0E3DA;}
    .artist-bloc:hover polygon, .artist-bloc:hover rect {fill: #E0E3DA;}
    .artist-bloc:hover .song-line:hover {opacity: 1; background-color: #E0E3DA; color: #282828;}

    .song-line.current svg {display: inline-block;}
    .song-line:hover svg {display: inline-block;}
    .song-line:hover svg polygon, .song-line:hover svg rect {fill: #282828;}

    .song-line #pause-icon {display: none;}
    .song-line #play-icon {display: none;}
    .song-line.current #pause-icon {display: block;}
    .song-line.current.playing #pause-icon {display: none;}
    .song-line:hover #pause-icon {display: none;}
    .song-line.current.playing:hover #pause-icon {display: block;}
    .song-line.current.playing #play-icon {display: block;}
    .song-line:hover #play-icon {display: block;}
    .song-line.current:hover #play-icon {display: block;}
    .song-line.current.playing:hover #play-icon {display: none;}

</style>
