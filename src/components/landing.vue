<template>

    <div class="cosmos-main"></div>
    <div class="header-main">
        <div class="header-logo-wrapper">
            <app-logo size="big"></app-logo>
        </div>
        <h1 class="header-message">
            <span v-show="currentHeader === 'welcome'" transition="head">Your personnal music time machine</span>
            <span v-show="currentHeader === 'authLoading'" transition="head">Fetching your account information..</span>
            <span v-show="currentHeader === 'helloX'" transition="head">Hello {{loginName}} !</span>
            <span v-show="currentHeader === 'connectError'" transition="head">{{connectErrorMessage}}</span>
            <span v-show="currentHeader === 'songLoading'" transition="head">Fetching your music listening history..</span>
            <span v-show="currentHeader === 'songError'" transition="head">There was an error, {{currentSongIndex}} were loaded</span>
            <span v-show="currentHeader === 'analyseSongs'" transition="head">Analysing songs..</span>
            <span v-show="currentHeader === 'playerLoading'" transition="head">Loading the music player..</span>
            <span v-show="currentHeader === 'allDone'" transition="head">All done !</span>
        </h1>
        <div class="loading-bar-wrapper" v-show="currentHeader === 'songLoading'" transition="opac">
            <div class="loading-bar-back" v-bind:style="{backgroundColor: bckCol}">
                <div class="loading-bar-front" v-bind:style="{width: loadWidth + '%'}"></div>
            </div>
            <div class="loading-bar-text">{{currentSongIndex}} / {{histoBound - 1}}</div>
        </div>
        <div class="header-bt-wrapper bt-start" v-show="currentHeader === 'welcome'" transition="opac">
            <button type="button" class="bt-violet" name="button" v-on:click="startConnect()">
                Login<br>
                <em>using Deezer</em>
            </button>
            <button type="button" class="bt-brown" name="button" v-on:click="logout(this.$router)">
                Check<br>
                <em>an example</em>
            </button>
        </div>
        <div class="header-bt-wrapper bt-error" v-show="currentHeader === 'songError' || currentHeader === 'connectError'" transition="opac">
            <button type="button" class="bt-violet" name="button" v-on:click="tryAgain()">
                Try again
            </button>
            <button v-show="currentHeader === 'songError'" type="button" class="bt-brown" name="button" v-on:click="analyseSongs()">
                Continue
            </button>
        </div>
        <div class="header-bt-wrapper bt-error" v-show="currentHeader === 'allDone'" transition="opac">
            <button type="button" class="bt-violet" name="button" v-on:click="goPlay()">
                Go to your timeline
            </button>
        </div>
        <div class="header-about-wrap">
            <a href="http://google.com">About</a>
        </div>
    </div>
</template>

<script>
import applogo from './applogo.vue'
import {logout, login, initApp, initPlayer, getHistoBound, getAllSongs, resetSongs} from '../vuex/dz_actions'
import {setAppLoading, analyseSongEvents} from '../vuex/ui_actions'
import Cosmos from './cosmos/cosmosRendering.js'

