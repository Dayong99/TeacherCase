<template>
  <el-dialog
    :width="width"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i
        class="el-icon-info table-operation"
      ></i>
      <span>任务详情</span>
    </div>
    <div class="filter-container">
      <el-select v-model="caseId" placeholder="请选择" size="small" clearable>
        <el-option
          v-for="item in allCase"
          :key="item.id"
          :label="item.caseName"
          :value="item.id"
        />
      </el-select>
      <i
        class="el-icon-circle-plus-outline nav-operation"
        title="新增案例"
        @click="addCase()"
      />
    </div>

    <ul class="detailBox">
      <li v-for="(item, index) in caseList" :key="index">
        <el-row :gutter="24">
          <el-col :span="12">
            <span>{{ item.caseName }}（{{ item.weight }}%）</span>
          </el-col>
          <el-col :span="10" class="weight">
            <el-slider
              v-model="item.weight"
              @input="getTotalWeight"
            ></el-slider>
          </el-col>
          <el-col :span="2">
            <div>
              <i class="el-icon-delete red" @click="deleteCase(item)"></i>
            </div>
          </el-col>
        </el-row>
      </li>
    </ul>
    <h3>案例权重之和：{{ weightTotal }}%</h3>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain @click="submitForm">{{
        $t("common.confirm")
      }}</el-button>
    </div>
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
  },
  data() {
    return {
      id: null,
      modal: false,
      buttonLoading: false,
      width: "900px",
      caseList: [],
      idArr: [],
      weightTotal: 0,
      oneTeach: this.initTeach(),
      caseId: "",
      caseName: "",
      allCase: [],
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
     teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    }
  },
  watch: {
    isVisible(val) {
      if (val) {
        this.getAllInfo();
      }
    },
  },
  mounted() {},
  methods: {
    // 获取所有案例
    getAllInfo() {
      this.common.getAllCase().then((r) => {
        this.allCase = r;
      });
    },
    reset() {
      this.caseList = [];
      this.idArr = [];
      this.caseId = "";
      this.caseName = "";
      this.$emit("resetList");
    },

    close() {
      this.$emit("close");
    },
    initTeach() {
      return {
        id: null,
        classid: "",
        name: "",
        sts: [],
      };
    },
    setCase() {
      this.oneTeach.id = this.teachingInfo.id;
      this.oneTeach.name = this.teachingInfo.teachName;
      this.oneTeach.classid = this.classId;
      this.caseList = this.teachingInfo.teachCases;
      this.teachingInfo.teachCases.forEach((item, index) => {
        this.idArr.push(item.caseId);
      });
    },

    // 是否显示删除按钮
    deleteShow(item) {
      if (this.idArr.indexOf(item.caseId) == -1) {
        // console.log("不存在");
        return false;
      } else {
        // console.log("已存在");
        return true;
      }
    },

    deleteCase(item) {
      if (this.caseList.length === 1) {
        this.$message.warning("教学任务不可为空");
      } else {
        const index = this.caseList.indexOf(item);
        this.$message({
          message: this.$t("tips.deleteSuccess"),
          type: "success",
        });
        this.caseList.splice(index, 1);
        this.getTotalWeight();
      }
    },

    // 移动滑块时触发
    getTotalWeight() {
      this.weightTotal = 0;
      this.caseList.forEach((item, index) => {
        this.weightTotal += item.weight;
      });
    },
    submitForm() {
      this.oneTeach.sts = this.caseList;
      this.getTotalWeight();
      if (this.weightTotal > 100) {
        this.$message.warning("案例权重之和已超过100%");
      } else if (this.weightTotal !== 100) {
        this.$message.warning("案例权重之和需为100%");
      } else {
        this.$jsonPost("caseteach/teach-case/update_teachcase", {
          sts: this.oneTeach,
        }).then(() => {
          this.isVisible = false;
          this.$message({
            message: "设置成功",
            type: "success",
          });
          this.$emit("success");
        });
      }
    },

    // 新增案例
    addCase() {
      if (this.caseId == "") {
        this.$message.warning("未选择案例");
      } else {
        if (
          this.caseList.findIndex((target) => target.caseId === this.caseId) ==
          -1
        ) {
          this.allCase.forEach((item, index) => {
            if (item.id == this.caseId) {
              this.caseList.push({
                caseId: this.caseId,
                caseName: item.caseName,
                weight: 0,
              });
            }
          });
        } else {
          this.$message.warning("该案例已存在");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.detailBox {
  font-size: 16px;
  li {
    margin-bottom: 5px;
    line-height: 38px;
  }
  i {
    font-size: 1.2rem;
    float: right;
    cursor: pointer;
    line-height: 38px;
  }
}

h3 {
  text-align: right;
}

.filter-container {
  display: flex;
  flex-direction: flex-start;
  i {
    margin-left: 10px;
    margin-top: 3px;
  }
  .el-button {
    position: absolute;
    right: 5px;
  }
}
</style>
