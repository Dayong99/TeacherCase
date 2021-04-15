<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <svg aria-hidden="true">
          <use xlink:href="#icon-PDF1" />
        </svg>
        <span>批改文档</span>
      </div>
      <ul class="fileBox">
        <li v-for="(item, index) in list" :key="index">
          <span>{{ item.fileName }}</span>
          <div>
            <a :href="download(item)">
              <i class="iconfont icon-xiazai1 table-operation"></i>
            </a>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils";

export default {
  name: "CaseEdit",
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      width: "700px",

      // 表格
      list: [],
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
    nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
    }
  },
  mounted() {},
  methods: {
    // 加载相关信息
    setFile(val) {
      this.list = val;
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      this.list = [];
    },
    // 下载文件
    download(item) {
      return globalConfig.baseURL + "file/download?materialId=" + item.id;
    }
  }
};
</script>
<style lang="scss" scoped>
svg {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}
</style>
