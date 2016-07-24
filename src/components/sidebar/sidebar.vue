<template>
    <div class="sidebar-wrapper" v-bind:class="{'is-loading': appLoading}">
        <player :toppad="param.topPadding"></player>
        <div class="timeline-main" v-bind:style="{height: (renderHeight + 'px')}">
            <timeline-tick v-for="tick in ticks" :tick="tick" v-if="tick.important"></timeline-tick>
            <timeline-triangle :pos="trianglepos" :stepheight="param.stdStepHeight"></timeline-triangle>
            <timeline-step v-for="event in events" :event="event" :pos="evPos[$index]" :stepheight="param.stdStepHeight"></timeline-step>
        </div>
    </div>
    <div class="sidebar-gradient" v-bind:class="{'is-loading': appLoading}"></div>


</template>

<script type="text/javascript">
import moment from 'moment'
import timelineStep from './timelineStep.vue'
import timelineTriangle from './timelineTriangle.vue'
import timelineTick from './timelineTick.vue'
import player from './player.vue'

export default {
    replace: true,
    components: {'timeline-step': timelineStep, 'timeline-triangle': timelineTriangle, 'timeline-tick': timelineTick, player},
    vuex: {
        getters: {
            appLoading: (state) => state.appLoading,
            currentEvent: (state) => state.currentEvent,
            events: (state) => state.events.filter(ev => ev.visible),
            bckCol: state => state.bckCol
        }
    },
    methods: {
        getEvent: function (date) {
            for (var ii = 0; ii < this.events.length; ii++) {
                var evDate = moment(this.events[ii].date)
                if (evDate.diff(date, 'days') === 0) {
                    return this.events[ii]
                }
            }
            return null
        },
        getTick: function (date) {
            for (var ii = 0; ii < this.ticks.length; ii++) {
                var tickDate = moment(this.ticks[ii].date)
                if (tickDate.diff(date, 'days') === 0) {
                    return this.ticks[ii]
                }
            }
            return null
        },
        generateTicks: function () {
            return new Promise((resolve, reject) => {
                if (this.events.length > 1) {
                    var ii, firstDate, lastDate, totalHeight, wrapHeight, nbTicks, tickSpacing, ticks
                    // Find out the first and last events date
                    firstDate = lastDate = moment(this.events[0].date)
                    for (ii = 0; ii < this.events.length; ii++) {
                        var evDate = moment(this.events[ii].date)
                        if (firstDate.diff(evDate) > 0) {
                            firstDate = evDate
                        } else if (lastDate.diff(evDate) < 0) {
                            lastDate = evDate
                        }
                    }
                    if (firstDate.diff(lastDate, 'days') === 0) {
                        reject({'message': 'Can\'t place timeline ticks as all events have the same date'})
                    }
                } else {
                    reject({'message': 'Can\'t place timeline ticks as there is less than 2 events'})
                }
                // Space dates a bit..
                firstDate.subtract(10, 'days')
                lastDate.add(10, 'days')
                // Total height to be reached :
                totalHeight = this.param.stdStepHeight * this.events.length + this.param.stdTickSpacing * (lastDate.diff(firstDate, 'days') - this.events.length)
                wrapHeight = window.innerHeight - this.param.topPadding
                // Calculate the standard spacing between each tick
                nbTicks = lastDate.diff(firstDate, 'days')
                if (totalHeight < wrapHeight) {
                    if (nbTicks === this.events.length) {
                        // If by any chance there are as many events as ticks to be displayed !
                        tickSpacing = 0
                    } else {
                        tickSpacing = (wrapHeight - this.param.stdStepHeight * this.events.length) / (nbTicks - this.events.length)
                    }
                } else {
                    tickSpacing = this.param.stdTickSpacing
                }
                // Finally create ticks data
                ticks = []
                ticks.push({'date': firstDate.format('YYYY-MM-DD'), 'pos': this.param.topPadding})
                for (ii = 1; ii < nbTicks; ii++) {
                    var myDate = firstDate.clone().add(ii, 'days')
                    var important = false
                    if (myDate.date() === 1) {
                        important = true
                    }
                    if (this.getEvent(firstDate.clone().add(ii - 1, 'days'))) {
                        // If there is an event step at the previous tick
                        ticks.push({'date': myDate.format('YYYY-MM-DD'), 'pos': ticks[ii - 1].pos + this.param.stdStepHeight, 'important': important})
                    } else {
                        ticks.push({'date': myDate.format('YYYY-MM-DD'), 'pos': ticks[ii - 1].pos + tickSpacing, 'important': important})
                    }
                }
                resolve({'ticks': ticks, 'totalHeight': totalHeight + this.param.topPadding})
            })
        },
        generateEvPos: function () {
            var evPos = []
            for (var ii = 0; ii < this.events.length; ii++) {
                var tick = this.getTick(moment(this.events[ii].date))
                if (tick) {evPos.push(tick.pos)}
            }
            return evPos
        }
    },
    computed: {
        trianglepos: function () {
            if (this.currentEvent.date) {
                return this.evPos[this.events.indexOf(this.currentEvent)]
            } else {
                return 0
            }
        }
    },
    create: function () {
        // evPos initialisation
        for (var ii = 0; ii < this.events.length; ii++) {
            this.evPos.push(this.param.topPadding)
        }
    },
    ready: function () {
        this.generateTicks().then(success => {
            this.ticks = success.ticks
            this.renderHeight = success.totalHeight
            this.evPos = this.generateEvPos()
        }, (error) => {
            console.log(error.message)
        })
    },
    data () {
        return {
            param: {stdTickSpacing: 3, stdStepHeight: 25, topPadding: 80},
            renderHeight: 0,
            evPos: [],
            ticks: []
        }
    }
}

</script>

<style>
.sidebar-wrapper {
    z-index: 555;
    overflow: hidden;
    margin: 0; padding: 0;
    position: fixed; top:0; right:0;
    width: 200px; height:100%;
    background-color: none;
}
.sidebar-wrapper:hover {overflow-y: scroll; overflow-x: hidden;}
.timeline-main {
    position: absolute; right:0;
    overflow: hidden;
    width: 30px; min-height:100%; margin:0; padding: 0;
    transition: width 0.1s ease;
    background-color: #576271;
}
.sidebar-wrapper:hover .timeline-main {width:100%;}
.sidebar-gradient {
    z-index: 999;
    display:none; position: fixed; top:0; right: 0;
    width:30px; height: 200%;
    transform:translateY(-50%);
    background: linear-gradient(0deg, #576271, #A493C6, #576271);
    background-size: 100% 50%;
    animation: movegrad 0.8s linear infinite;
}
.sidebar-gradient.is-loading {display: block;}
.sidebar-wrapper.is-loading {display: none;}


@keyframes movegrad {
    0% {transform: translateY(-50%);}
    100% {transform: translateY(0%);}
}

</style>
