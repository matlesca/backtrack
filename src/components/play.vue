<template>
    <navbar></navbar>
    <sidebar></sidebar>

    <cosmos></cosmos>

    <songs-tab></songs-tab>

</template>

<script>
import sidebar from './sidebar/sidebar.vue'
import cosmos from './cosmos/cosmos.vue'
import navbar from './navbar.vue'
import songsTab from './songsTab.vue'

export default {
    replace: false,
    components: {sidebar, cosmos, navbar, 'songs-tab': songsTab}
}
</script>
