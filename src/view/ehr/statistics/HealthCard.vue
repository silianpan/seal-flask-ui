<template>
  <div>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaEcharts style='height: 300px' :options='healthCardOptions'></LegaEcharts>
          <LegaTable ref="table" :options="tableInfo"></LegaTable>
        </Card>
      </i-col>
    </Row>
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
      cardFamilyInfo: [],
      timeRange: {}, // 存储时间范围
      tableInfo: {
        queryDataAction: this.cardInit,
        stripe: true,
        border: true,
        tableSize: 'small',
        actionsHandle: {},
        permissionPerfix: this.$route.name,
        columns: [
          {
            key: 'name',
            title: '乡镇名'
          },
          {
            key: 'cardNum',
            title: '开卡家庭(户)'
          },
          {
            key: 'familyNum',
            title: '建档家庭(户)'
          },
          {
            key: 'sumFamilyNum',
            title: '总家庭数(户)'
          },
          {
            key: 'expireCard',
            title: '已建档未开卡家庭(户)',
            render: (h, params) => {
              return h('span', params.row.familyNum - params.row.cardNum)
            }
          },
          {
            key: 'cardRate',
            title: '开卡率',
            render: (h, params) => {
              let rate = Math.round(params.row.cardNum / params.row.familyNum * 10000) / 100.00
              let str = '-'
              if (isNaN(rate) === false) {
                str = rate + '%'
              }
              return h('span', str)
            }
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'dateRange',
              label: '时间范围',
              placement: 'bottom-start',
              prop: 'visit_date',
              tip: '时间范围'
            }
          ]
        }
      }
    }
  },
  methods: {
    async cardInit(params, callback) {
      let queryParams = {}
      if (params.conditions && this._.isArray(params.conditions)) {
        params.conditions.forEach(item => {
          if (item.field === 'visit_date' && item.value) {
            let fromDate = this._moment(item.value[0]).format('YYYY-MM-DD')
            let toDate = this._moment(item.value[1])
              .add(1, 'days')
              .format('YYYY-MM-DD')
            if (fromDate !== 'Invalid date') {
              queryParams.from_date = fromDate
            }
            if (toDate !== 'Invalid date') {
              queryParams.to_date = toDate
            }
          } else {
            queryParams[item.field] = item.value
          }
        })
      }
      this.timeRange = queryParams
      let res = await HealthCardService.getHealthCardInfo(queryParams)
      if (res.ok()) {
        this.cardFamilyInfo = res.data
        callback(res)
      }
    }
  },
  mounted: function() {
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
      // 柱状图中时间段的显示
      let subtext = this.timeRange.from_date + '~' + this.timeRange.to_date
      if (this._.isNil(this.timeRange.from_date) || this._.isNil(this.timeRange.to_date)) {
        subtext = '至今'
      }
      let options = {
        title: {
          text: '健康证发卡统计',
          subtext: subtext
        },
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
