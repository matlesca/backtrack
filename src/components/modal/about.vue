<template>
    <div class="modal-inner">
        <h2 class="modal-title">{{locale === 'fr' ? 'A propos de' : 'About'}} Backtrack</h2>
        <div class="modal-scroll">
            <div class="about-wrap">
                <div class="about-center">
                    {{locale === 'fr' ? '- Créé par ' : '- Built by '}}<a href="https://twitter.com/matlesca">@matlesca</a>,
                    {{locale === 'fr' ? 'basé sur l\'API de Deezer -' : 'based on the API of Deezer -'}}
                </div>
                <div class="about-grid">
                    <div class="about-grid-elem">
                        <div class="about-grid-elemin">
                            <div class="about-logo-wrap">
                                <svg class="search-logo" viewBox="0 0 66.616 66.613">
                                    <path d="M0,20.851c0,11.516,9.336,20.852,20.852,20.852c4.313,0,8.318-1.311,11.644-3.553l27.291,27.291
                                        c0.782,0.781,1.805,1.172,2.829,1.172s2.047-0.391,2.829-1.172c1.562-1.562,1.562-4.096,0-5.656l-27.291-27.29
                                        c2.242-3.326,3.552-7.331,3.552-11.643C41.705,9.335,32.369,0,20.854,0S0.002,9.335,0,20.851z M6.229,20.852
                                        c0-8.077,6.548-14.625,14.625-14.625c8.076,0,14.624,6.548,14.624,14.625c0,8.076-6.548,14.625-14.624,14.625
                                        C12.776,35.477,6.229,28.928,6.229,20.852z"/>
                                </svg>
                            </div>
                            {{locale === 'fr' ? 'Backtrack propose une gallerie d\'événements publics, et te permets de découvrir ce que tu écoutais à ce moment là.' : 'Backtrack lets you browse through a timeline of public events and find out which music you listened to at that time.'}}
                        </div>
                    </div>
                    <div class="about-grid-elem">
                        <div class="about-grid-elemin">
                        <div class="about-logo-wrap">
                            <img height="50px" src="../../img/deez-logo.svg" alt="Deezer"/>
                        </div>
                            {{locale === 'fr' ? 'Un compte Deezer est obligatoire, c\'est ce qui nous permet d\'obtenir ton historique d\'écoute.' : 'You need a Deezer account, that\'s where we get your listening history from.'}}
                        </div>
                    </div>
                    <div class="about-grid-elem">
                        <div class="about-grid-elemin">
                            <div class="about-logo-wrap">
                                <svg viewBox="0 0 74.879 84.467">
                                    <path d="M73.74,15.872L38.22,0.152c-0.286-0.128-0.571-0.161-0.84-0.15s-0.521,0.065-0.72,0.15L1.14,15.872
                                        c-0.67,0.298-1.135,1.007-1.14,1.74c0,21.747,4.783,35.912,11.82,45.87c7.037,9.959,16.223,15.608,24.63,20.7
                                        c0.65,0.392,1.412,0.369,1.98,0c8.407-5.092,17.591-10.741,24.63-20.7c7.037-9.958,11.818-24.123,11.818-45.87
                                        C74.869,16.879,74.41,16.169,73.74,15.872z M59.939,61.262c-6.266,8.866-14.437,14.118-22.5,19.021
                                        c-8.064-4.902-16.233-10.152-22.5-19.021c-6.385-9.036-10.85-22.012-11.04-42.42l33.54-14.82l33.539,14.82
                                        C70.789,39.25,66.326,52.226,59.939,61.262z"/>
                                    <path d="M37.41,37.442c-3.486,0-6.666,0.767-9.12,2.19s-4.32,3.689-4.32,6.45v7.68c0.009,0.819,0.594,1.601,1.38,1.83
                                        c3.527,1.004,6.439,0.966,10.11,1.05h3.9c3.67-0.084,6.583-0.046,10.11-1.05c0.786-0.229,1.374-1.011,1.379-1.83v-7.68
                                        c0-2.761-1.865-5.027-4.32-6.45C44.076,38.209,40.895,37.442,37.41,37.442z"/>
                                    <path d="M37.44,24.335c-3.689,0-6.72,3.031-6.72,6.72s3.031,6.72,6.72,6.72c3.688,0,6.719-3.032,6.719-6.72
                                        S41.128,24.335,37.44,24.335z"/>
                                </svg>
                            </div>
                            {{locale === 'fr' ? 'Backtrack ne garde aucune information sur toi - tout se passe sur le navigateur internet.' : 'Backtrack doesn\'t keep any information about you - everything happens on your personal web browser.'}}
                        </div>
                    </div>
                </div>
                <div class="about-under">
                    <p class="about-under-title">{{locale === 'fr' ? 'Pourquoi' : 'Why'}} Backtrack ?</p>
                    {{locale === 'fr' ? 'Lors des attentats terroristes du 13/11/2015 à Paris, j\'écoutais beaucoup The Pains of Being Pure At Heart. Depuis, dès que passe une de leurs musiques, je retrouve les mêmes émotions : tristesse, inconfort, anxiété. Mon cerveau les a profondément associées au groupe.' : 'During the terrorist attacks of November 13th in Paris, I kept listening to The Pains of Being Pure At Heart. Now whenever I hear their music again, I instantly get in the same mood : sadness, discomfort, anxiety. My brain has deeply associated these feelings to the band.'}}
                    <br>
                    {{locale === 'fr' ? 'Au contraire, les australiens de The Avalanches me rappellent les vacances d\'été : liberté, famille, soirées pic-nic sur la plage.' : 'On the contrary, the Australian band The Avalanches feels to me like summer vacations : freedom, family time, late picnics on the beach.'}}
                    <br>
                    {{locale === 'fr' ? 'Envie de faire la même experience ? Connecte-toi avec un compte Deezer !' : 'Attracted by the experience? Go on and connect with your Deezer account!'}}
                </div>
                <div class="about-under">
                    <p class="about-under-title">{{locale === 'fr' ? 'Icônes issues de' : 'Icons from'}} The Noun Project :</p>
                    Newspaper <em>by Shane Herzog</em>,
                    Calendar <em>by Edward Boatman</em>,
                    Share <em>by Margot Nadot</em>,
                    Logout <em>by Olga Prikhodko</em>,
                    Home <em>by Viktor Vorobyev</em>,
                    Sun <em>by Creative outlet</em>,
                    Chinese motif <em>by Rflor</em>,
                    Turkey <em>by Pumpkin Juice</em>,
                    Drum <em>by Creative Stall</em>,
                    Pumpkin <em>by Artworkbean</em>,
                    Rabbit Foot <em>by Richard Zeid</em>,
                    Heart <em>by Okan Benn</em>,
                    Fireworks <em>by Sergey Demushkin</em>,
                    Christmas ornament <em>by Retinaicon</em>,
                    Family <em>by Sara</em>,
                    Tree <em>by Florent</em>,
                    Flower <em>by Brad Ashburn</em>,
                    Tea Leaves <em>by Korawan.M</em>,
                    Shield user <em>by Arjuazka</em>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
