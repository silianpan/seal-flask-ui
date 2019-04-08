<template>
  <div>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='24' :lg='24' >
        <Card shadow>
          <LegaEcharts style='height: 300px' :options='focusOptions'></LegaEcharts>
        </Card>
      </i-col>
    </Row>
    <Row :gutter='20' style='margin-top: 20px'>
      <i-col :xs='24' :sm='24' :md='16' :lg='16' >
        <Card shadow>
          <LegaTable ref="table" :options="tableInfo"></LegaTable>
        </Card>
      </i-col>
      <i-col :xs='24' :sm='24' :md='8' :lg='8' >
        <Card shadow>
          <LegaEcharts style='height: 300px' :options='diseaseOptions'></LegaEcharts>
        </Card>
      </i-col>
    </Row>
    <Tooltip content="刷新" placement="right">
      <Icon style="cursor: pointer;" type="md-refresh" @click="typeInit('all')"/>
    </Tooltip>
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
      pieText: '总体', // 存放饼状图的子标题
      focusInfo: [], // 存储重点人群统计
      typeInfo: [], // 存储慢性病类型统计
      tableInfo: {
        queryDataAction: this.focusInit,
        height: 290,
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
            key: 'childrenNum',
            title: '儿童数量(人)'
          },
          {
            key: 'oldNum',
            title: '老年人数量(人)'
          },
          {
            key: 'diseaseNum',
            title: '慢性病患者数量(人)',
            render: (h, params) => {
              return h('Tooltip',
                {
                  props: {
                    content: '点击查看详情',
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
                        this.typeInit(params.row.code)
                        this.pieText = params.row.name
                      }
                    }
                  }, params.row.diseaseNum)
                ]
              )
            }
          },
          {
            key: 'womenNum',
            title: '孕妇数量(人)'
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: []
        }
      }
    }
  },
  methods: {
    async focusInit(params, callback) {
      let res = await SResidentService.getFocusGroupInfo()
      if (res.ok()) {
        this.focusInfo = res.data
        callback(res)
      }
    },
    async typeInit(code = 'all') {
      this.pieText = code === 'all' ? '总体' : this.pieText
      let res = await SResidentService.getDiseaseTypeInfo({ code })
      if (res.ok()) {
        this.typeInfo = res.data
      }
    }
  },
  mounted() {
    this.typeInit()
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
        title: {
          text: '重点人群情况统计',
          subtext: '当前'
        },
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
    },
    diseaseOptions() {
      let info = this.typeInfo || []
      let title = []
      for (let obj of info) {
        title.push(obj.name)
      }
      let options = {
        title: {
          text: '慢性病分布',
          subtext: this.pieText,
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
            data: info,
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
