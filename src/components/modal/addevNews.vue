<template>
    <div class="modal-inner evsmodal">
        <div class="modal-title">
            <span v-if="locale === 'fr'" class="modal-title-title">Choisis un événement</span>
            <span v-if="locale !== 'fr'" class="modal-title-title">Choose event</span>
            <div class="modal-search">
                <svg class="search-logo" viewBox="0 0 66.616 66.613">
                    <path d="M0,20.851c0,11.516,9.336,20.852,20.852,20.852c4.313,0,8.318-1.311,11.644-3.553l27.291,27.291
                        c0.782,0.781,1.805,1.172,2.829,1.172s2.047-0.391,2.829-1.172c1.562-1.562,1.562-4.096,0-5.656l-27.291-27.29
                        c2.242-3.326,3.552-7.331,3.552-11.643C41.705,9.335,32.369,0,20.854,0S0.002,9.335,0,20.851z M6.229,20.852
                        c0-8.077,6.548-14.625,14.625-14.625c8.076,0,14.624,6.548,14.624,14.625c0,8.076-6.548,14.625-14.624,14.625
                        C12.776,35.477,6.229,28.928,6.229,20.852z"/>
                </svg>

                <input type="text" name="search-event" v-model="searchInput" debounce="200" style="width: 390px" class="modal-search-input" v-bind:placeholder="locale === 'fr' ? 'Filtrer par événement, label, date..' : 'Filter by event, tag, date..'">
            </div>
        </div>
        <div class="modal-scroll">
            <news-event-card v-for="event in displayEvents" :event="event"></news-event-card>
        </div>
    </div>
</template>

<script type="text/javascript">
import newsEventCard from './newsEventCard.vue'
import moment from 'moment'
import {getIntervalSongs} from '../../vuex/algo_actions.js'
import lunr from 'lunr'

export default {
    replace: true,
    components: {'news-event-card': newsEventCard},
    vuex: {
        actions: {getIntervalSongs},
        getters: {
            events: state => state.events,
            locale: state => state.locale
        }
    },
    created: function () {
        this.lunrIndex = lunr(function () {
            this.field('title')
            this.field('tag0')
            this.field('tag1')
            this.field('tag2')
            this.field('tag3')
            this.field('tag4')
            this.field('tag5')
            this.field('tag6')
            this.field('tag7')
            this.field('tag8')
            this.field('tag9')
            this.field('dateShort')
            this.field('dateLong')
        })
    },
    computed: {
        dataEvents: function () {
            let retTab = []
            this.events.forEach(ev => {
                // if (this.getIntervalSongs(ev.date, ev.date, 12).length > 10) {
                if (true) {
                    retTab.push(ev)
                    let evIndex = {
                        'id': ev.id,
                        'title': ev.title[this.locale === 'fr' ? 'fr' : 'en']
                    }
                    let evDate = moment(ev.date)
                    ev.tags.forEach((tag, ind) => evIndex['tag' + ind] = tag[this.locale === 'fr' ? 'fr' : 'en'])
                    evIndex['dateShort'] = evDate.format('l')
                    evIndex['dateLong'] = evDate.format('LL')
                    this.lunrIndex.add(evIndex)
                }
            })
            retTab.sort((a, b) => {
                return moment(a.date).diff(b.date, 'days')
            })
            return retTab
        },
        displayEvents: function () {
            let retTab = []
            if (this.searchInput === '') {
                return this.dataEvents
            } else {
                let res = this.lunrIndex.search(this.searchInput)
                this.dataEvents.forEach(ev => {
                    res.forEach(fEv => {
                        if (fEv.ref === ev.id) {
                            retTab.push(ev)
                        }
                    })
                })
                return retTab
            }
        }
    },
    data: () => {
        return {
            searchInput: '',
            lunrIndex: {}
        }
    }
}
</script>


