<template>
  <div class="login-container">
    <div class="login-box">
      <div class="bg-box"></div>
      <!-- 登录 -->
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        autocomplete="off"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t("login.title") }}</h3>
          <!-- <lang-select class="set-language" /> -->
        </div>

        <div class="login-item">
          <i class="el-icon-user"></i>
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              autocomplete="off"
              @keyup.enter.native="handleLogin"
              clearable
            />
          </el-form-item>
        </div>
        <div class="login-item">
          <i class="el-icon-key"></i>
          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('login.password')"
              name="password"
              autocomplete="off"
              :show-password="true"
              @keyup.enter.native="handleLogin"
              clearable
            />
          </el-form-item>
        </div>

        <el-button type="primary" @click.native.prevent="handleLogin"
          >登 录</el-button
        >
      </el-form>
    </div>
    <span class="login-footer">
      © 2020
      <a target="_blank" href="https://www.baidu.com">qqkj</a>
    </span>
  </div>
</template>

<script>
import LangSelect from "@/components/LangSelect";
import db from "@/utils/localstorage";
import axios from "axios";

export default {
  name: "Login",
  components: { LangSelect },
  data() {
    return {
      login: {
        type: "up"
      },

      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        password: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        },
        code: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        }
      }
    };
  },
  mounted() {
    db.clear();
  },
  destroyed() {
    window.removeEventListener("message", this.resolveSocialLogin);
  },
  methods: {
    handleLogin() {
      let username_c = false;
      let password_c = false;
      let code_c = false;
      this.$refs.loginForm.validateField("username", e => {
        if (!e) {
          username_c = true;
        }
      });
      this.$refs.loginForm.validateField("password", e => {
        if (!e) {
          password_c = true;
        }
      });
      this.$refs.loginForm.validateField("code", e => {
        if (!e) {
          code_c = true;
        }
      });

      if (username_c && password_c) {
        // this.loginLoading = true;
        // this.registerLoading = false;
        const that = this;
        this.$post("/login", {
          username: that.loginForm.username,
          password: that.loginForm.password
        })
          .then(r => {
            // this.loginLoading = false;

            if (r.data.code === 800) {
              this.$message.error(r.data.message);
            } else {
              // location.reload()
              const data = r.data.data;
              this.$store.commit("account/setPosition", data.user.position);

              this.getUserDetailInfo(data.user);
            }

            // this.loginSuccessCallback();
          })
          .catch(error => {
            // that.loginLoading = false;
            // that.getCodeImage();
          });
      }
    },
    saveLoginData(data) {
      this.$store.commit("account/setAccessToken", data.access_token);
      this.$store.commit("account/setRefreshToken", data.refresh_token);
      const current = new Date();
      const expireTime = current.setTime(
        current.getTime() + 1000 * data.expires_in
      );
      this.$store.commit("account/setExpireTime", expireTime);
    },
    getUserDetailInfo(user) {
      this.$store.commit("account/setUser", user);
      this.$message({
        message: this.$t("tips.loginSuccess"),
        type: "success"
      });
      // this.loginLoading = false;
      this.$router.push("/dashboard");
    },
    loginSuccessCallback() {
      // this.$get("system/user/success").catch((e) => {
      //   console.log(e);
      // });
    }
  }
};
</script>

<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
@import "login-scoped";
</style>
