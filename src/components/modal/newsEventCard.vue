<template>
    <div class="nec-wrapper">
        <div class="nec-date">
            - {{formatDate}} -
        </div>
        <div class="nec-card" v-bind:id="'nec-card-' + event.id" v-on:click="toggleSelect">
            <img v-bind:src="imageLink" v-bind:id="'nec-img-' + event.id" v-bind:alt="locale === 'fr' ? event.title.fr : event.title.en" />
            <svg class="validation-line" viewBox="0 0 81.751 68.454">
                <!-- <path v-bind:id="'nec-line-' + event.id" stroke-width="15" d="M-6.75,39.958 42,96.584 100,0 "/> -->
                <path v-bind:id="'nec-line-' + event.id" stroke-width="15" stroke-linecap="round" d="M11.017,31.997c0,0,21.346,25.641,22.083,25.641s38.149-47.165,38.149-47.165"/>
            </svg>
            <div class="nec-card-title">
                {{locale === 'fr' ? event.title.fr : event.title.en}}
            </div>
            <div class="nec-category">
                {{formatCategory}}
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
/*global anime*/
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import {toggleSelectedEvent} from '../../vuex/ui_actions.js'

export default {
    replace: true,
    props: ['event'],
    vuex: {
        actions: {toggleSelectedEvent},
        getters: {
            locale: state => state.locale,
            selectedEvents: state => state.selectedEvents
        }
    },
    computed: {
        formatDate: function () {return moment(this.event.date, 'YYYY-MM-DD').format('ll')},
        imageLink: function () {
            var ret = false
            this.event.panels.forEach(pan => {
                if (!ret && pan.type === 'image') {
                    ret = pan.src
                }
            })
            return ret
        },
        formatCategory: function () {
            if (this.locale === 'fr') {
                return this.event.category['fr'].charAt(0).toUpperCase() + this.event.category['fr'].slice(1)
            } else {
                return this.event.category['en'].charAt(0).toUpperCase() + this.event.category['en'].slice(1)
            }
        }
    },
    methods: {
        updateAnime: function (dur) {
            var seeDashoffset = function (el) {
                var l = el.getTotalLength()
                el.setAttribute('stroke-dasharray', l)
                return [l, 0]
            }
            var hideDashoffset = function (el) {
                var l = el.getTotalLength()
                el.setAttribute('stroke-dasharray', l)
                return [0, l]
            }
            if (this.selectedEvents[this.event.id]) {
                anime({
                    targets: '#nec-line-' + this.event.id,
                    strokeDashoffset: seeDashoffset,
                    elasticity: 0,
                    easing: 'easeOutExpo',
                    opacity: 0.7,
                    duration: dur
                })
                anime({
                    targets: ['#nec-card-' + this.event.id, '#nec-card-' + this.event.id + ' img'],
                    elasticity: 0,
                    easing: 'easeOutExpo',
                    opacity: 0.9,
                    duration: dur
                })
            } else {
                anime({
                    targets: '#nec-line-' + this.event.id,
                    strokeDashoffset: hideDashoffset,
                    elasticity: 0,
                    easing: 'easeOutExpo',
                    opacity: 0,
                    duration: dur
                })
                anime({
                    targets: ['#nec-card-' + this.event.id, '#nec-card-' + this.event.id + ' img'],
                    elasticity: 0,
                    easing: 'easeOutExpo',
                    opacity: 0.7,
                    duration: dur
                })
            }
        },
        toggleSelect: function () {
            this.toggleSelectedEvent(this.event.id)
            this.updateAnime(800)
        }
    },
    beforeDestroy: function () {
        anime.remove(['#nec-card-' + this.event.id, '#nec-card-' + this.event.id + ' img', '#nec-line-' + this.event.id])
    },
    ready: function () {
        var myImg = document.getElementById('nec-img-' + this.event.id)
        var myCard = document.getElementById('nec-card-' + this.event.id)
        imagesLoaded(myImg, () => {
            setTimeout(() => {
                if (myImg.offsetHeight / myCard.offsetHeight < myImg.offsetWidth / myCard.offsetWidth) {
                    myImg.style.height = '100%'
                    myImg.style.width = 'auto'
                    myImg.style.transform = 'translateX(' + Math.round((myCard.offsetWidth - myImg.offsetWidth) / 2) + 'px)'
                } else {
                    myImg.style.transform = 'translateY(' + Math.round((myCard.offsetHeight - myImg.offsetHeight) / 2) + 'px)'
                }
                this.updateAnime(1)
            }, 1)
        })
    }
}

</script>

<style>

.nec-wrapper {
    width: 33%; display: inline-block;
    height: 300px; position: relative;
}
.nec-date {
    position: absolute;
    width: 100%; text-align: center; opacity: 0.6; z-index: 1000;
    font-size: 13pt; font-style: italic;
    color: #FEFCEA;
}
.nec-card {
    position: absolute; top: 25px; bottom: 20px; left: 20px; right: 20px;
    border-radius: 10px; opacity: 0.7;
    background-color: #A493C6;
    /*box-shadow: 0 0 10px 10px #576271;*/
    box-shadow: 0 0 20px 5px #282828;
    overflow: hidden; cursor: pointer;
}
.nec-card img {width: 100%; opacity: 0.7;}
.nec-card-title {
    text-align: center; margin: 0; font-size: 1.05em;
    position: absolute; width: 100%;
    background-color: rgba(200, 190, 225, 0.9);
    /*top: 50%; transform: translateY(-50%);*/
    bottom: 0;
}
.nec-category {
    position: absolute; top: 0; left: 0;
    max-width: 80%; font-size: 12pt; padding: 5px;
    border-bottom-right-radius: 4px;
    overflow: hidden; opacity: 0.9;
    background-color: #E0E3DA; color: #576271;
    background-color: #282828; color: #FEFCEA;
}
.validation-line {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60%; height: 60%;
    stroke: #FEFCEA; fill: none;
}
.validation-line path {opacity: 0;}
/*.nec-wrapper.selected .validation-line {opacity: 1;}*/

</style>
