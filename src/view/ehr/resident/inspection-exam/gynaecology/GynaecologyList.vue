<!--  -->
<template>
<div>
  <PatientTemplate :loadingData="init" emptyText="暂无孕产记录">
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
import GynFirstcheckView from './GynFirstCheckView'
import GynOtherCheckView from './GynOtherCheckView'
import GynAfterBirthView from './GynAfterBirthView'
import { RenatalExamService, PostpartumVisitService } from '@/api/ehr/inspection'
import Icons from '@/components/icons'
export default {
  props: {
    residentInfo: Object
  },
  components: {
    PatientTemplate,
    GynFirstcheckView,
    GynOtherCheckView,
    GynAfterBirthView,
    Icons
  },
  data() {
    return {
      gynConfig: [
        {
          name: '第一次产前检查服务',
          icon: 'iconfont icon-pregnancy',
          color: 'rgb(45, 140, 240)',
          component: GynFirstcheckView,
          queryDataAction: (params, callBack) => {
            RenatalExamService.findFirstInfoByConditions(params).then(res => {
              if (res.ok()) {
                callBack(res.data)
              } else {
                callBack()
              }
            }).catch(e => {
              callBack()
            })
          }
        },
        {
          name: '第2~5次随访服务',
          color: '#00B8D4',
          icon: 'iconfont icon-yunfu',
          component: GynOtherCheckView,
          queryDataAction: (params, callBack) => {
            RenatalExamService.find2To5InfosByConditions(params).then(res => {
              if (res.ok()) {
                callBack(res.data)
              } else {
                callBack()
              }
            }).catch(e => {
              callBack()
            })
          }
        },
        {
          name: '产后访视',
          color: '#40C4FF',
          icon: 'iconfont icon-muying',
          component: GynAfterBirthView,
          queryDataAction: (params, callBack) => {
            PostpartumVisitService.findAfterInfosByConditions(params).then(res => {
              if (res.ok()) {
                callBack(res.data)
              } else {
                callBack()
              }
            }).catch(e => {
              callBack()
            })
          }
        },
        {
          name: '产后42天健康检查',
          icon: 'iconfont icon-haizi',
          color: '#0288D1',
          component: GynAfterBirthView,
          queryDataAction: (params, callBack) => {
            PostpartumVisitService.findAfter42daysInfosByConditions(params).then(res => {
              if (res.ok()) {
                callBack(res.data)
              } else {
                callBack()
              }
            }).catch(e => {
              callBack()
            })
          }
        }
      ]
    }
  },
  methods: {
    handleClick(item) {
      this._dynamicModal.newInstance({
        width: '80%',
        footerHide: true,
        closable: false,
        renderBody: (h) => {
          return h(item.component, {
            props: {
              title: item.name,
              queryDataAction: item.queryDataAction,
              gestationalInfo: item.currentGestationalInfo
            }
          })
        }
      }).show()
    },
    init(callBack) {
      if (this.residentInfo && this.residentInfo.profileNumber) {
        RenatalExamService.findGestationalTimesByProfileNumber(this.residentInfo.profileNumber).then(res => {
          if (res.ok()) {
            let rebuildInfos = {}
            res.data.forEach(item => {
              let key = `${item.medical_org_name} (孕次 ${item.gestational_times})`
              if (!rebuildInfos[key]) {
                rebuildInfos[key] = [...this.gynConfig].map(i => {
                  let c = { ...i }
                  c.currentGestationalInfo = { ...item }
                  return c
                })
              }
            })
            callBack(rebuildInfos)
          }
        })
      } else {
        callBack({})
      }
    }
  },
  mounted: function () {
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.patient-info-template-item {
  text-align: left;
}
</style>
