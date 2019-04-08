<!--  -->
<template>
<div class="inspection-exam-container">
  <div>
    <Row type="flex" justify="center" align="middle" style="text-align:center">
      <i-col :xs="8" :sm="4" :md="3" :lg="3" v-for="(item, index) in inspectionExamItemConfig" :key="index" v-if="!item.show || item.show() ===true">
        <Button type="text" @click="handleClick(item)" :class="{'item-focus':currentComponent===item.component}">
             <Icons :color="item.color" :type="item.icon"></Icons>
             {{item.title}}
        </Button>
      </i-col>
    </Row>
    <div>
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :residentInfo="residentInfo" v-bind:is="currentComponent">
          </component>
        </keep-alive>
      </transition>
    </div>
  </div>
</div>
</template>
<script>
import Icons from '@/components/icons'
import AgedSelfCareAbilityList from './aged/AgedSelfCareAbilityList'
import ChildrenExamList from './children/ChildrenExamList'
import DiabetesList from './diabetes-hypertension/DiabetesList'
import HypertensionList from './diabetes-hypertension/HypertensionList'
import GynaecologyList from './gynaecology/GynaecologyList'
export default {
  props: {
    residentInfo: Object
  },
  components: {
    Icons,
    AgedSelfCareAbilityList,
    ChildrenExamList,
    DiabetesList,
    HypertensionList,
    GynaecologyList
  },
  data() {
    return {
      currentComponent: '',
      inspectionExamItemConfig: [{
        title: '0～6岁儿童体检记录',
        icon: 'iconfont icon-ertong',
        component: 'ChildrenExamList'
      },
      {
        title: '孕产检查记录',
        icon: 'iconfont icon-funvbaojianke',
        component: 'GynaecologyList',
        show: this.isWomen
      },
      {
        title: '老年人评估记录',
        icon: 'iconfont icon-laonianren',
        component: 'AgedSelfCareAbilityList',
        show: this.isOlderMan
      },
      {
        title: 'Ⅱ型糖尿病检查记录',
        icon: 'iconfont icon-tangniaobingleixing',
        component: 'DiabetesList',
        show: this.isOlderMan
      },
      {
        title: '高血压检查记录',
        icon: 'iconfont icon-gaoxieya',
        color: 'rgb(25, 195, 186)',
        component: 'HypertensionList',
        show: this.isOlderMan
      }
      ]
    }
  },
  methods: {
    isWomen: function() {
      if (this.residentInfo && this.residentInfo.gender === '2') {
        return true
      }
      return false
    },
    isOlderMan: function() {
      if (this.residentInfo && this.residentInfo.birthday) {
        if (this._moment(this.residentInfo.birthday || '').isValid()) {
          return this._moment().diff(this._moment(this.residentInfo.birthday).format('YYYY-MM-DD'), 'years') > 65
        }
      }
      return false
    },
    handleClick(item) {
      this.currentComponent = item.component
    }
  },
  mounted: function () {
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.ivu-tabs-nav-scroll {
  display: flex !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}

.item-focus {
  -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  border-bottom: 2px solid #39f;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
</style>
