<!--  -->
<template>
<div>

  <Card :bordered="false" dis-hover>
    <Row v-if="showBtns" style="margin-bottom:10px">
      <ButtonGroup>
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
      </ButtonGroup>
    </Row>
    <i-button type="primary" @click.native="print">
    <Icon type="md-print" />打印</i-button>
    <div class="ivu-table-wrapper" id="aged-selef-care-ability-view">
      <div class="ivu-table ivu-table-default ivu-table-border">
        <!---->
        <div class="ivu-table-title'">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <tr class="ivu-table-row">
              <td class="ivu-table-column-center" colspan="6">
                <span style="font-size:1.4em;font-weight: bold;">{{this.title}}</span>
              </td>
            </tr>
            <tr class="ivu-table-row">
              <td class="ivu-table-column-center" style="width:80px;font-weight: bold;">姓名</td>
              <td class="ivu-table-column-center">{{data.name}}</td>
              <td class="ivu-table-column-center" style="width:80px;font-weight: bold;">档案编号</td>
              <td class="ivu-table-column-center">{{data.profile_number}}</td>
              <td class="ivu-table-column-center" style="width:80px;font-weight: bold;">评估时间</td>
              <td class="ivu-table-column-center">{{formatUTC(data.eval_time,'YYYY-MM-DD')}} </td>
            </tr>
          </table>
        </div>
        <div class="ivu-table-header">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <thead>
              <tr>
                <th colspan="1" rowspan="2" class="ivu-table-column-center">
                  <div class="ivu-table-cell"><span class="">评估事项、内容与评分</span>

                  </div>
                </th>
                <th colspan="4" rowspan="1" class="ivu-table-column-center">
                  <div class="ivu-table-cell"><span class="">程度等级</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th colspan="1" rowspan="1" class="ivu-table-column-center">
                  <div class="ivu-table-cell"><span class="">可自理</span>
                  </div>
                </th>
                <th colspan="1" rowspan="1" class="ivu-table-column-center">
                  <div class="ivu-table-cell"><span class="">轻度依赖</span>
                  </div>
                </th>
                <th colspan="1" rowspan="1" class="ivu-table-column-center">
                  <div class="ivu-table-cell"><span class="">中度依赖</span>
                  </div>
                </th>
                <th colspan="1" rowspan="1" class="ivu-table-column-center">
                  <div class="ivu-table-cell"><span class="">不能自理</span>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="ivu-table-body">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <tbody class="ivu-table-tbody">
              <tr class="ivu-table-row" v-for="(item, index) in tableData" :key="index">
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <div class="table-cell-container">
                      <div class="table-cell-label">{{item.name}}</div>
                      <div class="table-cell-score red">
                        <span class="red-nums">{{(data[item.prop]|| {}).score || 0}}</span>
                        <span class="red-label">分</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <div class="table-cell-container">
                      <div v-if="_.eq((data[item.prop]|| {}).value,'level_1')" class="table-cell-selected">
                        <Icon color="red" custom="iconfont icon-gouxuan-"></Icon>
                      </div>
                      <div class="table-cell-label">{{item.level_1}}</div>
                      <div class="table-cell-score">{{item.score.level_1}}</div>
                    </div>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <div class="table-cell-container">
                      <div v-if="_.eq((data[item.prop]|| {}).value,'level_2')" class="table-cell-selected">
                        <Icon color="red" custom="iconfont icon-gouxuan-"></Icon>
                      </div>
                      <div class="table-cell-label">{{item.level_2}}</div>
                      <div class="table-cell-score">{{item.score.level_2}}</div>
                    </div>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <div class="table-cell-container">
                      <div v-if="_.eq((data[item.prop]|| {}).value,'level_3')" class="table-cell-selected">
                        <Icon color="red" custom="iconfont icon-gouxuan-"></Icon>
                      </div>
                      <div class="table-cell-label">{{item.level_3}}</div>
                      <div class="table-cell-score">{{item.score.level_3}}</div>
                    </div>
                  </div>
                </td>
                <td class="ivu-table-column-center">
                  <div class="ivu-table-cell">
                    <div class="table-cell-container">
                      <div v-if="_.eq((data[item.prop]|| {}).value,'level_4')" class="table-cell-selected">
                        <Icon color="red" custom="iconfont icon-gouxuan-"></Icon>
                      </div>
                      <div class="table-cell-label">{{item.level_4}}</div>
                      <div class="table-cell-score">{{item.score.level_4}}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ivu-table-footer total-score ">
          <span>总分</span>
          <span class="total-score-nums">
             {{data.total_score || 0}}
           </span>
          <span> 分</span>
        </div>
      </div>
    </div>
  </Card>
