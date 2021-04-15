<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <i :class="icon"></i>
        <span>{{ title }}</span>
      </div>
      <el-form
        ref="caseForm"
        :model="oneCase"
        :rules="caseRules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="案例名称" prop="caseName">
              <el-input v-model="oneCase.caseName" size="small" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="题材类型" prop="caseType">
              <el-select
                v-model="oneCase.caseType"
                placeholder="请选择"
                size="small"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案例密级" prop="caseSecrecy">
              <el-select
                v-model="oneCase.caseSecrecy"
                placeholder="请选择"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in secrecyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案例作者" prop="caseAuthor">
              <el-input v-model="oneCase.caseAuthor" size="small" clearable />
            </el-form-item>
          </el-col> </el-row
      ></el-form>
      <el-form label-position="right" label-width="80px" class="case-form">
        <el-row :gutter="24">
          <el-col :span="19">
            <el-row>
              <el-form-item label="案例简介" prop="caseIntroduce">
                <Tinymce
                  ref="editor"
                  v-model="oneCase.caseIntroduce"
                  :height="height"
                />
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="img-block">
              <div class="demonstration">案例封面</div>
              <el-upload
                ref="drawUpload"
                class="avatar-uploader"
                :action="getURL()"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="getParams()"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="title !== '新增案例'" v-cloak>
        <div class="filter-container" style="text-align: right">
          <i
            class="el-icon-circle-plus-outline nav-operation"
            title="新建章节"
            @click="add()"
          />
          <i
            class="el-icon-remove-outline nav-operation"
            title="批量删除"
            @click="batchDelete()"
          />
        </div>
        <el-table
          ref="table"
          :key="tableKey"
          v-loading="loading"
          :data="list"
          border
          fit
          style="width: 100%"
          @selection-change="onSelectChange"
          max-height="300"
        >
          <el-table-column type="selection" align="center" width="40px" />
          <el-table-column
            label="章节名称"
            :show-overflow-tooltip="true"
            align="center"
            min-width="80px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sectionName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="资料"
            align="center"
            width="120px"
            class-name="iconBox"
          >
            <template slot-scope="{ row }">
              <i
                class="el-icon-upload table-operation"
                @click="getFile(row)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operation')"
            align="center"
            width="200px"
            class-name="small-padding fixed-width iconBox"
          >
            <template slot-scope="{ row }">
              <i
                class="el-icon-info table-operation"
                @click="view(row)"
                title="任务详情"
              />
              <i
                class="iconfont icon-ai-module table-operation orange"
                title="查看子章节"
                @click="addChild(row)"
              />
              <i
                class="iconfont icon-tishi table-operation green"
                title="操作提示"
                @click="showTip(row)"
              />
              <i
                class="el-icon-s-tools table-operation purple"
                title="修改"
                @click="edit(row)"
              />
              <i
                class="el-icon-delete table-operation red"
                title="删除"
                @click="singleDelete(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          plain
          :loading="buttonLoading"
          @click="isVisible = false"
          >{{ $t("common.cancel") }}</el-button
        >
        <el-button
          type="primary"
          plain
          :loading="buttonLoading"
          @click="submitForm"
          >{{ $t("common.confirm") }}</el-button
        >
      </div>
    </el-dialog>

    <!-- 新建章节/阶段 -->
    <add-chapter
      ref="chapter"
      :dialog-visible="caseChapterVisible"
      @close="chapterClose"
      @success="editSuccess"
      :title="chapterTitle"
      :icon="chapterIcon"
    />

    <!-- 参考资料 -->
    <file ref="file" :dialog-visible="fileTipVisible" @close="fileClose" />

    <!-- 新建子阶段 -->
    <add-child
      ref="child"
      :dialog-visible="caseChildVisible"
      :title="childTitle"
      @close="childClose"
    />

    <!-- 操作提示 -->
    <tip
      ref="tip"
      :dialog-visible="caseTipVisible"
      @close="TipClose"
      @success="editSuccess"
    />

    <!-- 详情 -->
    <case-view
      ref="view"
      :dialog-visible="caseViewVisible"
      @close="viewClose"
      :icon="icon"
      :detailTitle="detailTitle"
    />
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import Pagination from "@/components/Pagination";
import Tinymce from "@/components/Tinymce";

import Tip from "../Edit/OperationTip";
import File from "../Edit/Upload";
import AddChild from "../Edit/Child";
import AddChapter from "../Edit/AddChapter";
import caseView from "../../caseCommon/task/Index";

