<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="12">
        <h3>
          <i class="iconfont icon-qushiyanshi table-operation mr0" />
          系统访问量统计
        </h3>
        <pv></pv>
      </el-col>
      <el-col :span="12">
        <h3>
          <i class="iconfont icon-qushiyanshi table-operation mr0" />
          当前案例分类占比统计
        </h3>
        <type></type>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Pv from "./components/PV";
import Type from "./components/Type";

export default {
     props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Pv,
    Type,
  },
  data() {
    return {
      width: "1000px",
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
   methods: {
    close() {
      this.$emit("close");
    }
  },
};
</script>
<style lang="scss" scoped>
h4 {
  display: flex;
  align-items: center;
}
.iconfont {
  font-size:20px;
  margin-right:10px;
}
</style>