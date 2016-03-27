<template>
    <div class="timeline-tick" v-bind:style="styleTick">
        <div class="tick-left" v-bind:style="styleSideTick"></div>
        <span class="tick-info" v-bind:style="styleTickInfo">{{infoDate}}</span>
        <div class="tick-right" v-bind:style="styleSideTick"></div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
    replace: true,
    props: ['tick'],
    created: function () {
        // Setup the style objects depending on the tick date..
        var locale = window.navigator.userLanguage || window.navigator.language
        moment.locale(locale)
        var momDate = moment(this.tick.date, 'YYYY-MM-DD')
        this.styleTick = {top: this.tick.pos + 'px'}
        if (momDate.date() === 1 && momDate.month() === 0) {
            this.styleSideTick = {width: '60px'}
            this.styleTickInfo = {'font-size': '15pt', 'bottom': '-7px', 'font-weight': 'bold'}
            this.infoDate = momDate.format('YYYY')
        } else if (momDate.date() === 1) {
            this.styleSideTick = {width: '40px'}
            this.styleTickInfo = {'font-size': '11pt', bottom: '-6px'}
            this.infoDate = momDate.format('MMMM')
        } else if (momDate.day() === 1) {
            this.styleSideTick = {width: '30px'}
        } else {
            this.styleSideTick = {width: '20px'}
        }
    },
    data () {
        return {
            infoDate: ''
        }
    }
}

</script>

<style>
    .timeline-tick {
        position: absolute; display:none;
        left:0; width: 100%; height: 2px;
        text-align: center;
    }
    .timeline-wrapper:hover .timeline-tick {display: block;}
    .timeline-tick .tick-left, .timeline-tick .tick-right {position: absolute; top:0; height: 100%; background-color: #636b77;}
    .timeline-tick .tick-left {left: 0;}
    .timeline-tick .tick-right {right: 0;}
    .timeline-tick .tick-info {
        position: absolute; left:0; width: 100%; text-align:center;
        font-family: 'Roboto', 'Helvetica', sans-serif;
        text-transform: capitalize;
        font-style: italic; color: #737f8f;
    }

</style>
