<template>
  <div class="corner">
    <span class="bottom-left" />
    <span class="bottom-right" />
    <div class="title">【饼图】</div>
    <div ref="pieRef" class="w-full h-full" />
  </div>
</template>

<script setup>
import useEchart from "./hooks/useEchart";
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "100%"
  },
  saturationRatioData: {
    type: Array,
    default() {
      return [];
    }
  }
});
const pieRef = ref();
let myChart = null;

onMounted(() => {
  myChart = useEchart(pieRef.value);
  let options = getOption(props.saturationRatioData);
  myChart.setOption(options);
});

watch(
  () => props.saturationRatioData,
  newVal => {
    if (myChart) {
      let options = getOption(newVal);
      myChart.setOption(options);
    } else {
      myChart = useEchart(pieRef.value);
      let options = getOption(props.saturationRatioData);
      myChart.setOption(options);
    }
  },
  {
    deep: true
  }
);

const getOption = pieDatas => {
  pieDatas = [
    {
      value: 100,
      name: "11占比",
      percentage: "20%",
      color: "#34D160"
    },
    {
      value: 400,
      name: "22占比",
      percentage: "40%",
      color: "#F19610"
    },
    {
      value: 500,
      name: "33占比",
      percentage: "40%",
      color: "#6054FF"
    }
  ];

  let colors = pieDatas.map(item => {
    return item.color;
  });

  let data = pieDatas.map(item => {
    return {
      value: item.value,
      name: item.name
    };
  });

  let total = pieDatas.reduce((a, b) => {
    return a + b.value * 1;
  }, 0);

  let option = {
    color: colors,
    title: {
      text: `{nameSty| 总数}\n{number|${total}}`,
      top: "50%",
      left: "30%",
      textStyle: {
        rich: {
          nameSty: {
            fontSize: 19,
            color: "white",
            padding: [10, 0]
          },
          number: {
            fontSize: 24,
            color: "white",
            padding: [4, 0, 0, 20]
          }
        }
      }
    },
    legend: {
      orient: "vertical",
      right: "10%",
      top: "5%",
      itemGap: 20,
      itemWidth: 16,
      itemHeigth: 16,
      icon: "rect",
      formatter: function (name) {
        var currentItem = pieDatas.find(item => item.name === name);
        return (
          "{nameSty|" +
          currentItem.name +
          "}\n" +
          "{numberSty|" +
          currentItem.value +
          "个 }" +
          "{preSty|" +
          currentItem.percentage +
          "}"
        );
      },
      textStyle: {
        rich: {
          nameSty: {
            fontSize: 12,
            color: "#FFFFFF",
            padding: [10, 14]
          },
          numberSty: {
            fontSize: 12,
            color: "#40E6ff",
            padding: [0, 0, 0, 14]
          },
          preSty: {
            fontSize: 12,
            color: "#40E6ff"
          }
        }
      }
    },
    series: [
      {
        type: "pie",
        center: ["40%", "57%"],
        radius: ["30%", "75%"],
        label: {
          show: false
        },
        data: data,
        roseType: "area"
      }
    ]
  };

  return option;
};
</script>
