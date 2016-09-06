<template>
    <div class="logo-wrapper" v-bind:class="{'is-loading': loading, 'big': (size === 'big'), 'small': (size === 'small')}">
        <svg class="svg-logo" viewBox="0 0 180 77">
            <text class="logo-text">backtrack</text>
            <path class="logo-line" stroke-miterlimit="10" d="M162.515,0C173.492,7.19,180,16.139,180,25.837c0,23.725-38.959,42.961-87.014,42.961c-7.917,0-15.586-0.524-22.876-1.502"/>
            <path class="small-motion-path" fill="none" stroke="none" d="M-13.667-21.667C90-36.334,148.028-8.5,162.514,0S180,16.139,180,25.837c0,23.725-37.326,42.961-86.197,43.777c0,0-15.444,1.499-44.999-8.35"/>
            <path class="big-motion-path" fill="none" stroke="none" d="M-20.416-32.354C135.083-54.355,222.127-12.603,243.855,0.147s26.228,24.208,26.228,38.756c0,35.586-55.988,64.441-129.295,65.666c0,0-23.167,2.247-67.498-12.525"/>
            <path class="big-loading-path" fill="none" stroke="none" d="M29.609,62.028c-1.546-3.148-2.359-6.422-2.359-9.78c0-24.96,44.997-45.194,100.5-45.194c55.504,0,100.5,20.234,100.5,45.194c0,24.962-44.995,45.195-100.5,45.195C79.714,97.443,39.547,82.289,29.609,62.028"/>
            <path class="small-loading-path" fill="none" d="M19.74,41.174c-1.031-2.09-1.573-4.263-1.573-6.492c0-16.568,29.998-30,67-30c37.003,0,67,13.431,67,30c0,16.57-29.997,30-67,30C53.143,64.683,26.365,54.623,19.74,41.174"/>
        </svg>
        <svg class="svg-rocket" viewBox="0 0 180 77">
            <polygon points="78.692,28.919 73.384,27.094 73.381,32.796 73.38,38.497 73.384,44.205 73.383,49.905 78.692,48.09 	"/>
            <path d="M106.62,38.528l-25.068-8.625l0.002,17.206L106.62,38.528z M87.089,38.512c0-1.608,1.304-2.912,2.913-2.913c1.607,0.002,2.909,1.31,2.909,2.917c0.001,1.612-1.303,2.913-2.911,2.915C88.392,41.426,87.091,40.122,87.089,38.512z"/>
        </svg>
    </div>

</template>

<script type="text/javascript">
// import anime from 'animejs'
/*global anime*/

  export default {
      replace: false,
      vuex: {
          getters: {loading: (state) => state.appLoading || state.eventLoading || state.moving}
      },
      props: {size: 'size'},
      watch: {
          loading: function (newVal) {
              if (newVal) {
                  this.animeLoading(this.size, 600)
              } else {
                  this.animeOpen(this.size, 500)
              }
          }
      },
      methods: {
          animeOpen: function (size, dur) {
              var myPath = anime.path('.' + size + '-motion-path')
              var setDashoffset = function (el) {
                  var l = el.getTotalLength()
                  el.setAttribute('stroke-dasharray', l)
                  return [l, 0]
              }
              var textDelta = 100
              if (this.size === 'big') {
                  textDelta = 150
              }
              anime.remove(['.svg-rocket', '.small-loading-path', '.logo-text', '.logo-line'])
              anime({
                  targets: '.svg-rocket',
                  delay: 0,
                  translateX: myPath,
                  translateY: myPath,
                  rotate: myPath,
                  elasticity: 0,
                  easing: 'easeOutExpo',
                  duration: dur,
                  opacity: {
                      value: 1,
                      duration: Math.floor(0.3 * dur)
                  }
              })
              anime({
                  targets: '.logo-line',
                  strokeDashoffset: setDashoffset,
                  delay: Math.floor(0.15 * dur),
                  elasticity: 0,
                  easing: 'easeOutExpo',
                  opacity: 1,
                  duration: dur
              })
              anime({
                  targets: '.logo-text',
                  delay: 100,
                  elasticity: 0,
                  easing: 'easeOutExpo',
                  transform: ['translate(0 ' + textDelta + ')', 'translate(0 42)'],
                  opacity: {
                      value: 1,
                      delay: Math.floor(0.25 * dur),
                      duration: Math.floor(0.25 * dur)
                  },
                  duration: dur
              })
              anime({
                  targets: '.small-loading-path',
                  delay: 0,
                  opacity: 0,
                  easing: 'linear',
                  loop: false,
                  elasticity: 0,
                  duration: Math.floor(0.1 * dur)
              })
          },
          animeLoading: function (size, dur) {
              var myPath = anime.path('.' + size + '-loading-path')
              function loadDashOffset (el, index, total) {
                  var delta = Math.floor(el.getTotalLength() / 2)
                  el.setAttribute('stroke-dasharray', delta)
                  return [delta * (index + 1), delta * (index - 1)]
              }
              anime.remove(['.svg-rocket', '.small-loading-path', '.logo-text', '.logo-line'])
              anime({
                  targets: ['.svg-rocket'],
                  translateX: myPath,
                  translateY: myPath,
                  rotate: myPath,
                  easing: 'linear',
                  elasticity: 0,
                  loop: true,
                  duration: dur,
                  update: roundAnim
              })
              anime({
                   targets: '.small-loading-path',
                   strokeDashoffset: loadDashOffset,
                   delay: 50,
                   easing: 'linear',
                   loop: false,
                   elasticity: 0,
                   duration: dur
               })
              function roundAnim (anim) {
                  if (anim.progress === 100) {
                      anime({
                           targets: '.small-loading-path',
                           strokeDashoffset: loadDashOffset,
                           delay: 50,
                           easing: 'linear',
                           loop: false,
                           elasticity: 0,
                           duration: dur
                       })
                  }
               }
              anime({
                  targets: '.small-loading-path',
                  delay: 0,
                  opacity: 1,
                  easing: 'linear',
                  loop: false,
                  elasticity: 0,
                  duration: Math.floor(0.5 * dur)
              })
              anime({
                  targets: ['.logo-text', '.logo-line'],
                  delay: 0,
                  opacity: 0,
                  easing: 'linear',
                  loop: false,
                  elasticity: 0,
                  duration: Math.floor(0.2 * dur)
              })
          }
      },
      ready: function () {
          document.querySelector('.logo-wrapper').style.display = 'inline-block'
          setTimeout(() => this.animeOpen(this.size, 2000), 500)
      },
      data () {
          return {
              loadingIntervals: []
          }
      }
  }

</script>

<style>

.logo-wrapper {display: none; position: relative;}
.logo-wrapper.big {width: 270px; height: 116px;}
.logo-wrapper.small {width: 180px; height: 77px;}
.svg-logo, .svg-rocket {width:100%; height: 100%;}
.logo-wrapper.small .svg-rocket {position: absolute; top: -38.5px; left:-90px;}
.logo-wrapper.big .svg-rocket {position: absolute; top: -58px; left:-135px;}

.logo-text, .svg-rocket {
    font-family: 'Roboto Condensed', sans-serif;
    /*font-family: 'Playfair Display', serif;*/
    font-size: 45px;
    font-style: italic; fill: #FFFFE9; opacity: 0;
}
.logo-line, .small-loading-path {stroke: #FFFFE9; fill: none; opacity: 0;}

.logo-wrapper.big .small-motion-path, .logo-wrapper.small .big-motion-path, .logo-wrapper.small .big-loading-path {display: none;}

</style>
