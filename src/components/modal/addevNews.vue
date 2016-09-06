<template>
    <div class="modal-inner evsmodal">
        <h1 class="modal-title">Add event from the news</h1>
        <div class="modal-search-filters">
            <!-- <div class="modal-search-date">
                <input type="text" id="datepicker">
            </div> -->
        </div>
        <div class="modal-scroll">
            <news-event-card v-for="event in displayEvents" :event="event"></news-event-card>
        </div>
        <!-- <svg class="modal-logo" viewBox="0 0 760.32 760.32">
            <path d="M701.244,0H59.077C26.521,0,0,26.519,0,59.075v642.169c0,32.557,26.521,59.076,59.077,59.076h326.521h150.9h164.747
                c32.554,0,59.075-26.52,59.075-59.076V59.075C760.32,26.519,733.799,0,701.244,0z M424.32,721.92V441.601h-94.08v-69.12h94.08
                V272.264c0-39.6,11.307-71.865,33.003-93.31c20.845-20.604,51.5-31.494,88.062-31.494c25.695,0,47.893,1.262,65.173,2.496v60.841
                l-39.289,0.018c-73.19,0-73.991,54.368-73.991,72.236v89.43h106.061l-9.095,69.12H497.28V721.92H424.32z M721.92,701.244
                c0,11.381-9.297,20.676-20.676,20.676H535.68V480h92.331l19.001-145.92H535.68v-51.03c0-13.251,2.164-21.508,5.93-25.981
                c4.389-5.213,14.834-7.854,29.877-7.854l77.474-0.035V115.732l-17.064-2.214c-8.71-1.158-43.51-4.458-86.786-4.458
                c-46.883,0-86.498,14.725-114.684,42.583c-29.157,28.819-44.506,70.529-44.506,120.62v61.816h-94.08V480h94.08v241.92H59.077
                c-11.382,0-20.676-9.295-20.676-20.676V59.075c0-11.382,9.294-20.674,20.676-20.674h642.167c11.379,0,20.676,9.292,20.676,20.674
                V701.244z"/>
        </svg> -->
        <svg class="modal-logo" viewBox="0 0 768 679.435">
            <path d="M688.604,319.111H447.36v36.634h241.244V319.111z M407.662,83.98H172.531v36.642h235.146V83.98H407.662z M688.604,473.318
                H447.36v36.642h241.244V473.318z M688.604,395.443H447.36v36.648h241.244V395.443z M645.857,636.702H42.754V126.72h13.748V83.973
                H0v595.461h688.604v-56.479h-42.747V636.702L645.857,636.702z M684.02,83.98H447.36v192.376H684.02V83.98z M407.662,473.318
                H172.531v36.642h235.146v-36.642H407.662L407.662,473.318z M88.558,0v595.469H768V0H88.558z M725.253,552.698H131.305V41.226
                h593.94L725.253,552.698L725.253,552.698z M407.662,395.443H172.531v36.648h235.146v-36.648H407.662z M407.662,161.84H172.531
                v36.642h235.146V161.84H407.662z M407.662,319.111H172.531v36.634h235.146v-36.634H407.662z M407.662,241.236H172.531v36.642
                h235.146v-36.642H407.662z"/>
        </svg>
        <div class="modal-footer">
            <span class="modal-footer-caption">{{selectedEvents.nb}} news events selected</span>
            <a class="modal-validate-btn">OK</a>
        </div>
    </div>
</template>

<script type="text/javascript">
import newsEventCard from './newsEventCard.vue'
import moment from 'moment'
import {resetSelectedEvents, toggleSelectedEvent} from '../../vuex/ui_actions.js'
import {getIntervalSongs} from '../../vuex/algo_actions.js'
import Pikaday from 'pikaday'
import './pika.css'

export default {
    replace: true,
    components: {'news-event-card': newsEventCard},
    vuex: {
        actions: {resetSelectedEvents, toggleSelectedEvent, getIntervalSongs},
        getters: {
            bckCol: state => state.bckCol,
            events: state => state.events,
            locale: state => state.locale,
            selectedEvents: state => state.selectedEvents
        }
    },
    ready: function () {
        moment.locale(this.locale)
        this.resetSelectedEvents()
        this.events.forEach(ev => {
            if (this.getIntervalSongs(ev.date, 12).length >= 0) {
                this.displayEvents.push(ev)
                if (ev.visible) {
                    this.toggleSelectedEvent(ev.id)
                }
            }
        })
        this.displayEvents.sort((a, b) => {
            return moment(a.date).diff(b.date, 'days')
        })
        this.picker = new Pikaday({
            field: document.getElementById('datepicker'),
            firstDay: 1,
            minDate: moment('2010-01-01'),
            maxDate: moment(),
            format: 'L',
            yearRange: [2010, moment().year()],
            i18n: {
                previousMonth: 'Previous Month',
                nextMonth: 'Next Month',
                months: moment.months().map(val => val.charAt(0).toUpperCase() + val.slice(1)),
                weekdays: moment.weekdays(),
                weekdaysShort: moment.weekdaysShort()
            }
        })
    },
    beforeDestroy: function () {
        this.picker.destroy()
    },
    data () {
        return {
            picker: {},
            displayEvents: []
        }
    }
}
</script>

<style>
    .evsmodal .modal-scroll {
        top: 103px; padding-top: 20px;
        bottom: 44px;
    }

</style>
