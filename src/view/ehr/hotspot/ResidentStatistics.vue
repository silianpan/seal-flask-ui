<template>
  <div>
    <LegaEcharts style='height: 300px' :options='residentOptions'></LegaEcharts>
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
      residentInfo: []
    }
  },
  methods: {
    async resInit() {
      let res = await SResidentService.getResidentInfo()
      if (res.ok()) {
        this.residentInfo = res.data
      }
    }
  },
  mounted() {
    this.resInit()
  },
  computed: {
    residentOptions() {
      let info = this.residentInfo || {}
      let title = []
      let res = []
      let sumRes = []
      for (let obj of info) {
        title.push(obj.name)
        res.push(obj.resNum)
        sumRes.push(obj.sumResNum)
      }
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['建档人数', '总人数']
        },
        xAxis: {
          type: 'category',
          data: title
        },
        yAxis: {},
        series: [
          {
            name: '建档人数',
            type: 'bar',
            data: res
          },
          {
            name: '总人数',
            type: 'bar',
            data: sumRes
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
