<template>
  <div class="navbar-wrapper" v-bind:class="{'active': showNav && !loading}">
    <a class="nav-main-btn" type="button" v-on:click.prevent="toggleShowNav()">
      <app-logo class="top-logo" size="small"></app-logo>
      <span class="nav-burger"><span></span></span>
    </a>
    <div class="navbar-side" v-show="showNav && !loading">
        <a class="navbar-side-btn active" v-on:click="btnHome">
            <svg class="navbar-side-btn-logo" viewBox="0 0 662.783 592.127">
                <path d="M0,296.448l30.72,34.561l71.424-63.744v324.863h178.944V387.84h99.84v204.287h179.712V267.264l71.424,63.744l30.719-34.561
		              L331.776,0L0,296.448z M514.561,546.049h-88.32V341.76h-192v204.289h-86.016V225.792L331.776,62.208l182.785,163.584V546.049z"/>
            </svg>
            <span class="navbar-side-btn-caption one-line">
                Home
            </span>
        </a>
        <a class="navbar-side-btn" v-bind:class="{'active': auth.status && !loading}" v-on:click="btnModal('addevNews')">
            <svg class="navbar-side-btn-logo" viewBox="-34.248 0 130 89">
        		<g>
                    <path d="M42.307,11.001H32.282c2.734,4.02,4.334,8.873,4.334,14.101c0,3.985-0.933,7.751-2.586,11.098h8.277V11.001z"/>
                    <rect x="13.486" y="51.799" width="28.82" height="4.801"/>
                    <path d="M42.307,41.8H30.25c-1.67,1.872-3.614,3.495-5.772,4.799h17.829V41.8z"/>
                    <path d="M4.002,1.145C6.374,0.401,8.897,0,11.514,0H4.002V1.145z"/>
                    <path d="M85.172,0H11.514c5.873,0,11.269,2.022,15.545,5.4h53.006v66.998H9.109V50.085c-1.762-0.167-3.471-0.515-5.107-1.027
                        v28.943h81.17V0z"/>
                    <rect x="13.486" y="62.001" width="28.82" height="4.798"/>
                    <polygon points="47.047,46.599 75.141,46.599 75.141,41.8 47.049,41.8 47.047,41.8    "/>
                    <polygon points="47.047,56.6 75.141,56.6 75.141,51.799 47.049,51.799 47.047,51.799  "/>
                    <polygon points="47.047,26 75.141,26 75.141,21.199 47.049,21.199 47.047,21.199  "/>
                    <polygon points="89.001,11 89.001,16.599 90.645,16.599 90.645,83.402 18.594,83.402 18.594,81.6 13.486,81.6 13.486,89 95.752,89 
                        95.752,11   "/>
                    <polygon points="47.047,66.799 75.141,66.799 75.141,62.001 47.049,62.001 47.047,62.001  "/>
                    <polygon points="47.047,36.399 75.141,36.399 75.141,31.6 47.049,31.6 47.047,31.6    "/>
                    <polygon points="75.141,11.001 47.049,11.001 47.047,11.001 47.047,15.8 75.141,15.8  "/>
                </g>
                <path d="M11.514,4.25c-11.516,0-20.852,9.335-20.852,20.852c0,4.312,1.31,8.317,3.552,11.642l-27.291,27.291
                    c-1.562,1.562-1.562,4.095,0,5.656c0.781,0.781,1.805,1.172,2.829,1.172s2.047-0.391,2.829-1.172l27.291-27.29
                    c3.325,2.242,7.331,3.551,11.643,3.551c11.516,0,20.852-9.335,20.852-20.851C32.366,13.585,23.03,4.25,11.514,4.25z M11.514,39.726
                    c-8.077,0-14.625-6.548-14.625-14.625c0-8.077,6.548-14.625,14.625-14.625s14.625,6.548,14.625,14.625
                    C26.139,33.178,19.591,39.726,11.514,39.726z"/>
            </svg>
            <span class="navbar-side-btn-caption">
                Search
                <br>
                from event
            </span>
        </a>
        <a class="navbar-side-btn" v-bind:class="{'active': auth.status && !loading}" v-on:click="btnModal('addevDates')">
            <svg class="navbar-side-btn-logo" viewBox="0 0 130 89">
                <path d="M70.631,28.48c-0.521,3.867-1.917,7.456-3.99,10.556v9.024H55.91c-3.104,1.375-6.535,2.144-10.148,2.144
                    c-0.081,0-0.161-0.005-0.242-0.006v31.6c0,3.979,3.439,7.203,7.68,7.203h69.12c4.24,0,7.68-3.225,7.68-7.203V28.48H70.631z
                     M66.641,83.66H51.28V69.42h15.36V83.66z M66.641,65.86H51.28V51.62h15.36V65.86z M85.84,83.66H70.48V69.42H85.84V83.66z
                     M85.84,65.86H70.48V51.62H85.84V65.86z M85.84,48.06H70.48V33.82H85.84V48.06z M105.039,83.66H89.68V69.42h15.359V83.66z
                     M105.039,65.86H89.68V51.62h15.359V65.86z M105.039,48.06H89.68V33.82h15.359V48.06z M124.24,83.66h-15.359V69.42h15.359V83.66z
                     M124.24,65.86h-15.359V51.62h15.359V65.86z M124.24,48.06h-15.359V33.82h15.359V48.06z"/>
                <path d="M122.32,10.68h-12.48V2.67c0-1.475-1.291-2.67-2.879-2.67c-1.592,0-2.881,1.195-2.881,2.67v8.01H71.44V2.67
                    c0-1.475-1.29-2.67-2.88-2.67C66.97,0,65.68,1.195,65.68,2.67v7.163c2.24,2.917,3.854,6.338,4.641,10.067
                    c0.677-0.488,1.12-1.243,1.12-2.099v-4.62c1.72,0.923,2.88,2.645,2.88,4.62c0,2.23-1.476,4.139-3.571,4.938
                    c0.067,0.719,0.104,1.446,0.109,2.181H130v-0.89v-6.147C130,13.904,126.561,10.68,122.32,10.68z M106.961,23.14
                    c-3.182,0-5.762-2.392-5.762-5.34c0-1.975,1.162-3.696,2.881-4.619V17.8c0,1.474,1.289,2.67,2.881,2.67
                    c1.588,0,2.879-1.196,2.879-2.67v-4.62c1.721,0.923,2.881,2.645,2.881,4.62C112.721,20.749,110.141,23.14,106.961,23.14z"/>
                <path d="M45.762,4.25c-11.516,0-20.852,9.335-20.852,20.852c0,4.312,1.31,8.317,3.552,11.643L1.171,64.035
                    c-1.562,1.561-1.562,4.094,0,5.656C1.953,70.473,2.976,70.863,4,70.863s2.047-0.391,2.829-1.172l27.291-27.291
                    c3.325,2.242,7.33,3.553,11.643,3.553c11.516,0,20.852-9.336,20.852-20.852C66.613,13.585,57.277,4.25,45.762,4.25z M45.762,39.727
                    c-8.077,0-14.625-6.549-14.625-14.625c0-8.077,6.548-14.625,14.625-14.625s14.625,6.548,14.625,14.625
                    C60.387,33.178,53.839,39.727,45.762,39.727z"/>
            </svg>
            <span class="navbar-side-btn-caption">
                Search
                <br>
                from date
            </span>
        </a>
        <a class="navbar-side-btn" v-on:click="btnShare" v-bind:class="{'active': (auth.status && currentEvent.id && !loading)}">
            <svg class="navbar-side-btn-logo" viewBox="0 0 460.815 614.4">
                <path d="M364.815,422.4c-20.099,0-38.854,6.229-54.298,16.834l-124.723-98.065c3.978-10.575,6.229-21.935,6.229-33.977
                	c0-12.304-2.404-24.076-6.598-34.875l122.85-98.665c15.812,11.52,35.39,18.347,56.54,18.347c53.022,0,96-42.977,96-96
                	c0-53.022-42.978-96-96-96c-53.1,0-96,42.978-96,96c0,10.952,1.797,21.45,5.177,31.235L149.269,227.397
                	c-15.153-10.199-33.523-16.197-53.253-16.197C42.939,211.2,0,254.178,0,307.2s42.939,96,96.016,96
                	c20.021,0,38.776-6.151,54.229-16.727l124.723,98.027c-3.978,10.575-6.151,22.011-6.151,33.899c0,53.022,42.9,96,96,96
                	c53.022,0,96-42.978,96-96S417.838,422.4,364.815,422.4z"/>
            </svg>
            <span class="navbar-side-btn-caption one-line">
                Share
            </span>
        </a>
        <a class="navbar-side-btn" v-on:click="btnLogout" v-bind:class="{'active': auth.status}">
            <svg class="navbar-side-btn-logo" viewBox="0 0 787.982 788">
                <path d="M521.489,566.784c-13.983,0-25.359,11.376-25.359,25.359v125.475c0,10.842-8.82,19.662-19.662,19.662H70.38
            		c-10.841,0-19.66-8.819-19.66-19.66V70.382c0-10.842,8.819-19.662,19.66-19.662h406.087c10.841,0,19.66,8.82,19.66,19.662V186.64
            		c0,13.983,11.377,25.36,25.36,25.36s25.359-11.376,25.359-25.36V70.382C546.848,31.573,515.275,0,476.468,0H70.38
            		C31.572,0,0,31.573,0,70.382v647.236C0,756.427,31.572,788,70.38,788h406.087c38.807,0,70.38-31.573,70.382-70.382V592.144
            		C546.85,578.16,535.473,566.784,521.489,566.784z"/>
            	<path d="M780.574,375.412L651.325,246.164c-4.791-4.79-11.159-7.428-17.934-7.428s-13.143,2.639-17.933,7.43
            		c-9.886,9.891-9.884,25.979,0.002,35.863l86.612,86.611H241.936c-13.983,0-25.36,11.376-25.36,25.36s11.376,25.36,25.36,25.36
            		h460.131l-86.609,86.607c-9.885,9.889-9.885,25.978,0.005,35.87c4.792,4.788,11.16,7.425,17.932,7.425
            		c6.775,0,13.145-2.639,17.931-7.428l129.249-129.248c5.109-5.11,7.571-11.876,7.399-18.587
            		C788.146,387.289,785.684,380.522,780.574,375.412z"/>
            </svg>
            <span class="navbar-side-btn-caption one-line">
                Log-out
            </span>
        </a>
    </div>
  </div>

