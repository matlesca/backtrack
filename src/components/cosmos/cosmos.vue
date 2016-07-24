<template>
    <event-grid v-for="event in events" :event="event" :index="$index" :cosmos="myCosmos" :zpos="getZPos(event.date)"></event-grid>
    <labels :evdates="evdates" :cosmos="myCosmos" :param="param"></labels>

    <div class="cosmos-main"></div>

</template>

<script type="text/javascript">
import Cosmos from './cosmosRendering.js'
import eventGrid from './eventGrid.vue'
import labels from './labels.vue'
import moment from 'moment'
import {setMoving} from '../../vuex/ui_actions'

export default {
    // replace: false,
    components: {'event-grid': eventGrid, labels},
    vuex: {
        getters: {
            events: (state) => state.events.filter(ev => ev.visible),
            currentEvent: (state) => state.currentEvent,
            bckCol: (state) => state.bckCol,
            randKey: (state) => state.randKey
        },
        actions: {setMoving}
    },
    methods: {
        getZPos: function (date) {
            // Scales a date to its cosmos zpos (proportionally with the events dates distribution)
            if (this.evdates.dates.length) {
                return Math.floor(this.param.startPos + this.param.minZGap * moment(date).diff(this.evdates.dates[0], 'days') / this.evdates.minGap)
            } else {
                return Math.floor(this.param.startPos)
            }
        }
    },
    watch: {
        currentEvent: function (newVal) {
            this.setMoving(true)
            this.myCosmos.moveTo(this.getZPos(newVal.date)).then(() => {this.setMoving(false)})
        }
    },
    computed: {
        evdates: function () {
            var retObj = {lastDate: moment(), dates: [], minGap: 1, nbDays: 1}
            if (this.events.length) {
                retObj.dates = this.events.map(function (event) {return moment(event.date, 'YYYY-MM-DD')}).sort(function (a, b) {return a.isAfter(b, 'day')})
                // minGap is the smallest time gap between events (in number of days)
                if (this.events.length === 1) {retObj.minGap = 1} else {
                    retObj.minGap = retObj.dates[1].diff(retObj.dates[0], 'days')
                    for (var ii = 1; ii < retObj.dates.length; ii++) {
                        var diff = retObj.dates[ii].diff(retObj.dates[ii - 1], 'days')
                        if (diff < retObj.minGap) {retObj.minGap = diff}
                    }
                }
                // Number of days between the first and last event dates
                retObj.nbDays = retObj.dates[retObj.dates.length - 1].diff(retObj.dates[0], 'days') + 1
                retObj.lastDate = retObj.dates[retObj.dates.length - 1]
            }
            return retObj
        }
    },
    ready: function () {
        var depth = this.getZPos(this.evdates.lastDate)
        this.myCosmos = new Cosmos('.cosmos-main', this.bckCol, this.randKey)
        this.myCosmos.init(depth, false, Math.floor(depth / 60))
    },
    data () {
        return {
            param: {startPos: 1000, minZGap: 2000},
            myCosmos: {}
        }
    }
}

</script>

<style>
.cosmos-main {
    width: 100%; height: 100%;
    overflow: hidden;
}

</style>
