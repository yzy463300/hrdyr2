<template>
  <div id="app" v-if="isShow">
  	<keep-alive>
    	<router-view/>
  	</keep-alive>
	<tabbar @change="change" v-if="isShow"></tabbar>
  <Music class="" :src="src"></Music>
  </div>
</template>

<script>
import { querystring } from "vux";
import api from "./api/api.js";
import tabbar from "./components/tabbar.vue";
import Music from "./components/Music.vue";
export default {
  name: "App",
  data() {
    return {
      isShow: false,
      src: require("./assets/bgm.mp3")
    };
  },
  async created() {
    const res = await api.check_auth();
    if (res.error_no == 0) {
      this.isShow = true;
      window.has_uploaded = res.data.has_uploaded;
      window.is_final = res.data.is_final;
      window.player_id = res.data.player_id;
      if (window.has_uploaded) {
        this.$router.replace("/list");
      }
      const player_id = querystring.parse().player_id;
      if (player_id) {
        location.replace(
          "http://h5.bukeyi.net/h5/2019/hrdyr2/online/#/center?player_id=" +
            player_id
        );
      }
    }
  },
  methods: {
    change(index) {
      console.log(index);
      if (index == 0) {
        this.$router.replace("/");
      }
      if (index == 1) {
        this.$router.replace("/list");
      }
      if (index == 2) {
        if (window.has_uploaded) {
          this.$router.replace({
            path: "/center",
            query: { player_id: window.player_id }
          });
        } else {
          this.$router.replace("upload");
        }
      }
    }
  },
  components: {
    tabbar,
    Music
  }
};
</script>

<style  lang='less' >
#app {
  padding-bottom: 1.15rem;
  /*background-color: #ab0006;*/
}
</style>
