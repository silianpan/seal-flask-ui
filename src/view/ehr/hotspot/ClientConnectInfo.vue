<!--
  设备联通度
 -->
<template>
<div class="device-connect">
  <Row>
    <i-col>
      <span  style="margin-right:5px" class="ivu-badge-status ivu-badge">
          <span class="ivu-badge-status-dot ivu-badge-status-success"></span>
      <span class="ivu-badge-status-text">已连通</span>
      </span>
      <span style="margin-right:5px"  class="ivu-badge-status ivu-badge">
          <span class="ivu-badge-status-dot ivu-badge-status-error"></span>
      <span class="ivu-badge-status-text">未连通</span>
      </span>
      <span style="margin-right:5px" class="ivu-badge-status ivu-badge">
          <span class="ivu-badge-status-dot ivu-badge-status-warning"></span>
      <span class="ivu-badge-status-text">未知</span>
      </span>
    </i-col>
  </Row>
  <Row>
    <i-col v-for="(item, index) in connectInfo" :key="index" :xs="12" :sm="6" :md="4" :lg="4">
      <span style="float:left">
        <span  class="ivu-badge-status ivu-badge">
          <span :class="getClassByStatus(item)"></span>
      <span class="ivu-badge-status-text"></span>
      </span>
      </span>
      <a>{{item.name}}</a>
    </i-col>
    <div v-if="!connectInfo.length" style="min-height:100px"></div>
    <Spin fix size="large" v-if="spinShow"></Spin>
  </Row>
</div>
</template>

<script>
import {
  HotSpotService
} from '@/api/ehr/hotspot'
import {
  MedicalOrgService
} from '@/api/ehr/org'
export default {
  props: {},
  components: {},
  data() {
    return {
      connectInfo: [],
      timer: null,
      spinShow: true
    }
  },
  beforeDestroy() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  },
  methods: {
    getClassByStatus(item) {
      return [
        'ivu-badge-status-dot',
        {
          'ivu-badge-status-success': item.isConnect === true,
          'ivu-badge-status-error': item.isConnect === false,
          'ivu-badge-status-warning': item.isConnect !== true && item.isConnect !== false
        }
      ]
    },
    async checkIsConnect() {
      if (!this._.isNil(this.connectInfo) && this.connectInfo.length > 0) {
        for (let index = 0; index < this.connectInfo.length; index++) {
          const res = await HotSpotService.checkConnectByIpAddress(this.connectInfo[index].ipAddress)
          if (res.status === 0) {
            this.$set(this.connectInfo[index], 'isConnect', res.data)
          }
        }
      }
    },
    async init() {
      this.spinShow = true
      const res = await MedicalOrgService.findAll()
      if (res.status === 0) {
        this.connectInfo = res.data
      }
      this.spinShow = false
      this.checkIsConnect()
      if (!this.timer) {
        this.timer = window.setInterval(this.checkIsConnect, 50000)
      }
    }
  },
  mounted: function () {
    this.init()
  },
  computed: {

  }
}
</script>

<style lang="less" scoped>
.device-connect {
  .ivu-badge-status-dot {
    width: 12px !important;
    height: 12px !important;
  }

  .ivu-badge-status-success:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #19be6b;
    content: '';
    -webkit-animation: aniStatusProcessing 1.2s infinite ease-in-out;
    animation: aniStatusProcessing 1.2s infinite ease-in-out;
  }

  .ivu-badge-status-error:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #ed4014;
    content: '';
    -webkit-animation: aniStatusProcessing 1.2s infinite ease-in-out;
    animation: aniStatusProcessing 1.2s infinite ease-in-out;
  }
}
</style>
