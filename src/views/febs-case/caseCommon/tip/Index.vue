<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i class="el-icon-question table-operation green"></i>
      <span>操作提示</span>
    </div>
    <div v-html="content"></div>
  </el-dialog>
</template>
<script>
import Tinymce from "@/components/Tinymce";

export default {
  name: "OperationTip",
  components: { Tinymce },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      screenWidth: 0,
      width: "700px",
      height: "400",
      content:''
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
  mounted() {
  },
  methods: {
    setView(val){
      this.content  = val
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

