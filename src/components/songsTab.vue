<template>
    <div class="songs-tab-wrapper">
        <div class="artist-bloc" v-for="tab in dataTab" v-bind:class="{'playing': ($index === 0)}">
            <em class="artist-name">{{tab.artist.name}}</em>
            <div class="artist-pic-wrap">
                <div class="artist-pic-crop">
                    <img v-bind:class="'img-artist' + tab.artist.id" class="artist-img" v-bind:src="'https://api.deezer.com/artist/' + tab.artist.id + '/image'"/>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {setAppLoading} from '../vuex/ui_actions'
import loadSongs from '../testSongs.json'

export default {
    replace: false,
    components: {},
    vuex: {
        getters: {
            currentEvent: state => state.currentEvent,
            dateSongs: state => state.dateSongs
        },
        actions: {setAppLoading}
    },
    computed: {
        dataTab: function () {
            var retTab = []
            var mySongs = this.dateSongs[this.currentEvent.date]
            if (mySongs) {
                mySongs.forEach(song => {
                    var pushed = false
                    retTab.forEach(ret => {
                        if (song.artist.id === ret.artist.id) {
                            ret.songs.push(song)
                            pushed = true
                        }
                    })
                    if (!pushed) {
                        retTab.push({artist: song.artist, songs: [song]})
                    }
                })
            } else {
                retTab = loadSongs
            }
            console.log(JSON.stringify(retTab))
            return retTab
        }
    },
    methods: {

    },
    data () {
        return {

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
        margin-top: 20px;
        padding: 5px; border-radius: 50%;
        background-color: #A493C6; opacity: 0.6;
        /*transition: all 0.1s ease-out;*/
    }
    .artist-name {
        position: absolute; top:0; left: 70px; right: 0; padding-left: 10px;
        z-index: 0; font-size: 1.1em;
        margin-top: 15px;
        font-family: 'Roboto Condensed', 'Helvetica', sans-serif;
        color: #A493C6; opacity: 0.2;
        border-bottom: solid #A493C6 3px;
        /*transition: all 0.1s ease-out;*/
    }
    .artist-pic-crop {
        position: relative; z-index: 1;
        width: 70px; height: 70px;
        overflow: hidden;
        border-radius: 50%;
    }
    .artist-pic-crop img {width: 100%; height: 100%;}

    .artist-bloc:hover .artist-name {opacity: 1; color: #E0E3DA; border-bottom: solid #E0E3DA 2px;}
    .artist-bloc.playing .artist-name {opacity: 1;}
    .artist-bloc:hover .artist-pic-wrap {opacity: 1; background-color: #E0E3DA;}
    .artist-bloc.playing .artist-pic-wrap {opacity: 1;}

</style>