export default {
    replace: true,
    vuex: {
        getters: {
            locale: state => state.locale
        }
    }
}
</script>

<style>
    .about-wrap {
        padding: 10px 20px;
        font-size: 1em; color: #8EACB7;
    }
    .about-wrap a {color: #A493C6; cursor: pointer;}
    .about-center {font-size: 1.2em; color: #A493C6; padding: 0 20px; text-align: center; margin: 10px 0;}
    .about-under {
        padding: 20px;
        margin: 20px 30px; border-radius: 10px;
        background-color: rgba(100, 100, 110, 0.5);
        font-size: 0.95em; opacity: 0.9; color: #A493C6;
        /*color: #748C93;*/
    }
    .about-under .about-under-title {
        color: #A493C6;
        font-weight: bold; font-size: 1.2em; margin: 0 0 5px 0;
    }

    .about-grid {margin-top: 40px;}
    .about-grid-elem {width: 33%; margin-bottom: 30px; display: inline-block; position: relative; vertical-align: top;}
    .about-grid-elemin {padding: 0 10px; text-align: center;}

    .about-logo-wrap {text-align: center; margin-bottom: 10px;}
    .about-logo-wrap svg {height: 50px; fill: #8EACB7;}

    @media (max-width: 800px) {
        .about-under {margin: 15px 5px;}
        .about-grid-elem {width: 49%;}
    }
    @media (max-width: 460px) {
        .about-grid-elem {width: 100%;}
    }

</style>
