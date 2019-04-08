<!--  -->
<template>
<div>
  <div class="bs-callout-small bs-callout-primary">
    <h4>{{title}} </h4>
  </div>
  <div v-if="birthRegistrationInfos.length > 0">
    <i-button type="primary" @click.native="print">
      <Icon type="md-print" />打印
    </i-button>
    <Row>
      <i-col>
        <BirthRegistrationWordView id="BirthRegistrationWordView" :birthRegistrationInfo="{}"></BirthRegistrationWordView>
      </i-col>
    </Row>
  </div>
  <div v-else-if="!spinShow" style="text-align:center">
    暂无访视记录
  </div>
  <Spin fixed v-if="spinShow"></Spin>
</div>
</template>

<script>
import BirthRegistrationWordView from './BirthRegistrationWordView'
import {
  Printd
} from 'printd'
export default {
  props: {
    title: String,
    queryDataAction: Function
  },
  components: {
    BirthRegistrationWordView
  },
  data() {
    return {
      spinShow: false,
      birthRegistrationInfos: []
    }
  },
  methods: {
    init() {
      if (this.queryDataAction && this._.isFunction(this.queryDataAction)) {
        this.spinShow = true
        this.queryDataAction((data) => {
          if (data && this._.isArray(data)) {
            this.birthRegistrationInfos = [...data]
          }
          this.spinShow = false
        })
      }
    },
    print() {
      this.$nextTick(() => {
        const d = new Printd()
        let csses = []
        for (let i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].type === 'text/css') {
            [...document.styleSheets[i].cssRules].map(rule => {
              csses.push(rule.cssText)
            })
          }
        }
        d.print(this.$el.querySelector('#BirthRegistrationWordView'), csses.join(''))
      })
    }
  },
  mounted: function () {
    this.init()
  },
  computed: {}
}
</script>

<style  scoped>
</style>
