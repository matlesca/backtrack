<template>
    <navbar></navbar>
    <sidebar></sidebar>

    <!-- <br><button type="button" name="button" v-on:click="loginDeezer()">Loggin to Deezer</button>
    <br><button type="button" name="button" v-on:click="getLastSongs()">Load 50 last played songs</button>
    <ul>
    <li v-for="song in lastSongs">{{song.title}} played on the : {{song.date}}</li>
    </ul> -->

    <cosmos></cosmos>

</template>

<script>
import sidebar from './sidebar/sidebar.vue'
import cosmos from './cosmos/cosmos.vue'
import deezer from '../deezer.js'
import navbar from './navbar.vue'
import {accessPlay, setAppLoading} from '../vuex/actions'

export default {
    replace: false,
    components: {sidebar, cosmos, navbar},
    vuex: {
        getters: {events: (state) => state.events},
        actions: {accessPlay, setAppLoading}
    },
    // route: {
    //     data: function (transition) {
    //         if (transition.to.path === '/example') {
    //             this.setAppLoading(false)
    //             return true
    //         } else {
    //             return this.accessPlay().then().catch(function () {console.log('not connected..'); transition.redirect('/')})
    //         }
    //     }
    // },
    methods: {
        loginDeezer: deezer.login,
        getLastSongs: function () {
            if (!this.lastSongs) {
                this.lastSongs = []
            }
            deezer.getSongs(this.lastSongRank, 50).then(success => {
                var date
                for (var ii = 0; ii < success.length; ii++) {
                    date = new Date(success[ii].timestamp * 1000)
                    date = date.toLocaleDateString()
                    this.lastSongs.push({'title': success[ii].title, 'date': date})
                }
                this.lastSongRank += 50
            }, error => {
                console.log(error.message)
            })
        }
    },
    data () {
        return {
            currentEvent: {},
            deezer: deezer,
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
