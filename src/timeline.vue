<template>
  <div class="timeline-wrapper">
    <div class="timeline-main">
      <div class="timeline-step"></div>
      <div class="timeline-gradient"></div>

    </div>
  </div>


</template>

<script type="text/javascript">
  export default {
    replace: true,
    methods: {

    },
    created: function () {

    },
    events: {

    },
    data () {
      return {

      }
    }
  }

</script>

<style>
.timeline-wrapper {
  z-index: 999;
  position: fixed; top:0; right:0;
  width: 100px; height:100%;
  /*background-color: #576271;*/
  background-color: none;
}
.timeline-main {
  position: absolute; right:0;
  width: 30px; height:100%; margin:0; padding: 0;
  transition: width 0.08s ease;
  background-color: #E0E3DA;
  background-color: #576271;
}
.timeline-wrapper:hover .timeline-main {width:100px;}
.timeline-gradient {
  display:none;
  width:100%; height:200%;
  top:0;transform:translateY(-50%);
  background: linear-gradient(0deg, #576271, #A493C6, #576271);
  /*background: linear-gradient(0deg, #576271, #E0E3DA, #576271);*/
  /*background: linear-gradient(0deg, #E0E3DA, #A493C6, #E0E3DA);*/
  background-size: 100% 50%;
  animation: movegrad 0.6s linear infinite;
}
/*.timeline-wrapper:hover .timeline-gradient {display:block;}*/

.timeline-step {
  position: absolute;
  top:100px; width:100%; height:20px;
  background-color: #A493C6;
}
@keyframes movegrad {
    0% {transform: translateY(-50%);}
    100% {transform: translateY(0%);}
}

</style>
