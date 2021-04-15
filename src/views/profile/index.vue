<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <!-- <el-col :span="8" :xs="24">
          <user-card :user="user" />
        </el-col> -->
        <el-col :span="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane :label="$t('common.timeline')" name="timeline">
                <timeline />
              </el-tab-pane> -->
              <el-tab-pane :label="$t('common.account')" name="account">
                <account-teacher :user="user" v-show="teacherShow" />
                <account-student :user="user" v-show="studentShow" />
              </el-tab-pane>
              <el-tab-pane :label="$t('common.password')" name="password">
                <password />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from "./components/UserCard";
import Password from "./components/Password";
import Timeline from "./components/Timeline";
import AccountTeacher from "./components/AccountTeacher";
import AccountStudent from "./components/AccountStudent";

export default {
  name: "Profile",
  components: { UserCard, Password, Timeline, AccountTeacher, AccountStudent },
  data() {
    return {
      activeTab: "",
      teacherShow: false,
      studentShow: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.account.user;
    },
  },
  created() {
    this.activeTab = "account";
    let position = this.$store.state.account.user.position 

    if (position == "老师") {
      this.teacherShow = true;
      this.studentShow = false;
    } else if(position==='学生'){
      this.teacherShow = false;
      this.studentShow = true;
    } 
  },
};
</script>
<style lang="scss" scoped>
.el-card.is-always-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-card {
  border: none;
  border-radius: 0;
}
</style>
