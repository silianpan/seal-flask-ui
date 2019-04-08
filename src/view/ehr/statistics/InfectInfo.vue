<template>
  <div>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaEcharts style='height: 300px' :options='infectOptions'></LegaEcharts>
        </Card>
      </i-col>
    </Row>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaTable ref="table" :options="tableInfo"></LegaTable>
        </Card>
      </i-col>
    </Row>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaEcharts style='height: 500px' :options='typeOptions'></LegaEcharts>
        </Card>
      </i-col>
    </Row>
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
      pieText: '总体', // 存放饼状图的子标题
      pieParams: {}, // 饼状图的条件
      timeRange: {}, // 存储时间范围
      infectInfo: [], // 存储传染病报告统计
      typeInfo: [], // 存储慢性病类型统计
      diseaseInfo: [],
      tableInfo: {
        queryDataAction: this.infectInit,
        height: 290,
        stripe: true,
        border: true,
        tableSize: 'small',
        actionsHandle: {},
        permissionPerfix: this.$route.name,
        columns: [
          {
            key: 'position',
            title: '乡镇名'
          },
          {
            key: 'diagnosisNum',
            title: '确诊数量'
          },
          {
            key: 'diseaseNum',
            title: '发病数量'
          },
          {
            key: 'deadNum',
            title: '死亡数量'
          },
          {
            key: 'sumNum',
            title: '总数量',
            render: (h, params) => {
              return h('Tooltip',
                {
                  props: {
                    content: '点击查看传染病分类详情',
                    placement: 'right'
                  }
                },
                [
                  h('span', {
                    style: {
                      'cursor': 'pointer',
                      'color': 'rgb(45,140,240)',
                      'text-decoration': 'underline'
                    },
                    on: {
                      click: () => {
                        this.typeInit(params.row.position)
                        this.pieText = params.row.position
                      }
                    }
                  }, params.row.sumNum)
                ]
              )
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
    async infectInit(params, callback) {
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
      this.pieParams = JSON.parse(JSON.stringify(queryParams))
      this.timeRange = queryParams
      let res = await SInfectService.getInfectInfo(queryParams)
      if (res.ok()) {
        this.typeInit()
        this.infectInfo = res.data
        callback(res)
      }
    },
    async typeInit(position = 'all') {
      this.pieText = position === 'all' ? '总体' : this.pieText
      this.pieParams.position = position
      let res1 = await SInfectService.getInfectType(this.pieParams)
      let res2 = await SInfectService.getInfectDisease(this.pieParams)
      if (res1.ok() && res2.ok()) {
        this.typeInfo = res1.data
        this.diseaseInfo = res2.data
      }
    }
  },
  computed: {
    infectOptions() {
      let info = this.infectInfo || []
      let title = []
      let diagnosis = []
      let disease = []
      let dead = []
      let total = []
      for (let obj of info) {
        title.push(obj.position)
        diagnosis.push(obj.diagnosisNum)
        disease.push(obj.diseaseNum)
        dead.push(obj.deadNum)
        total.push(obj.sumNum)
      }
      // 柱状图中时间段的显示
      let subtext = this.timeRange.from_date + '~' + this.timeRange.to_date
      if (this._.isNil(this.timeRange.from_date) || this._.isNil(this.timeRange.to_date)) {
        subtext = '至今'
      }
      let options = {
        title: {
          text: '传染病情况统计',
          subtext: subtext
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['确诊报告', '发病报告', '死亡报告', '报告总数']
        },
        xAxis: {
          type: 'category',
          data: title
        },
        yAxis: {},
        series: [
          {
            name: '确诊报告',
            type: 'bar',
            data: diagnosis
          },
          {
            name: '发病报告',
            type: 'bar',
            data: disease
          },
          {
            name: '死亡报告',
            type: 'bar',
            data: dead
          },
          {
            name: '报告总数',
            type: 'bar',
            data: total
          }
        ]
      }
      return options
    },
    typeOptions() {
      let type = this.typeInfo || []
      let disease = this.diseaseInfo || []
      let title = []
      for (let obj of disease) {
        title.push(obj.name)
      }
      let time = this.timeRange.from_date + '~' + this.timeRange.to_date
      if (this._.isNil(this.timeRange.from_date) || this._.isNil(this.timeRange.to_date)) {
        time = '至今'
      }
      let options = {
        title: {
          text: '传染病分类',
          subtext: this.pieText + '(' + time + ')',
          x: 'center'
        },
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
