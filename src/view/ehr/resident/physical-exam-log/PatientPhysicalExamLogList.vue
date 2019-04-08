<!--  -->
<template>
<div>
  <PatientTemplate :loadingData="loadingData" emptyText="暂无缴费信息">
    <template slot-scope="slotProps">
      <div class="patient-info-template-item">
        <div class="patient-info-template-item-img" @click="handlePhysicalExamItemClick(slotProps.item)">
          <Icons color="green" type="iconfont icon-tijianbaogao" :size="50"></Icons>
        </div>
        <div class="patient-info-template-item-desc">{{_moment(slotProps.item.peDate).format("YYYY-MM-DD")}}</div>
      </div>
    </template>
  </PatientTemplate>
</div>
</template>

<script>
import PatientTemplate from '.././Template'
import PatientExamLogDetail from './PatientExamLogDetail'
import {
  PhysicalExamLogService
} from '@/api/ehr/inspection'
import Icons from '@/components/icons'
export default {
  props: {
    residentInfo: Object
  },
  components: {
    PatientTemplate,
    PatientExamLogDetail,
    Icons
  },
  data() {
    return {}
  },
  methods: {
    handlePhysicalExamItemClick(examItem) {
      this._dynamicModal.newInstance({
        width: '70%',
        footerHide: true,
        renderBody: (h) => {
          return h(PatientExamLogDetail, {
            props: {
              physicalExamLogInfo: { ...examItem }
            }
          })
        }
      }).show()
    },
    loadingData(callBack) {
      // 根据 居民id 查找 体检记录
      if (this.residentInfo && this.residentInfo.id) {
        PhysicalExamLogService.findInfoByResidentId(this.residentInfo.id).then(resp => {
          if (resp.ok()) {
            let rebuildInfos = {}
            resp.data.forEach(item => {
              if (!rebuildInfos[item.medicalOrgName]) {
                rebuildInfos[item.medicalOrgName] = []
              }
              rebuildInfos[item.medicalOrgName].push({ ...item })
            })
            callBack(rebuildInfos)
          }
        })
      } else {
        callBack({})
      }
    }
  },
  mounted: function () {},
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