export default {
    components: {'app-logo': applogo},
    vuex: {
        actions: {setAppLoading, logout, login, initApp, initPlayer, getHistoBound, getAllSongs, resetSongs, analyseSongEvents},
        getters: {
            // Init app :
            auth: state => state.auth,
            isInitApp: state => state.isInitApp,
            isInitPlayer: state => state.isInitPlayer,
            // Songs loading :
            currentSongIndex: state => state.currentSongIndex,
            histoBound: state => state.histoBound,
            songLoadProg: state => {
                if (state.histoBound === 0) {
                    return 0
                } else {
                    return Math.round(100 * state.currentSongIndex / state.histoBound)
                }
            },
            bckCol: state => state.bckCol,
            randKey: state => state.randKey
        }
    },
    computed: {
        loadWidth: function () {
            return Math.min(100, Math.round(100 * this.currentSongIndex / Math.max((this.histoBound - 1), 1)))
        }
    },
    methods: {
        initCosmos: function () {
            this.myCosmos.init(3000, false, 70)
            this.myCosmos.isAnim = true
            this.myCosmos.moveParticles(-3000)
        },
        startConnect: function () {
            this.currentHeader = 'authLoading'
            this.setAppLoading(true)
            if (this.isInitApp) {
                this.login().then((response) => {
                    this.loadHistoBound(response.name)
                }).catch(error => {
                    this.setAppLoading(false)
                    this.currentHeader = 'connectError'
                    this.connectErrorMessage = error.message
                })
            } else {
                this.initApp().then(this.startLoading)
            }
        },
        tryAgain: function () {
            this.resetSongs().then(() => this.startConnect())
        },
        loadHistoBound: function (name) {
            this.currentHeader = 'helloX'
            this.setAppLoading(true)
            this.loginName = name
            this.getHistoBound().then(() => {
                this.loadSongs()
            }).catch(error => {
                this.setAppLoading(false)
                this.currentHeader = 'connectError'
                this.connectErrorMessage = error.message
            })
        },
        loadSongs: function () {
            this.currentHeader = 'songLoading'
            this.setAppLoading(true)
            this.getAllSongs().then(() => {
                this.analyseSongs()
            }).catch(error => {
                console.log(error)
                this.setAppLoading(false)
                this.currentHeader = 'songError'
            })
        },
        analyseSongs: function () {
            this.currentHeader = 'analyseSongs'
            this.setAppLoading(true)
            setTimeout(() => {
                this.analyseSongEvents('all').then(() => this.loadPlayer()).catch(() => this.loadPlayer())
            }, 400)
        },
        loadPlayer: function () {
            this.currentHeader = 'playerLoading'
            this.setAppLoading(true)
            this.initPlayer().then(() => {
                this.currentHeader = 'allDone'
                this.setAppLoading(false)
            })
        },
        goPlay: function () {
            this.$router.go('/play')
        }
    },
    ready: function () {
        this.myCosmos = new Cosmos('.cosmos-main', this.bckCol, this.randKey)
        setTimeout(this.initCosmos, 1500)
        setTimeout(() => this.currentHeader = 'welcome', 800)
    },
    data () {
        return {
            myCosmos: {},
            loginName: '',
            currentHeader: '',
            connectErrorMessage: ''
        }
    }
}

</script>

<style>
    /*GLOBAL WRAPPING*/
    .cosmos-main {
        position: absolute; overflow: hidden; z-index: 0;
        width: 100%%; height: 100%;
    }
    .header-main {
        position: absolute; top:0; left: 0; width: 100%; height: 100%; z-index:10;
    }
    .header-logo-wrapper {margin-top:120px; width:100%; text-align: center;}

    /*HEADER TEXT*/
    .header-message {
        position: relative;
        font-family: 'Raleway', 'Helvetica', sans-serif;
        font-size: 3em;
        margin-top:80px;
        width: 100%;
        color: white;
    }

    /*BUTTONS*/
    .header-bt-wrapper {
        position: relative;
        width:100%; text-align: center;
        top: 100px;
    }
    .header-bt-wrapper button {
        margin: 50px; padding:10px; font-size: 1.1em;
        cursor: pointer;
        font-family: 'Roboto', 'Helvetica', sans-serif;
        border-radius: 5px; border: none;
    }
    .bt-violet {background-color: #A493C6;}
    .bt-brown {background-color: #E0E3DA;}
    .header-bt-wrapper em {font-style: normal; font-size:0.9em; opacity: 0.6;}

    /*LOADING BAR*/
    .loading-bar-wrapper {
        position: relative; text-align: center;
        width:100%; height: 50px;
        top: 100px;
    }
    .loading-bar-back {
        display: inline-block; text-align: left;
        height:100%;
        width: 80%; max-width: 500px;
        /*background-color: #576271;*/
        opacity: 0.7;
    }
    .loading-bar-front {
        height: 100%; background-color: #A493C6;
        transition: width 100ms ease;
    }
    .loading-bar-text {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        color: #E0E3DA;
        font-family: 'Roboto', 'Helvetica', sans-serif;
        font-size: 24px;
    }

    /*ABOUT LINK*/
    .header-about-wrap {
        position: absolute; bottom: 20px;
        width: 100%; text-align: center;
    }
    .header-about-wrap a {
        font-family: 'Raleway', 'Helvetica', sans-serif;
        color: #FFFFE9; font-style: italic;
    }

    /*TRANSITIONS*/
    .head-transition {
        width: 100%; position: absolute;
        text-align: center; transform: translateY(0px);
        opacity: 1; transition: all 0.4s ease-out;
    }
    .head-enter, .head-leave {opacity: 0;}
    .head-enter {transform: translateY(20px);}
    .head-leave {transform: translateY(-40px);}
    .opac-transition {
        opacity: 1; transition: all 0.4s ease-in
    }
    .opac-enter, .opac-leave {opacity: 0;}

</style>
