<template>
    <event-grid v-for="event in events" :event="event" :index="$index" :cosmos="myCosmos" :zpos="getZPos(event.date)"></event-grid>

    <div class="month-label" v-for="label in monthLabels" v-bind:id="label.elemId">
        {{label.text}}
    </div>

    <div v-bind:id="startTooltip.elemId">
        {{startTooltip.text}} &rarr;
    </div>

    <div class="cosmos-main"></div>

</template>

<script type="text/javascript">
import Cosmos from './cosmosRendering.js'
import eventGrid from './eventGrid.vue'
import moment from 'moment'

export default {
    // replace: false,
    components: {'event-grid': eventGrid},
    props: ['events', 'currentevent'],
    methods: {
        getZPos: function (date) {
            // Scales a date to its cosmos zpos (proportionally with the events dates distribution)
            return Math.floor(this.param.startPos + this.param.minZGap * moment(date).diff(this.evDates.dates[0], 'days') / this.evDates.minGap)
        },
        initTooltip: function () {
            if (this.locale === 'fr') {
                this.startTooltip.text = 'Pour commencer, choisis une date dans la barre latérale'
                this.startTooltip.xpos = -130
                this.startTooltip.ypos = 300
            } else {
                this.startTooltip.text = 'Start by choosing a date in the sidebar'
                this.startTooltip.xpos = -300
                this.startTooltip.ypos = 300
            }
            this.myCosmos.addLabels([this.startTooltip])
        }
    },
    watch: {
        currentevent: function (newVal) {
            this.myCosmos.moveTo(this.getZPos(newVal.date))

        }
    },
    computed: {
        evDates: function () {
            var retObj = {}
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
            return retObj
        },
        monthLabels: function () {
            // Check all the days between the first and last events to display month names
            var daysTab = []
            moment.locale(this.locale)
            if (this.events.length > 1) {
                // Increment dayInc to find out all the months covered
                var dayInc = this.evDates.dates[0]
                daysTab.push(dayInc)
                for (var ii = 1; ii < this.evDates.nbDays; ii++) {
                    if (!daysTab[daysTab.length - 1].isSame(dayInc.clone().add(ii, 'days'), 'month')) {
                        daysTab.push(dayInc.clone().add(ii, 'days'))
                    }
                }
            }
            return daysTab.map((date, ii) => {
                return {
                    'elemId': 'month-label-' + ii,
                    'xpos': -400,
                    'ypos': 350,
                    'zpos': this.getZPos(date),
                    'text': date.format('MMMM YYYY')
                }
            })
        }
    },
    ready: function () {
        this.myCosmos = new Cosmos('.cosmos-main')
        this.myCosmos.init(this.getZPos(this.evDates.lastDate))
        this.initTooltip()
        this.myCosmos.addLabels(this.monthLabels)
    },
    data () {
        return {
            param: {startPos: 1000, minZGap: 2000},
            myCosmos: {},
            startTooltip: {'elemId': 'start-tooltip', 'xpos': 0, 'ypos': 0, 'zpos': 500, 'text': ''},
            eventsReady: [],
            locale: window.navigator.userLanguage || window.navigator.language
        }
    }
}

</script>

<style>
.cosmos-main {
    width: 100%; height: 100%;
    overflow: hidden;
}

.month-label {
    font-size: 80px;
    color: #ffffff;
    opacity: 0;
    text-transform: capitalize;
    font-family: 'Roboto', 'Helvetica', sans-serif
}
#start-tooltip {
    font-size: 40px;
    color: #ffffff;
    opacity: 1;
    font-family: 'Roboto', 'Helvetica', sans-serif
}

</style>
