<!--
建档率统计
 -->
<template>
    <div>
      <LegaEcharts style="height: 300px;" :options="options" />
    </div>
</template>

<script>
import LegaEcharts from '@/components/charts/echarts'
import { TreeUtil } from '@/utils/TreeUtil'
import { HotSpotService } from '@/api/ehr/hotspot'
export default {
  props: { },
  components: {
    LegaEcharts
  },
  data () {
    return {
      areaInfo: TreeUtil.loadAreaTreeDatas('540330', 'village'),
      areaPopuProportionInfo: []
    }
  },
  methods: {
    async  init() {
      const res = await HotSpotService.findAreaPopuProportionInfo()
      if (res.ok()) {
        this.areaPopuProportionInfo = res.data
      }
    }

  },
  mounted: function() {
    this.init()
  },
  computed: {
    options() {
      let areaInfo = {}
      let dataInfo = []

      this.areaInfo.map(item => {
        areaInfo[item.value] = item.title
        let t = (this.areaPopuProportionInfo || []).find(i => {
          return `${i.village}` === `${item.value}`
        })
        let dv = {
          totalResidentCnt: 0,
          totalFamilyCnt: 0,
          familyCnt: 0,
          residentCnt: 0,
          village: item.value
        }
        t = { ...dv, ...t }
        dataInfo.push(t)
      })
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['建档个人', '建档家庭', '总居民数', '总家庭数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Object.values(areaInfo)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总居民数',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true

              }
            },
            data: dataInfo.map(i => i.totalResidentCnt)
          },
          {
            name: '总家庭数',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true

              }
            },
            data: dataInfo.map(i => i.totalFamilyCnt)
          },
          {
            name: '建档家庭',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true

              }
            },
            data: dataInfo.map(i => i.familyCnt)
          },
          {
            name: '建档个人',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true

              }
            },
            data: dataInfo.map(i => i.residentCnt)
          }
        ]
      }
      return options
    }
    // options() {
    //   let areaInfo = {}
    //   this.areaInfo.map(item => {
    //     areaInfo[item.value] = item.title
    //   })
    //   let residentRs = {}
    //   let familyRs = {}
    //   this.areaPopuProportionInfo.map(item => {
    //     residentRs[item.village] = item.residentCnt / item.totalResidentCnt
    //     familyRs[item.village] = item.familyCnt / item.totalFamilyCnt
    //   })
    //   let options = {
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: { // 坐标轴指示器，坐标轴触发有效
    //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    //       },
    //       formatter: '{a0}: {c0}<br />{a1}: {c1}'
    //     },
    //     legend: {
    //       data: ['建档率', '家庭']
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     xAxis: [
    //       {
    //         type: 'category',
    //         data: Object.values(areaInfo)
    //       }
    //     ],
    //     yAxis: [
    //       {
    //         type: 'value'
    //       }
    //     ],
    //     series: [
    //       {
    //         name: '建档率',
    //         type: 'bar',
    //         data: Object.keys(areaInfo).map(code => {
    //           return residentRs[code] * 100
    //         })
    //       },
    //       {
    //         name: '家庭',
    //         type: 'bar',
    //         stack: '广告',
    //         data: Object.keys(areaInfo).map(code => familyRs[code] * 100)
    //       }
    //     ]

    //   }
    //   return options
    // }

  }
}

</script>
<style  scoped>
</style>
