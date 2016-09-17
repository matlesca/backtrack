<template>
    <div class="songs-tab-wrapper" v-bind:class="{'extended': showSongsTab && visibleTab && !songsDataLoading}">
        <songs-tab-player :visibletab="visibleTab"></songs-tab-player>
        <div class="playlist-wrapper">
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
            currentSongsData: state => {
                if (state.currentSongsData.length > 0) {
                    return state.currentSongsData
                } else {
                    return JSON.parse('[{"id":128528305,"title":"Morning","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-c.deezer.com/stream/c9a19bc676f41c3349cdccb1295c5c20-2.mp3","nb":25},{"id":128528307,"title":"Just Drive","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-f.deezer.com/stream/f2fa2b8bc783d2cc4fa9ca4c2525827b-2.mp3","nb":24},{"id":128528303,"title":"Search","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-5.deezer.com/stream/54f3a61e2cc52d60943cebfd46f792cb-2.mp3","nb":23},{"id":128528309,"title":"Wait a Minute","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-9.deezer.com/stream/95bd06e9cf1b0a57331c8ce7651a66bf-2.mp3","nb":23},{"id":128528301,"title":"Dizzy","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-5.deezer.com/stream/512b176801b4a4fdfd1ab52d44a6257c-2.mp3","nb":21},{"id":128528311,"title":"Wild Flower","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-1.deezer.com/stream/142928ccf3fbb5a5867f55a35c6c1c90-2.mp3","nb":21},{"id":128528313,"title":"Beach","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-4.deezer.com/stream/440fc10023d5c39d358241b494267eca-2.mp3","nb":17},{"id":128528315,"title":"Anytime","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-5.deezer.com/stream/5a229610dcb0dd724304c189088e248b-2.mp3","nb":16},{"id":128528319,"title":"10k","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-8.deezer.com/stream/81e362b7cb2f37ac98ac87108da0a2df-2.mp3","nb":15},{"id":128528321,"title":"Vacation","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-a.deezer.com/stream/a65bd7433878561ed3fe6a133ba8728d-2.mp3","nb":15},{"id":128528317,"title":"Piano & Sax","artist":{"id":5392331,"name":"Joakim Karud"},"album":{"id":13577183,"name":"Dizzy Compilation"},"preview":"http://cdn-preview-9.deezer.com/stream/939328bd43c26bd9c65c60fa4e549004-2.mp3","nb":14},{"id":873280,"title":"So Long, Marianne","artist":{"id":1834,"name":"Leonard Cohen"},"album":{"id":99375,"name":"The Collection"},"preview":"http://cdn-preview-9.deezer.com/stream/9fff7a2de62651b21ae69a53a7a79852-1.mp3","nb":14},{"id":107474518,"title":"Oh! You Pretty Things (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-3.deezer.com/stream/3d8bd0525bec7983a8638b51fd6a5416-4.mp3","nb":11},{"id":118203088,"title":"I\'m Painting Money","artist":{"id":78484,"name":"Get Well Soon"},"album":{"id":12281030,"name":"LOVE"},"preview":"http://cdn-preview-2.deezer.com/stream/2a003bb315218148cd43b8a394ac2547-3.mp3","nb":9},{"id":107474522,"title":"Life On Mars? (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-c.deezer.com/stream/c9ff46cbfc2ce921ca75dfb3713c38c5-4.mp3","nb":9},{"id":118203086,"title":"Young Count Falls For Nurse","artist":{"id":78484,"name":"Get Well Soon"},"album":{"id":12281030,"name":"LOVE"},"preview":"http://cdn-preview-8.deezer.com/stream/8256867c1dabcfe5346806d3547096e3-4.mp3","nb":8},{"id":107474528,"title":"Fill Your Heart (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-4.deezer.com/stream/4a4a6dda058ffc0ff42171f3f1246514-4.mp3","nb":8},{"id":107474524,"title":"Kooks (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-f.deezer.com/stream/f780c55fee6dd885936be53862b2530c-4.mp3","nb":8},{"id":118203090,"title":"It\'s A Mess","artist":{"id":78484,"name":"Get Well Soon"},"album":{"id":12281030,"name":"LOVE"},"preview":"http://cdn-preview-f.deezer.com/stream/f8a03e5d65a7e35e03918d3858025774-3.mp3","nb":7},{"id":107474534,"title":"Queen Bitch (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-e.deezer.com/stream/e469ecb2f9e390babdc67bb1d7e23b98-4.mp3","nb":7},{"id":118203082,"title":"Marienbad","artist":{"id":78484,"name":"Get Well Soon"},"album":{"id":12281030,"name":"LOVE"},"preview":"http://cdn-preview-3.deezer.com/stream/3a386bb077e44c46085327dc899c27aa-3.mp3","nb":6},{"id":107474532,"title":"Song For Bob Dylan (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-2.deezer.com/stream/20da119594bc94290a4c99c1be99fa0a-4.mp3","nb":6},{"id":61573235,"title":"Golden Revolver","artist":{"id":1389120,"name":"San Cisco"},"album":{"id":6033686,"name":"Awkward"},"preview":"http://cdn-preview-5.deezer.com/stream/5ed99a011e4ae675d56f344927a5a034-3.mp3","nb":6},{"id":118203092,"title":"It\'s A Fog","artist":{"id":78484,"name":"Get Well Soon"},"album":{"id":12281030,"name":"LOVE"},"preview":"http://cdn-preview-b.deezer.com/stream/bff3e4d20dcdbe5837bb9cb999e5984a-3.mp3","nb":6},{"id":107474520,"title":"Eight Line Poem (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-b.deezer.com/stream/b9062abbce8011cf0fd1bdf94b0d2e02-4.mp3","nb":6},{"id":107474526,"title":"Quicksand (2015 Remastered Version)","artist":{"id":997,"name":"David Bowie"},"album":{"id":11205658,"name":"Hunky Dory"},"preview":"http://cdn-preview-8.deezer.com/stream/894b7b1fcaf5e11979d19522bf20bad1-4.mp3","nb":6},{"id":118203084,"title":"33","artist":{"id":78484,"name":"Get Well Soon"},"album":{"id":12281030,"name":"LOVE"},"preview":"http://cdn-preview-c.deezer.com/stream/c93b10971c8509e4a50f5c23ef25c72c-3.mp3","nb":6},{"id":62269627,"title":"Girls Do Cry","artist":{"id":1389120,"name":"San Cisco"},"album":{"id":6033686,"name":"Awkward"},"preview":"http://cdn-preview-9.deezer.com/stream/96a4ee6d0a6c7f8d555671e7b1238b87-3.mp3","nb":5},{"id":61573234,"title":"Awkward (EP Version)","artist":{"id":1389120,"name":"San Cisco"},"album":{"id":6033686,"name":"Awkward"},"preview":"http://cdn-preview-2.deezer.com/stream/25e4e47d6e7752c5f6c9d6756fc81016-3.mp3","nb":5},{"id":61573236,"title":"Reckless","artist":{"id":1389120,"name":"San Cisco"},"album":{"id":6033686,"name":"Awkward"},"preview":"http://cdn-preview-0.deezer.com/stream/0a127694e3644b2d9264911addc63d22-3.mp3","nb":5}]')
                }
            },
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
        },
        groupBy: function () {

        }
    },
    methods: {
        clickSong: function (songID) {
            if (songID === this.currentSongID) {
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
                    this.setShowSongsTab(true)
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
                    group.songs.sort((a, b) => b.nb - a.nb)
                    group.songs.forEach(song => {
                        playTemp.push(song)
                    })
                })
            } else if (this.groupBy === 'track') {
                playTemp = this.currentSongsData.sort((a, b) => b.nb - a.nb)
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
