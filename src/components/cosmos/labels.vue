<template>
    <div class="month-label" v-for="label in monthLabels" v-bind:id="label.elemId">
        {{label.text}}
    </div>
    <div v-bind:id="startTooltip.elemId">
        {{startTooltip.text}} &rarr;
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
    replace: true,
    props: ['cosmos', 'evdates', 'param'],
    methods: {
        getZPos: function (date) {
            // Scales a date to its cosmos zpos (proportionally with the events dates distribution)
            return Math.floor(this.param.startPos + this.param.minZGap * moment(date).diff(this.evdates.dates[0], 'days') / this.evdates.minGap)
        }
    },
    watch: {
        cosmos: function () {
            if (!this.loaded && this.cosmos) {
                this.cosmos.addLabels(this.monthLabels)
                if (this.locale === 'fr') {
                    this.startTooltip.text = 'Pour commencer, choisis une date dans la barre latérale'
                    this.startTooltip.xpos = -130
                } else {
                    this.startTooltip.text = 'Start by choosing a date in the sidebar'
                }
                this.cosmos.addLabels([this.startTooltip])
                this.loaded = true
            }
        }
    },
    computed: {
        monthLabels: function () {
            // Check all the days between the first and last events to display month names
            var daysTab = []
            moment.locale(this.locale)
            if (this.evdates.dates.length > 1) {
                // Increment dayInc to find out all the months covered
                var dayInc = this.evdates.dates[0]
                daysTab.push(dayInc)
                for (var ii = 1; ii < this.evdates.nbDays; ii++) {
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
    data () {
        return {
            startTooltip: {'elemId': 'start-tooltip', 'xpos': -300, 'ypos': 300, 'zpos': 500, 'text': ''},
            locale: window.navigator.userLanguage || window.navigator.language,
            loaded: false
        }
    }
}

</script>

<style>

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
