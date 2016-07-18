<template>
    <navbar></navbar>
    <sidebar></sidebar>

    <!-- <br><button type="button" name="button" v-on:click="loginDeezer()">Loggin to Deezer</button>
    <br><button type="button" name="button" v-on:click="getLastSongs()">Load 50 last played songs</button>
    <ul>
    <li v-for="song in lastSongs">{{song.title}} played on the : {{song.date}}</li>
    </ul> -->

    <cosmos></cosmos>

    <songs-tab></songs-tab>

</template>

<script>
import sidebar from './sidebar/sidebar.vue'
import cosmos from './cosmos/cosmos.vue'
import navbar from './navbar.vue'
import songsTab from './songsTab.vue'
import {setAppLoading} from '../vuex/ui_actions'

export default {
    replace: false,
    components: {sidebar, cosmos, navbar, 'songs-tab': songsTab},
    vuex: {
        getters: {events: (state) => state.events},
        actions: {setAppLoading}
    },
    methods: {

    },
    data () {
        return {
            currentEvent: {},
            userData: {},
            lastSongRank: 0,
            lastSongs: '',
            featArtist: '',
            toDay: false,
            delta: 0,
            maxDate: 0
        }
    }
}
</script>
