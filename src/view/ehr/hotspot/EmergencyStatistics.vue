<template>
  <div>
    <LegaEcharts style='height: 500px' :options='typeOptions'></LegaEcharts>
  </div>
</template>

<script>
import LegaEcharts from '@/components/charts/echarts'
import { SEmergencyService } from '@/api/ehr/statistics'
export default {
  props: {},
  components: {
    LegaEcharts
  },
  data() {
    return {
      pieParams: {}, // 饼状图的条件
      typeInfo: [] // 存储突发事件类型统计
    }
  },
  methods: {
    async typeInit(position = 'all') {
      this.pieParams.position = position
      let res = await SEmergencyService.getEmergencyType(this.pieParams)
      if (res.ok()) {
        this.typeInfo = res.data
      }
    }
  },
  mounted() {
    this.typeInit()
  },
  computed: {
    typeOptions() {
      let type = this.typeInfo || []
      let title = []
      for (let obj of type) {
        title.push(obj.name)
      }
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: title
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: type,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
