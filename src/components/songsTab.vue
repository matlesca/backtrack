<template>
    <div class="songs-tab-wrapper" v-show="visibleTab" v-bind:class="{'extended': showSongsTab && visibleTab && !songsDataLoading}">
        <songs-tab-player :visibletab="visibleTab"></songs-tab-player>
        <div class="playlist-wrapper" v-show="showSongsTab && visibleTab && !songsDataLoading">
            <div v-if="groupBy === 'artist' || groupBy === 'album'" class="group-bloc" v-for="tab in displayGrouped">
                <div class="group-pic-wrap">
                    <div class="group-pic-crop">
                        <img class="group-img" v-bind:src="'https://api.deezer.com/' + groupBy + '/' + tab.id + '/image'"/>
                    </div>
                </div>
                <div class="group-songs-bloc">
                    <em class="group-name" v-if="groupBy === 'artist'">{{tab.artistName}}</em>
                    <em class="group-name" v-if="groupBy === 'album'">{{tab.albumName}} <em class="group-name-desc">({{tab.artistName}})</em></em>
                    <span v-on:click="clickSong(song.id)" class="song-line" v-bind:class="{'current': song.id.toString() === currentSongID.toString(), 'playing': playing}" v-for="song in tab.songs">
                        <svg viewBox="0 0 20 20" >
                            <rect id="pause-icon" width="7" height="20"/>
                            <rect id="pause-icon" x="13" width="7" height="20"/>
                            <polygon id="play-icon" points="0,0 20,10 0,20 "/>
                        </svg>
                        {{song.title}}
                    </span>
                </div>
            </div>
            <div v-if="groupBy === 'track'" class="song-bloc">
                <span v-on:click="clickSong(song.id)" class="song-line" v-bind:class="{'current': song.id.toString() === currentSongID.toString(), 'playing': playing}" v-for="song in currentSongsData">
                    <svg viewBox="0 0 20 20" >
                        <rect id="pause-icon" width="7" height="20"/>
                        <rect id="pause-icon" x="13" width="7" height="20"/>
                        <polygon id="play-icon" points="0,0 20,10 0,20 "/>
                    </svg>
                    <span class="song-line-title">{{song.title}}</span>
                    <span class="song-line-artist">{{song.artist.name}}</span>
                </span>
            </div>
        </div>
    </div>

</template>

<script>
import songsTabPlayer from './songsTabPlayer.vue'
import {setAppLoading, setShowSongsTab} from '../vuex/ui_actions'
import {setPlayerSongs, togglePlayerPlay, changeSongsOrder} from '../vuex/dzplay_actions'

export default {
    replace: false,
    components: {'songs-tab-player': songsTabPlayer},
    vuex: {
        getters: {
            showSongsTab: state => state.showSongsTab,
            currentSongsData: state => state.currentSongsData,
            playing: state => state.playing,
            moving: state => state.moving,
            songsDataLoading: state => state.songsDataLoading,
            groupBy: state => state.groupBy,
            currentSongID: state => state.currentSongID,
            currentDate: state => state.currentDate
        },
        actions: {setAppLoading, setPlayerSongs, togglePlayerPlay, setShowSongsTab, changeSongsOrder}
    },
    watch: {
        moving: function (newVal) {
            if (newVal) {
                this.dirtyMove = false
            }
        }
    },
    methods: {
        clickSong: function (songID) {
            if (parseInt(songID, 10) === parseInt(this.currentSongID, 10)) {
                this.togglePlayerPlay()
            } else {
                let playlistRank = 0
                for (let ii = 0; ii < this.playlist.length; ii++) {
                    if (this.playlist[ii].id === songID) {
                        playlistRank = ii
                    }
                }
                this.setPlayerSongs(this.playlist, playlistRank)
            }
        }
    },
    computed: {
        visibleTab: function () {
            if (!this.moving && this.currentDate && !this.songsDataLoading) {
                if (!this.playing && !this.dirtyMove) {
                    this.setPlayerSongs(this.playlist, 0)
                    this.dirtyMove = true
                }
                return true
            } else {
                return false
            }
        },
        songPlaying: function () {
            var retObj = {}
            retObj[this.currentSongID] = true
            return retObj
        },
        displayGrouped: function () {
            let retTab = []
            let playTemp = []
            if (this.groupBy === 'artist' || this.groupBy === 'album') {
                this.currentSongsData.forEach(song => {
                    let knownGroup = false
                    retTab.forEach(group => {
                        if (group.id === song[this.groupBy].id) {
                            knownGroup = true
                            group.nb += song.nb
                            group.songs.push({id: song.id, title: song.title, preview: song.preview, nb: song.nb})
                        }
                    })
                    if (!knownGroup) {
                        retTab.push({id: song[this.groupBy].id, artistName: song.artist.name, albumName: song.album.name, nb: song.nb, songs: [{id: song.id, title: song.title, preview: song.preview, nb: song.nb}]})
                    }
                })
                retTab.sort((a, b) => b.nb - a.nb)
                retTab.forEach(group => {
                    group.songs.sort((a, b) => {
                        if (b.nb === a.nb) {
                            return a.id - b.id
                        } else {
                            return b.nb - a.nb
                        }
                    })
                    group.songs.forEach(song => {
                        playTemp.push(song)
                    })
                })
            } else if (this.groupBy === 'track') {
                playTemp = this.currentSongsData.sort((a, b) => {
                    if (b.nb === a.nb) {
                        return a.id - b.id
                    } else {
                        return b.nb - a.nb
                    }
                })
            }
            if (playTemp.length > 0) {
                this.changeSongsOrder(playTemp)
            }
            this.playlist = playTemp
            return retTab
        }
    },
    data () {
        return {
            dirtyMove: false,
            playlist: []
        }
    }
}
</script>