</template>

<script type="text/javascript">
  import applogo from './applogo.vue'
  import {toggleShowNav, initState, setCurrentModal} from '../vuex/ui_actions'
  import {logout} from '../vuex/dz_actions'

  export default {
    replace: true,
    components: {'app-logo': applogo},
    vuex: {
        getters: {
            loading: (state) => state.appLoading || state.eventLoading || state.moving,
            showNav: state => state.showNav,
            events: state => state.events,
            currentEvent: state => state.currentEvent,
            auth: state => state.auth
        },
        actions: {toggleShowNav, initState, logout, setCurrentModal}
    },
    methods: {
        btnLogout: function () {
            this.initState().then(() => {
                this.logout().then(() => {
                    this.$router.go('/')
                })
            })
        },
        btnHome: function () {
            this.initState().then(() => {
                this.$router.go('/')
            })
        },
        btnModal: function (type) {
            if (this.auth.status && !this.loading) {
                this.setCurrentModal(type)
            }
        },
        btnShare: function () {
            console.log('The share feature is not available yet :)')
        }
    }
  }

</script>

<style>
.navbar-wrapper {
  z-index: 999; padding: 0;
  width:auto; height: auto;
  position: fixed; top:0; left:0;
}
/*MAIN BUTTON*/
.nav-main-btn {position: absolute; top:10px; left: 15px; background: none; border:none; width:245px;height:95px; cursor: pointer; border-radius: 10px;}
.nav-main-btn:hover, .navbar-wrapper.active .nav-main-btn {box-shadow: 0 0 30px 0 #505050; background-color: #282828;}
.nav-main-btn:disabled {box-shadow: none;cursor: default; pointer-events: none;}
.top-logo {position: absolute; top:12px; left:17px;}
.nav-burger {position: absolute; top: 43px; left: 215px; width: 15px; height: 19px;}
.nav-burger span, .nav-burger span:before, .nav-burger span:after {
  display: block; content: '';
  position: absolute;left:0;
  height: 3px; width: 100%;
  background: #FFFFE9;
}
.nav-burger span:before {top: -8px;}
.nav-burger span:after {bottom: -8px;}

/*POPUP NAV*/
.navbar-side {
    position: relative; top:10px; left: 275px;
    display: inline-block; height: 95px;
    /*border: 1px solid white;*/
    background-color: #282828;
    border-radius: 5px;
    box-shadow: 0 0 30px 0 #505050;
}
.navbar-side::before, .navbar-side::after {
    content: "\00a0"; z-index: -1;
    background-color: #282828;
    /*border: 1px solid white;*/
    box-shadow: 0 0 30px 0 #505050;
    position: absolute; display: block;
    width: 20px; height: 20px; left: -10px; top:35px;
    transform: rotate( 45deg );
}
.navbar-side::after {box-shadow: none; z-index: 10;}
.navbar-side-btn {
    display: inline-block; position: relative;
    overflow: hidden; cursor: pointer;
    color: #636363; font-family: 'Roboto Condensed', Helvetica, sans-serif;
    font-size: 19px; font-style: italic; text-align: center;
    top: 20%; width: 100px; height: 60%;
    border-right: 1px solid #636363;
}
.navbar-side-btn.active {cursor: pointer; color: #FEFCEA;}
.navbar-side-btn:last-child {border: none;}

.navbar-side-btn-logo {
    position: absolute; top: 10%; left: 10%;
    width: 80%; height: 80%;
    fill: #636363;
    transition: transform 0.1s ease;
}
.navbar-side-btn.active .navbar-side-btn-logo {fill: #FEFCEA}
.navbar-side-btn-caption {
    display: inline-block;
    transform: translateY(-70px);
    transition: transform 0.1s ease;
}
.navbar-side-btn-caption.one-line {margin-top: 12%;}
.navbar-side-btn.active:hover .navbar-side-btn-logo {transform: translateY(70px);}
.navbar-side-btn.active:hover .navbar-side-btn-caption {transform: translateY(0);}

</style>
