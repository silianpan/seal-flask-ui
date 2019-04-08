<!--  -->
<template>
<div class="patient-info-template-container">
  <Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div v-if="Object.keys(patientInfos).length> 0">
      <Row type="flex" justify="center" v-for="(value,key,index) in patientInfos" :key="index">
        <i-col :xs="24" :sm="24" :md="12" :lg="12">
          <slot name="title">
            <div style="font-weight:bold;font-size:14px">
              {{key || '' }}
            </div>
          </slot>
          <div style="margin-left:20px">
            <Row type="flex" align='middle'>
              <i-col :xs="12" :sm="8" :md="6" :lg="6" v-for="(item, _index) in value" :key="_index">
                <slot :item="item">
                  <div class="patient-info-template-item">
                    <div class="patient-info-template-item-img" @click="handleCaseItemClick(item)">
                      <Icons type="iconfont icon-wj-jzbg" :size="50"></Icons>
                    </div>
                    <div class="patient-info-template-item-desc">{{_moment(item.oncomeDate).format("YYYY-MM-DD")}}</div>
                  </div>
                </slot>
              </i-col>
            </Row>
            <Divider></Divider>
          </div>
        </i-Col>
      </Row>
    </div>
    <Row type="flex" justify="center" align='middle' v-else-if="!spinShow">
      <i-col :xs="24" :sm="24" :md="12" :lg="12" style="text-align:center">
        {{emptyText || '暂无信息'}}
      </i-col>
    </Row>
  </Card>
</div>
</template>

<script>
import Icons from '@/components/icons'
export default {
  props: {
    loadingData: Function,
    emptyText: {
      type: String,
      default: function () {
        return '暂无信息'
      }
    }

  },
  components: {
    Icons
  },
  data() {
    return {
      patientInfos: {},
      spinShow: false
    }
  },
  methods: {
    handleCaseItemClick(item) {
      console.log(item)
    },
    load() {
      if (this.loadingData && this._.isFunction(this.loadingData)) {
        this.spinShow = true
        this.loadingData((data) => {
          this.patientInfos = data || {}
          this.spinShow = false
        })
      }
    }
  },
  mounted: function () {
    this.load()
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
