<template>
    <div class="player-wrapper" v-bind:style="{height: toppad + 'px'}">
        hey guys how are you ?!
        <button type="button" name="button" v-on:click="playSong(3135556)">Play Daft Punk</button>
    </div>
</template>

<script type="text/javascript">
import deezer from '../../deezer'

export default {
    replace: true,
    props: ['toppad'],
    vuex: {
        getters: {
            currentEvent: (state) => state.currentEvent
        }
    },
    methods: {
        playSong: function (song) {deezer.playSong(song)}
    }
}

</script>

<style>

.player-wrapper {
    z-index: 99; overflow:hidden;
    position: fixed; top:0; right: 0;
    margin: 0; padding: 0;
    width: 30px; transition: width 0.1s ease;
    background-color: yellow;
    /*opacity: 0.5;*/
}
.player-wrapper button {z-index: 99; width: 100%; height: 30px;}
.sidebar-wrapper:hover .player-wrapper {width:200px}

</style>
