<template>
    <div class="event-grid-wrapper" v-bind:id="myGrid.elemId">
        <div class="event-grid" v-bind:id="'event-grid-' + index">
            <div class="event-panel" v-for="panel in myGrid.panels" v-bind:style="panel.styleObj">
                <span v-if="panel.type === 'text'">{{panel.text}}</span>
                <img v-bind:class="'img-' + index" class="event-panel-img" v-if="panel.type === 'image' && focus" v-bind:src="panel.src"/>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import Masonry from 'masonry-layout'
import {setEventLoading} from '../../vuex/actions'

export default {
    replace: true,
    props: ['event', 'index', 'zpos', 'cosmos'],
    vuex: {
        getters: {
            currentEvent: (state) => state.currentEvent
        },
        actions: {setEventLoading}
    },
    watch: {
        currentEvent: function (newVal) {
            if (newVal === this.event) {
                if (!this.focus) {
                    this.focus = true
                }
                this.setEventLoading(true)
                imagesLoaded('.img-' + this.index, () => {
                    setTimeout(() => {
                        this.msnry = new Masonry('#event-grid-' + this.index, {itemSelector: '.event-panel', columnWidth: 10})
                        this.setEventLoading(false)
                    }, 100)
                })
            }
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
            retObj.elemId = 'event-grid-wrapper' + this.index
            retObj.panels = []
            // Event title panel :
            retObj.panels.push({
                'type': 'text',
                'text': this.event.title[textLocale],
                'styleObj': {
                    'color': 'black',
                    'backgroundColor': 'rgb(' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ')',
                    'fontFamily': 'Times New Roman, Times, serif',
                    'fontSize': 70 - Math.min(40, Math.round(this.event.title[textLocale].length - 25 + 20 * Math.random())) + 'px',
                    'fontWeight': 'bold',
                    'fontStyle': 'italic',
                    'maxWidth': Math.round(25 + 10 * Math.random()) + '%',
                    'margin': Math.round(5 + 3 * Math.random()) + 'px'
                }
            })
            // Event date panel :
            retObj.panels.push({
                'type': 'text',
                'text': moment(this.event.date).format('L'),
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
            for (jj = 0; jj < this.event.panels.length; jj++) {
                var randVal = Math.random()
                if (this.event.panels[jj].type === 'text') {
                    retObj.panels.push({
                        'type': 'text',
                        'text': this.event.panels[jj].text[textLocale],
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
                if (this.event.panels[jj].type === 'image') {
                    retObj.panels.push({
                        'type': 'image',
                        'src': this.event.panels[jj].src,
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
            return retObj
        }
    },
    created: function () {
        moment.locale(window.navigator.userLanguage || window.navigator.language)
    },
    data () {
        return {
            msnry: false,
            focus: false,
            loaded: false
        }
    }
}

</script>

<style>

.event-grid-wrapper {
    width: 100%; height: 100%;
    padding-top:250px; opacity: 0
}

.event-panel-img {width: 100%; height: auto;}

</style>
