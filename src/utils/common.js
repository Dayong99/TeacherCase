import axios from "axios";

export default {
    // 获取所有案例
    getAllCase: function () {
        return new Promise((resolve, reject) => {
            axios.get(globalConfig.baseURL + "caseteach/case-library/showAll").then((r) => {
                if (r.data.code == 20000) {
                    resolve(r.data.data) 
                }
            });
        })

    },
    // 显示案例
    showCase: function (val, arr) {
        let process;
        arr.forEach((item, index) => {
            if (Number(val) === Number(item.id)) {
                process = item.typeName;
            }
        });
        return process;
    },


    // 案例类型
    getAllType: function () {
        return new Promise((resolve, reject) => {
            axios.get(globalConfig.baseURL + "caseteach/case-type-info").then((r) => {
                if (r.data.code == 20000) {
                    resolve(r.data.data) 
                }
            });
        })
    },
    showType: function (val, arr) {
        let type;
        console.log(arr)
        arr.forEach((item, index) => {
            if (Number(val) === Number(item.id)) {
                type = item.typeName;
            }
        });
        return type;
    },

    // 案例进度
    getAllProcess: function () {
        return new Promise((resolve, reject) => {
            axios.get(globalConfig.baseURL + "caseteach/pro-type-info").then((r) => {
                if (r.data.code == 20000) {
                    resolve(r.data.data) 
                }
            });
        })
    },
    showProcess: function (val, arr) {
        let process;
        arr.forEach((item, index) => {
            if (Number(val) === Number(item.id)) {
                process = item.typeName;
            }
        });
        return process;
    },

    // 获取所有期班
    getAllClass: function () {
        return new Promise((resolve, reject) => {
            axios.get(globalConfig.baseURL + "case/user/showCalss").then((r) => {
                if (r.data.code == 20000) {
                    resolve(r.data.data) 
                }
            });
        })
    },
    // 显示班级
    showClass: function (val, arr) {
        let oneClass;
        arr.forEach((item, index) => {
            if (Number(val) === Number(item.id)) {
                cloneClassass = item.typeName;
            }
        });
        return oneClass;
    },
}


