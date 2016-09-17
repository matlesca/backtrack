<template>
    <div class="modal-inner evsmodal">
        <div class="modal-title">
            <span v-if="locale === 'fr'" class="modal-title-title">Choisis une période</span>
            <span v-if="locale !== 'fr'" class="modal-title-title">Choose period</span>
            <div class="modal-search">
                <svg class="search-logo" viewBox="0 0 66.616 66.613">
                <path d="M0,20.851c0,11.516,9.336,20.852,20.852,20.852c4.313,0,8.318-1.311,11.644-3.553l27.291,27.291
                    c0.782,0.781,1.805,1.172,2.829,1.172s2.047-0.391,2.829-1.172c1.562-1.562,1.562-4.096,0-5.656l-27.291-27.29
                    c2.242-3.326,3.552-7.331,3.552-11.643C41.705,9.335,32.369,0,20.854,0S0.002,9.335,0,20.851z M6.229,20.852
                    c0-8.077,6.548-14.625,14.625-14.625c8.076,0,14.624,6.548,14.624,14.625c0,8.076-6.548,14.625-14.624,14.625
                    C12.776,35.477,6.229,28.928,6.229,20.852z"/>
                </svg>

                <input type="text" name="search-event" v-model="searchInput" debounce="200" style="width: 390px" class="modal-search-input" v-bind:placeholder="locale === 'fr' ? 'Filtrer par période, date..' : 'Filter by period, holiday, date..'">
            </div>
        </div>
        <div class="modal-scroll">
            <date-card v-for="dateCard in displayCards" :data="dateCard"></date-card>
        </div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'
import lunr from 'lunr'
import dateCard from './dateCard.vue'
import generateDateTags from './generateDateTags.js'
import {getIntervalSongs} from '../../vuex/algo_actions.js'

export default {
    replace: true,
    components: {'date-card': dateCard},
    vuex: {
        actions: {generateDateTags, getIntervalSongs},
        getters: {
            locale: state => state.locale,
            dateBounds: state => state.dateBounds
        }
    },
    computed: {
        displayCards: function () {
            let retTab = []
            if (this.allCards.length) {
                if (this.searchInput === '') {
                    retTab = this.allCards.filter(card => card.featured).sort(() => Math.random())
                } else {
                    let res = this.lunrIndex.search(this.searchInput)
                    this.allCards.forEach(card => {
                        res.forEach(fEv => {
                            if (fEv.ref === card.id) {
                                retTab.push(card)
                            }
                        })
                    })
                    retTab.sort((a, b) => {
                        if (a.rank === b.rank) {
                            return moment(a.start).diff(b.start, 'days')
                        } else {
                            return a.rank - b.rank
                        }
                    })
                }
            }
            if (retTab.length > 20) {
                return retTab
            } else {
                return retTab
                // retTab.filter(dc => this.getIntervalSongs(dc.start, dc.end, 12).length > 10)
            }
        }
    },
    created: function () {
        this.lunrIndex = lunr(function () {
            this.field('name')
            this.field('fromNow')
            this.field('specialDay')
            this.field('lookFor')
        })
        this.allCards = this.generateDateTags()
        this.allCards.forEach(card => this.lunrIndex.add(card))
    },
    data () {
        return {
            searchInput: '',
            allCards: [],
            lunrIndex: {}
        }
    }
}
</script>



