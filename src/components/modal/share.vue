<template>
    <div class="modal-inner">
        <h2 class="modal-title">{{locale === 'fr' ? 'Partager' : 'Share'}}</h2>
        <div class="modal-scroll">
            <div id="mc-wrapper">
                <canvas id="mycanvas"></canvas>
            </div>
            <div class="share-infos">
                <p class="si-text">{{locale === 'fr' ? 'Partage cette image ou ce texte sur ta timeline !' : 'Share this image or this text on your timeline !'}}</p>
                <p class="si-text">{{locale === 'fr' ? 'Le titre affiché dépend de ce que tu écoutes actuellement.' : 'The song displayed depends on what you\'re currently listening.'}}</p>
                <div class="share-under">
                    <div class="select-text-tooltip">- {{locale === 'fr' ? 'Clique pour sélectionner' : 'Click to select'}} -</div>
                    <div id="select-text" v-on:click.prevent="selectText">{{copyText}}</div>
                </div>
                <div class="share-bt-line">
                    <!-- <div class="fb-share-button" data-href="https://matlesca.github.io/backtrack/" data-layout="button" data-size="large" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse">Partager</a></div> -->
                    <iframe src="https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fbacktrack.cc%2F&layout=button&size=large&mobile_iframe=true&appId=1809656775937797&width=89&height=28" width="89" height="38" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
                    <iframe
                      v-bind:src="twitterSRC"
                      width="100"
                      height="38"
                      title="Twitter Tweet Button"
                      style="border: 0; overflow: hidden;">
                    </iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import {drawShare} from '../../vuex/draw_actions'

export default {
    replace: true,
    vuex: {
        getters: {
            locale: state => state.locale,
            currentSongID: state => state.currentSongID
        },
        actions: {drawShare}
    },
    watch: {
        currentSongID: function () {
            this.drawShare('mc-wrapper', 'mycanvas').then((retVal) => {
                this.copyText = retVal
            })
        }
    },
    computed: {
        twitterSRC: function () {
            return 'https://platform.twitter.com/widgets/tweet_button.html?size=l&url=http%3A%2F%2Fbacktrack.cc%2F&text=' + this.copyText
        }
    },
    methods: {
        selectText: function () {
            if (document.selection) {
                let range = document.body.createTextRange()
                range.moveToElementText(document.getElementById('select-text'))
                range.select()
            } else if (window.getSelection) {
                let range = document.createRange()
                range.selectNode(document.getElementById('select-text'))
                window.getSelection().addRange(range)
            }
        }
    },
    ready: function () {
        this.drawShare('mc-wrapper', 'mycanvas').then((retVal) => {
            this.copyText = retVal
        })
    },
    data: () => {
        return {
            copyText: ''
        }
    }
}
</script>

<style>
    #mc-wrapper {
        position: absolute; top: 20px; left: 20px;
        width: 75vh; height: 75vh; max-width: 100%; max-height: 100%;
    }
    #my-canvas {width: 100%; height: 100%;}

    .share-infos {
        position: absolute; margin: 0; width: 40%; top: 20px; right: 0;
        text-align: center;
        font-size: 1.1em;
    }
    .si-text {color: #8EACB7; margin: 15px 0; text-align: right;}
    .share-bt-line {
        margin: 20px 0; text-align: center; overflow: hidden;
    }
    .share-bt-line iframe {margin: 20px;}
    .share-under {
        padding: 20px; margin: 30px 30px; border-radius: 10px;
        background-color: rgba(100, 100, 110, 0.5); opacity: 0.9; 
    }
    .select-text-tooltip {
        color: #8EACB7; font-size: 0.85em;
        text-align: center; margin-bottom: 10px;
    }
    #select-text {color: #A493C6;}

    @media (max-width: 1200px) {
        .share-infos {width: 30%;}
    }
    @media (max-width: 1024px) {
        .share-infos {width: 25%;}
    }
    @media (max-width: 850px) {
        #mc-wrapper {position: relative; left: 50%; transform: translate(-50%, 0);}
        .share-infos {position: relative; width: 100%; top: 0; margin-top: 60px;}
        .si-text {text-align: center;}
    }

</style>
