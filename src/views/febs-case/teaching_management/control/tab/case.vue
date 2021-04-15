<template>
  <div v-show="tabShow">
    <h3 class="detail-title">{{ caseName }}</h3>

    <div class="block">
      <el-form class="case-form">
        <el-form-item label="案例名称" prop="caseId">
          <el-select v-model="caseId" placeholder="请选择" size="small">
            <el-option
              v-for="(item, index) in caseList"
              :key="index"
              :label="item.caseName"
              :value="item.caseId"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-timeline>
        <el-timeline-item
          placement="top"
          :hide-timestamp="hide"
          v-for="(item, index) in chapterList"
          :key="index"
        >
          <div slot="dot" class="dot">{{ index + 1 }}</div>
          <h4>{{ item.sectionName }}</h4>
          <el-card class="detailBox" shadow="hover">
            <div
              class="infoBox"
              v-html="showInfo(item.sectionWork)"
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
              v-for="(item1, index1) in item.sectionList"
              :key="index1"
            >
              <div slot="dot" class="arrows">
                <div></div>
                <div class="last"></div>
                <i class="iconfont icon-bofang"></i>
              </div>
              <h5>{{ item1.childName }}</h5>
              <el-card class="detailBox" shadow="hover">
                <div v-html="showInfo(item1.sectionWork)" class="infoBox"></div>
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
  </div>
</template>
<script>
export default {
  name: "Detail",

  props: ["tabShow"],

  data() {
    return {
      width: "900px",
      caseName: "",
      hide: true,
      chapterList: [],
      caseId: null,
      caseList: [],
      isControl: 0,
      statusList: [],
      sectionList: []
    };
  },
  computed: {
     teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    },
  },
  watch: {
    caseId(val) {
      if (val) {
        this.getStatus(val);
      }
    },
  },
  mounted() {
    this.setData()
  },
  methods: {
    reset() {
      this.chapterList = [];
      this.statusList = [];
      this.caseId = null;
    },
    setData() {
      this.caseName = this.teachingInfo.caseName;
      this.caseList = this.teachingInfo.teachCases;

      console.log(this.caseList);
      if (this.caseList.length > 0) {
        this.caseId = this.caseList[0].caseId;
      }
    },

    getStatus(caseId) {
      this.statusList = [];

      this.$get("caseteach/teach-section/showSection", {
        caseid: caseId,
        teachid: this.teachingInfo.id
      }).then(r => {
        r.data.data.forEach((item, index) => {
          this.statusList.push({
            id: item.sectionId,
            status: item.status + ""
          });
        });

        this.getChapter(caseId);
      });
    },

    // 加载章节
    getChapter(caseId) {
      this.chapterList = [];
      if (caseId) {
        this.$get("caseteach/case-section/getSection", {
          caseid: caseId
        }).then(r => {
          r.data.data.forEach((item, index) => {
            let status;
            this.statusList.forEach((item1, index) => {
              if (item.id == item1.id) {
                status = item1.status + "";
              }
            });
            this.chapterList.push({
              sectionName: item.sectionName,
              caseId: item.caseId,
              sectionId: item.id,
              id: item.id,
              sectionWork: item.sectionWork,
              sectionList: [],
              isControl: item.isControl,
              status: status
            });
          });

          this.chapterList.forEach((item, index) => {
            this.getChild(item);
          });
        });
      }
    },

    // 加载子章节
    getChild(obj) {
      if (obj.caseId && obj.sectionId) {
        this.$get("caseteach/case-section/getChildSection", {
          sectionid: obj.sectionId
        }).then(r => {
          r.data.data.forEach((item, index) => {
            let status;
            this.statusList.forEach((item1, index) => {
              if (item.id == item1.id) {
                status = item1.status + "";
              }
            });
            obj.sectionList.push({
              childName: item.sectionName,
              caseId: item.caseId,
              sectionId: item.id,
              id: item.id,
              sectionWork: item.sectionWork,
              isControl: item.isControl,
              status: status
            });
          });
        });
      }
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
      this.$get("caseteach/teach-case/contro", {
        caseSectionid: item.id,
        con: item.status,
        theachid: this.teachingInfo.id
      }).then(r => {
        if (r.data.code === 20000) {
          this.$message.success("进度控制成功");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.child {
  margin-top: 20px;
}
</style>
