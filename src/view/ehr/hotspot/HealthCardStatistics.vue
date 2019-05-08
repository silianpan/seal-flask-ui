<template>
  <div>
    <LegaEcharts style='height: 300px' :options='healthCardOptions'></LegaEcharts>
  </div>
</template>

<script>
import LegaEcharts from '@/components/charts/echarts'
import { HealthCardService } from '@/api/ehr/statistics'
export default {
  props: {},
  components: {
    LegaEcharts
  },
  data() {
    return {
      cardFamilyInfo: []
    }
  },
  methods: {
    async cardInit() {
      let res = await HealthCardService.getHealthCardInfo()
      if (res.ok()) {
        this.cardFamilyInfo = res.data
      }
    }
  },
  mounted() {
    // this.cardInit()
  },
  computed: {
    healthCardOptions() {
      let info = this.cardFamilyInfo || {}
      let title = []
      let card = []
      let family = []
      let sumFamily = []
      for (let obj of info) {
        title.push(obj.name)
        card.push(obj.cardNum)
        family.push(obj.familyNum)
        sumFamily.push(obj.sumFamilyNum)
      }
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['开卡家庭', '建档家庭', '总家庭数']
        },
        xAxis: {
          type: 'category',
          data: title
        },
        yAxis: {},
        series: [
          {
            name: '开卡家庭',
            type: 'bar',
            data: card
          },
          {
            name: '建档家庭',
            type: 'bar',
            data: family
          },
          {
            name: '总家庭数',
            type: 'bar',
            data: sumFamily
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
