<template>
  <svg class="backtrack-logo" v-bind:class="{'is-loading': loading}" viewBox="0 0 140 60">
    <g class="static-logo">
      <text transform="matrix(1 0 0 1 -4.882812e-04 32.2866)" font-family="'RobotoCondensed-LightItalic'" font-size="35">backtrack</text>
      <path class="backtrack-logo-line" stroke-miterlimit="10" d="M125.7,0c8.491,5.552,13.525,12.46,13.525,19.948c0,18.317-30.134,33.169-67.303,33.169c-6.124,0-12.056-0.404-17.694-1.159"/>
      <g class="backtrack-logo-rocket">
      	<polygon points="43.672,56.866 47.159,59.45 48.495,55.255 49.829,51.058 51.163,46.858 52.498,42.663 48.16,42.759 	"/>
      	<path d="M25.333,43.269l16.462,12.205l4.026-12.662L25.333,43.269z M39.727,47.845c-0.376,1.184-1.642,1.838-2.828,1.463c-1.185-0.377-1.839-1.643-1.463-2.826c0.378-1.186,1.643-1.84,2.829-1.465C39.449,45.396,40.103,46.659,39.727,47.845z"/>
      </g>
    </g>
    <g class="loading-logo" transform="translate(30, 5)">
      <g class="loading-logo-spin">
        <path class="backtrack-logo-line" stroke-miterlimit="10" d="M9.217,5.934C14.69,0.863,22.594-1.331,30.31,0.826C42.115,4.128,49.009,16.37,45.707,28.167c-3.304,11.798-15.555,18.688-27.362,15.385"/>
        <g class="backtrack-logo-rocket">
          <polygon points="7.65,44.217 9.105,48.306 12.552,45.566 15.999,42.826 19.446,40.082 22.893,37.342 19.238,35.004 	"/>
	        <path d="M0,22.706l6.868,19.31l10.399-8.271L0,22.706z M9.401,34.527c-0.972,0.773-2.387,0.611-3.163-0.361c-0.774-0.973-0.612-2.388,0.36-3.161c0.974-0.775,2.389-0.612,3.166,0.36C10.535,32.341,10.374,33.753,9.401,34.527z"/>
        </g>
      </g>
    </g>

  </svg>

</template>

<script type="text/javascript">
  export default {
    props: ['loading']
  }

</script>

<style>

.backtrack-logo {font-family: 'Roboto Condensed', sans-serif; font-style: italic;}
.backtrack-logo-line {stroke: #FFFFE9; fill: none}
.backtrack-logo text, .backtrack-logo-rocket {fill: #FFFFE9}
.static-logo, .loading-logo-spin {transition: opacity 0.6s ease}
.loading-logo-spin {opacity:0;transform-origin: 50% 48%}

.backtrack-logo.is-loading .static-logo {opacity:0;}
.backtrack-logo.is-loading .loading-logo-spin {opacity: 1; animation:spin 0.6s linear infinite 0.1s;}

@keyframes spin {100% {transform:rotate(360deg);}}

</style>
