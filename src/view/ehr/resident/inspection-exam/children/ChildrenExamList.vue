<!--  -->
<template>
<div>
  <PatientTemplate :loadingData="init" emptyText="暂无儿童体检信息">
    <template slot-scope="slotProps">
      <div class="patient-info-template-item">
        <Button type="text" @click="handleClick(slotProps.item)" >
             <Icons :color="slotProps.item.color" :type="slotProps.item.icon"></Icons>
             {{slotProps.item.name}}
        </Button>
      </div>
    </template>
  </PatientTemplate>
</div>
</template>

<script>
import PatientTemplate from '@/view/ehr/resident/Template'
import { BirthRegistrationService, ChildrenHealthExamService } from '@/api/ehr/inspection'
import BirthRegistrationView from './BirthRegistrationView'
import ChildrenHealthExamView from './ChildrenHealthExamView'
import Icons from '@/components/icons'
export default {
  props: {
    residentInfo: Object
  },
  components: {
    PatientTemplate,
    Icons
  },
  data() {
    return {
      configData: {
        '': [
          {
            name: '新生儿家庭访视',
            icon: 'iconfont icon-yinger-',
            color: 'rgb(45, 140, 240)',
            component: BirthRegistrationView,
            queryDataAction: (callBack) => {
              if (this.residentInfo && this.residentInfo.profileNumber) {
                BirthRegistrationService.findInfosByProfileNumber(this.residentInfo.profileNumber).then(resp => {
                  if (resp.ok()) {
                    callBack(resp.data)
                  }
                })
              } else {
                callBack([])
              }
            }
          },
          {
            name: '1~8月龄健康检查',
            color: '#00B8D4',
            icon: 'iconfont icon-baby1',
            component: ChildrenHealthExamView,
            queryDataAction: (callBack) => {
              if (this.residentInfo && this.residentInfo.profileNumber) {
                ChildrenHealthExamService.findInfos18MonthlyByProfileNumber(this.residentInfo.profileNumber).then(resp => {
                  if (resp.ok()) {
                    callBack(resp.data)
                  }
                })
              } else {
                callBack([])
              }
            }
          },
          {
            name: '12~30月龄健康检查',
            color: '#40C4FF',
            icon: 'iconfont icon-babynew',
            component: ChildrenHealthExamView,
            queryDataAction: (callBack) => {
              if (this.residentInfo && this.residentInfo.profileNumber) {
                ChildrenHealthExamService.findInfos1230MonthlyByProfileNumber(this.residentInfo.profileNumber).then(resp => {
                  if (resp.ok()) {
                    callBack(resp.data)
                  }
                })
              } else {
                callBack([])
              }
            }
          },
          {
            name: '3~6岁健康检查',
            icon: 'iconfont icon-ertong',
            color: '#0288D1',
            component: ChildrenHealthExamView,
            queryDataAction: (callBack) => {
              if (this.residentInfo && this.residentInfo.profileNumber) {
                ChildrenHealthExamService.findInfos3672MonthlyByProfileNumber(this.residentInfo.profileNumber).then(resp => {
                  if (resp.ok()) {
                    callBack(resp.data)
                  }
                })
              } else {
                callBack([])
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    handleClick(item) {
      this._dynamicModal.newInstance({
        width: '70%',
        footerHide: true,
        closable: false,
        renderBody: (h) => {
          return h(item.component, {
            props: {
              title: item.name,
              queryDataAction: item.queryDataAction
            }
          })
        }
      }).show()
    },
    init(callBack) {
      callBack({ ...this.configData })
    }
  },
  mounted: function () {
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.patient-info-template-item {
  &-img {
    cursor: pointer;
    &:not(:hover) {
      // ivuMoveUpOut
      transition: 0.2s height ease-in-out, 0.2s padding-top ease-in-out,
        0.2s padding-bottom ease-in-out;
    }
    &:hover {
      border: 1px sold red;
    }
  }

  text-align: center;
}
</style>
