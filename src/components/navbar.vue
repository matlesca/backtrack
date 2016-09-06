<template>
  <div class="navbar-wrapper" v-bind:class="{'active': showNav}">
    <a class="nav-main-btn" type="button" v-on:click.prevent="toggleShowNav()">
      <app-logo class="top-logo" size="small"></app-logo>
      <span class="nav-burger"><span></span></span>
    </a>
    <div class="navbar-side" v-show="showNav">
        <a class="navbar-side-btn active" v-on:click="btnHome">
            <svg class="navbar-side-btn-logo" viewBox="0 0 662.783 592.127">
                <path d="M0,296.448l30.72,34.561l71.424-63.744v324.863h178.944V387.84h99.84v204.287h179.712V267.264l71.424,63.744l30.719-34.561
		              L331.776,0L0,296.448z M514.561,546.049h-88.32V341.76h-192v204.289h-86.016V225.792L331.776,62.208l182.785,163.584V546.049z"/>
            </svg>
            <span class="navbar-side-btn-caption one-line">
                Home
            </span>
        </a>
        <a class="navbar-side-btn" v-bind:class="{'active': auth.status && !loading}" v-on:click="btnAddEvent('addevNews')">
            <svg class="navbar-side-btn-logo" viewBox="0 0 768 679.435">
        		<path d="M688.604,319.111H447.36v36.634h241.244V319.111z M407.662,83.98H172.531v36.642h235.146V83.98H407.662z M688.604,473.318
        			H447.36v36.642h241.244V473.318z M688.604,395.443H447.36v36.648h241.244V395.443z M645.857,636.702H42.754V126.72h13.748V83.973
        			H0v595.461h688.604v-56.479h-42.747V636.702L645.857,636.702z M684.02,83.98H447.36v192.376H684.02V83.98z M407.662,473.318
        			H172.531v36.642h235.146v-36.642H407.662L407.662,473.318z M88.558,0v595.469H768V0H88.558z M725.253,552.698H131.305V41.226
        			h593.94L725.253,552.698L725.253,552.698z M407.662,395.443H172.531v36.648h235.146v-36.648H407.662z M407.662,161.84H172.531
        			v36.642h235.146V161.84H407.662z M407.662,319.111H172.531v36.634h235.146v-36.634H407.662z M407.662,241.236H172.531v36.642
        			h235.146v-36.642H407.662z"/>
            </svg>
            <span class="navbar-side-btn-caption">
                Add from
                <br>
                the news
            </span>
        </a>
        <a class="navbar-side-btn" v-bind:class="{'active': auth.status && !loading}">
            <svg class="navbar-side-btn-logo" viewBox="0 0 760.32 760.32">
                <path d="M701.244,0H59.077C26.521,0,0,26.519,0,59.075v642.169c0,32.557,26.521,59.076,59.077,59.076h326.521h150.9h164.747
                	c32.554,0,59.075-26.52,59.075-59.076V59.075C760.32,26.519,733.799,0,701.244,0z M424.32,721.92V441.601h-94.08v-69.12h94.08
                	V272.264c0-39.6,11.307-71.865,33.003-93.31c20.845-20.604,51.5-31.494,88.062-31.494c25.695,0,47.893,1.262,65.173,2.496v60.841
                	l-39.289,0.018c-73.19,0-73.991,54.368-73.991,72.236v89.43h106.061l-9.095,69.12H497.28V721.92H424.32z M721.92,701.244
                	c0,11.381-9.297,20.676-20.676,20.676H535.68V480h92.331l19.001-145.92H535.68v-51.03c0-13.251,2.164-21.508,5.93-25.981
                	c4.389-5.213,14.834-7.854,29.877-7.854l77.474-0.035V115.732l-17.064-2.214c-8.71-1.158-43.51-4.458-86.786-4.458
                	c-46.883,0-86.498,14.725-114.684,42.583c-29.157,28.819-44.506,70.529-44.506,120.62v61.816h-94.08V480h94.08v241.92H59.077
                	c-11.382,0-20.676-9.295-20.676-20.676V59.075c0-11.382,9.294-20.674,20.676-20.674h642.167c11.379,0,20.676,9.292,20.676,20.674
                	V701.244z"/>
            </svg>
            <span class="navbar-side-btn-caption">
                Add from
                <br>
                facebook
            </span>
        </a>
        <a class="navbar-side-btn" v-bind:class="{'active': (auth.status && currentEvent.id && !loading)}">
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
        btnAddEvent: function (type) {
            if (this.auth.status && !this.loading) {
                this.setCurrentModal(type)
            }
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
