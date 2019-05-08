<!--
证卡发放统计
 -->
<template>
<div>
  <LegaEcharts style="height: 300px;" :options="healthCardOptions"></LegaEcharts>
</div>
</template>

<script>
import {
  HotSpotService
} from '@/api/ehr/hotspot'
import LegaEcharts from '@/components/charts/echarts'
export default {
  props: {},
  components: {
    LegaEcharts
  },
  data() {
    return {
      cardFamilyInfo: {}
    }
  },
  methods: {
    async init() {
      const res = HotSpotService.queryStatisticsOfHealthCardIssuance()
      if (res.status === 0) {
        this.cardFamilyInfo = res.data
      }
    }
  },
  mounted() {
    // this.init()
  },
  computed: {
    healthCardOptions() {
      let info = this.cardFamilyInfo || {}
      let options = {
        legend: {
          left: 'left',
          data: ['家庭', '证卡']
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            let content = `${params.name} :${params.value}`
            return callback(content)
          }
        },
        series: [{
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [{
            name: '家庭',
            value: info.familyNums || 0
          },
          {
            name: '证卡',
            value: info.cardNums || 0
          }
          ]
        }]
      }

      return options
    }
  }
}
</script>

<style  scoped>
</style>
