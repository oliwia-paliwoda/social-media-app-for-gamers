<template>

  <div style="font-weight: bold" v-if="connection" class="role-card">
      <div class="role-icon" v-if="connections[connection].type === 'svg'" v-html="connections[connection].source"></div>
      <img class=role-icon-png v-else-if="connections[connection].type === 'png'" :src="connections[connection].source" />
    <span
        class="role-card-title"
        :style="{ fontWeight: username ? 'bold' : 'normal' }"
    >
      {{ username || connection }}
    </span>
  </div>

  <div v-else-if="role" class="role-card">
    <div
        :class="role === 'platformSteamDeck' ? 'role-icon-steamdeck' : 'role-icon'"
        v-html="role !== 'platformSteamDeck' ? getLogo(role) : null"
    ></div>
    <span class="role-card-title">{{ getTitle(role) }}</span>
  </div>

  <div v-else-if="countryCode" class="role-card">
    <img :src="getFlagSrc(countryCode)" class="flag-icon" alt="Flaga" />
    <span class="role-card-title">{{ getCountryName(countryCode) }}</span>
  </div>




</template>

<script>
import countryNames from '../countryNames';

export default {
  data() {
    return {
      NAME: 'RoleCard',



      connections: {
        Steam: {
          type: 'png',
          source: '/images/steam.png'

        },
        Discord: {
        type: 'png',
        source: '/images/discord.png',

        },
        Reddit: {
          type: 'png',
          source: '/images/reddit.png'
        },
        "Epic Games": {
          type: 'png',
          source: '/images/epic.png'

        },
        Xbox: {
          type: 'svg',
          source: `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0 0 48 48">
<path fill="#7cb342" d="M24.001 4A20 20 0 1 0 24.001 44A20 20 0 1 0 24.001 4Z"></path><path fill="#cfd8dc" d="M38.59,10.32c0,0-0.85-1.07-2.19-1.08c-1.32-0.01-2.72,0.6-3.94,1.4c-0.05,0.03-0.08,0.05-0.08,0.05l-0.01,0.02c-2.6,1.57-4.37,3.77-4.37,3.77c2.27,2.17,7.86,9.35,9.66,13.77c2.75,6.76,1.04,9.23,1.04,9.23c-0.32-3.7-5.96-10.29-7.93-12.39c-1-1.073-5.888-6.042-6.77-6.938c-0.882,0.896-5.77,5.865-6.77,6.938c-1.97,2.1-7.61,8.69-7.93,12.39c0,0-1.71-2.47,1.04-9.23c1.8-4.42,7.39-11.6,9.66-13.77c0,0-1.77-2.2-4.37-3.77l-0.01-0.02c0,0-0.03-0.02-0.08-0.05c-1.22-0.8-2.62-1.41-3.94-1.4c-1.34,0.01-2.19,1.08-2.19,1.08C6.05,13.91,4,18.7,4,24c0,11.05,8.95,20,20,20s20-8.95,20-20C44,18.7,41.95,13.91,38.59,10.32z"></path><path fill="#cfd8dc" d="M34.76,7.12C31.63,5.09,28.01,4,24,4s-7.63,1.09-10.76,3.12c-0.1,0.07-0.27,0.2-0.39,0.32c0.02-0.01,0.04-0.03,0.06-0.04c0.56-0.44,1.72-0.82,3.41-0.36C18.33,7.59,21.05,9.73,24,12c2.95-2.27,5.67-4.41,7.68-4.96c1.69-0.46,2.85-0.08,3.41,0.36c0.02,0.01,0.04,0.03,0.06,0.04C35.03,7.32,34.86,7.19,34.76,7.12z"></path>
</svg>
      `,

        },
        Playstation: {
          type: 'svg',
          source: `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0,0,256,256">
<g fill="#2344c9" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M11.18164,3.74219v21.11523l4.58008,1.40039v-17.68164c0,-0.509 -0.00009,-0.76258 0.25391,-1.01758c0.127,-0.254 0.38077,-0.25395 0.63477,-0.12695c0.636,0.254 1.01953,0.76325 1.01953,1.78125v6.99414c1.526,0.763 2.79645,0.763 3.81445,0c1.018,-0.763 1.52734,-1.90645 1.52734,-3.81445c0.001,-2.035 -0.38148,-3.30722 -1.27148,-4.32422c-0.763,-1.018 -2.16127,-1.90892 -4.19727,-2.54492c-2.544,-0.763 -4.70733,-1.39925 -6.36133,-1.78125zM9.91016,16.97266l-5.85156,2.03516l-0.88867,0.38086c-1.399,0.636 -2.16211,1.2722 -2.16211,1.9082c0.127,0.763 0.38106,1.78197 2.28906,2.41797c1.781,0.636 3.18019,0.89005 6.74219,-0.12695v-2.29102c-3.436,1.144 -3.94412,1.01767 -4.45312,0.76367c-0.509,-0.254 -0.50981,-0.50972 -0.38281,-0.63672c0.382,-0.254 1.78125,-0.76367 1.78125,-0.76367l2.92578,-1.01758zM22.85352,17.96289c-0.41341,-0.01391 -0.82673,-0.00636 -1.24023,0.02539c-1.399,0 -2.67222,0.25472 -4.19922,0.63672v2.67188l2.79883,-1.01953l1.52539,-0.50781c0,0 0.63753,-0.12691 1.01953,-0.25391c0.636,-0.127 1.39844,0.12695 1.39844,0.12695c0.382,0 0.63672,0.12586 0.63672,0.38086c0.127,0.254 -0.12767,0.38272 -0.76367,0.63672l-1.39844,0.50977l-5.08789,1.90625v2.67188l2.28906,-0.76367l6.35938,-2.28906l0.76367,-0.38281c1.526,-0.509 2.16216,-1.1452 2.03516,-1.9082c0,-0.762 -0.89002,-1.2703 -2.41602,-1.7793c-1.2405,-0.38175 -2.48048,-0.62039 -3.7207,-0.66211z"></path></g></g>
</svg>
`,

        },
        Youtube: {
          type: 'png',
          source: '/images/youtube.png'

        },
        Twitch: {
          type: 'png',
          source: '/images/twitch.png'

        },
        Riot: {
          type: 'svg',
          source: `
         <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><circle cx="24" cy="24" r="20" fill="#d32f2f"/><polygon fill="#fff" points="25.891,13.176 12.584,19.462 14.642,28.935 17.356,28.935 16.887,22.159 17.304,22.03 18.936,28.935 21.756,28.935 21.652,20.681 22.068,20.552 23.495,28.935 26.481,28.935 27.185,18.965 27.601,18.835 28.34,28.935 32.288,28.935 33.678,15.07"/><polygon fill="#fff" points="23.612,32.813 22.628,30.278 32.118,30.766 31.711,34.824"/></svg>
`,

        },
      },





      logos: {
        platformXbox: {
          svg: `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0 0 48 48">
<path fill="#7cb342" d="M24.001 4A20 20 0 1 0 24.001 44A20 20 0 1 0 24.001 4Z"></path><path fill="#cfd8dc" d="M38.59,10.32c0,0-0.85-1.07-2.19-1.08c-1.32-0.01-2.72,0.6-3.94,1.4c-0.05,0.03-0.08,0.05-0.08,0.05l-0.01,0.02c-2.6,1.57-4.37,3.77-4.37,3.77c2.27,2.17,7.86,9.35,9.66,13.77c2.75,6.76,1.04,9.23,1.04,9.23c-0.32-3.7-5.96-10.29-7.93-12.39c-1-1.073-5.888-6.042-6.77-6.938c-0.882,0.896-5.77,5.865-6.77,6.938c-1.97,2.1-7.61,8.69-7.93,12.39c0,0-1.71-2.47,1.04-9.23c1.8-4.42,7.39-11.6,9.66-13.77c0,0-1.77-2.2-4.37-3.77l-0.01-0.02c0,0-0.03-0.02-0.08-0.05c-1.22-0.8-2.62-1.41-3.94-1.4c-1.34,0.01-2.19,1.08-2.19,1.08C6.05,13.91,4,18.7,4,24c0,11.05,8.95,20,20,20s20-8.95,20-20C44,18.7,41.95,13.91,38.59,10.32z"></path><path fill="#cfd8dc" d="M34.76,7.12C31.63,5.09,28.01,4,24,4s-7.63,1.09-10.76,3.12c-0.1,0.07-0.27,0.2-0.39,0.32c0.02-0.01,0.04-0.03,0.06-0.04c0.56-0.44,1.72-0.82,3.41-0.36C18.33,7.59,21.05,9.73,24,12c2.95-2.27,5.67-4.41,7.68-4.96c1.69-0.46,2.85-0.08,3.41,0.36c0.02,0.01,0.04,0.03,0.06,0.04C35.03,7.32,34.86,7.19,34.76,7.12z"></path>
</svg>
      `,
          title: 'Xbox',
        },

        platformPS: {
          svg: `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0,0,256,256">
<g fill="#2344c9" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M11.18164,3.74219v21.11523l4.58008,1.40039v-17.68164c0,-0.509 -0.00009,-0.76258 0.25391,-1.01758c0.127,-0.254 0.38077,-0.25395 0.63477,-0.12695c0.636,0.254 1.01953,0.76325 1.01953,1.78125v6.99414c1.526,0.763 2.79645,0.763 3.81445,0c1.018,-0.763 1.52734,-1.90645 1.52734,-3.81445c0.001,-2.035 -0.38148,-3.30722 -1.27148,-4.32422c-0.763,-1.018 -2.16127,-1.90892 -4.19727,-2.54492c-2.544,-0.763 -4.70733,-1.39925 -6.36133,-1.78125zM9.91016,16.97266l-5.85156,2.03516l-0.88867,0.38086c-1.399,0.636 -2.16211,1.2722 -2.16211,1.9082c0.127,0.763 0.38106,1.78197 2.28906,2.41797c1.781,0.636 3.18019,0.89005 6.74219,-0.12695v-2.29102c-3.436,1.144 -3.94412,1.01767 -4.45312,0.76367c-0.509,-0.254 -0.50981,-0.50972 -0.38281,-0.63672c0.382,-0.254 1.78125,-0.76367 1.78125,-0.76367l2.92578,-1.01758zM22.85352,17.96289c-0.41341,-0.01391 -0.82673,-0.00636 -1.24023,0.02539c-1.399,0 -2.67222,0.25472 -4.19922,0.63672v2.67188l2.79883,-1.01953l1.52539,-0.50781c0,0 0.63753,-0.12691 1.01953,-0.25391c0.636,-0.127 1.39844,0.12695 1.39844,0.12695c0.382,0 0.63672,0.12586 0.63672,0.38086c0.127,0.254 -0.12767,0.38272 -0.76367,0.63672l-1.39844,0.50977l-5.08789,1.90625v2.67188l2.28906,-0.76367l6.35938,-2.28906l0.76367,-0.38281c1.526,-0.509 2.16216,-1.1452 2.03516,-1.9082c0,-0.762 -0.89002,-1.2703 -2.41602,-1.7793c-1.2405,-0.38175 -2.48048,-0.62039 -3.7207,-0.66211z"></path></g></g>
</svg>
`,
          title: 'Playstation',
        },

        platformPC: {
          svg:
              `
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="20" height="20" viewBox="0 0 100 100">

<g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
fill="#FFFFFF" stroke="none">
<path d="M12 928 c-17 -17 -17 -899 0 -916 17 -17 279 -17 296 0 17 17 17 899
0 916 -17 17 -279 17 -296 0z m178 -763 c15 -18 10 -45 -12 -59 -35 -22 -74
27 -48 59 16 19 44 19 60 0z"/>
<path d="M360 890 l0 -50 268 -2 267 -3 0 -255 0 -255 -267 -3 -268 -2 0 -80
0 -80 308 0 c226 0 311 3 320 12 17 17 17 739 0 756 -9 9 -94 12 -320 12
l-308 0 0 -50z"/>
<path d="M460 120 c0 -16 -7 -20 -30 -20 -38 0 -70 -32 -70 -70 l0 -30 200 0
200 0 0 30 c0 38 -32 70 -70 70 -23 0 -30 4 -30 20 0 19 -7 20 -100 20 -93 0
-100 -1 -100 -20z"/>
</g>
</svg>
      `,
          title: 'PC',
        },

        platformMobile: {
          svg:
              `
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="20" height="20" viewBox="0 0 100 100"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
fill="#FFFFFF" stroke="none">
<path d="M240 920 c-19 -19 -20 -33 -20 -420 0 -387 1 -401 20 -420 19 -19 33
-20 260 -20 227 0 241 1 260 20 19 19 20 33 20 420 0 387 -1 401 -20 420 -19
19 -33 20 -260 20 -227 0 -241 -1 -260 -20z m276 -41 c10 -17 -13 -36 -27 -22
-12 12 -4 33 11 33 5 0 12 -5 16 -11z m164 -369 l0 -310 -180 0 -180 0 0 310
0 310 180 0 180 0 0 -310z m-105 -370 c0 -12 -16 -16 -69 -18 -69 -3 -95 6
-81 28 4 7 33 10 78 8 56 -2 72 -6 72 -18z"/>
</g>
</svg>

      `,
          title: 'Mobile'
        },

        platformSwitch: {
          svg:
            `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256">
<g fill="#fa5252" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,256v-256h256v256z" id="bgRectangle"></path></g><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M14.5293,4c-3.5868,0 -6.32345,1.05343 -8.07422,3.10352c-1.75077,2.05009 -2.45508,4.93792 -2.45508,8.42188v20c0,6.03248 4.40487,10.47461 10.5293,10.47461h9.4707v-42zM35.47461,4l-9.5,0.01563v41.98438h9.5c6.139,0 10.52539,-4.435 10.52539,-10.5v-19.94922c0,-7.592 -3.55439,-11.55078 -10.52539,-11.55078zM14.5293,6h7.4707v38h-7.4707c-5.20557,0 -8.5293,-3.36709 -8.5293,-8.47461v-20c0,-3.21205 0.66234,-5.58414 1.97656,-7.12305c1.31423,-1.53891 3.34153,-2.40234 6.55273,-2.40234zM14.5,10c-1.41667,0 -2.60644,0.56726 -3.37305,1.42969c-0.76661,0.86243 -1.12695,1.97309 -1.12695,3.07031c0,1.09722 0.36035,2.20788 1.12695,3.07031c0.76661,0.86243 1.95638,1.42969 3.37305,1.42969c1.41667,0 2.60644,-0.56726 3.37305,-1.42969c0.76661,-0.86243 1.12695,-1.97309 1.12695,-3.07031c0,-1.09722 -0.36035,-2.20788 -1.12695,-3.07031c-0.76661,-0.86243 -1.95638,-1.42969 -3.37305,-1.42969zM14.5,12c0.91667,0 1.47689,0.30774 1.87695,0.75781c0.40006,0.45007 0.62305,1.08941 0.62305,1.74219c0,0.65278 -0.22299,1.29212 -0.62305,1.74219c-0.40006,0.45007 -0.96029,0.75781 -1.87695,0.75781c-0.91667,0 -1.47689,-0.30774 -1.87695,-0.75781c-0.40006,-0.45007 -0.62305,-1.08941 -0.62305,-1.74219c0,-0.65278 0.22299,-1.29212 0.62305,-1.74219c0.40006,-0.45007 0.96029,-0.75781 1.87695,-0.75781zM36,24c2.206,0 4,1.794 4,4c0,2.206 -1.794,4 -4,4c-2.206,0 -4,-1.794 -4,-4c0,-2.206 1.794,-4 4,-4z"></path></g></g>
</svg>
      `,
        title: 'Nintendo Switch'
      },

        platformVR: {
          svg:
              `
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#FFFFFF" stroke-linecap="round" stroke-width="1.5"><path d="m17 9h-10c-1.86923 0-2.80385 0-3.5.44212-.45606.28963-.83477.70618-1.09808 1.20788-.40192.7658-.40192 1.7938-.40192 3.85s0 3.0842.40192 3.85c.26331.5017.64202.9182 1.09808 1.2079.69615.4421 1.63077.4421 3.5.4421.61332 0 .91998 0 1.21032-.0471.77464-.1257 1.4987-.4988 2.08238-1.0729.2188-.2152.4151-.4743.8078-.9926l.3341-.4411c.1988-.2624.2982-.3936.4197-.4449.1009-.0427.2116-.0482.3156-.0158.1252.039.235.1598.4546.4013l.9613 1.0575c.2385.2623.3577.3935.4818.5093.638.5961 1.43.9569 2.2643 1.0318.1622.0145.3308.0145.6681.0145 1.8692 0 2.8038 0 3.5-.4421.4561-.2897.8348-.7062 1.0981-1.2079.4019-.7658.4019-1.7938.4019-3.85s0-3.0842-.4019-3.85c-.2633-.5017-.642-.91825-1.0981-1.20788-.6962-.44212-1.6308-.44212-3.5-.44212z"/><path d="m16 13h2"/><path d="m22 15v-2.5478c0-.9799 0-1.4699-.0773-1.9436-.0383-.2343-.0905-.4648-.1563-.68972-.1331-.45477-.3394-.87496-.7519-1.71528-.8269-1.68433-1.2403-2.5265-1.843-3.09222-.2959-.27773-.6222-.5035-.9693-.67073-.707-.34065-1.5106-.34065-3.1177-.34065h-6.16902c-1.60712 0-2.41068 0-3.11769.34065-.3471.16723-.67335.393-.96926.67073-.60274.56572-1.01617 1.40789-1.84303 3.09222-.41252.84034-.61879 1.2605-.75186 1.71528-.06583.22492-.11807.45542-.15631.68972-.07733.4737-.07733.9637-.07733 1.9436v2.5478"/></g></svg>
      `,
          title: 'VR',
        },

        platformSteamDeck: {
          svg: null,
          title: 'Steam Deck'
        }

      }

    }
  },

  props: {
    role: {
      type: String,
    },

    countryCode: {
      type: String,
    },

    connection: {
      type: String,
    },

    username: {
      type: String,
    }
  },

  methods: {
    getLogo(role) {
      if (role === 'platformSteamDeck') {
        return `<div class="role-icon-steamdeck"></div>`; // Specjalny wyjątek dla SteamDeck
      }
      else return this.logos[role] ? this.logos[role].svg : '';
    },
    getTitle(role) {
      return this.logos[role] ? this.logos[role].title : 'Unknown Platform';
    },
      getFlagSrc(code) {
        return `/4x3/${code.toLowerCase()}.svg`;
      },


    getCountryName(code) {
      return countryNames[code.toLowerCase()] || 'Unknown Country';
    }



  },
}
</script>

<style scoped>
.role-card {
  display: flex;
  align-items: center;
  background-color: mediumpurple;
  font-family: system-ui;
  border-radius: 5px;
  padding: 0vmin;
  padding-right: 1vmin;
  padding-left: 1vmin;
  width: fit-content;
  color: white;
  font-size: 14px;
  margin: 0.5vmin;
  box-shadow: 0 4px 6px rebeccapurple;


}

.role-card-title{

}

.role-icon-png{

  width: 28px;
  height: 28px;
  padding: 0.5vmin 0.5vmin 0.5vmin 0;
  overflow: hidden;
  position: relative;
}

.role-icon-png img{
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.role-icon {
  display: flex;
  width: 32px;
  justify-items: center;
  align-items: center;
  height: 32px;
}


.role-icon svg {
  width: 100%;
  height: 100%;
}

.role-icon-steamdeck{
  width: 75%;
  height: 75%;
  background-image: url('/images/steamdeck.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.flag-icon{
  display: flex;
  width: 28px;
  padding-right: 1vmin;
  justify-items: center;
  align-items: center;
  height: 32px;
}


.role-card__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.role-card__title {
  font-weight: 600;
}
</style>
