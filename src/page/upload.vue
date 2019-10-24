<template>
  <div class="upload">
    <div class="form_wrap tc bbox" v-show='step == "step1"'>
      <p class="title"><img src="../assets/form_t1.png" height="47" width="444" alt=""></p>
      <div class="name input_wrap bbox"><input v-model='name' type="text" placeholder="您的姓名"></div> 
      <div class="phone input_wrap bbox"><input v-model='phone' type="tel" placeholder="您的电话"></div> 
      <div class="city input_wrap bbox" @click='cityShow = true'><input disabled="true" v-model='city' type="text" placeholder="所在城市"><img src="../assets/arr.png" height="18" width="24" alt=""></div> 
      <div class="bank input_wrap bbox" v-show="city_id" @click='bankShow = true'><input disabled="true" v-model='bank' type="text" placeholder="分行网点"><img src="../assets/arr.png" height="18" width="24" alt=""></div> 
      <p class="next" @click='onNext()'><img src="../assets/btn_next.png" height="119" width="541" alt=""></p>
    </div>
    <div class="upload_photo tc bbox" v-show='step == "step2"'>
      <p class="title"><img src="../assets/form_t2.png" height="47" width="367" alt=""></p>
      <div class="upload_select bbox" @click='chooseImage'>
        <canvas id="canvas"></canvas>
      </div>
      <p class="tip">小提示：可放大缩小图片</p>
      <p class="btn_wrap">
        <img @click="chooseImage" src="../assets/restart.png" height="85" width="266" class="reselect">
        <img @click="onSubmit" src="../assets/upload_confirm.png" height="85" width="267" class="confirm">
      </p>
      <p class="return" @click='step = "step1"'>返回上一步</p>
    </div>
    <van-popup v-model="cityShow" position='bottom'><van-picker  show-toolbar :columns="cityList" @cancel='cityShow = false' @confirm="cityConfirm" /></van-popup>
    <van-popup v-model="bankShow" position='bottom'><van-picker  show-toolbar :columns="bankList" @cancel='bankShow = false' @confirm="bankConfirm" /></van-popup>
    <div class="verification alert" v-show='verShow'>
      <div class="main vtc tc">
        <p class="title">请理财经理输入上传密码核实照片是否符合要求</p>
        <div class="input_wrap bbox"><input v-model="password" type="password"></div>
        <div class="yes"><img @click='checkPassword' src="../assets/form_confirm.png" height="90" width="340" alt=""></div>
        <img @click='verShow = false' src="../assets/close.png" height="52" width="52" alt="" class="close">
      </div>
    </div>
    <div class="success alert" v-show='successShow'>
      <div class="main vtc tc">
        <p class="icon"><img src="../assets/success.png" height="133" width="133" alt=""></p>
        <p class="text">恭喜上传成功</p>
        <p class="gotocenter" @click='gotoCenter'><img src="../assets/form_confirm.png" height="90" width="340" alt=""></p>
      </div>
    </div>
    <div class="fail alert" v-show='failShow'>
      <div class="main vtc tc">
        <p class="icon"><img src="../assets/fail.png" height="133" width="133" alt=""></p>
        <p class="text">上传失败</p>
        <p class="text">{{msg}}</p>
        <p class="btn"><img @click='reInput' src="../assets/repassword.png" height="90" width="340" alt=""></p>
        <img @click='failShow = false' src="../assets/close.png" height="52" width="52" alt="" class="close">
      </div>
    </div>
  </div>
</template>

