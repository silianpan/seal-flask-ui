<template>
  <div>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaEcharts style='height: 300px' :options='emergencyOptions'></LegaEcharts>
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
import { SEmergencyService } from '@/api/ehr/statistics'
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
      emergencyInfo: [], // 存储传染病报告统计
      typeInfo: [], // 存储突发事件类型统计
      tableInfo: {
        queryDataAction: this.emergencyInit,
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
            key: 'commonNum',
            title: '一般报告'
          },
          {
            key: 'moreNum',
            title: '较大报告'
          },
          {
            key: 'majorNum',
            title: '重大报告'
          },
          {
            key: 'noLvNum',
            title: '未定级报告'
          },
          {
            key: 'moreMajorNum',
            title: '特别重大报告'
          },
          {
            key: 'sumNum',
            title: '报告总数',
            render: (h, params) => {
              return h('Tooltip',
                {
                  props: {
                    content: '点击查看突发事件分类详情',
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
    async emergencyInit(params, callback) {
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
      let res = await SEmergencyService.getEmergencyInfo(queryParams)
      if (res.ok()) {
        this.typeInit()
        this.emergencyInfo = res.data
        callback(res)
      }
    },
    async typeInit(position = 'all') {
      this.pieText = position === 'all' ? '总体' : this.pieText
      this.pieParams.position = position
      let res = await SEmergencyService.getEmergencyType(this.pieParams)
      if (res.ok()) {
        this.typeInfo = res.data
      }
    }
  },
  computed: {
    emergencyOptions() {
      let info = this.emergencyInfo || []
      let title = []
      let common = []
      let more = []
      let major = []
      let moreMajor = []
      let noLv = []
      let total = []
      for (let obj of info) {
        title.push(obj.position)
        common.push(obj.commonNum)
        more.push(obj.moreNum)
        major.push(obj.majorNum)
        moreMajor.push(obj.moreMajorNum)
        noLv.push(obj.noLvNum)
        total.push(obj.sumNum)
      }
      // 柱状图中时间段的显示
      let subtext = this.timeRange.from_date + '~' + this.timeRange.to_date
      if (this._.isNil(this.timeRange.from_date) || this._.isNil(this.timeRange.to_date)) {
        subtext = '至今'
      }
      let options = {
        title: {
          text: '突发事件情况统计',
          subtext: subtext
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['一般报告', '较大报告', '重大报告', '特别重大报告', '未定级', '报告总数']
        },
        xAxis: {
          type: 'category',
          data: title
        },
        yAxis: {},
        series: [
          {
            name: '一般报告',
            type: 'bar',
            data: common
          },
          {
            name: '较大报告',
            type: 'bar',
            data: more
          },
          {
            name: '重大报告',
            type: 'bar',
            data: major
          },
          {
            name: '特别重大报告',
            type: 'bar',
            data: moreMajor
          },
          {
            name: '未定级',
            type: 'bar',
            data: noLv
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
      let title = []
      for (let obj of type) {
        title.push(obj.name)
      }
      let time = this.timeRange.from_date + '~' + this.timeRange.to_date
      if (this._.isNil(this.timeRange.from_date) || this._.isNil(this.timeRange.to_date)) {
        time = '至今'
      }
      let options = {
        title: {
          text: '突发事件类型分布',
          subtext: this.pieText + '(' + time + ')',
          x: 'center'
        },
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
