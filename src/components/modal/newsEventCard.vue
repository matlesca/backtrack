<template>
    <div class="nec-wrapper">
        <div class="nec-card" v-bind:id="'nec-card-' + event.id" v-on:click="clickCard(event)">
            <div class="nec-img-wrapper" v-bind:id="'nec-img-wrapper-' + event.id">
                <img v-bind:src="imageLink" v-bind:id="'nec-img-' + event.id" v-bind:alt="locale === 'fr' ? event.title.fr : event.title.en" />
            </div>
            <div class="nec-card-caption">
                <div class="nec-tags-wrapper">
                    <span class="nec-tag" v-for="tag in formatTags" track-by="$index">{{tag}}</span>
                </div>
                <div class="nec-date">
                    {{formatDate}} :
                </div>
                <a class="nec-card-title">
                    {{locale === 'fr' ? event.title.fr : event.title.en}}
                </a>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import moment from 'moment'
import imagesLoaded from 'imagesloaded'
import {clickCard} from '../../vuex/ui_actions.js'

export default {
    replace: true,
    props: ['event'],
    vuex: {
        getters: {
            locale: state => state.locale
        },
        actions: {clickCard}
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
        formatTags: function () {
            if (this.locale === 'fr') {
                return this.event.tags.map(tag => tag['fr'].charAt(0).toUpperCase() + tag['fr'].slice(1))
            } else {
                return this.event.tags.map(tag => tag['en'].charAt(0).toUpperCase() + tag['en'].slice(1))
            }
        }
    },
    ready: function () {
        var myImg = document.getElementById('nec-img-' + this.event.id)
        var myWrap = document.getElementById('nec-img-wrapper-' + this.event.id)
        var myCard = document.getElementById('nec-card-' + this.event.id)
        imagesLoaded(myImg, () => {
            setTimeout(() => {
                if (myImg.offsetHeight / myWrap.offsetHeight < myImg.offsetWidth / myWrap.offsetWidth) {
                    myImg.style.height = '100%'
                    myImg.style.width = 'auto'
                    myImg.style.transform = 'translateX(' + Math.round((myWrap.offsetWidth - myImg.offsetWidth) / 2) + 'px)'
                } else {
                    myImg.style.height = 'auto'
                    myImg.style.width = '100%'
                    myImg.style.transform = 'translateY(' + Math.round((myWrap.offsetHeight - myImg.offsetHeight) / 2) + 'px)'
                }
                myCard.style.opacity = 1
            }, 1)
        })
    }
}

</script>

<style>

.nec-wrapper {
    width: 25%; display: inline-block;
    height: 400px; position: relative;
}
.nec-card {
    position: absolute; top: 10px; bottom: 10px; left: 10px; right: 10px;
    border-bottom-left-radius: 2px; border-bottom-right-radius: 2px;
    border-top-left-radius: 2px; border-top-right-radius: 2px;
    opacity: 0; transition: opacity 100ms ease;
    background-color: #A493C6;
    box-shadow: 0 0 20px 5px #282828;
    overflow: hidden; cursor: pointer;
}
.nec-img-wrapper {height: 250px; width: 100%;}
.nec-card-caption {
    position: absolute; bottom: 0; left: 0; right: 0;
    width: 100%; height: 130px;
    background-color: #FEFCEA;
}
.nec-date {
    position: absolute; top: 38px; padding-left: 12px;
    width: 100%; z-index: 1000;
    font-size: 1.1em; font-style: italic; font-weight: bold;
    color: #614C8A;
}
.nec-card-title {
    margin: 8px 12px; font-size: 1em;
    padding: 0;
    position: absolute; bottom: 0; left: 0; right: 0;
    overflow: hidden; text-overflow: clip;
    height: 60px; line-height: 20px;
}
.nec-tags-wrapper {
    position: absolute; top: 8px; left: 5px; right: 5px;
    overflow: hidden; height: 30px; text-overflow: ellipsis; white-space: nowrap;
}
.nec-tag {background-color: #E0E3DA; margin: 2px; padding: 2px 5px; font-size: 0.85em; border-radius: 4px;}

@media (max-width: 1200px) {
    .nec-wrapper {width: 33%;}
}
@media (max-width: 720px) {
    .nec-wrapper {width: 50%;}
}
@media (max-width: 400px) {
    .nec-wrapper {width: 100%;}
}

</style>
