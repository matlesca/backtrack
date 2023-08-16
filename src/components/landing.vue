<template>
  <div class="cosmos-main"></div>
  <div class="header-main">
    <div class="header-logo-wrapper">
      <app-logo size="big"></app-logo>
    </div>
    <div class="header-message">
      <span v-show="currentHeader === 'welcome'" transition="head">
        {{
          locale === "fr"
            ? "Redécouvre ton historique d'écoute musical"
            : "Rediscover your music listening history"
        }}
      </span>
      <span v-show="currentHeader === 'authLoading'" transition="head">
        {{
          locale === "fr"
            ? "Connexion en cours.."
            : "Fetching your account information.."
        }}
      </span>
      <span v-show="currentHeader === 'helloX'" transition="head">
        {{
          locale === "fr"
            ? "Salut " + loginName + " !"
            : "Hello " + loginName + " !"
        }}
      </span>
      <span v-show="currentHeader === 'connectError'" transition="head">{{
        connectErrorMessage
      }}</span>
      <span v-show="currentHeader === 'songLoading'" transition="head">
        {{
          locale === "fr"
            ? "Chargement de l'historique d'écoute.."
            : "Fetching your music listening history.."
        }}
      </span>
      <span v-show="currentHeader === 'songError'" transition="head">
        {{
          locale === "fr"
            ? "Erreur serveur, Backtrack n'a chargé que " +
              loadingSongsIndex +
              "/" +
              histoBound -
              1 +
              " chansons"
            : "Server error, Backtrack loaded only " +
              loadingSongsIndex +
              "/" +
              histoBound -
              1 +
              " songs"
        }}
      </span>
      <span v-show="currentHeader === 'eventLoading'" transition="head">
        {{
          locale === "fr" ? "Analyse des événements.." : "Processing events.."
        }}
      </span>
      <span v-show="currentHeader === 'playerLoading'" transition="head">
        {{
          locale === "fr"
            ? "Chargement du lecteur musical.."
            : "Loading the music player.."
        }}
      </span>
      <span class="clearer"></span>
    </div>
    <div
      class="loading-bar-wrapper"
      v-show="currentHeader === 'songLoading'"
      transition="opac"
    >
      <div class="loading-bar-back" v-bind:style="{ backgroundColor: bckCol }">
        <div
          class="loading-bar-front"
          v-bind:style="{ width: loadWidth + '%' }"
        ></div>
      </div>
      <div class="loading-bar-text">
        {{ loadingSongsIndex }} / {{ histoBound - 1 }}
      </div>
    </div>
    <div
      class="header-bt-wrapper bt-start"
      v-show="currentHeader === 'welcome'"
      transition="opac"
    >
      <button
        type="button"
        class="bt-violet"
        name="button"
        v-on:click="startConnect()"
        v-if="!fullyLoaded"
      >
        {{ locale === "fr" ? "Connexion" : "Login" }}<br />
        <em>{{ locale === "fr" ? "avec" : "using" }} Deezer</em>
      </button>
      <button
        type="button"
        class="bt-violet"
        name="button"
        v-on:click="goPlay()"
        v-if="fullyLoaded"
      >
        {{ locale === "fr" ? "Retour à" : "Back to" }}<br />
        {{ locale === "fr" ? "l'appli" : "the app" }}
      </button>
      <button
        type="button"
        class="bt-brown lh2"
        name="button"
        v-on:click="setCurrentModal('about')"
      >
        {{ locale === "fr" ? "A propos" : "About" }}
      </button>
      <button
        type="button"
        class="bt-brown lh2"
        name="button"
        v-on:click="logout()"
        v-if="fullyLoaded"
      >
        {{ locale === "fr" ? "Déconnexion" : "Log-out" }}
      </button>
    </div>
    <div
      class="header-bt-wrapper bt-error"
      v-show="currentHeader === 'songError' || currentHeader === 'connectError'"
      transition="opac"
    >
      <button
        type="button"
        class="bt-violet lh2"
        name="button"
        v-on:click="startConnect()"
      >
        {{ locale === "fr" ? "Réessayer" : "Try again" }}
      </button>
      <button
        v-show="currentHeader === 'songError'"
        type="button"
        class="bt-brown lh2"
        name="button"
        v-on:click="continueLoad()"
      >
        {{ locale === "fr" ? "Continuer" : "Continue" }}
      </button>
    </div>
    <!-- <div class="header-about-wrap">
            <a v-on:click="setCurrentModal('about')">About</a>
        </div> -->
  </div>
</template>

<script>
import applogo from "./applogo.vue";
import {
  logout,
  login,
  initApp,
  initPlayer,
  getHistoBound,
  getAllSongs,
  resetSongs,
} from "../vuex/dz_actions";
import { setAppLoading, setCurrentModal } from "../vuex/ui_actions";
import { generateDateTags, generateEvents } from "../vuex/genevents_actions.js";
import Cosmos from "./cosmos/cosmosRendering.js";

