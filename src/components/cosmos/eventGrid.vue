<template>
    <div class="mygrid visible">
        <div class="event-panel" v-for="panel in myGrid.panels" v-bind:style="panel.styleObj">
            <span v-if="panel.type === 'text'">{{panel.text}}</span>
            <img class="event-panel-img" v-if="panel.type === 'image'" v-bind:src="panel.src"/>
        </div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import Masonry from 'masonry-layout'
import {setEventLoading} from '../../vuex/ui_actions'

export default {
    replace: true,
    props: ['zpos', 'cosmos'],
    vuex: {
        getters: {
            currentEvent: (state) => state.currentEvent,
            currentDate: (state) => state.currentDate,
            momentLocale: state => state.momentLocale,
            locale: state => state.locale
        },
        actions: {setEventLoading}
    },
    watch: {
        currentDate: function (newVal) {
            window.setTimeout(() => {
                this.cosmos.moveGrid(this.zpos)
                if (this.currentEvent.id) {
                    this.gridEvent = this.currentEvent
                    this.setEventLoading(true)
                    imagesLoaded('.event-panel-img', () => {
                        setTimeout(() => {
                            this.msnry = new Masonry('.mygrid', {itemSelector: '.event-panel', columnWidth: 10})
                            this.setEventLoading(false)
                        }, 200)
                    })
                } else {
                    this.gridEvent = 'date'
                }
            }, 1000)
        },
        cosmos: function () {
            if (!this.loaded && this.cosmos) {
                this.cosmos.addGrid(this.myGrid).then(() => {
                    this.loaded = true
                })
            }
        }
    },
    computed: {
        myGrid: function () {
            var jj, retObj, textLocale
            if (this.locale === 'fr') {textLocale = 'fr'} else {textLocale = 'en'}
            retObj = {}
            retObj.zpos = this.zpos
            if (this.gridEvent.id) {
                retObj.panels = []
                // Event title panel :
                retObj.panels.push({
                    'type': 'text',
                    'text': this.gridEvent.title[textLocale],
                    'styleObj': {
                        'color': 'black',
                        'backgroundColor': 'rgb(' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ')',
                        'fontFamily': 'Times New Roman, Times, serif',
                        'fontSize': 70 - Math.min(40, Math.round(this.gridEvent.title[textLocale].length - 25 + 20 * Math.random())) + 'px',
                        'fontWeight': 'bold',
                        'fontStyle': 'italic',
                        'maxWidth': Math.round(25 + 10 * Math.random()) + '%',
                        'margin': Math.round(5 + 3 * Math.random()) + 'px'
                    }
                })
                // Event date panel :
                retObj.panels.push({
                    'type': 'text',
                    'text': moment(this.gridEvent.date).format('L'),
                    'styleObj': {
                        'color': '#E0E3DA',
                        'fontFamily': 'Raleway, Helvetica, sans-serif',
                        'backgroundColor': 'transparent',
                        'fontSize': 90 - Math.round(30 * Math.random()) + 'px',
                        'maxWidth': '100%',
                        'margin': Math.round(5 + 3 * Math.random()) + 'px'
                    }
                })
                // Other text panels :
                for (jj = 0; jj < this.gridEvent.panels.length; jj++) {
                    var randVal = Math.random()
                    if (this.gridEvent.panels[jj].type === 'text') {
                        retObj.panels.push({
                            'type': 'text',
                            'text': this.gridEvent.panels[jj].text[textLocale],
                            'styleObj': {
                                'color': randVal < 0.5 ? '#FEFCEA' : 'black',
                                'backgroundColor': randVal < 0.5 ? 'transparent' : 'rgb(' + (255 - Math.round(50 * randVal)) + ',' + (255 - Math.round(50 * randVal)) + ',' + (255 - Math.round(50 * randVal)) + ')',
                                'fontSize': Math.round(18 + 4 * Math.random()) + 'px',
                                'fontFamily': 'Roboto, Helvetica, sans-serif',
                                // 'fontFamily': 'Palatino Linotype, serif',
                                'maxWidth': Math.round(30 + 10 * Math.random()) + '%',
                                'margin': Math.round(5 + 3 * Math.random()) + 'px'
                            }
                        })
                    }
                    // Image panels :
                    if (this.gridEvent.panels[jj].type === 'image') {
                        retObj.panels.push({
                            'type': 'image',
                            'src': this.gridEvent.panels[jj].src,
                            'styleObj': {
                                'backgroundColor': 'rgb(' + (Math.round(30 * randVal)) + ',' + (Math.round(30 * randVal)) + ',' + (Math.round(30 * randVal)) + ')',
                                // set a width and not a maxWidth so that masonry renders properly event if the image isn't yet loaded
                                'width': Math.round(25 + 10 * Math.random()) + '%',
                                'padding': Math.round(5 + 5 * Math.random()) + 'px',
                                'margin': Math.round(5 + 3 * Math.random()) + 'px'
                            }
                        })
                    }
                }
                // Add randomly a few more empty panels :
                for (jj = 0; jj < 4; jj++) {
                    if (Math.random() > 0.5) {
                        retObj.panels.push({
                            'type': 'empty',
                            'styleObj': {
                                'background': 'transparent',
                                'width': Math.round(15 + 10 * Math.random()) + '%',
                                'height': Math.round(40 + 60 * Math.random()) + 'px'
                            }
                        })
                    }
                }
                // Sort randomly panels :
                retObj.panels.sort(function () {return Math.random() > 0.5})
            }
            return retObj
        }
    },
    created: function () {
        moment.locale(this.momentLocale)
    },
    data () {
        return {
            gridEvent: false,
            msnry: false,
            loaded: false
        }
    }
}

</script>

<style>

.mygrid {
    width: 100%; height: 100%;
    padding-top:250px; opacity: 0;
    transition: opacity 500ms ease;
}
.mygrid.visible {opacity: 1;}

.event-panel-img {width: 100%; height: auto;}

</style>
