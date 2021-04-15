<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
var e = 80;
export default {
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "500px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000",
              fontSize: "16",
            },
          },
          // 控制网格线是否显示
          splitLine: {
            show: false,
          },
          // x轴的颜色和宽度
          axisLine: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是坐标轴的宽度,可以去掉
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000",
              fontSize: "16",
            },
          },
          // 控制网格线是否显示
          splitLine: {
            show: false,
          },
          // x轴的颜色和宽度
          axisLine: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是坐标轴的宽度,可以去掉
            },
          },
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
          },
        ],
        color: ["#3c90f7", "#55bfc0", "#76c87e", "#f4cd49", "#e05667"],
      });
    },
  },
};
</script>