</div>
</template>

<script>
import { Printd } from 'printd'
import LegaWordView from '@/components/LegaWordView'
import {
  backMixin
} from '@/mixin/back-mixin'
export default {
  mixins: [backMixin],
  props: {
    /** 数据 */
    data: Object,
    /** 是否展示按钮 */
    showBtns: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  components: {
    LegaWordView
  },

  data() {
    return {
      sourceRoute: null,
      title: '老年人自我评估表',
      tableData: [{
        name: '进餐：使用餐具将饭菜送入口、咀嚼、吞咽等活动',
        prop: 'meal',
        level_1: '独立完成',
        level_2: '',
        level_3: '需要协助，如切碎、搅拌食物等',
        level_4: '完全需要帮助',
        score: {
          level_1: 0,
          level_2: 0,
          level_3: 3,
          level_4: 5
        }
      },
      {
        name: '梳洗：梳头、洗脸、刷牙、剃须、洗澡等活动',
        prop: 'wash_up',
        level_1: '独立完成',
        level_2: '能独立地洗头、梳头、洗脸、刷牙、剃须等；洗澡需要协助',
        level_3: '在协助下和适当的时间内，能完成部分梳洗活动',
        level_4: '完全需要帮助',
        score: {
          level_1: 0,
          level_2: 1,
          level_3: 3,
          level_4: 7
        }
      },
      {
        name: '穿衣：穿衣裤、袜子、鞋子等活动',
        prop: 'dress',
        level_1: '独立完成',
        level_2: '',
        level_3: '需要协助，在适当的时间内完成部分穿衣',
        level_4: '完全需要帮助',
        score: {
          level_1: 0,
          level_2: 0,
          level_3: 3,
          level_4: 7
        }
      },
      {
        name: '如厕：小便、大便等活动及自控',
        prop: 'toilet',
        level_1: '不需协助，可自控',
        level_2: '偶尔失禁，但基本上能如厕或使用便具',
        level_3: '经常失禁，在很多提示和协助下尚能如厕或使用便具',
        level_4: '完全失禁，完全需要帮助',
        score: {
          level_1: 0,
          level_2: 1,
          level_3: 5,
          level_4: 10
        }
      },
      {
        name: '活动：站立、室内行走、上下楼梯、户外活动',
        prop: 'activity',
        level_1: '独立完成所有活动',
        level_2: '借助较小的外力或辅助装置能完成站立、行走、上下楼梯等',
        level_3: '借助较大的外力才能完成站立、行走，不能上下楼梯',
        level_4: '卧床不起，活动完全需要帮助',
        score: {
          level_1: 0,
          level_2: 1,
          level_3: 5,
          level_4: 10
        }
      }
      ]
    }
  },
  methods: {
    formatUTC: function(value, format) {
      if (this._moment(value || '').isValid()) {
        return this._moment(value).format(format || 'YYYY-MM-DD')
      }
      return '未知'
    },
    print() {
      this.$nextTick(() => {
        const d = new Printd()
        let csses = []
        for (let i = 0; i < document.styleSheets.length; i++) {
          [...document.styleSheets[i].cssRules].forEach(rule => {
            csses.push(rule.cssText)
          })
        }
        d.print(this.$el.querySelector('#aged-selef-care-ability-view'), csses.join(' '))
      })
    }
  },
  mounted: function () {
    if (this.showBtns !== false) {
      let {
        sourceRoute
      } = this.$route.params || {}
      this.sourceRoute = sourceRoute
    }
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
.red {
  color: red;

  &-label {
    font-size: 10px;
  }

  &-nums {
    font-size: 16px;
  }
}

.total-score {
  width: 100%;
  text-align: center;
  color: red;

  &-nums {
    font-size: 40px;
  }
}

.score-level {
  color: rgb(36, 218, 224);
  font-size: 16px;
}

.table-cell {
  &-container {
    position: relative;
    width: 100%;
    height: 70px;
  }

  &-label {
    position: absolute;
    width: 80%;
    top: 10px;
    right: 15px;
  }

  &-selected {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  &-score {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
}
</style>
