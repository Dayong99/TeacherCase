<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
          <i class="iconfont icon-kongzhi table-operation size"></i>
        <span>进度控制</span>
      </div>
      <div class="block">
        <el-timeline>
          <el-timeline-item
            placement="top"
            :hide-timestamp="hide"
            v-for="(item, index) in stageList"
            :key="index"
          >
            <div slot="dot" class="dot">{{ index + 1 }}</div>
            <h4>{{ item.gradationName }}</h4>
            <el-card class="detailBox" shadow="hover">
              <div
                class="infoBox"
                v-html="showInfo(item.gradationWork)"
                style="width: 726px"
              ></div>
              <div class="iconBox">
                <el-switch
                  v-model="item.status"
                  active-value="1"
                  inactive-value="0"
                  @change="changeControl(item)"
                ></el-switch>
              </div>
            </el-card>
            <el-timeline class="child">
              <el-timeline-item
                placement="top"
                :hide-timestamp="hide"
                v-for="(item1, index1) in item.teachGradations"
                :key="index1"
              >
                <div slot="dot" class="arrows">
                  <div></div>
                  <div class="last"></div>
                  <i class="iconfont icon-bofang"></i>
                </div>
                <h5>{{ item1.gradationName }}</h5>
                <el-card class="detailBox" shadow="hover">
                  <div
                    v-html="showInfo(item1.gradationWork)"
                    class="infoBox"
                    style="width: 688px"
                  ></div>
                  <div class="iconBox">
                    <el-switch
                      v-model="item1.status"
                      active-value="1"
                      inactive-value="0"
                      @change="changeControl(item1)"
                    ></el-switch>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "CaseEdit",
  components: { },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      width: "900px",
 hide: true,
      stageList: [],
      isControl: 0
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    },
    teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    }
  },
  mounted() {},
  methods: {
    reset() {
      this.stageList = [];
    },

    // 加载阶段
    getStage() {
      this.stageList = [];
      this.$get("caseteach/teach-gradation/list", {
        teachname: this.teachingInfo.teachName
      }).then(r => {
        r.data.data.forEach((item, index) => {
          this.stageList = r.data.data;
          this.stageList.forEach((item,index)=>{
            item.status+=''
            item.teachGradations.forEach((item1,index1)=>{
              item1.status+=''
            })
          })
        });
      });
    },

    // 显示简介
    showInfo(info) {
      if (info == "") {
        return "暂无简介";
      } else if (info.length <= 100) {
        return info;
      } else {
        return info.substring(0, 100) + "......";
      }
    },

    // 控制进度
    changeControl(item) {
      this.$get("caseteach/teach-gradation/updstatus", {
        id: item.id,
        status: item.status,
      }).then(r => {
        if (r.data.code === 20000) {
          this.$message.success("进度控制成功");
        }
      });
    },


    close() {
      this.$emit("close");
    },

  }
};
</script>
<style lang="scss" scoped>
.block {
  .child {
    margin-top:10px;
  }
  h4 {
    line-height:26px;
  }
  h5 {
    line-height:20px;
  }
}
h3 {
  text-align: right;
  margin-top: 10px;
}

button i {
  color: white !important;
}
</style>
