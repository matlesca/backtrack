<template>
    <div class="player-wrapper" v-bind:style="{height: toppad + 'px'}">
        <div class="player-col-wrap" v-bind:style="{height: toppad + 'px', backgroundColor : bckCol}">
            <div class="play-buttons-wrap" v-show="currentEvent.date">
                <button type="button" name="button" class="btn-prev" v-on:click="playerPrevious">
                    <svg viewBox="0 0 20 20" >
                        <polygon points="16,0 16,8 0,0 0,20 16,12 16,20 20,20 20,0 "/>
                    </svg>
                </button>
                <button type="button" name="button" class="btn-play" v-bind:class="{'playing': playing}" v-on:click="togglePlayerPlay">
                    <svg viewBox="0 0 20 20" >
                        <rect id="pause-icon" width="7" height="20"/>
                        <rect id="pause-icon" x="13" width="7" height="20"/>
                        <polygon id="play-icon" points="0,0 20,10 0,20 "/>
                    </svg>
                </button>
                <button type="button" name="button" class="btn-next" v-on:click="playerNext">
                    <svg viewBox="0 0 20 20" >
                        <polygon points="16,0 16,8 0,0 0,20 16,12 16,20 20,20 20,0 "/>
                    </svg>
                </button>
            </div>
            <div class="volume-buttons-wrap" v-show="currentEvent.date">
                <button type="button" name="button" class="btn-volume" v-on:click="resetVolume">
                    <svg viewBox="0 0 20 20" >
                        <polygon points="9.062,3.203 3.323,7.508 0,7.508 0,12.492 3.323,12.492 9.062,16.797 "/>
                        <path v-show="volumePos > 0" d="M12.184,12.696c0.779-0.538,1.302-1.544,1.302-2.696s-0.523-2.158-1.303-2.695"/>
                        <path v-show="volumePos > 40" d="M13.775,16.485c1.875-1.291,3.133-3.713,3.133-6.485c0-2.771-1.262-5.192-3.135-6.484"/>
                        <path v-show="volumePos > 80" d="M15.365,19.589C18.137,17.677,20,14.101,20,10c0-4.099-1.864-7.677-4.636-9.588"/>
                    </svg>
                </button>
                <input class="slider-volume" type="range" min="0" max="100" v-model="volumePos">
            </div>
            <div class="music-note-wrapper" v-bind:class="{'onevent': currentEvent.date}">
                <svg viewBox="0 0 7.647 14.401">
                    <path d="M6.191,3.93C4.414,2.217,4.187,0.782,4.163,0.231V0.002L4.169,0H3.795v10.812c-0.601-0.521-1.771-0.343-2.714,0.446
	                    c-1.009,0.844-1.377,2.065-0.823,2.728c0.554,0.663,1.821,0.516,2.83-0.328c0.714-0.596,1.075-1.365,1.075-2.018V3.905
	                    C6.285,4.241,7.032,6.49,7.045,6.517c0.561,1.558-0.786,4.167-0.833,4.294c0,0,0.167,0,0.22,0c1.267-2.24,1.209-3.832,1.214-3.947
	                    C7.699,5.503,6.277,4.016,6.191,3.93z"/>
                </svg>

            </div>
        </div>

    </div>
</template>

<script type="text/javascript">
import {togglePlayerPlay, playerNext, playerPrevious, playerVolume} from '../../vuex/dzplay_actions'

export default {
    replace: true,
    props: ['toppad'],
    vuex: {
        getters: {
            currentEvent: state => state.currentEvent,
            playing: state => state.playing,
            bckCol: state => state.bckCol
        },
        actions: {togglePlayerPlay, playerNext, playerPrevious, playerVolume}
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
            if (ev.keyCode === 32) {
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
            previousVolume: 80
        }
    }
}

</script>

<style>

.player-wrapper {
    z-index: 99; overflow: hidden; display: block;
    position: fixed; top:0; right: 0;
    margin: 0; padding: 0;
    width: 30px; transition: width 0.1s ease;
    background-color: #576271;
    border-bottom: 4px solid #636b77
}
.player-color-wrap {
    width: 100%; height: 100%; opacity: 0.7;
}
.sidebar-wrapper:hover .player-wrapper {width:200px}

.music-note-wrapper {display: block; width: 100%; height: 100%; text-align: center;}
.music-note-wrapper svg {height: 30px; fill: #FEFCEA; margin-top: 22px; opacity: 0.7;}
.sidebar-wrapper:hover .music-note-wrapper.onevent {display: none;}

.play-buttons-wrap {margin-top: 10px; width: 200px; overflow: hidden; display: none; text-align: center;}
.volume-buttons-wrap {margin-top: 5px; width: 200px; overflow: hidden; display: none; text-align: left;}
.sidebar-wrapper:hover .play-buttons-wrap, .sidebar-wrapper:hover .volume-buttons-wrap {display: inline-block;}
.player-wrapper button {background: none; border: none; display: inline-block; margin-left: 12px; margin-right: 12px;}
.play-buttons-wrap svg, .volume-buttons-wrap svg {width: 20px; height: 20px; display: inline-block}
.btn-prev svg {transform: rotate(180deg);}
#pause-icon {display: none;}
.btn-play.playing #play-icon {display: none;}
.btn-play.playing #pause-icon {display: block;}

.player-wrapper svg polygon, .player-wrapper svg rect {fill: #FEFCEA;}
.player-wrapper .btn-volume path {fill: none; stroke: #FEFCEA;}

.player-wrapper button, .player-wrapper input[type='range'] {cursor: pointer; opacity: 0.7;}
.player-wrapper button:hover, .player-wrapper input[type='range']:hover {opacity: 1;}

/*Slider design*/
.player-wrapper input[type='range'] {
    -webkit-appearance: none !important;
    opacity: 0.7;
    position: absolute; left: 50px; bottom: 20px;
    width: 60%; height:2px;
    background: #FEFCEA; border: none;
}
.player-wrapper input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    border-radius: 50%;
    background: #FEFCEA;
    height:10px;
    width:10px;
}


</style>
