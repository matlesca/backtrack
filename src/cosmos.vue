<template>
    <div class="cosmos-main"></div>
    <div class="event-grid-wrapper" v-show="showGrids" v-for="grid in computeGrids" v-bind:id="'event-grid-wrapper' + $index">
        <div class="event-grid" v-bind:id="'event-grid-' + $index">
            <div class="event-panel" v-for="panel in grid.panels" v-bind:style="panel.styleObj">
                <span v-if="panel.type === 'text'">{{panel.text}}</span>
                <img class="event-panel-img" v-if="panel.type === 'image'" v-bind:src="panel.src"/>
            </div>
        </div>
    </div>

    <div class="month-label" v-show="showLabels" v-for="label in monthLabels" v-bind:id="'month-label-' + $index">
        {{label.text}}
    </div>

</template>

<script type="text/javascript">
import Cosmos from './cosmosRendering.js'
import moment from 'moment'
import Masonry from 'masonry-layout'

export default {
    // replace: false,
    components: {},
    props: ['events', 'currentevent'],
    methods: {
        getZPos: function (date) {
            // Scales a date to its cosmos zpos (proportionally with the events dates distribution)
            return Math.floor(this.param.startPos + this.param.minZGap * moment(date).diff(this.evDates.dates[0], 'days') / this.evDates.minGap)
        },
        initMasonry: function () {
            for (var ii = 0; ii < this.events.length; ii++) {
                this.masonrys.push(new Masonry('#event-grid-' + ii, {itemSelector: '.event-panel', columnWidth: 10}))
            }
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
            return daysTab.map(function (date) {
                return {
                    'zpos': this.getZPos(date),
                    'text': date.format('MMMM YYYY')
                }
            }.bind(this))
        },
        computeGrids: function () {
            var ii, jj, retTab, retObj, textLocale
            retTab = []
            moment.locale(this.locale)
            if (this.locale === 'fr') {textLocale = 'fr'} else {textLocale = 'en'}
            // textLocale = 'en'
            for (ii = 0; ii < this.events.length; ii++) {
                retObj = {}
                retObj.zpos = this.getZPos(this.events[ii].date)
                retObj.panels = []
                // Event title panel :
                retObj.panels.push({
                    'type': 'text',
                    'text': this.events[ii].title[textLocale],
                    'styleObj': {
                        'color': 'black',
                        'backgroundColor': 'rgb(' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ')',
                        'fontFamily': 'Times New Roman, Times, serif',
                        'fontSize': 70 - Math.min(40, Math.round(this.events[ii].title[textLocale].length - 25 + 20 * Math.random())) + 'px',
                        'fontWeight': 'bold',
                        'fontStyle': 'italic',
                        'maxWidth': Math.round(20 + 20 * Math.random()) + '%',
                        'margin': Math.round(5 + 3 * Math.random()) + 'px'
                    }
                })
                // Event date panel :
                retObj.panels.push({
                    'type': 'text',
                    'text': moment(this.events[ii].date).format('L'),
                    'styleObj': {
                        'color': '#ffffff',
                        'backgroundColor': 'transparent',
                        'fontSize': 90 - Math.round(30 * Math.random()) + 'px',
                        'maxWidth': '100%',
                        'margin': Math.round(5 + 3 * Math.random()) + 'px'
                    }
                })
                // Other image/text panels :
                for (jj = 0; jj < this.events[ii].panels.length; jj++) {
                    var randVal = Math.random()
                    if (this.events[ii].panels[jj].type === 'text') {
                        retObj.panels.push({
                            'type': 'text',
                            'text': this.events[ii].panels[jj].text[textLocale],
                            'styleObj': {
                                'color': randVal < 0.5 ? 'white' : 'black',
                                'backgroundColor': randVal < 0.5 ? 'transparent' : 'rgb(' + (255 - Math.round(100 * randVal)) + ',' + (255 - Math.round(100 * randVal)) + ',' + (255 - Math.round(100 * randVal)) + ')',
                                'fontSize': Math.round(18 + 4 * Math.random()) + 'px',
                                'fontFamily': 'Roboto, Helvetica, sans-serif',
                                'maxWidth': Math.round(30 + 15 * Math.random()) + '%',
                                'margin': Math.round(5 + 3 * Math.random()) + 'px'
                            }
                        })
                    }
                    if (this.events[ii].panels[jj].type === 'image') {
                        retObj.panels.push({
                            'type': 'image',
                            'src': this.events[ii].panels[jj].src,
                            'styleObj': {
                                'backgroundColor': randVal < 0.5 ? 'transparent' : 'rgb(' + (255 - Math.round(100 * randVal)) + ',' + (255 - Math.round(100 * randVal)) + ',' + (255 - Math.round(100 * randVal)) + ')',
                                'maxWidth': Math.round(30 + 10 * Math.random()) + '%',
                                'padding': Math.round(5 + 5 * Math.random()) + 'px',
                                'margin': Math.round(5 + 3 * Math.random()) + 'px'
                            }
                        })
                    }
                }
                // Empty panels :
                // for (var rr = 0; rr < 4; rr++) {
                //     if (Math.random() > 0.3) {
                //         retObj.panels.push({
                //             'type': 'empty',
                //             'styleObj': {
                //                 'backgroundColor': 'transparent',
                //                 'width': (10 + Math.round(20 * Math.random())) + '%',
                //                 'height': (5 + Math.round(10 * Math.random())) + '%'
                //             }
                //         })
                //     }
                // }
                // Sort randomly panels :
                retObj.panels.sort(function () {return Math.random() > 0.5})
                retTab.push(retObj)
            }
            return retTab
        }
    },
    ready: function () {
        this.myCosmos = new Cosmos('.cosmos-main')
        this.myCosmos.init(this.computeGrids[this.computeGrids.length - 1].zpos)
        this.myCosmos.addMonthLabels(this.monthLabels).then(function () {this.showLabels = true}.bind(this))
        this.myCosmos.addGrids(this.computeGrids).then(function () {this.showGrids = true}.bind(this))
        window.setTimeout(this.initMasonry, 1)
    },
    data () {
        return {
            myCosmos: {},
            masonrys: [],
            locale: window.navigator.userLanguage || window.navigator.language,
            showGrids: false,
            showLabels: false,
            param: {startPos: 1000, minZGap: 2000},
            currentDate: 0
        }
    }
}

</script>

<style>
.cosmos-main {
    width: 100%; height: 100%;
    overflow: hidden;
}
.event-grid-wrapper {
    width: 100%; height: 100%;
    padding-top:250px; opacity: 0
}
.month-label {
    font-size: 80px;
    color: #ffffff;
    text-transform: capitalize;
    font-family: 'Roboto', 'Helvetica', sans-serif
}
.event-panel-img {width: 100%; height: auto;}
</style>
