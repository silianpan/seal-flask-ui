<!--  -->
<template>
    <div>
      <div class="bs-callout-small bs-callout-primary">
        <h4>{{title}} </h4>
      </div>
      <Spin fixed v-if="spinShow"></Spin>
      <Tabs type="card" v-if="childrenHealthExamInfos && childrenHealthExamInfos.length>0">
        <template v-for="(item, index) in childrenHealthExamInfos">
           <TabPane :label="`${item.monthly || ''}月龄儿童健康检查记录`"  :key="index">
              <ChildrenHealthExamWordView :childrenHealthExamInfo="item"></ChildrenHealthExamWordView>
           </TabPane>
        </template>
      </Tabs>
      <div v-else-if="!spinShow" style="text-align:center">
        暂无检查记录
      </div>
    </div>
</template>

<script>
import ChildrenHealthExamWordView from './ChildrenHealthExamWordView'
export default {
  props: {
    title: String,
    queryDataAction: Function
  },
  components: {
    ChildrenHealthExamWordView
  },
  data () {
    return {
      spinShow: false,
      childrenHealthExamInfos: []
    }
  },
  methods: {
    init() {
      if (this.queryDataAction && this._.isFunction(this.queryDataAction)) {
        this.spinShow = true
        this.queryDataAction((data) => {
          if (data && this._.isArray(data)) {
            this.childrenHealthExamInfos = [...data]
          }
          this.spinShow = false
        })
      }
    }
  },
  mounted: function() {
    this.init()
  },
  computed: {}
}

</script>
<style  scoped>
</style>
