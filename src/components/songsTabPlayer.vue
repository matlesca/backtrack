<template>
    <div class="player-wrapper">
        <div class="play-buttons-wrap">
            <button type="button" class="btn-show" v-show="visibletab" v-on:click="setShowSongsTab(!showSongsTab)">
                <svg viewBox="0 0 187 95.334">
                <g transform="translate(-390 -1400)">
                    <path d="M448.366,1493.634c-6.837,0-12.4-4.486-12.4-10s5.563-10,12.4-10c1.365,0,2.749,0.213,4.232,0.652l2.567,0.76v-59.395
                        l63.2-13.542v67.126c0,5.514-5.562,10-12.4,10c-6.837,0-12.399-4.486-12.399-10s5.562-10,12.399-10
                        c1.362,0,2.747,0.214,4.233,0.652l2.566,0.757v-47.029l-51.999,11.144v58.875C460.767,1489.147,455.204,1493.634,448.366,1493.634z
                        "/>
                </g>
                <polygon v-show="!showSongsTab" points="34.045,80.651 1.265,47.872 34.044,15.091 38.287,19.333 9.75,47.872 38.287,76.409 "/>
                <polygon v-show="showSongsTab" points="152.3,80.65 148.058,76.408 176.595,47.871 148.058,19.333 152.3,15.091 185.079,47.871 "/>
                </svg>
            </button>
            <button type="button" class="btn-prev player-transp" v-on:click="playerPrevious">
                <svg viewBox="0 0 20 20" >
                    <polygon points="16,0 16,8 0,0 0,20 16,12 16,20 20,20 20,0 "/>
                </svg>
            </button>
            <button type="button" class="btn-play player-transp" v-bind:class="{'playing': playing}" v-on:click="togglePlayerPlay">
                <svg viewBox="0 0 20 20" >
                    <rect id="pause-icon" width="7" height="20"/>
                    <rect id="pause-icon" x="13" width="7" height="20"/>
                    <polygon id="play-icon" points="0,0 20,10 0,20 "/>
                </svg>
            </button>
            <button type="button" class="btn-next player-transp" v-on:click="playerNext">
                <svg viewBox="0 0 20 20" >
                    <polygon points="16,0 16,8 0,0 0,20 16,12 16,20 20,20 20,0 "/>
                </svg>
            </button>
        </div>
        <div class="volume-buttons-wrap player-transp">
            <button type="button" class="btn-volume" v-on:click="resetVolume">
                <svg viewBox="0 0 20 20" >
                    <polygon points="9.062,3.203 3.323,7.508 0,7.508 0,12.492 3.323,12.492 9.062,16.797 "/>
                    <path v-show="volumePos > 0" d="M12.184,12.696c0.779-0.538,1.302-1.544,1.302-2.696s-0.523-2.158-1.303-2.695"/>
                    <path v-show="volumePos > 40" d="M13.775,16.485c1.875-1.291,3.133-3.713,3.133-6.485c0-2.771-1.262-5.192-3.135-6.484"/>
                    <path v-show="volumePos > 80" d="M15.365,19.589C18.137,17.677,20,14.101,20,10c0-4.099-1.864-7.677-4.636-9.588"/>
                </svg>
            </button>
            <input class="slider-volume" type="range" min="0" max="100" v-model="volumePos">
        </div>
        <div class="group-buttons-label player-transp">{{locale === 'fr' ? 'Grouper par :' : 'Group by :'}}</div>
        <div class="group-buttons-wrapper">
            <a class="group-button player-transp" v-on:click="setGroupBy('track')" v-bind:class="{'selected': groupBy === 'track'}">{{locale === 'fr' ? 'Titre' : 'Track'}}</a>
            <a class="group-button player-transp" v-on:click="setGroupBy('album')" v-bind:class="{'selected': groupBy === 'album'}">Album</a>
            <a class="group-button player-transp" v-on:click="setGroupBy('artist')" v-bind:class="{'selected': groupBy === 'artist'}">{{locale === 'fr' ? 'Artiste' : 'Artist'}}</a>
        </div>
    </div>
</template>

<script type="text/javascript">
import {togglePlayerPlay, playerNext, playerPrevious, playerVolume} from '../vuex/dzplay_actions'
import {setShowSongsTab, setGroupBy} from '../vuex/ui_actions'

