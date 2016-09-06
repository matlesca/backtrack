<template>
    <div class="modal-wrapper" v-if="currentModal">
        <!-- v-bind:style="{background: 'linear-gradient(to bottom, #E0E3DA 50%,' + bckCol + ')'}" -->
        <div class="modal-color"></div>
        <a class="modal-btn-close" v-on:click="setCurrentModal(false)">
            <svg viewBox="0.5 0 500 500">
                <polygon points="435.787,0 250.806,184.982 65.213,0 0.5,64.713 186.092,249.694 0.5,435.287 65.213,500 250.806,314.408 435.787,500 500.5,435.287 315.518,249.694 500.5,64.713 	"/>
            </svg>
        </a>
        <about v-if="currentModal === 'about'"></about>
        <addev-news v-if="currentModal === 'addevNews'"></addev-news>
    </div>
    <div class="modal-overlay" v-if="currentModal" v-on:click="setCurrentModal(false)"></div>
</template>

<script type="text/javascript">
import {setCurrentModal} from '../../vuex/ui_actions'
import about from './about.vue'
import addevNews from './addevNews.vue'

export default {
    replace: true,
    components: {about, 'addev-news': addevNews},
    vuex: {
        actions: {setCurrentModal},
        getters: {
            currentModal: state => state.currentModal,
            bckCol: state => state.bckCol
        }
    },
    methods: {
        // f
    }
}

</script>

<style>

.modal-wrapper {
    position: fixed; top: 50%; left: 50%; z-index: 1100;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    /*color: ;*/
    /*background-color: #6e7886;*/
    background-color: #838e9d;
    box-shadow: 0 0 50px 0 #282828;
    width: 95%; max-width: 900px;
    display: block;
    height: 95%; max-height: 600px;
    overflow: hidden;
}
.modal-color {
    /*background-color: #E0E3DA;*/
    width: 100%; height: 100%;
    opacity: 0.5;
}
.modal-inner {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    font-family: 'Roboto', 'Helvetica', sans-serif;
    overflow: hidden;
}
.modal-title {
    position:absolute; z-index: 3000; width: 100%;
    text-align:center; margin: 0; padding: 15px 0 15px 0;
    color: #E0E3DA;
    background-color: #6e7886;
    font-family: 'Raleway', 'Helvetica', sans-serif;
    font-size: 1.6em; font-style: italic;
}
.modal-scroll {
    position: absolute; top: 60px; bottom: 0; left: 20px; right: 20px;
    z-index: 1000;
    overflow-y: auto;
}
.modal-logo {
    position: absolute; bottom: -13%; right: -9%;
    z-index: 0;
    max-width: 80%; height: 60%;
}
.modal-logo path, .modal-logo text {fill: #6e7886;}
.modal-search-filters {
    position: absolute; margin-top: 50px; z-index: 2000;
    width: 100%; height: 30px; text-align: center; padding: 10px;
    overflow: visible;
    border-bottom: 3px dotted #838e9d;
    background-color: #d6cde4;
    /*box-shadow: 0 0 10px 5px #6e7886;*/
}
.modal-overlay {
    position: fixed; z-index: 1000;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: #282828;
    opacity: 0.8;
}
.modal-btn-close {
    position: absolute; top: 15px; right: 15px;
    width: 15px; height: 15px; z-index: 5000;
    cursor: pointer;
}
.modal-btn-close polygon {fill: #E0E3DA;}
.modal-footer {
    position: absolute; bottom: 0; z-index: 2000;
    background-color: #6e7886;
    width: 100%; height: 23px; padding: 10px 0;
    /*border-top: 3px solid #6e7886;*/
    /*box-shadow: 0 0 10px 5px #6e7886;*/
}
.modal-footer-caption {
    position: absolute; bottom: 13px; right: 100px;
    color: #E0E3DA; opacity: 0.8;
}
.modal-validate-btn {
    position: absolute; right: 20px; bottom: 10px;
    padding: 3px 15px; background-color: #A493C6;
    border-radius: 2px;
}

</style>
