<!--
西药处方 界面
@author panliu
@date 2018-11-02
created by scaffold
-->
<template>
    <div>
        <Card>
            <Row :gutter="5">
                <i-Col>
                    <LegaTable ref="table" :options="options" @addClick="openCreateModule">
                    </LegaTable>
                </i-Col>
            </Row>
        </Card>
        <Modal width="80%" :title="modal.title" v-model="modal.visible">
            <!--
                表单组件位置
             -->
            <div slot='footer'>
                <i-button type='text' size='large' @click.native='hiddenModal'>取消</i-button>
                <i-button type='primary' size='large' :loading='modal.buttonLoading' @click.native='okClick'>确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { WesternPrescriptionService } from '@/api/ehr/diagnose'
import { mapGetters } from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      modal: {
        title: '新增',
        visible: false,
        code: 'create',
        buttonLoading: false
      },
      // 被选中的居民
      selectedWesternPrescription: {},

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
        url: `${WesternPrescriptionService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'area',
            title: '区域编码'
          },
          {
            key: 'caseId',
            title: '病历ID'
          },
          {
            key: 'drugId',
            title: '药品ID'
          },
          {
            key: 'singleDose',
            title: '单次剂量'
          },
          {
            key: 'usage',
            title: '用法'
          },
          {
            key: 'useDrugFreq',
            title: '用药频次'
          },
          {
            key: 'dayNum',
            title: '天数'
          },
          {
            key: 'total',
            title: '总量'
          },
          {
            key: 'explain',
            title: '说明'
          },
          {
            key: 'drugUnit',
            title: '总量单位'
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
              label: '用法',
              prop: 'usage',
              tip: '用法'
            },
            {
              type: 'input',
              label: '用药频次',
              prop: 'useDrugFreq',
              tip: '用药频次'
            },
            {
              type: 'input',
              label: '天数',
              prop: 'dayNum',
              tip: '天数'
            },
            {
              type: 'input',
              label: '总量',
              prop: 'total',
              tip: '总量'
            },
            {
              type: 'input',
              label: '说明',
              prop: 'explain',
              tip: '说明'
            },
            {
              type: 'input',
              label: '总量单位',
              prop: 'drugUnit',
              tip: '总量单位'
            }
          ],
          showItems: [
            {
              type: 'input',
              label: '区域编码',
              prop: 'area',
              tip: '区域编码'
            },
            {
              type: 'input',
              label: '病历ID',
              prop: 'caseId',
              tip: '病历ID'
            },
            {
              type: 'input',
              label: '药品ID',
              prop: 'drugId',
              tip: '药品ID'
            },
            {
              type: 'input',
              label: '单次剂量',
              prop: 'singleDose',
              tip: '单次剂量'
            }
          ]
        }
      }
    }
  },
  methods: {
    /** 修改按钮 点击 */
    modifyClick(row) {
      WesternPrescriptionService.findById(row.id).then(resp => {
        // response.data
        if (resp.status === 0) {
          this.selectedWesternPrescription = resp.data || {}
          this.openModifyModule()
        } else {
        }
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {},
    /** 打开修改弹窗 */
    openModifyModule() {
      this.modal.visible = true
      this.modal.code = 'update'
      this.modal.title = '修改'
    },
    /** 打开新增弹窗 */
    openCreateModule() {
      this.modal.visible = true
      this.modal.code = 'create'
      this.selectedWesternPrescription = {}
      this.modal.title = '新增'
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      WesternPrescriptionService.delete(row.id).then(() => {
        this.$Message.success('删除成功！')
        this.$refs['table'].reLoad()
      })
    },
    /** 表单弹窗点击确定按钮 */
    okClick() {
      const vm = this
      vm.modal.buttonLoading = true
      var opt = {
        fail: function() {
          vm.$Message.error('数据格式不正确')
          vm.modal.buttonLoading = false
          vm.modal.visible = true
        }
      }
      if (vm.modal.code === 'create') {
        opt.success = function(params) {
          WesternPrescriptionService.save(params).then(res => {
            if (res.status === 0) {
              vm.$Message.success('成功录入')
              vm.hiddenModal()
            } else {
              vm.modal.buttonLoading = false
              vm.$Message.error('失败')
            }
            vm.$refs['table'].reLoad()
          })
        }
      } else if (vm.modal.code === 'update') {
        opt.success = function(params) {
          WesternPrescriptionService.save(params).then(res => {
            if (res.status === 0) {
              vm.$Message.success('信息更改成功')
              vm.hiddenModal()
            } else {
              vm.modal.buttonLoading = false
              vm.$Message.error('失败')
            }
            vm.$refs['table'].reLoad()
          })
        }
      }
      vm.$refs['WesternPrescriptionForm'].validate(opt)
    },
    /** 隐藏弹窗 */
    hiddenModal() {
      const vm = this
      vm.modal.buttonLoading = false
      vm.modal.visible = false
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
