<template>
    <div class="modal-inner">
        <h2 class="modal-title">{{locale === 'fr' ? 'Partager' : 'Share'}}</h2>
        <div class="modal-scroll">
            <div id="mc-wrapper">
                <canvas id="mycanvas"></canvas>
            </div>
            <div class="share-infos">
                
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import {drawShare} from '../../vuex/draw_actions'

export default {
    replace: true,
    vuex: {
        getters: {
            locale: state => state.locale
        },
        actions: {drawShare}
    },
    ready: function () {
        this.drawShare('mc-wrapper', 'mycanvas')
    }
}
</script>

<style>
    #mc-wrapper {
        position: absolute; left: 10%; top: 50%; transform: translate(0, -50%);
        width: 75vh; height: 75vh; max-width: 100%; max-height: 100%;
    }
    #my-canvas {width: 100%; height: 100%;}

    @media (max-width: 1024px) {
        #mc-wrapper {left: 0;}
    }

</style>
