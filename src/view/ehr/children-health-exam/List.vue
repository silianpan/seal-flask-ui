<!--
儿童健康检查记录表（整合1~8月龄、12~30月龄、3~6岁三张表格） 界面
@author hsc
@date 2018-11-04
created by scaffold
-->
<template>
  <div>
    <Card>
      <Row :gutter="5">
        <i-Col>
          <LegaTable ref="table" :options="options" @addClick="handleAddClickAction">
          </LegaTable>
        </i-Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { ChildrenHealthExamService } from '@/api/ehr/inspection'
import { mapGetters } from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      options: {
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          view: (params, column) => {
            this.viewClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [
          {
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn_add'
          }
        ],
        url: `${ChildrenHealthExamService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'residentId',
            title: '档案编号'
          },
          {
            key: 'monthly',
            title: '月龄'
          },
          {
            key: 'visitDate',
            title: '随访日期'
          },
          {
            key: 'weight',
            title: '体重'
          },
          {
            key: 'height',
            title: '身高'
          },
          {
            key: 'headCircumference',
            title: '头围'
          },
          {
            key: 'faceColor',
            title: '面色',
            dictGroup: 'faceColor',
            render: 'dictFormatter'
          },
          {
            key: 'skin',
            title: '皮肤',
            dictGroup: 'skin',
            render: 'dictFormatter'
          },
          {
            key: 'bregma',
            title: '前囟',
            dictGroup: 'bregma',
            render: 'dictFormatter'
          },
          {
            key: 'neckMasses',
            title: '颈部包块',
            dictGroup: 'neckMasses',
            render: 'dictFormatter'
          },
          {
            key: 'eyes',
            title: '眼睛',
            dictGroup: 'eyes',
            render: 'dictFormatter'
          },
          {
            key: 'ears',
            title: '耳外观',
            dictGroup: 'ears',
            render: 'dictFormatter'
          },
          {
            key: 'hearing',
            title: '听力',
            dictGroup: 'hearing',
            render: 'dictFormatter'
          },
          {
            key: 'mouth',
            title: '口腔',
            dictGroup: 'mouth',
            render: 'dictFormatter'
          },
          {
            key: 'chest',
            title: '胸部',
            dictGroup: 'chest',
            render: 'dictFormatter'
          },
          {
            key: 'abdomen',
            title: '腹部',
            dictGroup: 'abdomen',
            render: 'dictFormatter'
          },
          {
            key: 'umbilicalCord',
            title: '脐带',
            dictGroup: 'umbilicalCord',
            render: 'dictFormatter'
          },
          {
            key: 'limbsActivity',
            title: '四肢活动度',
            dictGroup: 'limbsActivity',
            render: 'dictFormatter'
          },
          {
            key: 'signsOfSuspectedRickets',
            title: '可疑佝偻病体征',
            dictGroup: 'signsOfSuspectedRickets',
            render: 'dictFormatter'
          },
          {
            key: 'anus',
            title: '肛门',
            dictGroup: 'anus',
            render: 'dictFormatter'
          },
          {
            key: 'externalGenitals',
            title: '外生殖器',
            dictGroup: 'externalGenitals',
            render: 'dictFormatter'
          },
          {
            key: 'hemoglobin',
            title: '血红蛋白值'
          },
          {
            key: 'outdoorActivities',
            title: '户外活动'
          },
          {
            key: 'vd',
            title: '复用维生素D'
          },
          {
            key: 'developmentAssessment',
            title: '发育评估'
          },
          {
            key: 'advice',
            title: '指导'
          },
          {
            key: 'area',
            title: '区域标志'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'modify', permissionSuffix: 'btn_update' },
              { key: 'delete', permissionSuffix: 'btn_delete' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [
            {
              type: 'input',
              label: '身高',
              prop: 'height',
              tip: '身高'
            },
            {
              type: 'input',
              label: '头围',
              prop: 'headCircumference',
              tip: '头围'
            },
            {
              type: 'select',
              label: '面色',
              prop: 'faceColor',
              tip: '面色',
              r: rowItem => {
                return this.dictDatasWithGroupKey('faceColor')
              }
            },
            {
              type: 'select',
              label: '皮肤',
              prop: 'skin',
              tip: '皮肤',
              r: rowItem => {
                return this.dictDatasWithGroupKey('skin')
              }
            },
            {
              type: 'select',
              label: '前囟',
              prop: 'bregma',
              tip: '前囟',
              r: rowItem => {
                return this.dictDatasWithGroupKey('bregma')
              }
            },
            {
              type: 'select',
              label: '颈部包块',
              prop: 'neckMasses',
              tip: '颈部包块',
              r: rowItem => {
                return this.dictDatasWithGroupKey('neckMasses')
              }
            },
            {
              type: 'select',
              label: '眼睛',
              prop: 'eyes',
              tip: '眼睛',
              r: rowItem => {
                return this.dictDatasWithGroupKey('eyes')
              }
            },
            {
              type: 'select',
              label: '耳外观',
              prop: 'ears',
              tip: '耳外观',
              r: rowItem => {
                return this.dictDatasWithGroupKey('ears')
              }
            },
            {
              type: 'select',
              label: '听力',
              prop: 'hearing',
              tip: '听力',
              r: rowItem => {
                return this.dictDatasWithGroupKey('hearing')
              }
            },
            {
              type: 'select',
              label: '口腔',
              prop: 'mouth',
              tip: '口腔',
              r: rowItem => {
                return this.dictDatasWithGroupKey('mouth')
              }
            },
            {
              type: 'select',
              label: '胸部',
              prop: 'chest',
              tip: '胸部',
              r: rowItem => {
                return this.dictDatasWithGroupKey('chest')
              }
            },
            {
              type: 'select',
              label: '腹部',
              prop: 'abdomen',
              tip: '腹部',
              r: rowItem => {
                return this.dictDatasWithGroupKey('abdomen')
              }
            },
            {
              type: 'select',
              label: '脐带',
              prop: 'umbilicalCord',
              tip: '脐带',
              r: rowItem => {
                return this.dictDatasWithGroupKey('umbilicalCord')
              }
            },
            {
              type: 'select',
              label: '四肢活动度',
              prop: 'limbsActivity',
              tip: '四肢活动度',
              r: rowItem => {
                return this.dictDatasWithGroupKey('limbsActivity')
              }
            },
            {
              type: 'select',
              label: '可疑佝偻病体征',
              prop: 'signsOfSuspectedRickets',
              tip: '可疑佝偻病体征',
              r: rowItem => {
                return this.dictDatasWithGroupKey('signsOfSuspectedRickets')
              }
            },
            {
              type: 'select',
              label: '肛门',
              prop: 'anus',
              tip: '肛门',
              r: rowItem => {
                return this.dictDatasWithGroupKey('anus')
              }
            },
            {
              type: 'select',
              label: '外生殖器',
              prop: 'externalGenitals',
              tip: '外生殖器',
              r: rowItem => {
                return this.dictDatasWithGroupKey('externalGenitals')
              }
            },
            {
              type: 'input',
              label: '血红蛋白值',
              prop: 'hemoglobin',
              tip: '血红蛋白值'
            },
            {
              type: 'input',
              label: '户外活动',
              prop: 'outdoorActivities',
              tip: '户外活动'
            },
            {
              type: 'input',
              label: '复用维生素D',
              prop: 'vd',
              tip: '复用维生素D'
            },
            {
              type: 'input',
              label: '发育评估',
              prop: 'developmentAssessment',
              tip: '发育评估'
            },
            {
              type: 'input',
              label: '指导',
              prop: 'advice',
              tip: '指导'
            },
            {
              type: 'input',
              label: '区域标志',
              prop: 'area',
              tip: '区域标志'
            }
          ],
          showItems: [
            {
              type: 'input',
              label: '档案编号',
              prop: 'residentId',
              tip: '档案编号'
            },
            {
              type: 'input',
              label: '月龄',
              prop: 'monthly',
              tip: '月龄'
            },
            {
              type: 'input',
              label: '随访日期',
              prop: 'visitDate',
              tip: '随访日期'
            },
            {
              type: 'input',
              label: '体重',
              prop: 'weight',
              tip: '体重'
            }
          ]
        }
      }
    }
  },
  methods: {
    /** 修改按钮 点击 */
    modifyClick(row) {
      ChildrenHealthExamService.findById(row.id).then(resp => {
        // response.data
        if (resp.status === 0) {
          this.handleModifyAction(resp.data)
        } else {
        }
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {},
    /** 新增 */
    handleAddClickAction() {},
    handleModifyAction(data) {},
    /** 点击删除按钮 */
    deleteClick(row) {
      ChildrenHealthExamService.logicDelete(row.id).then((res) => {
        if (res.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    }
  },

  mounted: function() {},
  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>
