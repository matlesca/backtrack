<template>
    <div class="modal-wrapper" v-if="currentModal" transition="modal-main">
        <!--  -->
        <div class="modal-color" v-bind:style="{backgroundColor: bckCol}"></div>
        <a class="modal-btn-close" v-on:click="setCurrentModal(false)">
            <svg viewBox="0.5 0 500 500">
                <polygon points="435.787,0 250.806,184.982 65.213,0 0.5,64.713 186.092,249.694 0.5,435.287 65.213,500 250.806,314.408 435.787,500 500.5,435.287 315.518,249.694 500.5,64.713 	"/>
            </svg>
        </a>
        <about v-if="currentModal === 'about'"></about>
        <share v-if="currentModal === 'share'"></share>
        <addev-news v-if="currentModal === 'addevNews'"></addev-news>
        <addev-dates v-if="currentModal === 'addevDates'"></addev-dates>
    </div>
    <div class="modal-overlay" v-if="currentModal" transition="modal-overlay" v-on:click="setCurrentModal(false)"></div>
</template>

<script type="text/javascript">
import {setCurrentModal} from '../../vuex/ui_actions'
import about from './about.vue'
import share from './share.vue'
import addevNews from './addevNews.vue'
import addevDates from './addevDates.vue'

export default {
    replace: true,
    components: {about, share, 'addev-news': addevNews, 'addev-dates': addevDates},
    vuex: {
        actions: {setCurrentModal},
        getters: {
            currentModal: state => state.currentModal,
            bckCol: state => state.bckCol
        }
    },
    methods: {
        pressEscape: function (ev) {
            if (ev.keyCode === 27) {
                this.setCurrentModal(false)
            }
        }
    },
    created: function () {
        window.addEventListener('keyup', this.pressEscape)
    },
    beforeDestroy: function () {
        window.removeEventListener('keyup', this.pressEscape)
    }
}

</script>

<style>

.modal-wrapper {
    display: block; position: fixed; top: 50%; left: 50%; z-index: 1100;
    transform: translate(-50%, -50%);
    background-color: #3F3F3F; border-radius: 6px; box-shadow: 0 0 50px 0 #282828;
    width: 90%; height: 90%; overflow: hidden;
}
.modal-main-transition {opacity: 1; transform: translate(-50%, -50%); transition: all 0.2s ease-out;}
.modal-main-enter, .modal-main-leave {transform: translate(-50%, -40%); opacity: 0;}
.modal-overlay-transition {opacity: 0.8; transition: opacity 0.2s ease-out;}
.modal-overlay-enter, .modal-overlay-leave {opacity: 0}
.modal-color {
    /*background-color: #E0E3DA;*/
    width: 100%; height: 100%;
    opacity: 0.2;
}
.modal-overlay {
    position: fixed; z-index: 1000;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: #282828;
}
.modal-overlay.shown {opacity: 0.8;}
.modal-inner {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    font-family: 'Roboto', 'Helvetica', sans-serif;
    overflow: hidden;
}
.modal-title {
    position:absolute; z-index: 3000; width: 100%; height: 30px;
    margin: 0; padding: 15px 0 15px 30px;
    color: #E0E3DA;
    border-bottom: 3px dotted #838e9d;
    font-family: 'Raleway', 'Helvetica', sans-serif;
    font-size: 1.6em; font-style: italic; font-weight: normal;
}
.modal-scroll {
    position: absolute; top: 63px; bottom: 0; left: 20px; right: 20px;
    z-index: 1000;
    overflow-y: auto;
}
.modal-logo {
    position: absolute; bottom: -13%; right: -9%;
    z-index: 0;
    max-width: 80%; height: 60%;
}
.modal-logo path, .modal-logo text {fill: #6e7886;}
.modal-search {
    position: absolute; z-index: 3500;
    top: 0px; bottom: 0px; right: 100px; width: 50%; max-width: 400px; margin: 10px 0;
    background-color: rgba(200, 190, 225, 0.2);
    border-radius: 20px;
    overflow: hidden;
}
.modal-search-input {
    position: absolute; top: 0; bottom: 0; left: 40px; max-width: 95%;
    display: block; outline: none; color: #E0E3DA; width: auto; height: auto;
    background: transparent; border: none;
    font-size: 0.8em; font-family: 'Roboto', 'Helvetica', sans-serif;
}
.modal-btn-close {
    position: absolute; top: 15px; right: 15px;
    width: 15px; height: 15px; z-index: 5000;
    cursor: pointer;
}
.modal-btn-close polygon {fill: #E0E3DA;}

.modal-search .search-logo {
    position: absolute; top: 25%; left: 10px;
    height: 50%;
    fill: #E0E3DA;
}

.modal-validate-btn {
    position: absolute; right: 20px; bottom: 10px;
    padding: 3px 15px; background-color: #A493C6;
    border-radius: 2px;
}

@media (max-width: 1024px) {
    .modal-wrapper {width: 95%; height: 95%;}
    .modal-scroll {left: 10px; right: 10px;}
}
@media (max-width: 800px) {
    .modal-title-title {display: none;}
    .modal-search {width: 80%; right: 15%;}
}

</style>
