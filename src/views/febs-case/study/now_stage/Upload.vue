<template>
  <el-dialog
    :width="width"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-upload table-operation"></i>
      <span>参考资料</span>
    </div>
    <ul class="fileBox">
      <li v-for="(item, index) in fileList" :key="index">
        <span>{{ item.fileName }}</span>
        <div>
          <a :href="download(item)">
            <i class="iconfont icon-xiazai1 table-operation" title="下载" />
          </a>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>
<script>
export default {
  name: "Upload",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      id: null,
      modal: false,
      width: "700px",
      fileList:[]
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
    }
  },
  mounted() {},
  methods: {
    reset() {
      this.fileList = [];
    },
   
    close() {
      this.$emit("close");
    },
   
    setId(val) {
      this.id = val;
      this.getFileList();
    },
    getFileList() {
      this.$get("caseteach/teach-gradation/getMaterial", {
        parentId: this.id
      }).then(r => {
        this.fileList = r.data.data;
      });
    },
    
    download(item) {
      return globalConfig.baseURL + "file/download?materialId=" + item.id;
    },

  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
