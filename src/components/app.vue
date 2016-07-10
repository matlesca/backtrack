<template>
    <div class="main-wrapper">

        <router-view></router-view>

    </div>

    <!-- DEEZER root info place -->
    <div id="dz-root"></div>
</template>

<script>
import store from '../vuex/store'
import {init} from '../vuex/actions'

export default {
    replace: false,
    store,
    vuex: {
        actions: {init}
    },
    ready: function () {
        this.init()
    }
}

</script>

<style>
.main-wrapper {
    position: absolute; top:0; left: 0;
    margin:0; padding:0; width: 100%; height:100%;
    overflow: hidden;
    /*padding-top: 90px;*/
    background: #282828;
}


</style>
