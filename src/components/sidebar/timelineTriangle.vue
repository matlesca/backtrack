<template>
    <svg class="step-triangle" viewbox="0 0 100 100" v-bind:style="styleObject" preserveAspectRatio="none">
        <polygon points="0,0 100,0 50,100">
    </svg>
</template>

<script type="text/javascript">
export default {
    replace: true,
    props: ['pos', 'stepheight'],
    computed: {
        styleObject: function () {
            return {
                'transform': 'translateY(' + this.pos + 'px)',
                'height': this.stepheight + 'px'
            }
        }
    }
}

</script>

<style>

.step-triangle {
    fill:#E0E3DA; width: 100%;
    position: absolute; top:0; left:0;
    transition: transform 1s ease;
}

</style>
