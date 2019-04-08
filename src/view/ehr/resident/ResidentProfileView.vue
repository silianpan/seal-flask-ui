<!--
 -->
<template>
<div class="resident-profile-view-container">
  <Card>
    <ButtonGroup style="margin-bottom:5px">
      <i-button @click.native='goBack'>
        <Icon type="ios-arrow-back" />返回</i-button>
      <!-- <i-button type="primary" style="margin-bottom:10px" @click="printClick">打印</i-button> -->
    </ButtonGroup>
    <Row type="flex" justify="center">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <i-col :xs="24" :sm="24" :md="12" :lg="12">
        <IdCardInfo :photoSrc="residentInfo.photo" :name="residentInfo.name" :idNumber="residentInfo.idNumber" :gender="dictFormatter('gender',residentInfo.gender)" :nationality="dictFormatter('nationality',residentInfo.nationality)" :birthday="residentInfo.birthday" :address="residentInfo.currentAddress"></IdCardInfo>
      </i-col>
    </Row>
    <Divider></Divider>
    <div>
      <Row type="flex" justify="center" align="middle" style="text-align:center">
        <i-col :xs="8" :sm="4" :md="3" :lg="3" v-for="(item, index) in profileInfoConfig" :key="index">
          <Button type="text" @click="handleClick(item)" :class="{'item-focus':currentComponent===item.component}">
             <Icons :color="item.color" :type="item.icon"></Icons>
             {{item.title}}
          </Button>
        </i-col>
      </Row>
    </div>
     <Divider style="margin-bottom:5px"></Divider>
    <div>
      <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <component :residentInfo="residentInfo" v-bind:is="currentComponent">
            </component>
          </keep-alive>
      </transition>
    </div>
  </Card>
</div>
</template>

<script>
import {
  backMixin
} from '@/mixin/back-mixin'
import ResidentWordView from './ResidentWordView'
import PatientCaseList from './patient-case/PatientCaseList'
import PatientChargeList from './patient-charge/PatientChargeList'
import PatientPhysicalExamLogList from './physical-exam-log/PatientPhysicalExamLogList'
import VaccinationFactList from './vaccination-fact/VaccinationFactList'
import InspectionExamView from './inspection-exam/InspectionExamView'
import Icons from '@/components/icons'
import IdCardInfo from './IdCardInfo'
import {
  ResidentService
} from '@/api/ehr/resident'
export default {
  mixins: [backMixin],
  props: {
    residentId: String
  },
  components: {
    Icons,
    IdCardInfo,
    PatientCaseList,
    PatientChargeList,
    PatientPhysicalExamLogList,
    VaccinationFactList,
    InspectionExamView,
    BaseInfo: {
      props: {
        residentInfo: Object
      },
      render() {
        return (
          <ResidentWordView value = {this.residentInfo}
            showBtns = {
              false
            }><slot> </slot>
          </ResidentWordView >
        )
      }
    }
  },
  data() {
    return {
      targetRoute: {
        name: 'residentList'
      },
      currentComponent: 'BaseInfo',
      profileInfoConfig: [
        {
          title: '基本信息',
          component: 'BaseInfo',
          color: 'rgb(237, 146, 91)',
          icon: 'iconfont icon-xiangxixinxi'
        },
        {
          title: '就诊情况',
          component: 'PatientCaseList',
          icon: 'iconfont icon-wj-jzbg'

        },
        {
          title: '缴费信息',
          component: 'PatientChargeList',
          color: 'rgb(255, 127, 133)',
          icon: 'iconfont icon-jiaofeid'
        },
        {
          title: '体检记录',
          component: 'PatientPhysicalExamLogList',
          icon: 'iconfont icon-tijianbaogao'
        },
        {
          title: '计划免疫',
          component: 'VaccinationFactList',
          icon: 'iconfont icon-jihuamianyi'
        },
        {
          title: '专项检查',
          component: 'InspectionExamView',
          icon: 'iconfont icon-zhuanxianghuizong'
        }
      ],
      spinShow: false,
      residentInfo: {}
    }
  },
  methods: {
    init() {
      if (!this.residentId) {
        return
      }
      this.spinShow = true
      ResidentService.findById(this.residentId).then(resp => {
        if (resp.ok()) {
          this.residentInfo = resp.data
        }
        this.spinShow = false
      })
    },
    handleClick(item) {
      this.currentComponent = item.component
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this.init()
  },
  computed: {}
}
</script>

<style  scoped>
.item-focus {
  -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  border-bottom: 2px solid #39f;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
</style>
