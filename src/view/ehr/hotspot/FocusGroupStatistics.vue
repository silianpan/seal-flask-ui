<template>
  <div>
    <LegaEcharts style='height: 300px' :options='focusOptions'></LegaEcharts>
  </div>
</template>

<script>
import LegaEcharts from '@/components/charts/echarts'
import { SResidentService } from '@/api/ehr/statistics'
export default {
  props: {},
  components: {
    LegaEcharts
  },
  data() {
    return {
      focusInfo: [] // 存储重点人群统计
    }
  },
  methods: {
    async focusInit() {
      let res = await SResidentService.getFocusGroupInfo()
      if (res.ok()) {
        this.focusInfo = res.data
      }
    }
  },
  mounted() {
    this.focusInit()
  },
  computed: {
    focusOptions() {
      let info = this.focusInfo || []
      let title = []
      let children = []
      let old = []
      let disease = []
      let women = []
      for (let obj of info) {
        title.push(obj.name)
        children.push(obj.childrenNum)
        old.push(obj.oldNum)
        disease.push(obj.diseaseNum)
        women.push(obj.womenNum)
      }
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['儿童人数', '老年人人数', '慢性病人数', '孕妇人数']
        },
        xAxis: {
          type: 'category',
          data: title
        },
        yAxis: {},
        series: [
          {
            name: '儿童人数',
            type: 'bar',
            data: children
          },
          {
            name: '老年人人数',
            type: 'bar',
            data: old
          },
          {
            name: '慢性病人数',
            type: 'bar',
            data: disease
          },
          {
            name: '孕妇人数',
            type: 'bar',
            data: women
          }
        ]
      }
      return options
    }
  }
}
</script>

<style>
</style>
