<template>
    <div class="labels-wrapper">
        <div class="month-label" v-for="label in monthLabels" v-bind:id="label.elemId">
            {{label.text}}
        </div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
    replace: true,
    props: ['cosmos', 'param', 'getzpos'],
    vuex: {
        getters: {
            locale: state => state.locale,
            momentLocale: state => state.momentLocale,
            dateBounds: (state) => {return {first: moment(state.dateBounds.first), last: moment(state.dateBounds.last)}}
        }
    },
    watch: {
        cosmos: function () {
            if (!this.loaded && this.cosmos) {
                this.cosmos.addLabels(this.monthLabels)
                this.loaded = true
            }
        }
    },
    computed: {
        monthLabels: function () {
            // Check all the days between the first and last dates to display month names
            var daysTab = []
            let deltaDays = this.dateBounds.last.diff(this.dateBounds.first, 'days')
            moment.locale(this.momentLocale)
            if (deltaDays > 30) {
                // Increment dayInc to find out all the months covered
                var dayInc = this.dateBounds.first
                daysTab.push(dayInc)
                for (var ii = 1; ii < deltaDays; ii++) {
                    if (!daysTab[daysTab.length - 1].isSame(dayInc.clone().add(ii, 'days'), 'month')) {
                        daysTab.push(dayInc.clone().add(ii, 'days'))
                    }
                }
            }
            return daysTab.map((date, ii) => {
                return {
                    'elemId': 'month-label-' + ii,
                    'xpos': -200,
                    'ypos': 350,
                    'zpos': this.getzpos(date),
                    'text': date.format('MMMM YYYY')
                }
            })
        }
    },
    data () {
        return {
            loaded: false
        }
    }
}

</script>

<style>

.month-label {
    font-size: 85px;
    color: #A493C6;
    opacity: 0;
    text-transform: capitalize;
    font-family: 'Raleway', 'Helvetica', sans-serif;
}

</style>
