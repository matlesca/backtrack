<template>
    <a class="timeline-step-wrapper" v-bind:style="styleObject" v-on:click.prevent="clickEvent(event)" v-bind:class="{'selected': currentEvent === event}">
        <span class="timeline-date">{{date_formated}}</span>
    </a>
</template>

<script type="text/javascript">
import moment from 'moment'
import {clickEvent} from '../../vuex/actions'

export default {
    replace: true,
    props: ['event', 'pos', 'stepheight'],
    vuex: {
        getters: {
            currentEvent: (state) => state.currentEvent
        },
        actions: {clickEvent}
    },
    computed: {
        date_formated: function () {
            return moment(this.event.date, 'YYYY-MM-DD').format('ll')
        },
        styleObject: function () {
            return {'top': this.pos + 'px', 'height': this.stepheight + 'px'}
        }
    },
    created: function () {
        moment.locale(window.navigator.userLanguage || window.navigator.language)
    }
}

</script>

<style>

.timeline-step-wrapper {
    position: absolute; display: block;
    text-align: center;
    white-space: nowrap; text-decoration: none;
    top:100px; width:100%;
    background-color: rgba(200, 190, 225, 0.6);
}
.timeline-step-wrapper:hover {background-color: rgba(203, 170, 228, 0.6);}
.timeline-step-wrapper:hover .timeline-date {text-decoration: underline; cursor: pointer;}
.timeline-step-wrapper.selected {background-color: rgba(203, 170, 228, 0.6);}
.timeline-step-wrapper.selected .timeline-date {text-decoration: none; cursor: default;}

.timeline-date {
    opacity:0; transition: opacity 0.1s;
    color: #364559; font-size: 14pt;
    font-family: 'Roboto', 'Helvetica', sans-serif;
    font-style: italic;
}
.timeline-wrapper:hover .timeline-date {opacity: 1;}

</style>
