<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i :class="icon" style="font-size: 1.8rem; margin-top: 0"></i>
      <span>文件下载</span>
    </div>
    <ul class="fileBox">
      <li v-for="(item, index) in list" :key="index">
        <span>{{ item.fileName }}【{{ item.fileType }}】</span>
        <div>
          <a :href="download(item)">
            <i class="iconfont icon-xiazai1 table-operation" title="下载" />
          </a>
        </div>
      </li>
    </ul>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      class="pageBox"
    />
  </el-dialog>
</template>
<script>
import Pagination from "@/components/Pagination";

export default {
  name: "Upload",
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      id: null,
      modal: false,
      buttonLoading: false,
      width: "700px",
      // 表格
      loading: false,
      list: null,
      total: 0,
      pagination: {
        size: 10,
        num: 1,
      },
    };
  },
  filters: {},
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      },
    },
  },
  mounted() {
    this.fetch();
  },
  methods: {
    reset() {
      this.fileList = [];
    },

    close() {
      this.$emit("close");
    },
    fetch() {
      this.loading = true;
      this.$get("caseteach/section-material/showMaterial", {
        id: this.id,
        pageSize: this.pagination.size,
        pageNum: this.pagination.num,
      }).then((r) => {
        const data = r.data.data;
        this.total = data.total;
        this.list = data.rows;
        this.loading = false;
      });
    },
    setFile(val) {
      this.id = val;
      this.fetch();
    },
    getName(str) {
      let i = str.indexOf("&");
      return str.substring(i + 1);
    },
    download(row) {
      return globalConfig.baseURL + "file/download?materialId=" + row.id;
      this.getName(row.fileName);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
