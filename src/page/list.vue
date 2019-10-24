<template>
  <div class="lists">
    <div class="search_wrap">
      <div class="search bbox"><input v-model='keyword' type="text" placeholder="请输入编号或姓名"></div>
      <img @click='search' src="../assets/search.png" height="68" width="211" alt="" class="search_btn">
    </div>
    <div class="tab">
      <!-- <div class="it" :class="[index == tabIndex ? 'active' : '']" @click='tabChange(index)' v-for="(item,index) in tabList" :key="index">{{item}}</div> -->
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="暂无更多"
      @load="player_list"
    >
      <div class="items bbox">
        <div class="item" v-for="(item,index) in items" :key="index" @click='gotoDetail(item.player_id)'>
          <div class="photo"><img :src="item.img" alt=""></div>
          <p class="p1"><span class="name textoverflow">{{item.name}}</span><span class="id textoverflow">NO:{{item.player_id}}</span></p>
          <div class="p2">
            <div class="left ">
              <img src="../assets/like_icon.png" alt="" class="icon">
              <span class="textoverflow">{{item.vote_count}}</span>
            </div>
            <div class="right ">
              <img src="../assets/rank_icon.png" alt="" class="icon">
              <span class="">排名{{item.rank}}</span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
<!--     <div class="items bbox">
      
    </div> -->
    <!-- <div class="hasmore" v-if="has_more">加载中...</div> -->
    <!-- <div class="hasmore " v-if='!has_more'>暂无更多</div> -->
  </div>
</template>

<script>
import api from "../api/api.js";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      page: 1,
      size: 50,
      keyword: "",
      tabList: ["最新上传", "排行榜"],
      tabIndex: 1,
      items: []
    };
  },
  watch: {
    keyword: function(val) {
      if (!val) {
        this.search();
      }
    }
  },
  mounted() {},
  activated() {
    this.initData();
    // this.player_list();
  },
  methods: {
    search() {
      this.initData();
      this.player_list();
    },
    gotoDetail(player_id) {
      this.$router.replace({ path: "center", query: { player_id } });
    },
    initData() {
      this.finished = false;
      this.loading = false;
      this.items = [];
      this.page = 1;
    },
    // tabChange(index) {
    //   this.initData();
    //   this.tabIndex = index;
    //   this.player_list();
    // },
    async player_list() {
      if (!this.finished) {
        const res = await api.player_list({
          page: this.page,
          size: this.size,
          order_by: this.tabIndex,
          keyword: this.keyword
        });
        if (res.error_no == 0) {
          this.page++;
          this.items = this.items.concat(res.data.items);
          this.finished = !res.data.has_more;
          this.loading = false;
        }
      }
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.van-list__error-text,
.van-list__finished-text,
.van-list__loading-text {
  color: #ebd0d0;
}
.hasmore {
  text-align: center;
  width: 100%;
  font-size: 0.22rem;
  color: #ebd0d0;
}
.items {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-left: 0.3rem;

  .item {
    animation: fadeIn 0.5s;
    margin-right: 0.2rem;
    margin-bottom: 0.35rem;
    width: 2.19rem;
    color: #fff;
    font-size: 0.22rem;
    position: relative;
    .p1 {
      height: 0.4rem;
      padding-top: 0.2rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        flex: 1;
      }
      .id {
        flex: 1;
        text-align: right;
      }
    }
    .p2 {
      font-size: 0.2rem;
      padding-top: 0.1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        span {
          width: 0.9rem;
        }
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon {
        height: 0.2rem;
        margin-right: 0.05rem;
      }
    }
    .photo {
      width: 2.03rem;
      height: 2.74rem;
      border: 0.08rem solid #fff;
      border-radius: 0.1rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .item:nth-child(3n) {
    margin-right: 0;
  }
}
.tab {
  display: flex;
  width: 6rem;
  height: 0.4rem;
  border-radius: 0.1rem;
  .it {
    flex: 1;
    text-align: center;
    color: #fff;
  }
  .it.active {
    background-color: #fff;
    color: #d92211;
  }
}
.search_wrap {
  margin-left: 0.25rem;
  height: 0.68rem;
  overflow: hidden;
  border-radius: 0.1rem;
  display: flex;
  .search_btn {
    width: 2.11rem;
    height: 0.68rem;
  }
  .search {
    padding-left: 0.25rem;
    width: 4.85rem;
    height: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    input {
      width: 90%;
      border: none;
    }
  }
}
.lists {
  min-height: 11.5rem;
  padding-top: 3.09rem;
  padding-bottom: 1rem;
  background-image: url(../assets/form_bg.jpg);
  background-size: 7.5rem 16.53rem;
  background-repeat: no-repeat;
  background-color: #c9010b;
}
</style>
