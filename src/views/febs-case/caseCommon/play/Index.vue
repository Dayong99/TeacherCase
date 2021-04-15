<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible" class="user-view detail-box" >
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-bofang table-operation orange"></i>
        <span>案例预览</span>
      </div>
      <h3 class="detail-title">{{caseModule.caseName}}</h3>

      <div class="block">
        <el-timeline>
          <el-timeline-item
            placement="top"
            :hide-timestamp="hide"
            v-for="(item,index) in chapterList"
            :key="index"
          >
            <div slot="dot" class="dot">{{index+1}}</div>
            <h4>{{item.sectionName}}</h4>
            <el-card class="detailBox" shadow="hover">
              <div class="infoBox" v-html="showInfo(item.sectionWork)" style="width:828px;"></div>
              <div class="iconBox">
                <i
                  class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- table-operation"
                  @click="showDownload(item)"
                ></i>
              </div>
            </el-card>
            <el-timeline class="child">
              <el-timeline-item
                placement="top"
                :hide-timestamp="hide"
                v-for="(item1,index1) in item.sectionList"
                :key="index1"
              >
                <div slot="dot" class="arrows">
                  <div></div>
                  <div class="last"></div>
                  <i class="iconfont icon-bofang"></i>
                </div>
                <h5>{{item1.childName}}</h5>
                <el-card class="detailBox" shadow="hover">
                  <div v-html="showInfo(item1.sectionWork)" class="infoBox"></div>
                  <div class="iconBox">
                    <i
                      class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- table-operation"
                      @click="showDownload(item1)"
                    ></i>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
    <!-- 文件下载 -->
    <download
      ref="download"
      :title="title"
      :icon="downIcon"
      :dialog-visible="downloadVisible"
      @close="downloadClose"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import Download from "../Download/Index";

export default {
  name: "Detail",
  components: { Pagination, Download },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      width: "900px",
      caseModule: {},
      title: "",
      downIcon:
        "iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- table-operation icon",
      hide: true,
      value: "100",
      downloadVisible: false,
      chapterList: [],
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
      },
    },
  },
  mounted() {},
  methods: {
    setData(val) {
      this.caseModule = { ...val };
      this.getChapter();
    },
    getChapter() {
      this.chapterList = [];
      this.$get("caseteach/case-section/getSection", {
        caseid: this.caseModule.id,
      }).then((r) => {
        r.data.data.forEach((item, index) => {
          this.chapterList.push({
            sectionName: item.sectionName,
            caseId: item.caseId,
            sectionId: item.id,
            id: item.id,
            sectionWork: item.sectionWork,
            sectionList: [],
          });
        });

        this.chapterList.forEach((item, index) => {
          this.getChild(item);
        });

      });
    },

    getChild(obj) {
      this.$get("caseteach/case-section/getChildSection", {
        sectionid: obj.sectionId,
      }).then((r) => {
        r.data.data.forEach((item, index) => {
          obj.sectionList.push({
            childName: item.sectionName,
            caseId: item.caseId,
            sectionId: item.id,
            id: item.id,
            sectionWork: item.sectionWork,
          });
        });
      });
    },
    close() {
      this.$emit("close");
    },
    downloadClose() {
      this.downloadVisible = false;
    },
    showDownload(item) {
      this.downloadVisible = true;
      this.title = item.sectionName;
      this.$refs.download.setFile(item.id);
    },
    showInfo(info) {
      if (info == "") {
        return "暂无简介";
      } else if (info.length <= 100) {
        return info;
      } else {
        return info.substring(0, 100) + "......";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.child {
  margin-top: 20px;
}
.icon-bofang {
  font-size: 1.4rem!important;
}
</style>
