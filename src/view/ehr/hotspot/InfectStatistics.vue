<template>
  <div>
    <LegaEcharts style='height: 500px' :options='typeOptions'></LegaEcharts>
  </div>
</template>

<script>
import LegaEcharts from '@/components/charts/echarts'
import { SInfectService } from '@/api/ehr/statistics'
export default {
  props: {},
  components: {
    LegaEcharts
  },
  data() {
    return {
      pieParams: {}, // 饼状图的条件
      typeInfo: [], // 存储慢性病类型统计
      diseaseInfo: []
    }
  },
  methods: {
    async typeInit(position = 'all') {
      this.pieParams.position = position
      let res1 = await SInfectService.getInfectType(this.pieParams)
      let res2 = await SInfectService.getInfectDisease(this.pieParams)
      if (res1.ok() && res2.ok()) {
        this.typeInfo = res1.data
        this.diseaseInfo = res2.data
      }
    }
  },
  mounted() {
    this.typeInit()
  },
  computed: {
    typeOptions() {
      let type = this.typeInfo || []
      let disease = this.diseaseInfo || []
      let title = []
      for (let obj of disease) {
        title.push(obj.name)
      }
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: title
        },
        series: [
          {
            name: '类型分布',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: type
          },
          {
            name: '详情',
            type: 'pie',
            radius: ['40%', '55%'],
            data: disease
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
