<!--  -->
<template>
<div>
  <PatientTemplate :loadingData="init" emptyText="暂无Ⅱ型糖尿病记录">
    <template slot-scope="slotProps">
      <div class="patient-info-template-item">
        <div class="patient-info-template-item-img" @click="handleClick(slotProps.item)">
          <Icons color="red" type="iconfont icon-tangniaobingleixing" :size="50"></Icons>
        </div>
        <div class="patient-info-template-item-desc">{{_moment(slotProps.item.visit_date).format("YYYY-MM-DD")}}</div>
      </div>
    </template>
  </PatientTemplate>
</div>
</template>
<script>
import PatientTemplate from '@/view/ehr/resident/Template'
import DiabetesHypertensionView from './DiabetesHypertensionView'
import { HypertensionDiabetesRecordService } from '@/api/ehr/inspection'
import Icons from '@/components/icons'
export default {
  props: {
    residentInfo: Object
  },
  components: {
    PatientTemplate,
    Icons,
    DiabetesHypertensionView
  },
  data() {
    return {}
  },
  methods: {
    handleClick(data) {
      console.log(data.id)
      this._dynamicModal.newInstance({
        width: '70%',
        footerHide: true,
        closable: false,
        renderBody: (h) => {
          return h(DiabetesHypertensionView, {
            props: {
              data: { ...data },
              diseaseType: '2',
              title: 'Ⅱ型糖尿病随访记录'
            }
          })
        }
      }).show()
    },
    init(callBack) {
      if (this.residentInfo && this.residentInfo.profileNumber) {
        let profileNumber = this.residentInfo.profileNumber
        HypertensionDiabetesRecordService.findDiabetesInfosByProfileNumber(profileNumber).then(res => {
          if (res.ok()) {
            let rebuildInfos = {}
            res.data.forEach(item => {
              if (!rebuildInfos[item.medicalOrgName]) {
                rebuildInfos[item.medicalOrgName] = []
              }
              rebuildInfos[item.medicalOrgName].push({ ...item })
            })
            callBack(rebuildInfos)
          } else {
            callBack({})
          }
        }).catch(e => {
          callBack({})
        })
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
  &-img {
    cursor: pointer;
    position: relative;
    transition: 0.2s all ease-in-out;
    &:hover {
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      border-color: #eee;
    }
  }

  text-align: center;
}
</style>
