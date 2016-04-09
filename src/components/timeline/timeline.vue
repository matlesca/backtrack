<template>
    <div class="timeline-wrapper" v-bind:class="{'is-loading': appLoading}">
        <div class="timeline-main" v-bind:style="{height: renderHeight + 'px'}">
            <timeline-tick v-for="tick in ticks" :tick="tick"></timeline-tick>
            <timeline-triangle :pos="trianglepos" :stepheight="param.stdStepHeight"></timeline-triangle>
            <timeline-step v-for="event in events" :event="event" :pos="evPos[$index]" :stepheight="param.stdStepHeight"></timeline-step>
            <div class="player-wrapper" v-bind:style="{height: param.topPadding + 'px'}">
                <button type="button" name="button" v-on:click="playSong(3135556)">Play Daft Punk</button>
            </div>
            <div class="timeline-gradient"></div>

        </div>
    </div>


</template>

<script type="text/javascript">
import moment from 'moment'
import deezer from '../../deezer'
import timelineStep from './timelineStep.vue'
import timelineTriangle from './timelineTriangle.vue'
import timelineTick from './timelineTick.vue'

export default {
    replace: true,
    components: {'timeline-step': timelineStep, 'timeline-triangle': timelineTriangle, 'timeline-tick': timelineTick},
    vuex: {
        getters: {
            appLoading: (state) => state.appLoading,
            currentEvent: (state) => state.currentEvent,
            events: (state) => state.events
        }
    },
    methods: {
        playSong: function (song) {deezer.playSong(song)},
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
                    if (this.getEvent(firstDate.clone().add(ii - 1, 'days'))) {
                        // If there is an event step at the previous tick
                        ticks.push({'date': firstDate.clone().add(ii, 'days').format('YYYY-MM-DD'), 'pos': ticks[ii - 1].pos + this.param.stdStepHeight})
                    } else {
                        ticks.push({'date': firstDate.clone().add(ii, 'days').format('YYYY-MM-DD'), 'pos': ticks[ii - 1].pos + tickSpacing})
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
            if (this.currentEvent) {
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
            param: {stdTickSpacing: 6, stdStepHeight: 25, topPadding: 50},
            renderHeight: 0,
            evPos: [],
            ticks: []
        }
    }
}

</script>

<style>
.timeline-wrapper {
    z-index: 999;
    overflow-x: hidden; overflow-y: scroll;
    position: fixed; top:0; right:0;
    width: 200px; height:100%;
    background-color: none;
}
.timeline-main {
    position: absolute; right:0;
    width: 30px; min-height:100%; margin:0; padding: 0;
    transition: width 0.1s ease;
    background-color: #576271;
}
.timeline-wrapper:hover .timeline-main {width:100%;}
.timeline-gradient {
    display:none;
    width:100%; height:200%;
    top:0;transform:translateY(-50%);
    background: linear-gradient(0deg, #576271, #A493C6, #576271);
    background-size: 100% 50%;
    animation: movegrad 0.8s linear infinite;
}
.timeline-wrapper.is-loading .timeline-gradient {display: block;}
.timeline-wrapper.is-loading .timeline-step-wrapper {display: none;}

.player-wrapper {
    position: absolute;
    width: 100%;
    background-color: yellow;
    /*opacity: 0.5;*/
}


@keyframes movegrad {
    0% {transform: translateY(-50%);}
    100% {transform: translateY(0%);}
}

</style>
