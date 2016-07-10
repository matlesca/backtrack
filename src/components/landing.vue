<template>

    <div class="cosmos-main"></div>
    <div class="header-main">
        <div class="header-logo-wrapper">
            <app-logo size="big"></app-logo>
        </div>
        <h1 class="header-message">
            <span v-show="currentHeader === 'welcome'" transition="head">Your personnal music time machine</span>
            <span v-show="currentHeader === 'loading'" transition="head">Fetching your information..</span>
        </h1>
        <div class="header-bt-wrapper">
            <button type="button" class="bt-login" name="button" v-on:click="login(this.$router)">
                Login<br>
                <em>using Deezer</em>
            </button>
            <button type="button" class="bt-example" name="button" v-on:click="logout(this.$router)">
                Check<br>
                <em>an example</em>
            </button>
        </div>
        <a class="header-about-link" href="http://google.com">About</a>
    </div>
    <!-- <img class="bt-dz-logo" alt="Deezer"/> -->
    <!-- <img class="bt-dz-logo2" alt="Deezer"/> -->
</template>

<script>
import applogo from './applogo.vue'
import {logout, login} from '../vuex/actions'
import Cosmos from './cosmos/cosmosRendering.js'
import {toggleAppLoading} from '../vuex/actions'

export default {
    components: {'app-logo': applogo},
    vuex: {
        actions: {logout, login, toggleAppLoading},
        getters: {
            isAppLoading: state => state.appLoading,
            auth: state => state.auth,
            isInit: state => state.isInit,
            bckCol: state => state.bckCol,
            randKey: state => state.randKey
        }
    },
    watch: {
        isAppLoading: function () {
            this.updateHeader()
        }
    },
    methods: {
        initCosmos: function () {
            this.myCosmos.init(3000, false, 70)
            this.myCosmos.isAnim = true
            this.myCosmos.moveParticles(-4000)
        },
        updateHeader: function () {
            if (this.isAppLoading) {
                this.currentHeader = 'loading'
            }
        }
    },
    ready: function () {
        this.myCosmos = new Cosmos('.cosmos-main', this.bckCol, this.randKey)
        setTimeout(this.initCosmos, 200)
        setTimeout(() => this.currentHeader = 'welcome', 1000)
        setTimeout(() => this.currentHeader = 'loading', 5000)
    },
    data () {
        return {
            myCosmos: {},
            currentHeader: ''
        }
    }
}

</script>

<style>
    .cosmos-main {
        position: absolute; overflow: hidden; z-index: 0;
        width: 10%%; height: 100%;
    }
    .header-main {
        position: absolute; top:0; left: 0; width: 100%; height: 100%; z-index:10;
    }
    .header-logo-wrapper {margin-top:120px; width:100%; text-align: center;}

    .header-message {
        position: relative;
        font-family: 'Raleway', 'Helvetica', sans-serif;
        font-size: 3em;
        margin-top:80px;
        width: 100%;
        color: white;
    }
    .head-transition {
        width: 100%; position: absolute;
        text-align: center; transform: translateY(0px);
        opacity: 1; transition: all 0.4s ease-out;
    }
    .head-enter, .head-leave {opacity: 0;}
    .head-enter {transform: translateY(20px);}
    .head-leave {transform: translateY(-40px);}

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
    .bt-login {background-color: #A493C6;}
    .bt-example {background-color: #E0E3DA;}
    .bt-dz-logo {margin-left: 8px; margin-top: 5px; width: 80px;}
    .header-bt-wrapper em {font-style: normal; font-size:0.9em; opacity: 0.6;}
    .header-about-link {
        position: absolute; bottom: 20px;
        width: 100%; text-align: center;
        font-family: 'Raleway', 'Helvetica', sans-serif;
        color: #FFFFE9; font-style: italic;
    }

</style>