export default {
  name: "CaseEdit",
  components: {
    Pagination,
    Tip,
    AddChild,
    File,
    AddChapter,
    Tinymce,
    caseView
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      modal: false,
      oneCase: this.initCase(),
      buttonLoading: false,
      width: "1100px",
      height: "120",
      caseRules: {
        caseName: [
          {
            required: true,
            message: "案例名称不能为空",
            trigger: "blur"
          }
        ],
        caseType: {
          required: true,
          message: "请选择题材类型",
          trigger: "change"
        },
        caseSecrecy: [
          {
            required: true,
            message: "请选择案例密级",
            trigger: "change"
          }
        ],
        caseAuthor: {
          required: true,
          message: "案例作者不能为空",
          trigger: "change"
        }
      },

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      selection: [],
      pagination: {
        size: 10,
        num: 1
      },
      processList: [],
      secrecyList: [
        {
          label: "公开",
          value: 1
        },
        {
          label: "内部",
          value: 2
        }
      ],

      // 新增章节
      caseChapterVisible: false,
      chapterTitle: "",

      // 新增子章节
      caseChildVisible: false,
      childTitle: "",
      chapterIcon: "",

      // 操作提示
      caseTipVisible: false,

      // 章节详情
      caseViewVisible: false,
      detailTitle: "",

      // 参考资料
      fileTipVisible: false,

      // 封面上传
      imageUrl: ""
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
  mounted() {
    this.getProcessType();
  },
  methods: {
    // 加载相关信息
    setCase(val) {
      this.oneCase = { ...val };
      this.oneCase.materialId = this.oneCase.id;
      this.imageUrl =
        globalConfig.baseURL +
        "attach/findImg?caseId=" +
        this.oneCase.id +
        "&num=" +
        Math.random();

      if (window.tinymce) {
        if (this.oneCase.caseIntroduce) {
          this.$refs["editor"].setContent(this.oneCase.caseIntroduce);
        }
      }
      this.fetch();
    },

    // 查询该案例所有章节
    fetch(params = {}) {
      params.caseid = this.oneCase.id;
      this.loading = true;
      this.$get("caseteach/case-section/getSection", {
        ...params
      }).then(r => {
        const data = r.data.data;
        this.list = data;
        this.loading = false;
      });
    },
    getProcessType() {
      this.$get("caseteach/pro-type-info").then(r => {
        if (r.data.code == 20000) {
          this.processList = r.data.data;
        }
      });
    },
    showProcess(val) {
      let process;
      this.processList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          process = item.typeName;
        }
      });
      return process;
    },
    initCase() {
      return {
        id: "",
        caseName: "",
        caseType: "",
        caseSecrecy: "",
        caseAuthor: "",
        caseIntroduce: "",
        casePhoto: "",
        execute: null,
        isDelete: null,
        ratio: null,
        materialId: null
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneCase = this.initCase();
      this.imageUrl = "";
      this.$nextTick(() => {
        this.$refs["caseForm"].clearValidate();
        this.$refs["drawUpload"].clearFiles();
        if (window.tinymce) {
          this.$refs["editor"].setContent("");
        }
      });
    },

    // 新增章节/阶段
    editClose() {
      this.caseChapterVisible = false;
    },
    editSuccess() {
      this.fetch();
    },
    add() {
      this.chapterTitle = "新建";
      this.chapterIcon = "el-icon-circle-plus-outline nav-operation";
      this.caseChapterVisible = true;
      this.$refs.chapter.setId(this.oneCase.id);
    },
    edit(row) {
      this.chapterTitle = "修改";
      this.chapterIcon = "el-icon-s-tools table-operation purple";
      this.caseChapterVisible = true;
      this.$refs.chapter.setSection(row);
    },
    chapterClose() {
      this.caseChapterVisible = false;
    },
    //最终提交
    submitForm() {
      this.$refs.caseForm.validate(valid => {
        if (valid) {
          if (!this.oneCase.id) {
            this.$post("caseteach/case-library", { ...this.oneCase }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success"
                });
                this.$emit("success");
              }
            );
            // }
          } else {
            // update
            this.$put("caseteach/case-library", { ...this.oneCase }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.updateSuccess"),
                  type: "success"
                });
                this.$emit("success");
              }
            );
          }
        } else {
          return false;
        }
      });
    },

    // 新增子阶段
    addChild(row) {
      this.caseChildVisible = true;
      this.childTitle = row.sectionName + "—子章节";
      this.$refs.child.setId(row);
    },
    childClose() {
      this.caseChildVisible = false;
    },

    // 操作提示
    showTip(row) {
      this.caseTipVisible = true;
      this.$refs.tip.setSection(row);
    },
    TipClose() {
      this.caseTipVisible = false;
    },

    // 查看详情
    viewClose() {
      this.caseViewVisible = false;
    },
    view(row) {
      // this.$refs.view.setView(row);
      this.caseViewVisible = true;
      this.$refs.view.setView(row.sectionWork);
      this.detailTitle = row.sectionName;
    },

    // 删除单个案例
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true);
      this.batchDelete();
    },
    // 批量删除
    onSelectChange(selection) {
      this.selection = selection;
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning"
        });
        return;
      }
      const contain = false;
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          const sectionIds = [];
          this.selection.forEach(u => {
            sectionIds.push(u.id);
          });
          this.delete(sectionIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(sectionIds) {
      this.loading = true;
      sectionIds.forEach(e => {
        this.$delete(`caseteach/case-section/?ids=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          });
          this.fetch();
        });
      });
    },

    // 参考资料
    getFile(row) {
      this.fileTipVisible = true;
      this.$refs.file.setId(row.id);
    },
    fileClose() {
      this.fileTipVisible = false;
    },

    // 新建案例-上传封面
    // 参数
    getParams() {
      if (this.oneCase.id) {
        return {
          fileSource: 0,
          parentId: this.oneCase.id
        };
      } else {
        return {
          fileSource: 0
        };
      }
    },
    getURL() {
      return globalConfig.baseURL + "file/upload";
    },
    handleAvatarSuccess(res, file) {
      this.oneCase.materialId = res.data.id;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }

      return isJPG || isPNG;
    },

    showWork(work) {
      if (work.length >= 30) {
        return work.substring(0, 30) + "...";
      } else {
        return work;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.icon-wenjian {
  font-size: 1.4rem;
}
[v-cloak] {
  display: none;
}
</style>
