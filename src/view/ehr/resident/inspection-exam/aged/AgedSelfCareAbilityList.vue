<!--  -->
<template>
<div>
  <PatientTemplate  :loadingData="init" emptyText="暂无自我评估记录">
    <template slot-scope="slotProps">
      <div class="patient-info-template-item">
        <div class="patient-info-template-item-img" @click="handleClick(slotProps.item)">
          <Icons  type="iconfont icon-laonianren" :size="50"></Icons>
        </div>
        <div class="patient-info-template-item-desc">{{_moment(slotProps.item.date).format("YYYY-MM-DD")}}</div>
      </div>
    </template>
  </PatientTemplate>
</div>
</template>

<script>
import PatientTemplate from '@/view/ehr/resident/Template'
import AgedSelfCareAbilityView from './AgedSelfCareAbilityView'
import {
  AgedSelfCareAbilityService
} from '@/api/ehr/aged'
import Icons from '@/components/icons'
import { parseSplitFields } from '@/libs/tools'
const MergeFieldsConfig = {
  detail: ['meal', 'wash_up', 'dress', 'toilet', 'activity']
}
export default {
  props: {
    residentInfo: Object
  },
  components: {
    PatientTemplate,
    Icons,
    AgedSelfCareAbilityView
  },
  data() {
    return {}
  },
  methods: {
    handleClick(data) {
      let d = parseSplitFields(MergeFieldsConfig, { ...data })
      this._dynamicModal.newInstance({
        width: '70%',
        footerHide: true,
        closable: false,
        renderBody: (h) => {
          return h(AgedSelfCareAbilityView, {
            props: {
              data: { ...data, ...d },
              showBtns: false
            }
          })
        }
      }).show()
    },
    init(callBack) {
      let profileNumber = '54033020800011840'
      if (this.residentInfo && this.residentInfo.profileNumber) {
        profileNumber = this.residentInfo.profileNumber
      }
      AgedSelfCareAbilityService.findInfoByProfileNumber(profileNumber).then(res => {
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