export default {
  components: { "app-logo": applogo },
  vuex: {
    actions: {
      setAppLoading,
      logout,
      login,
      initApp,
      initPlayer,
      generateDateTags,
      generateEvents,
      getHistoBound,
      getAllSongs,
      resetSongs,
      setCurrentModal,
    },
    getters: {
      // Init app :
      auth: (state) => state.auth,
      isInitApp: (state) => state.isInitApp,
      isInitPlayer: (state) => state.isInitPlayer,
      locale: (state) => state.locale,
      // Songs loading :
      loadingSongsIndex: (state) => state.loadingSongsIndex,
      histoBound: (state) => state.histoBound,
      songLoadProg: (state) => {
        if (state.histoBound === 0) {
          return 0;
        } else {
          return Math.round((100 * state.loadingSongsIndex) / state.histoBound);
        }
      },
      bckCol: (state) => state.bckCol,
      randKey: (state) => state.randKey,
    },
  },
  computed: {
    loadWidth: function () {
      return Math.min(
        100,
        Math.round(
          (100 * this.loadingSongsIndex) / Math.max(this.histoBound - 1, 1)
        )
      );
    },
    fullyLoaded: function () {
      return (
        this.isInitApp &&
        this.isInitPlayer &&
        this.auth &&
        this.loadingSongsIndex > 0
      );
    },
  },
  methods: {
    initCosmos: function () {
      this.myCosmos.init(3000, false, 60);
      this.myCosmos.isAnim = true;
      this.myCosmos.moveParticles(-3000);
    },
    startConnect: function () {
      this.currentHeader = "authLoading";
      this.setAppLoading(true);
      if (this.isInitApp) {
        this.resetSongs().then(() => {
          this.login()
            .then((response) => {
              this.loadHistoBound(response.name);
            })
            .catch((error) => {
              this.setAppLoading(false);
              this.currentHeader = "connectError";
              this.connectErrorMessage =
                error.message[this.locale === "fr" ? "fr" : "en"];
            });
        });
      } else {
        this.initApp().then(this.startConnect);
      }
    },
    continueLoad: function () {
      if (this.currentHeader === "songError") {
        this.loadEvents();
      }
    },
    loadHistoBound: function (name) {
      this.currentHeader = "helloX";
      this.setAppLoading(true);
      this.loginName = name;
      this.getHistoBound()
        .then(() => {
          this.loadSongs();
        })
        .catch((error) => {
          this.setAppLoading(false);
          this.currentHeader = "connectError";
          this.connectErrorMessage =
            error.message[this.locale === "fr" ? "fr" : "en"];
        });
    },
    loadSongs: function () {
      this.currentHeader = "songLoading";
      this.setAppLoading(true);
      this.getAllSongs()
        .then(() => {
          this.loadEvents();
        })
        .catch((error) => {
          console.log(error);
          this.setAppLoading(false);
          this.currentHeader = "songError";
        });
    },
    loadEvents: function () {
      this.currentHeader = "eventLoading";
      this.setAppLoading(true);
      this.generateEvents().then(() => {
        this.generateDateTags().then(() => {
          this.loadPlayer();
        });
      });
    },
    loadPlayer: function () {
      this.currentHeader = "playerLoading";
      this.setAppLoading(true);
      this.initPlayer().then(() => {
        this.setAppLoading(false);
        this.goPlay();
      });
    },
    goPlay: function () {
      this.$router.go("/play");
    },
  },
  ready: function () {
    this.myCosmos = new Cosmos(".cosmos-main", this.bckCol, this.randKey);
    setTimeout(this.initCosmos, 1500);
    setTimeout(() => (this.currentHeader = "welcome"), 800);
  },
  data: () => {
    return {
      myCosmos: {},
      loginName: "",
      currentHeader: "",
      connectErrorMessage: "",
    };
  },
};
</script>

<style>
/*GLOBAL WRAPPING*/
.cosmos-main {
  position: absolute;
  overflow: hidden;
  z-index: 0;
  width: 100%%;
  height: 100%;
}
.header-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.header-logo-wrapper {
  margin-top: 120px;
  width: 100%;
  text-align: center;
}

/*HEADER TEXT*/
.header-message {
  font-family: "Raleway", "Helvetica", sans-serif;
  font-size: 3em;
  text-align: center;
  margin-top: 80px;
  color: white;
}
.clearer {
  clear: both;
}

/*BUTTONS*/
.header-bt-wrapper {
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 80px;
}
.header-bt-wrapper button {
  margin: 10px 50px;
  padding: 10px;
  font-size: 1.1em;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  font-family: "Roboto", "Helvetica", sans-serif;
  border-radius: 5px;
  border: none;
}
.bt-violet {
  background-color: #a493c6;
}
.bt-brown {
  background-color: #e0e3da;
}
.header-bt-wrapper em {
  font-style: normal;
  font-size: 0.9em;
  opacity: 0.6;
}
/*.lh2 {line-height: 2em;}*/

/*LOADING BAR*/
.loading-bar-wrapper {
  position: relative;
  text-align: center;
  width: 100%;
  height: 50px;
  top: 100px;
}
.loading-bar-back {
  display: inline-block;
  text-align: left;
  height: 100%;
  width: 80%;
  max-width: 500px;
  /*background-color: #576271;*/
  opacity: 0.7;
}
.loading-bar-front {
  height: 100%;
  background-color: #a493c6;
  transition: width 100ms ease;
}
.loading-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #e0e3da;
  font-family: "Roboto", "Helvetica", sans-serif;
  font-size: 24px;
}

/*ABOUT LINK*/
.header-about-wrap {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
.header-about-wrap a {
  font-family: "Raleway", "Helvetica", sans-serif;
  cursor: pointer;
  text-decoration: underline;
  color: #ffffe9;
  font-style: italic;
}

/*TRANSITIONS*/
.head-transition {
  width: 100%;
  text-align: center;
  opacity: 1;
  transition: all 0.4s ease-out;
}
.head-enter,
.head-leave {
  opacity: 0;
  position: absolute;
  left: 0;
}
.head-enter {
  transform: translateY(20px);
}
.head-leave {
  transform: translateY(-40px);
}
.opac-transition {
  opacity: 1;
  transition: all 0.4s ease-in;
}
.opac-enter,
.opac-leave {
  opacity: 0;
}
</style>
