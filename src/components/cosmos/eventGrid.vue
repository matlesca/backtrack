<template>
    <div class="mygrid visible">
        <div class="mg-images-bloc">
            <div class="mg-img-div" v-for="image in myGrid.images" track-by="$index" v-bind:style="{width: parseInt(100 / myGrid.images.length, 10) + '%', left: parseInt($index * 100 / myGrid.images.length, 10) + '%'}">
                <div class="mg-img-wrap" v-bind:id="'mg-img-wrap-' + $index" >
                    <img class="mg-img" v-bind:src="image" v-bind:id="'mg-img-' + $index">
                </div>
            </div>
        </div>
        <div class="mg-title-bloc">
            <span class="mg-subtitle" v-show="myGrid.subtitle" v-bind:style="{backgroundColor: myGrid.col2}">{{myGrid.subtitle}}</span>
            <br>
            <span class="mg-title" v-show="myGrid.title" v-bind:style="{backgroundColor: myGrid.col1}">{{myGrid.title}}</span>
        </div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
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
        currentDate: 'refreshMove',
        cosmos: function () {
            if (!this.loaded && this.cosmos) {
                this.cosmos.addGrid(this.myGrid).then(() => {
                    this.loaded = true
                })
            }
        }
    },
    created: function () {
        moment.locale(this.momentLocale)
        this.refreshMove()
    },
    methods: {
        refreshMove: function () {
            this.setEventLoading(true)
            // Wait a bit before switching grid to make sure the cosmos travel has started
            setTimeout(() => {
                this.cosmos.moveGrid(this.zpos)
                // Update myGrid :
                this.myGrid.zpos = this.zpos
                this.myGrid.images = []
                // Check the page width to determine the nb of images shown :
                let nb = 4
                let ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                if (ww < 400) {
                    nb = 1
                } else if (ww < 720) {
                    nb = 2
                } else if (ww < 1200) {
                    nb = 3
                }
                if (this.currentEvent.type === 'news') {
                    this.myGrid.images = this.currentEvent.images.slice(0, nb)
                    this.myGrid.title = this.currentEvent.title[this.locale === 'fr' ? 'fr' : 'en']
                    this.myGrid.subtitle = moment(this.currentEvent.date).format('L')
                } else {
                    if (this.currentEvent.specialDay) {
                        this.myGrid.title = this.currentEvent.specialDay
                        this.myGrid.subtitle = this.currentEvent.name
                    } else if (this.currentEvent.fromNow) {
                        this.myGrid.title = this.currentEvent.fromNow
                        this.myGrid.subtitle = this.currentEvent.name
                    } else {
                        this.myGrid.title = false
                        this.myGrid.subtitle = this.currentEvent.name
                    }
                    for (let nn = 0; nn < nb; nn++) {
                        this.myGrid.images.push('https://source.unsplash.com/random/10x10')
                    }
                }
                this.myGrid.col1 = 'rgb(' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ')'
                this.myGrid.col2 = 'rgb(' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ',' + (255 - Math.round(50 * Math.random())) + ')'
                this.setEventLoading(false)
                // Update myGrid images :
                for (let ii = 0; ii < this.myGrid.images.length; ii++) {
                    setTimeout(() => {
                        let img = document.getElementById('mg-img-' + ii)
                        let wrap = document.getElementById('mg-img-wrap-' + ii)
                        img.classList.remove('loaded')
                        if (this.currentEvent.type !== 'news') {
                            if (this.currentEvent.collection) {
                                this.myGrid.images.$set(ii, 'https://source.unsplash.com/collection/' + this.currentEvent.collection + '/' + parseInt(wrap.offsetWidth + 2, 10) + 'x' + parseInt(wrap.offsetHeight + 2, 10) + '?sig=' + this.currentDate + '-' + ii)
                            } else {
                                this.myGrid.images.$set(ii, 'https://source.unsplash.com/random/' + parseInt(wrap.offsetWidth + 2, 10) + 'x' + parseInt(wrap.offsetHeight + 2, 10) + '?sig=' + this.currentDate + '-' + ii)
                            }
                        }
                        let imgLoad = imagesLoaded(img)
                        imgLoad.on('done', (inst) => {
                            let img = inst.images[0].img
                            if (img.offsetHeight / wrap.offsetHeight < img.offsetWidth / wrap.offsetWidth) {
                                img.style.height = '100%'
                                img.style.width = 'auto'
                                img.style.transform = 'translateX(' + Math.round((wrap.offsetWidth - img.offsetWidth) / 2) + 'px)'
                            } else {
                                img.style.height = 'auto'
                                img.style.width = '100%'
                                img.style.transform = 'translateY(' + Math.round((wrap.offsetHeight - img.offsetHeight) / 2) + 'px)'
                            }
                            img.classList.add('loaded')
                        })
                    }, 3 + ii)
                }
            }, 1000)
        }
    },
    data () {
        return {
            myGrid: {zpos: this.zpos, images: [], title: '', subtitle: '', col1: 'white', col2: 'white'},
            loaded: false
        }
    }
}

</script>

<style>

.mygrid {
    width: 100%; height: 100%; opacity: 0;
    transition: opacity 500ms ease;
}
.mygrid.visible {opacity: 1;}

.event-panel-img {width: 100%; height: auto;}

.mg-title-bloc {
    position: absolute; left: 0; bottom: 0;
}
.mg-title {
    display: inline-block; margin: 5px 0;
    font-family: 'Times New Roman', 'Times', serif; font-size: 60px;
    font-weight: bold; font-style: italic;
}
.mg-subtitle {
    display: inline-block; margin: 5px 0;
    font-family: 'Raleway', 'Helvetica', sans-serif;
    width: auto; font-size: 80px;
}
.mg-subtitle:first-letter, .mg-title:first-letter {text-transform: uppercase;}
.mg-images-bloc {
    position: absolute; width: 100%;
    left: 0; bottom: 250px; top: 120px;
    overflow: hidden;
}
.mg-img-div {position: absolute; top: 0; height: 100%; overflow: hidden;}
.mg-img-wrap {overflow: hidden; position: absolute; left: 5px; right: 5px; bottom: 5px; top: 0px;}
.mg-img {opacity: 0; transition: opacity 0.2s ease; margin: 0 5px;}
.mg-img.loaded {opacity: 1;}

</style>