<style>
    .songs-tab-wrapper {
        position: absolute; z-index: 1000;
        right: 0; top: 0;
        font-family: 'Roboto', 'Helvetica', sans-serif;
        transform: translateX(250px); transition: transform 0.2s ease-in-out, background-color 0.15s ease-in-out;
        height: 100%; width: 320px; max-width: 80%;
        overflow-x: hidden;
        background-color: rgba(40, 40, 40, 0)
    }
    .songs-tab-wrapper.extended {
        transform: translateX(0);
        background-color: rgba(40, 40, 40, 0.8)
    }
    .playlist-wrapper {
        position: absolute; top: 120px; bottom: 0px; width: 100%;
        padding: 0 10px 0 10px; overflow-y: scroll; overflow-x: hidden;
        opacity: 0; transition: opacity 0.15s ease-in-out;
    }
    .songs-tab-wrapper.extended .playlist-wrapper {opacity: 1;}
    .group-bloc {
        position: relative; height: auto; min-height: 100px;
        margin-bottom: 20px;
        text-align: left; width: 100%;
    }
    .song-bloc {
        position: relative; width: 100%;
        top: 20px;
    }
    .group-pic-wrap {
        position: absolute; z-index: 10; top: 0;
        margin-top: 5px; display: inline-block;
        padding: 5px; border-radius: 50%;
        background-color: #A493C6; opacity: 0.8;
    }
    .group-songs-bloc {
        position: relative;
        left: 75px;
        z-index: 0;
        margin-top: 10px;
    }
    .group-pic-crop {
        position: relative; z-index: 1;
        width: 60px; height: 60px;
        overflow: hidden;
        border-radius: 50%;
    }
    .group-pic-crop img {width: 100%; height: 100%;}
    .group-name {
        display: block; width: 230px;
        margin-left: -15px; margin-bottom: 3px;
        font-size: 1.1em; padding-left: 10px;
        font-family: 'Roboto Condensed', 'Helvetica', sans-serif;
        color: #A493C6; opacity: 0.9;
        border-bottom: solid #A493C6 2px;
    }
    .group-name-desc {font-size: 0.8em; opacity: 0.7;}
    .song-line {
        cursor: pointer;
        display: block;
        padding-left: 5px; font-size: 0.85em;
        color: #E0E3DA; opacity: 0.8;
        overflow: hidden;
    }
    .song-line svg polygon, .song-line svg rect {fill: #A493C6;}
    .song-line svg {display: none; height: 10px; width: 10px; vertical-align: top; margin-top: 4px;}

    .song-line.current {color: #A493C6;}
    .song-line:hover {opacity: 1; background-color: #E0E3DA; color: #282828;}

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

    .song-line-title {display: inline-block; width: 66%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .song-line:hover .song-line-title {width: 61%;}
    .song-line.current .song-line-title {width: 61%;}
    .song-line-artist {
        display: inline-block;
        width: 30%; font-size: 0.8em; font-style: italic; overflow: hidden;
        opacity: 0.8; text-overflow: ellipsis; white-space: nowrap;
    }

    @media (max-width: 400px) {
      .songs-tab-wrapper {transform: translateX(240px);}
    }
    @media (max-width: 370px) {
      .songs-tab-wrapper {transform: translateX(220px);}
    }
    @media (max-width: 350px) {
      .songs-tab-wrapper {transform: translateX(200px);}
    }
    @media (max-width: 320px) {
      .songs-tab-wrapper {transform: translateX(180px);}
    }
    @media (max-width: 290px) {
      .songs-tab-wrapper {transform: translateX(160px);}
    }

</style>