export default {
    replace: true,
    props: ['visibletab'],
    vuex: {
        getters: {
            playing: state => state.playing,
            groupBy: state => state.groupBy,
            showSongsTab: state => state.showSongsTab,
            currentModal: state => state.currentModal,
            locale: state => state.locale
        },
        actions: {togglePlayerPlay, playerNext, playerPrevious, playerVolume, setShowSongsTab, setGroupBy}
    },
    watch: {
        volumePos: function (newVal) {
            this.playerVolume(newVal)
        }
    },
    methods: {
        resetVolume: function () {
            if (this.volumePos > 0) {
                this.previousVolume = this.volumePos
                this.volumePos = 0
            } else {
                this.volumePos = this.previousVolume
            }
        },
        pressSpace: function (ev) {
            if (ev.keyCode === 32 && (!this.currentModal || this.currentModal === '')) {
                this.togglePlayerPlay()
            }
        }
    },
    created: function () {
        window.addEventListener('keyup', this.pressSpace)
    },
    beforeDestroy: function () {
        window.removeEventListener('keyup', this.pressSpace)
    },
    data () {
        return {
            volumePos: 80,
            previousVolume: 80,
            extended: true
        }
    }
}

</script>

<style>

.player-wrapper {
    z-index: 99; overflow: hidden; display: block;
    height: 120px;
    position: absolute; top:0; right: 0;
    margin: 0; padding: 0; background: none;
    width: 100%; transition: width 0.1s ease;
    border-bottom: none;
}
.songs-tab-wrapper.extended .player-wrapper {border-bottom: 2px solid #636b77;}

.play-buttons-wrap {position: relative; margin-top: 18px; padding-left: 20px; width: 100%; text-align: center;}
.volume-buttons-wrap {position: relative; margin-left: 45px; margin-top: 10px; width: 100%; text-align: left;}
.player-wrapper button {background: none; border: none; display: inline-block; margin-left: 7%; margin-right: 7%;}
.play-buttons-wrap svg, .volume-buttons-wrap svg {width: 18px; height: 18px; display: inline-block}
.btn-prev svg {transform: rotate(180deg);}
.player-wrapper .btn-show {position: absolute; left: 0px; margin: 15px 0 0 0; padding: 0;}
.player-wrapper .btn-show svg {width: 60px; height: 30px;}

#pause-icon {display: none;}
.btn-play.playing #play-icon {display: none;}
.btn-play.playing #pause-icon {display: block;}
.player-wrapper svg polygon, .player-wrapper svg rect, .player-wrapper svg path {fill: #FEFCEA;}
.player-wrapper .btn-volume path {fill: none; stroke: #FEFCEA;}
.player-wrapper button, .player-wrapper input[type='range'] {cursor: pointer; opacity: 0.7;}
.songs-tab-wrapper.extended .player-wrapper button:hover, .songs-tab-wrapper.extended .player-wrapper input[type='range']:hover {opacity: 1;}

/*Slider design*/
.player-wrapper input[type='range'] {
    appearance: none !important;
    opacity: 0.7;
    position: absolute; left: 55px; bottom: 10px;
    width: 58%; height:2px;
    background: #FEFCEA; border: none;
}
.player-wrapper input[type='range']::slider-thumb {
    appearance: none !important;
    border-radius: 50%;
    background: #FEFCEA;
    height:10px;
    width:10px;
}

/*Group By buttons*/
.group-buttons-label {
    width: 100%; padding-left: 5px;
    color: #A493C6; font-size: 0.8em;
}
.group-buttons-wrapper {
    position: absolute; bottom: 0; overflow: hidden;
    width: 100%; height: 22px;
}
.group-button {
    display: inline-block; padding-top: 2px;
    width: 32%; height: 100%; color: #E0E3DA;
    font-style: italic;
    text-align: center; text-decoration: none;
}
.group-button:hover {text-decoration: underline; cursor: pointer; opacity: 1;}
.group-button.selected {
    background-color: #636b77; color: #282828; opacity: 1;
    text-decoration: none; cursor: default;
}

.songs-tab-wrapper .player-transp {opacity: 0; transition: opacity 0.05s ease;}
.songs-tab-wrapper.extended .player-transp {opacity: 0.8;}

</style>
