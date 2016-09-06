<template>
    <div class="modal-inner">
        <h2 class="modal-title">About Backtrack</h2>
        <div class="modal-scroll">
            <p class="about-text small">
                Backtrack lets you browse through a timeline of public events - or personal events using Facebook photo albums - and find out which music you listened to at that time.
            </p>
            <p class="about-text small">
                You need a Deezer account, that's where we get your listening history from.
            </p>
            <p class="about-text small">
                Backtrack doesn't keep any information about you - everything happens on your personal web browser.
            </p>
            <p class="about-text small">
                <span class="about-text medium">Credits</span>
                Built by <a href="https://twitter.com/matlesca">@matlesca</a>,
                based on the API of <a href="http://www.deezer.com/"><img width="100px" src="../../img/deez-logo.svg" alt="Deezer"/></a>
                <!-- <br>JS libraries : <a href="https://vuejs.org">Vue.js</a>, <a href="http://threejs.org/">Three.js</a>, <a href="https://firebase.google.com/">Firebase</a> -->
            </p>
            <p class="about-text small">
                <span>Icons from the Noun Project :</span>
                <br>
                Facebook <em>by Niels Gesquiere</em>,
                Music Note <em>by Tancrède Chaleil</em>,
                Newspaper <em>by Shane Herzog</em>,
                Share <em>by Margot Nadot</em>,
                Logout <em>by Olga Prikhodko</em>,
                Home <em>by Viktor Vorobyev</em>
            </p>
            <span class="about-text medium">Why Backtrack</span>
            <p class="about-text small">
                I live in Paris. During the terrorist attacks of November 13th, I kept listening to The Pains of Being Pure At Heart. A few weeks afterwards, when I heard their music again, I instantly got in the same mood : anxiety, discomfort, sadness. My brain had deeply associated these feelings to the band.
            </p>
            <p class="about-text small">
                However when I browsed backwards to my summer vacations in Britanny, it wasn't the same story : The Avalanches felt like freedom, family time, late picnics on the beach.
            </p>
            <p class="about-text small">
                Attracted by the experience? Go on and connect with your Deezer account!
            </p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

        </div>

        <svg class="modal-logo" viewBox="0 0 10 10">
            <text x="8%" y="78%" font-size="11px" font-family="Roboto, sans-serif">@</text>
        </svg>
    </div>
</template>

<script type="text/javascript">
export default {
    replace: true
}
</script>

<style>

    .about-text.small {font-size: 0.9em;}
    .about-text.lined {text-decoration: underline;}

</style>
