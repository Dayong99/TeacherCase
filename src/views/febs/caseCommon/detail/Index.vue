<template>
  <el-dialog title="案例详情" :width="width" :visible.sync="isVisible" class="viewBox">
    <div slot="title" class="dialog-title">
      <i class="el-icon-info table-operation"></i>
      <span>案例详情</span>
    </div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>案例名称：</span>
          {{ view.caseName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>题材类型：</span>
          <span v-text="showType(view.caseType)"></span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>案例作者：</span>
          {{ view.caseAuthor }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>密级：</span>
          {{ Number(view.caseSecrecy)===1?'公开':'保密' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <!-- <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>老师打分权重：</span>
          {{ view.ratio }}%
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>创建日期：</span>
          {{ view.createTime }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col>
        <div class="view-item">
          <span>案例简介：</span>
          <div v-html="view.caseIntroduce" class="textBox"></div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: "CaseView",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      width: "900px",
      view: {},
      typeList: [],
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
    this.getType()
  },
  methods: {
    getType() {
      this.$get("caseteach/case-type-info").then((r) => {
        if (r.data.code == 20000) {
          this.typeList = r.data.data;
        }
      });
    },
    showType(val) {
      let name;
      this.typeList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          name = item.typeName;
        }
      });
      return name;
    },

    close() {
      this.$emit("close");
    },
    setView(val) {
      this.view = val;
    },
  },
};
</script>