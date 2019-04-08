<template>
  <div>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaEcharts style='height: 300px' :options='residentOptions'></LegaEcharts>
          <LegaTable ref="table" :options="tableInfo"></LegaTable>
        </Card>
      </i-col>
    </Row>
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
      residentInfo: [],
      timeRange: {}, // 存储时间范围
      tableInfo: {
        queryDataAction: this.resInit,
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
            key: 'resNum',
            title: '建档个人(人)'
          },
          {
            key: 'sumResNum',
            title: '总人数(人)'
          },
          {
            key: 'expireRes',
            title: '未建档个人(人)',
            render: (h, params) => {
              let res = (params.row.sumResNum - params.row.resNum) < 0 ? 0 : params.row.sumResNum - params.row.resNum
              return h('span', params.row.sumResNum - res)
            }
          },
          {
            key: 'resRate',
            title: '建档率',
            render: (h, params) => {
              let rate = (params.row.sumResNum - params.row.resNum) < 0 ? 100 : Math.round(params.row.resNum / params.row.sumResNum * 10000) / 100.00
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
    async resInit(params, callback) {
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
      let res = await SResidentService.getResidentInfo(queryParams)
      if (res.ok()) {
        this.residentInfo = res.data
        callback(res)
      }
    }
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
      // 柱状图中时间段的显示
      let subtext = this.timeRange.from_date + '~' + this.timeRange.to_date
      if (this._.isNil(this.timeRange.from_date) || this._.isNil(this.timeRange.to_date)) {
        subtext = '至今'
      }
      let options = {
        title: {
          text: '居民登记情况统计',
          subtext: subtext
        },
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
