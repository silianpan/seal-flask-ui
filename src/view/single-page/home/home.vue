<template>
<div class="home-root">
  <ResidentFamilyCardInfo></ResidentFamilyCardInfo>
   <Row :gutter="20" style="margin-top: 20px;">
    <i-col >
      <Card shadow>
        <div slot="title">
          <span style="line-height: inherit;"><icon :size="12" custom="iconfont icon-jiandang"></icon></span>
          <b>建档统计</b>
        </div>
        <ResidentProfileStatistics></ResidentProfileStatistics>
      </Card>
    </i-col>
   </Row>

  <Row :gutter="20" style="margin-top: 20px;">
    <i-col :xs="24" :sm="24" :md="12" :lg="12">
      <Card shadow >
        <div slot="title">
          <icon custom="iconfont icon-qia"></icon>
          <b>健康卡发放统计</b>
          <Button type="text" @click="goToStatistics('sHealthCard')" >详情<Icon type="ios-arrow-forward" /></Button>
        </div>
        <HealthCardStatistics></HealthCardStatistics>
      </Card>
    </i-col>
    <i-col :xs="24" :sm="24" :md="12" :lg="12">
      <Card shadow>
        <div slot="title">
          <icon custom="iconfont icon-jumin"></icon>
          <b>居民登记统计</b>
          <Button type="text" @click="goToStatistics('sResident')" >详情<Icon type="ios-arrow-forward" /></Button>
        </div>
        <ResidentStatistics></ResidentStatistics>
      </Card>
    </i-col>
  </Row>

  <Row :gutter="20" style="margin-top: 20px;">
    <i-col :xs="24" :sm="24" :md="24" :lg="24">
      <Card shadow >
        <div slot="title">
          <icon custom="iconfont icon-laonianren"></icon>
          <b>重点人群统计</b>
          <Button type="text" @click="goToStatistics('sFocusGroup')" >详情<Icon type="ios-arrow-forward" /></Button>
        </div>
        <FocusGroupStatistics></FocusGroupStatistics>
      </Card>
    </i-col>
  </Row>

  <Row :gutter="20" style="margin-top: 20px;">
    <i-col :xs="24" :sm="24" :md="24" :lg="24">
      <Card shadow>
        <div slot="title">
          <icon custom="iconfont icon-weibiaoti564" size=14>
          </icon>
          区域内传染病统计
          <Button type="text" @click="goToStatistics('sInfect')" >详情<Icon type="ios-arrow-forward" /></Button>
        </div>
        <InfectStatistics></InfectStatistics>
      </Card>
    </i-col>
  </Row>
  <Row :gutter="20" style="margin-top: 20px;">
    <i-col :xs="24" :sm="24" :md="24" :lg="24">
      <Card shadow>
        <div slot="title">
          <icon custom="iconfont icon-tufashijianshangbao"></icon>
          区域内突发事件统计
          <Button type="text" @click="goToStatistics('sEmergency')" >详情<Icon type="ios-arrow-forward" /></Button>
        </div>
        <EmergencyStatistics></EmergencyStatistics>
      </Card>
    </i-col>
  </Row>
  <Row :gutter="20" style="margin-top: 20px;">
    <i-col >
      <Card shadow>
        <div slot="title">
          <icon custom="iconfont icon-lianjieconnecting5"></icon>
          <b>诊疗客户端连通情况</b>
        </div>
        <ClientConnectInfo></ClientConnectInfo>
      </Card>
    </i-col>
   </Row>
</div>
</template>

<script>
// import InforCard from '@/components/info-card'
// import CountTo from '@/components/count-to'
import LegaEcharts from '@/components/charts/echarts'
import ResidentFamilyCardInfo from '@/view/ehr/hotspot/ResidentFamilyCardInfo'
import ClientConnectInfo from '@/view/ehr/hotspot/ClientConnectInfo'
import ResidentProfileStatistics from '@/view/ehr/hotspot/ResidentProfileStatistics'
import CardIssuingStatistics from '@/view/ehr/hotspot/CardIssuingStatistics'
import HealthCardStatistics from '@/view/ehr/hotspot/HealthCardStatistics'
import ResidentStatistics from '@/view/ehr/hotspot/ResidentStatistics'
import FocusGroupStatistics from '@/view/ehr/hotspot/FocusGroupStatistics'
import InfectStatistics from '@/view/ehr/hotspot/InfectStatistics'
import EmergencyStatistics from '@/view/ehr/hotspot/EmergencyStatistics'
export default {
  name: 'home',
  components: {
    // InforCard,
    // CountTo,
    LegaEcharts,
    ResidentFamilyCardInfo,
    ClientConnectInfo,
    ResidentProfileStatistics,
    CardIssuingStatistics,
    HealthCardStatistics,
    ResidentStatistics,
    FocusGroupStatistics,
    InfectStatistics,
    EmergencyStatistics
  },
  data() {
    return {
    }
  },
  methods: {
    goToStatistics(name) {
      this.$router.push({ name })
    }
  },
  computed: {
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}

.home-root .ivu-row {
  margin-bottom: 5px;
}

.home-root .ivu-row .ivu-col {
  margin-bottom: 5px;
}

.ivu-card .home ul {
  padding: 0 !important;
}

.ivu-card .home ul li {
  list-style: none;
}

.ivu-card .home ul li span {
  float: right;
  color: #ffac2d;
}

.ivu-card .home ul li span i:last-child {
  margin-right: 5px;
}
</style>
