<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-kongzhi table-operation purple size"></i>
        <span>进度控制</span>
      </div>
      <el-tabs v-model="tabName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :key="'case'" label="案例进度控制" name="case">
          <case ref="case" :tabShow="flagArr[0]" />
        </el-tab-pane>
        <el-tab-pane :key="'stage'" label="教学进度控制" name="stage">
          <stage ref="stage" :tabShow="flagArr[1]" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import Case from "./tab/case";
import Stage from "./tab/stage";

import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Case,
    Stage,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      width: "900px",
      tabName: "case",
      flagArr: [true, false],
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.tabName = "case";
        this.flagArr = [true, false];
      }
    },
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
    teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    },
  },
  methods: {
    handleClick(tab) {
      this.flagArr = new Array(2).fill(false);
      if (tab.name === "case") {
        this.flagArr[0] = true;
        this.$refs.case.setData();
      } else if (tab.name === "stage") {
        this.flagArr[1] = true;
        this.$refs.stage.getStage();
      }
    },
    close() {
      this.$emit("close");
      this.$refs.case.reset();
      this.$refs.stage.reset();
    },
  },
};
</script>

<style lang="scss" scoped></style>
