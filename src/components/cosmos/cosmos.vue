<template>
    <labels :getzpos="getZPos" :cosmos="myCosmos" :param="param"></labels>
    <event-grid :cosmos="myCosmos" :zpos="getZPos(currentDate)"></event-grid>

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
            currentDate: (state) => state.currentDate,
            dateBounds: (state) => {
                return {first: moment(state.dateBounds.first, 'YYYY-MM-DD'), last: moment(state.dateBounds.last, 'YYYY-MM-DD')}
            },
            bckCol: (state) => state.bckCol,
            randKey: (state) => state.randKey
        },
        actions: {setMoving}
    },
    methods: {
        getZPos: function (date) {
            // Scales a date to its cosmos zpos (proportionally with the first/last listenened dates)
            const fromLast = this.dateBounds.last.diff(moment(date, 'YYYY-MM-DD'), 'days')
            // console.log(date)
            const fromFirst = moment(date, 'YYYY-MM-DD').diff(moment(this.dateBounds.first, 'YYYY-MM-DD'), 'days')
            let retVal
            if (fromFirst >= 0 && fromLast >= 0) {
                retVal = Math.floor(this.param.startPos + this.param.cosmosDepth * fromLast / (fromFirst + fromLast))
            } else {
                retVal = Math.floor(this.param.startPos)
            }
            return retVal
        }
    },
    watch: {
        currentDate: function (newVal) {
            if (newVal) {
                this.setMoving(true)
                this.myCosmos.moveTo(this.getZPos(newVal)).then(() => {this.setMoving(false)})
            }
        }
    },
    ready: function () {
        this.setMoving(false)
        this.myCosmos = new Cosmos('.cosmos-main', this.bckCol, this.randKey)
        this.myCosmos.init(this.param.cosmosDepth, false, Math.floor(this.param.cosmosDepth / 60))
    },
    data () {
        return {
            param: {startPos: 1000, minZGap: 2000, cosmosDepth: 10000},
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