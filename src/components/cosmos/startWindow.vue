<template>
    <div class="start-wrapper" v-bind:id="myObj.elemId">
        <div class="start-tooltip">{{tiptext}}</div>
        <div class="start-box">
            <div class="sb-bloc sb-ev">
                <news-event-card v-for="event in displayEvents" :context="'startwindow'" :event="event"></news-event-card>
            </div>
            <div class="sb-bloc sb-date">
                <date-card v-for="dateCard in displayDates" :data="dateCard"></date-card>
            </div>
            <!-- <div class="sb-more sb-ev">
                <a class="sb-link" v-on:click.prevent="setCurrentModal('addevNews')">
                    {{locale === 'fr' ? 'plus' : 'more'}}<br>{{locale === 'fr' ? 'd\'événements' : 'events'}}
                </a>
            </div>
            <div class="sb-more sb-date" v-on:click.prevent="setCurrentModal('addevDates')">
                <a class="sb-link">
                    {{locale === 'fr' ? 'plus' : 'more'}}<br>{{locale === 'fr' ? 'de dates' : 'dates'}}
                </a>
            </div> -->
            <div class="sb-more sb-ev">
                <a class="sb-link" v-on:click.prevent="setCurrentModal('addevNews')">
                    {{locale === 'fr' ? 'voir' : 'see'}}<br>{{locale === 'fr' ? 'plus' : 'more'}}
                </a>
            </div>
            <div class="sb-more sb-date" v-on:click.prevent="setCurrentModal('addevDates')">
                <a class="sb-link">
                    {{locale === 'fr' ? 'voir' : 'see'}}<br>{{locale === 'fr' ? 'plus' : 'more'}}
                </a>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import newsEventCard from '../modal/newsEventCard.vue'
import dateCard from '../modal/dateCard.vue'
import {setCurrentModal} from '../../vuex/ui_actions'

export default {
    replace: true,
    props: ['cosmos'],
    components: {'news-event-card': newsEventCard, 'date-card': dateCard},
    vuex: {
        getters: {
            dateCards: state => state.dateCards,
            events: state => state.events,
            locale: state => state.locale
        },
        actions: {setCurrentModal}
    },
    watch: {
        cosmos: function () {
            if (!this.loaded && this.cosmos) {
                this.cosmos.addLabels([this.myObj]).then(() => this.loaded = true)
            }
        }
    },
    computed: {
        nbCards: function () {
            let nb = 4
            let ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            if (ww < 400) {
                nb = 1
            } else if (ww < 720) {
                nb = 2
            } else if (ww < 1200) {
                nb = 3
            }
            return nb
        },
        displayEvents: function () {
            return this.events.sort(() => Math.random()).slice(0, this.nbCards)
        },
        displayDates: function () {
            return this.dateCards.filter(card => card.featured).sort(() => Math.random()).slice(0, this.nbCards)
        }
    },
    created: function () {
        if (this.locale === 'fr') {
            this.tiptext = 'Choisis un événement ou une date'
        } else {
            this.tiptext = 'Choose an event or a date'
        }
    },
    data () {
        return {
            myObj: {
                'elemId': 'sw-id',
                'xpos': 0, 'ypos': 0, 'zpos': 500
            },
            'tiptext': '',
            loaded: false
        }
    }
}

</script>

<style>

.start-wrapper {
    width: 100%; height: 100%; opacity: 1;
    font-family: 'Roboto', 'Helvetica', sans-serif;
}
.start-tooltip {
    color: #ffffff; margin-top: 20px; margin-left: 250px;
    font-size: 30px;
    font-family: 'Raleway', 'Helvetica', sans-serif;
}
.start-box {
    position: absolute; width: 100%;
    top: 130px; bottom: 0;
}
.sb-bloc {
    position: absolute; left: 0; right: 70px;
    height: 50%;
}
.sb-ev {top: 0;}
.sb-date {bottom: 0;}
.sb-more {
    position: absolute; right: 0;
    width: 70px; height: 50%;
}
.sb-link {
    display: block; cursor: pointer;
    color: #E0E3DA; background-color: rgba(0, 0, 0, 0.5);
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 60px; height: 60px; text-align: center; overflow: visible; line-height: 30px;
    font-size: 1.2em;
    border-radius: 30px;
}

</style>
