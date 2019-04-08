<!--  -->
<template>
<div>
  <PatientTemplate :loadingData="init" emptyText="暂无缴费信息">
    <template slot-scope="slotProps">
      <div class="patient-info-template-item">
        <div class="patient-info-template-item-img" @click="handleCaseItemClick(slotProps.item)">
          <Icons color="rgb(255, 127, 133)" type="iconfont icon-jiaofeid" :size="50"></Icons>
        </div>
        <div class="patient-info-template-item-desc">{{_moment(slotProps.item.oncomeDate).format("YYYY-MM-DD")}}</div>
      </div>
    </template>
  </PatientTemplate>
</div>
</template>

<script>
import PatientTemplate from '.././Template'
import PatientChargeDetail from './PatientChargeDetail'
import {
  PatientCaseService
} from '@/api/ehr/diagnose'
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
    return {}
  },
  methods: {
    handleCaseItemClick(patientCaseInfo) {
      this._dynamicModal.newInstance({
        width: '70%',
        closable: false,
        footerHide: true,
        renderBody: (h) => {
          return h(PatientChargeDetail, {
            props: {
              patientCaseInfo: { ...patientCaseInfo }
            }
          })
        }
      }).show()
    },
    init(callBack) {
      let conditions = []
      if (this.residentInfo && this.residentInfo.id) {
        conditions.push({
          field: 'patientId',
          value: this.residentInfo.id
        })
        conditions.push({
          field: 'status',
          value: '2'
        })
        PatientCaseService.findCaseInfo({
          conditions
        }).then(res => {
          if (res.ok()) {
            let rebuildInfos = {}
            res.data.forEach(item => {
              if (!rebuildInfos[item.medicalOrgName]) {
                rebuildInfos[item.medicalOrgName] = []
              }
              rebuildInfos[item.medicalOrgName].push({ ...item })
            })
            callBack(rebuildInfos)
          }
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
