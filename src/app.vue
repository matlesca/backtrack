<template>
    <div class="main-wrapper">
        <navbar :loading="loading" v-on:loading-switch="loadingSwitched"></navbar>


        <timeline :events="events" :currentevent="currentEvent" :loading="loading" v-on:event-select="eventSelected"></timeline>

        <!-- <br><button type="button" name="button" v-on:click="loginDeezer()">Loggin to Deezer</button>
        <br><button type="button" name="button" v-on:click="getLastSongs()">Load 50 last played songs</button>
        <ul>
        <li v-for="song in lastSongs">{{song.title}} played on the : {{song.date}}</li>
    </ul> -->

    <cosmos :events="events" :currentevent="currentEvent"></cosmos>

    <!-- DEEZER root info place -->
    <div id="dz-root"></div>

</div>
</template>

<script>
import timeline from './timeline/timeline.vue'
import cosmos from './cosmos/cosmos.vue'
import deezer from './deezer.js'
import navbar from './navbar.vue'
import loadEvents from './events.json'

export default {
    replace: false,
    components: {timeline, cosmos, navbar},
    methods: {
        loginDeezer: deezer.login,
        eventSelected: function (event) {
            this.currentEvent = event
        },
        loadingSwitched: function (event) {
            this.loading = event
        },
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
        },
        play: function () {
            // deezer.playSong(3135556)
        }
    },
    ready: function () {
        deezer.init(this.play)
        // this.currentEvent = this.events[0]
    },
    data () {
        return {
            currentEvent: {},
            lastSongRank: 0,
            lastSongs: '',
            featArtist: '',
            toDay: false,
            delta: 0,
            maxDate: 0,
            events: loadEvents,
            loading: false
        }
    }
}
</script>

<style>
.main-wrapper {
    position: absolute; top:0; left: 0;
    margin:0; padding:0; width: 100%; height:100%;
    overflow: hidden;
    /*padding-top: 90px;*/
    background-color: #282828;
}


</style>
