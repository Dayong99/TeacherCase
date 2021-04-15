<template>
  <div>
    <h3>
      <i class="el-icon-s-order table-operation" />
      <span>任务内容</span>
    </h3>
    <el-card class="box-card">
      <el-row :gutter="24">
        <el-col :span="4">
          <el-image :src="getUrl()">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
        <el-col :span="20">
          <p>
            <span>教学任务：</span><span>{{ nowCase.teachname }}</span>
          </p>
          <p>
            <span>案例名称：</span><span>{{ nowCase.casename }}</span>
          </p>
          <p>
            <span>题材类型：</span>
            <span v-html="showType(nowCase.casetype)"></span>
          </p>
          <div>
            <span>案例简介：</span>
            <div v-html="nowCase.caseQuire" id="introBox"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";

export default {
  name: "CaseEdit",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    nowCase: {},
  },
  data() {
    return {
      modal: false,
      buttonLoading: false,

      typeList: [],
    };
  },
  filters: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (this.$route.path == "/study/now_case") {
      this.getUrl();
      this.getType();
    }
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

    // 封面图片
    getUrl() {
      if (this.nowCase.caseid) {
        return (
          globalConfig.baseURL +
          "attach/findImg?caseId=" +
          this.nowCase.caseid +
          "&num=" +
          Math.random()
        );
      }
    },

    showWork(work) {
      if (work.length >= 30) {
        return work.substring(0, 30) + "...";
      } else {
        return work;
      }
    },
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.app-container {
  h3 {
    line-height: 50px;
    display: flex;
    align-items: center;

    i {
      font-size: 1.5rem;
    }
  }

  .el-card {
    margin-bottom: 30px;
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    .el-image {
      max-width: 300px;
      max-height: 300px;
    }
    .content {
      height: 100px;
      display: flex;
    }
    span {
      margin-right: 10px;
    }
    .type {
      margin-left: 20px;
    }
  }

  .caseBox {
    position: absolute;
    right: 30px;
    display: flex;
    align-items: center;

    i {
      &:first-child {
        font-size: 1.8rem;
        color: #ff8d1a;
      }
      &:nth-child(2) {
        font-size: 1.3rem;
      }
    }
  }

  .icon-download {
    font-size: 1.4rem !important;
  }

  #introBox {
    height: 200px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 100%;
    padding: 5px 15px;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -o-user-select: none;
    user-select: none;
  }
}
</style>
