<!--  -->
<template>
<div>
  <!-- 居民 卡片的热点 -->
  <Row :gutter="20">
    <i-col :xs="24" :sm="24" :md="24/(infoCardData.length || 1)>8?(24/(infoCardData.length || 1)):8" :lg="24/(infoCardData.length || 1)" v-for="(infor, i) in infoCardData" :key="`infor-${i}`" style="height: 120px;">
      <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
        <count-to :end="infor.count" count-class="count-style" :unit="infor.unit" :simplify="true" />
        <p>{{ infor.title }}</p>
      </infor-card>
    </i-col>
  </Row>
</div>
</template>

<script>
import InforCard from '@/components/info-card'
import CountTo from '@/components/count-to'
import { HotSpotService } from '@/api/ehr/hotspot'
export default {
  props: {},
  components: {
    InforCard,
    CountTo
  },
  data() {
    return {
      infoCardData: [
        {
          title: '本月居民登记',
          icon: 'iconfont icon-jumin',
          count: 0,
          unit: [
            [0, '人'],
            [3, '千人']
          ],
          color: '#2d8cf0'
        },
        {
          title: '本月家庭登记',
          icon: 'iconfont icon-renshu',
          unit: [
            [0, '户'],
            [3, '千户']
          ],
          count: 0,
          color: '#19be6b'
        },
        {
          title: '本月发卡统计',
          icon: 'iconfont icon-dianzijuminjiankangqia-S',
          count: 0,
          unit: [
            [0, '张'],
            [3, '千张']
          ],
          color: '#ff9900'
        }
      ]
    }
  },
  methods: {
    async init() {
      // 统计发卡数量
      let params = [
        {
          field: 'crtTime',
          queryType: 'ge',
          value: this._moment().format('YYYY-MM')
        }
      ]
      let res = await HotSpotService.queryStatisticsOfCardNums(params)
      if (res.status === 0) {
        this.infoCardData[2].count = res.data || 0
      }
      // 统计家庭数量
      res = await HotSpotService.queryStatisticsOfFamilyNums(params)

      if (res.status === 0) {
        this.infoCardData[1].count = res.data || 0
      }
      // 统计居民数量
      res = await HotSpotService.queryStatisticsOfResidentNums(params)
      if (res.status === 0) {
        this.infoCardData[0].count = res.data || 0
      }
    }
  },
  mounted() {
    // this.init()
  },
  computed: {}
}
</script>

<style  scoped>
</style>