<script>
import "../utils/exif.js";
import "../utils/imgslter.js";
import "../utils/jstween.js";
import "../utils/gesturer.js";
import "../utils/imgeditor.js";
import api from "../api/api.js";
import { Field, CellGroup } from "vant";
import imageConversion from "image-conversion";
export default {
  data() {
    return {
      password: "",
      step: "step1",
      name: "",
      phone: "",
      city: "",
      city_id: "",
      bank: "",
      branch_id: "",
      cityShow: false,
      bankShow: false,
      verShow: false,
      successShow: false,
      failShow: false,
      cityList: [],
      bankList: [],
      imgeditor: null,
      fileBase64: "",
      fileObject: null,
      selecter: null,
      imgUrl: "",
      msg: "",
      player_id: "",
      errcode: 0
    };
  },
  mounted() {
    this.initUpload();
  },
  activated() {
    this.city_list();
  },
  methods: {
    async city_list() {
      const res = await api.city_list();
      if (res.error_no == 0) {
        this.cityList = [];
        res.data.items.forEach((item, index) => {
          let obj = {};
          obj.text = item.city_name;
          obj.city_id = item.city_id;
          this.cityList.push(obj);
        });
      }
    },
    async branch_list() {
      const res = await api.branch_list({
        city_id: this.city_id
      });
      if (res.error_no == 0) {
        this.bankList = [];
        res.data.items.forEach((item, index) => {
          let obj = {};
          obj.text = item.branch_name;
          obj.branch_id = item.branch_id;
          this.bankList.push(obj);
        });
      }
    },
    gotoCenter() {
      window.has_uploaded = true;
      this.successShow = false;
      this.$router.replace({
        path: "center",
        query: { player_id: this.player_id }
      });
    },
    checkPassword() {
      //检测密码是否正确
      if (!this.password) {
        this.$dialog({ message: "请填写密码后再提交" });
      } else {
        this.uploadPhoto();
      }
    },
    async submit(img) {
      const res = await api.submit2({
        name: this.name,
        phone: this.phone,
        branch_id: this.branch_id,
        img: img,
        password: this.password
      });
      this.errcode = res.error_no;
      if (res.error_no == 0) {
        window.player_id = res.data.player_id;
        this.player_id = res.data.player_id;
        this.successShow = true;
      } else {
        this.verShow = false;
        this.password = "";
        this.failShow = true;
        this.msg = res.msg;
      }
    },
    async uploadPhoto() {
      // const res = await api.upload({
      //   img:this.fileObject
      // })
      // if (res.error_no == 0) {
      //   this.imgUrl = res.data.img
      //   this.submit()
      // }
      const OSSinfo = await api.get_oss_info();
      if (OSSinfo.error_no == 0) {
        const res = await api.OSSupload({
          host: OSSinfo.data.host,
          key: OSSinfo.data.img,
          OSSAccessKeyId: OSSinfo.data.OSSAccessKeyId,
          policy: OSSinfo.data.policy,
          signature: OSSinfo.data.Signature,
          file: this.fileObject
        });
        if (res) {
          this.imgUrl = OSSinfo.data.host + "/" + OSSinfo.data.img;
          this.submit(OSSinfo.data.img);
        }
      }
    },
    reInput() {
      //重新输入密码
      this.failShow = false;
      if (this.errcode == 1) {
        this.step = "step1";
      }
      if (this.errcode == 3) {
        this.verShow = true;
      }
    },
    onSubmit(e) {
      const base64 = document.getElementById("canvas").toDataURL();
      let fileObject = this.dataURLtoFile(base64);
      console.log(fileObject);
      console.log(Math.floor(fileObject.size / 1000) + "kb");
      imageConversion.compressAccurately(fileObject, 600).then(res => {
        fileObject = res;
        if (this.fileBase64) {
          this.fileObject = fileObject;
          this.verShow = true;
        } else {
          this.$dialog({ message: "请选择图片后再上传" });
        }
      });
    },
    chooseImage() {
      this.selecter.select();
    },
    initUpload() {
      const self = this;
      const width = $(".upload_select").width();
      const height = $(".upload_select").height();
      const canvas = document.getElementById("canvas");
      canvas.width = width * 5;
      canvas.height = height * 5;
      this.imgeditor = new ImgEditor({
        el: canvas,
        color: "#ffffff"
      });
      var gesture = new Gesturer({
        el: document.getElementById("canvas"),
        onPressMove(evt) {
          window.canPassive = false;
          self.imgeditor.onMove(evt);
        },
        onPinch(evt) {
          self.imgeditor.onPinch(evt);
        },
        onRotate(evt) {
          self.imgeditor.onRotate(evt);
        }
      });
      gesture.on();

      this.selecter = new ImgSlter();
      this.selecter.handler = function(data) {
        self.fileBase64 = data.img;
        self.imgeditor.setImg(self.fileBase64);
      };
    },
    onNext() {
      if (!this.name) {
        this.$dialog({ message: "请填写姓名" });
        return;
      }
      if (!this.phone || !/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.phone)) {
        this.$dialog({ message: "请填写正确的手机号" });
        return;
      }
      if (!this.city) {
        this.$dialog({ message: "请选择城市" });
        return;
      }
      if (!this.bank) {
        this.$dialog({ message: "请选择网点" });
        return;
      }
      this.step = "step2";
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename || Date.now() + "", { type: mime });
    },
    cityConfirm(e) {
      this.city = e.text;
      this.city_id = e.city_id;
      this.cityShow = false;
      this.branch_list();
    },
    bankConfirm(e) {
      this.bank = e.text;
      this.branch_id = e.branch_id;
      this.bankShow = false;
    }
  },
  components: {
    Field,
    CellGroup
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
#canvas {
  width: 100%;
  height: 100%;
}
.fail {
  .main {
    background-color: #fff;
    width: 5.97rem;
    height: 4.53rem;
    border-radius: 0.12rem;
    border: 0.05rem solid #e61d39;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .close {
      padding: 0.2rem;
      width: 0.52rem;
      height: 0.52rem;
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
    }
    .icon {
      padding-bottom: 0.2rem;
      img {
        width: 1.33rem;
        height: 1.33rem;
      }
    }
    .text {
      font-size: 0.39rem;
    }
    .btn {
      padding-top: 0.2rem;
      img {
        width: 3.4rem;
        height: 0.9rem;
      }
    }
  }
}
.success {
  .main {
    background-color: #fff;
    width: 5.97rem;
    height: 4.23rem;
    border-radius: 0.12rem;
    border: 0.05rem solid #e61d39;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .gotocenter {
      margin-top: 0.2rem;
      img {
        width: 3.4rem;
        height: 0.9rem;
      }
    }
    .text {
      margin-top: 0.3rem;
      font-size: 0.39rem;
    }
    .icon {
      img {
        width: 1.33rem;
        height: 1.33rem;
      }
    }
  }
}
.verification {
  .main {
    background-color: #fff;
    width: 5.97rem;
    height: 4.53rem;
    border-radius: 0.12rem;
    border: 0.05rem solid #e61d39;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .close {
      padding: 0.2rem;
      width: 0.52rem;
      height: 0.52rem;
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
    }
  }
  .input_wrap {
    margin: 0.3rem auto;
    width: 4.68rem;
    height: 0.78rem;
    background-color: #fff;
    border: 0.02rem solid #c6c6c6;
    border-radius: 0.1rem;
    display: flex;
    padding-left: 0.2rem;
    input {
      text-align: center;
      width: 90%;
      border: none;
      font-size: 0.26rem;
    }
  }
  .title {
    margin: 0 auto;
    width: 4.5rem;
    font-size: 0.39rem;
  }
  .yes {
    img {
      width: 3.4rem;
      height: 0.9rem;
    }
  }
}
#upload {
  position: absolute;
  left: -999em;
  top: -999em;
}
#canvas {
  position: absolute;
  left: 0;
  top: 0;
  /* width: 100%;
  height: 100%;*/
}
.upload_photo {
  width: 6.95rem;
  height: 8.65rem;
  background-image: url(../assets/upload_content.png);
  background-size: cover;
  margin: 0 auto;
  margin-left: 0.4rem;
  padding-top: 0.7rem;
  padding-right: 0.25rem;
  .tip {
    color: #b0b0b0;
    font-size: 0.24rem;
    padding-bottom: 0.3rem;
  }
  .btn_wrap {
    .reselect {
      width: 2.66rem;
      height: 0.85rem;
      margin-right: 0.2rem;
    }
    .confirm {
      width: 2.67rem;
      height: 0.85rem;
    }
  }
  .return {
    padding-top: 0.2rem;
    color: #898989;
    font-size: 0.36rem;
    text-decoration: underline;
  }
  .upload_select {
    position: relative;
    margin: 0.3rem auto;
    background-image: url(../assets/upload_icon.png);
    background-size: 1.71rem 1.36rem;
    background-position: center center;
    background-repeat: no-repeat;
    border: 0.02rem solid #c6c6c6;
    width: 2.92rem;
    height: 3.93rem;
  }
  .title {
    img {
      width: 3.67rem;
      height: 0.47rem;
    }
  }
}
.upload {
  padding-top: 3.09rem;
  padding-bottom: 0.5rem;
  background-image: url(../assets/form_bg.jpg);
  background-size: 7.5rem 16.53rem;
  background-repeat: no-repeat;
  padding-bottom: 3rem;
}
.form_wrap {
  margin: 0 auto;
  margin-left: 0.4rem;
  padding-top: 1rem;
  padding-right: 0.25rem;
  width: 6.95rem;
  height: 7.83rem;
  background-image: url(../assets/form_content.png);
  background-size: cover;
  .input_wrap {
    padding-left: 0.2rem;
    width: 5.38rem;
    height: 0.78rem;
    border: 0.02rem solid #cdcdcd;
    display: flex;
    align-items: center;
    border-radius: 0.1rem;
    background-color: #fff;
    margin: 0.2rem auto;
    img {
      width: 0.24rem;
      height: 0.18rem;
    }
    input {
      width: 90%;
      border: none;
      background-color: transparent;
    }
  }
  .title {
    padding-bottom: 0.3rem;
    img {
      width: 4.44rem;
      height: 0.47rem;
    }
  }
  .next {
    img {
      width: 5.41rem;
      height: 1.19rem;
    }
  }
}
</style>
