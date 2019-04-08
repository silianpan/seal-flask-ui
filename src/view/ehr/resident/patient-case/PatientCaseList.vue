<!--
患者病历 界面
@author hsc
@date 2019-01-17
created by scaffold
-->
<template>
<div class="patient-case-container">
  <Card>
    <div v-if="Object.keys(patientCaseInfos).length> 0">
       <Row type="flex" justify="center"  v-for="(value,key,index) in patientCaseInfos" :key="index">
        <i-col :xs="24" :sm="24" :md="12" :lg="12" >
          <div style="font-weight:bold;font-size:14px">
            {{key || '未知乡镇卫生院' }}
          </div>
          <div style="margin-left:20px">
            <Row type="flex" align='middle'>
              <i-col :xs="12" :sm="8" :md="6" :lg="6" v-for="(item, _index) in value" :key="_index">
                <div class="patient-case-item" >
                  <div  class="patient-case-item-img"  @click="handleCaseItemClick(item)">
                      <Icons color="grey" type="iconfont icon-wj-jzbg"  :size="50"></Icons>
                  </div>
                  <div class="patient-case-item-desc">{{_moment(item.oncomeDate).format("YYYY-MM-DD")}}</div>
                </div>
              </i-col>
            </Row>
            <Divider></Divider>
          </div>
        </i-Col>
      </Row>
    </div>
    <Row type="flex" justify="center" align='middle' v-else >
      <i-col :xs="24" :sm="24" :md="12" :lg="12" style="text-align:center">
        暂无就诊信息
      </i-col>
    </Row>
  </Card>
</div>
</template>

<script>
import Icons from '@/components/icons'
import PatientCaseDetail from './PatientCaseDetail'
import {
  PatientCaseService
} from '@/api/ehr/diagnose'
import {
  mapGetters
} from 'vuex'
export default {
  props: {
    residentInfo: Object
  },
  components: {
    Icons,
    PatientCaseDetail
  },
  data() {
    return {
      patientCaseInfos: {}
    }
  },
  methods: {
    handleCaseItemClick(patientCaseInfo) {
      this._dynamicModal.newInstance({
        width: '70%',
        footerHide: true,
        closable: false,
        renderBody: (h) => {
          return h(PatientCaseDetail, {
            props: {
              patientCaseInfo: { ...patientCaseInfo }
            }
          })
        }
      }).show()
    },
    init() {
      let conditions = []
      if (this.residentInfo.id) {
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
            this.patientCaseInfos = rebuildInfos
          }
        })
      }
    }

  },
  mounted: function () {
    this.init()
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style lang="less" scoped>
.patient-case-item {
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
