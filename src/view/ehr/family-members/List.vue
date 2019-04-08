<!--  -->
<template>
<div>
  <!-- 家庭信息 -->
  <Card>
    <!-- <Divider orientation="left">家庭信息</Divider> -->
    <!-- <lega-form ref="familyInfoCard" :read-only="true" :form-item-data="infoCardLayout"></lega-form> -->
    <!-- 详细成员 -->
    <FamilyInfoView :value="familyInfo"></FamilyInfoView>
    <Row style="margin-top:10px;">
      <LegaTable ref="table" :options="options" @goBack="goBack" @addClick="handleAddFamilyMembersClick" >
        <Row slot="table-title">
            <Alert show-icon>
              提示：不可改变户主
              <Icon type="ios-bulb-outline" slot="icon"></Icon>
            </Alert>
          </Row>
      </LegaTable>
    </Row>
  </Card>
  <Modal title="新增成员" v-model="modal.visible" width="600px">
    <lega-form ref="familymembersForm" :label-width="100" :form-item-data="familymembersFormItemData" :form-rules="familymembersFormRules"></lega-form>
    <div slot='footer'>
      <i-button type='text' size='large' @click.native='hiddenModal'>取消</i-button>
      <i-button type='primary' size='large' :loading='modal.buttonLoading' @click.native='okClick'>确定</i-button>
    </div>
  </Modal>
</div>
</template>

<script>
import {
  ResidentService
} from '@/api/ehr/resident'
import {
  mapGetters
} from 'vuex'
import { backMixin } from '@/mixin/back-mixin'
import FamilyInfoView from '@/view/ehr/family/FamilyInfoView'
export default {
  mixins: [backMixin],
  props: {
    familyInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  components: {
    // LegaTable
    FamilyInfoView
  },
  data() {
    return {
      /** 默认返回的route 页面 */
      targetRoute: {
        name: 'familyList'
      },
      familyAccount: this.familyInfo.familyAccount,
      // familyInfo: {},
      modal: {
        visible: false,
        buttonLoading: false
      },
      familymembersFormRules: {
        relationships: {
          required: true,
          message: '请选择关系',
          trigger: 'change'
        },
        id: {
          required: true,
          message: '居民不应该为空',
          trigger: 'change'
        }
      },
      familymembersFormItemData: [
        [{
          type: 'select',
          prop: 'relationships',
          label: '与户主关系',
          tip: '与户主关系',
          valueField: 'key',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('householderRelationship')
          }
        }],
        [{
          type: 'dynamic-modal',
          textField: 'name',
          valueField: 'id',
          prop: 'id',
          label: '姓名',
          options: {
            title: '选择人员',
            footerHide: true,
            width: '70%',
            renderHeader: (h) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'md-person',
                    size: 30
                  }
                }),
                '选择人员'
              ])
            },
            renderBody: (h) => {
              return h('LegaTable', {
                props: {
                  options: {
                    actionsHandle: {
                      select: (params, column) => {
                        let row = params.row
                        this.$refs['familymembersForm'].setFormFieldsData({
                          name: row.name,
                          id: row.id,
                          idNumber: row.idNumber
                        })
                        this.$refs['familymembersForm'].getDynamicModalByKey('name').remove()
                      }
                    },
                    permissionPerfix: 'residentList',
                    url: `${ResidentService.baseUrlPrefix}/page/not/in/family`,
                    columns: [{
                      key: 'name',
                      title: '姓名'
                    },
                    {
                      key: 'gender',
                      title: '性别',
                      dictGroup: 'gender',
                      render: 'dictFormatter'
                    },
                    {
                      key: 'birthday',
                      title: '出生日期'
                    },
                    {
                      key: 'idNumber',
                      title: '身份证号码'
                    },
                    {
                      key: 'telephone',
                      title: '联系电话'
                    },
                    {
                      key: 'address',
                      title: '详细地址'
                    },
                    {
                      title: '操作',
                      key: 'action',
                      render: ['select']
                    }
                    ],
                    searchOptions: {
                      hiddenItems: [{
                        type: 'select',
                        label: '性别',
                        prop: 'gender',
                        tip: '请选择性别',
                        r: (rowItem) => {
                          return this.dictDatasWithGroupKey('gender')
                        }
                      },
                      {
                        type: 'input',
                        label: '身份证号码',
                        prop: 'idNumber',
                        tip: '请输入身份证号码'
                      },
                      {
                        type: 'input',
                        label: '联系电话',
                        prop: 'telephone',
                        tip: '请输入联系电话'
                      },
                      {
                        type: 'select',
                        label: '常住类型',
                        prop: 'residentType',
                        tip: '常住类型',
                        r: (rowItem) => {
                          return this.dictDatasWithGroupKey('residentType')
                        }
                      },
                      {
                        type: 'select',
                        label: '民族',
                        prop: 'nationality',
                        tip: '民族',
                        r: (rowItem) => {
                          return this.dictDatasWithGroupKey('nationality')
                        }
                      },
                      {
                        type: 'select',
                        label: '文化程度',
                        prop: 'educationLevel',
                        tip: '文化程度',
                        r: (rowItem) => {
                          return this.dictDatasWithGroupKey('educationLevel')
                        }
                      }
                      ],
                      showItems: [{
                        type: 'input',
                        label: '姓名',
                        prop: 'name',
                        tip: '请输入姓名'
                      }

                      ]
                    }
                  }
                }
              })
            }
          }
        }],
        [{
          type: 'input',
          disabled: true,
          prop: 'idNumber',
          label: '身份证号'
        }]

      ],
      // 修改弹窗
      modifyModal: undefined,
      options: {
        queryDataAction: this.listFamilyMembers,
        actionsHandle: {
          modifyFamilyRelationships: (params, column) => {
            this.modifyFamilyRelationships(params.row || {})
          },
          removeFamilyRelationships: (params, column) => {
            // 解除家庭成员关系，并刷新表格
            ResidentService.removeFamilyRelationships({
              familyAccount: params.row.familyAccount,
              residentId: params.row.id
            }).then(resp => {
              if (resp.ok()) {
                if (resp.data) {
                  this.$Message.success('关系解除成功')
                } else {
                  this.$Message.error('解除失败')
                }
              }
              this.$refs.table.reLoad()
            })
          }
        },
        permissionPerfix: 'familyList',
        buttons: [
          {
            name: '返回',
            icon: 'ios-arrow-back',
            clickName: 'goBack'
          },
          {
            type: 'primary',
            name: '新增成员',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:family:addFamilyMember'
          },
          {
            type: 'primary',
            name: '导出',
            customIcon: 'iconfont icon-export',
            iconSize: 12,
            clickName: 'export',
            permissionSuffix: 'view'
          }
        ],
        columns: [
          {
            key: 'householdersRelationship',
            title: '与户主关系'
          },
          {
            key: 'name',
            title: '姓名'
          },
          {
            key: 'gender',
            title: '性别',
            dictGroup: 'gender',
            render: 'dictFormatter'
          },
          {
            key: 'birthday',
            title: '出生日期'
          },
          {
            key: 'idNumber',
            title: '身份证号码'
          },
          {
            title: '操作',
            key: 'action',
            render: [{
              key: 'removeFamilyRelationships',
              permissionSuffix: 'btn:family:removeFamilyRelationships',
              show: (params) => {
                return params.row.householdersRelationship !== '户主'
              }
            },
            {
              key: 'modifyFamilyRelationships',
              permissionSuffix: 'btn_add',
              show: (params) => { return params.row.householdersRelationship !== '户主' }
            }]
          }
        ]
      }
    }
  },
  methods: {
    // 打开修改关系弹窗
    modifyFamilyRelationships: function (familyMemberData) {
      const vm = this
      const options = {
        title: '修改家庭关系',
        width: '40%',
        footerHide: true,
        renderBody: (h) => {
          const items = vm.dictDatasWithGroupKey('householderRelationship')
          return h('Select', {
            props: {
              filterable: true,
              placeholder: '请选择关系',
              value: '0'
            },
            on: {
              input: (value) => {
                vm.establishFamilyRelationships(value, vm.familyAccount, familyMemberData)
              }
            }

          }, items.map((item) => {
            return h('Option', {
              props: {
                label: item.key,
                value: item.key
              }
            })
          }))
        }
      }
      this.modifyModal = this._dynamicModal.newInstance(options)
      this.modifyModal.show()
    },
    handleAddFamilyMembersClick: function () {
      // 打开新增家庭成员表单
      if (this._.isNil(this.familyAccount) || this._.isEmpty(this.familyAccount)) {
        this.$Message.error({
          content: '请确定家庭'
        })
        return
      }
      this.$refs['familymembersForm'].setFormDatas({})
      this.modal.visible = true
    },
    // 查询家庭成员信息
    listFamilyMembers: function (params, callback) {
      if (this._.isNil(this.familyAccount) || this._.isEmpty(this.familyAccount)) {
        callback()
        return
      }
      ResidentService.listFamilyMembers(this.familyAccount).then(res => {
        callback(res)
      }).catch(e => {
        callback()
      })
    },
    // 建立家庭关系
    establishFamilyRelationships: function (relationships, familyAccount, resident = {}) {
      const vm = this
      if (vm._.isNil(relationships) || vm._.isEmpty(relationships)) {
        vm.$Message.error({
          content: '家庭关系不能为空'
        })
        return
      }
      if (vm._.isNil(familyAccount) || vm._.isEmpty(familyAccount)) {
        vm.$Message.error({
          content: '家庭户号不能为空'
        })
        return
      }
      if (vm._.isNil(resident.id) || vm._.isEmpty(resident.id)) {
        vm.$Message.error({
          content: '不存在此居民'
        })
        return
      }
      let params = {
        relationships: relationships,
        familyAccount: familyAccount,
        residentId: resident.id
      }
      ResidentService.establishFamilyRelationships(params).then(resp => {
        if (resp.status === 0) {
          vm.$Message.success('家庭关系修改成功')
          vm.modifyModal.remove()
        } else {
          vm.$Message.error(resp.msg || '操作失败')
        }
        vm.$refs.table.reLoad()
      })
    },
    hiddenModal: function () {
      this.modal.visible = false
    },
    // 保存数据
    okClick: function () {
      const vm = this
      var opt = {
        fail: function () {
          vm.$Message.error('数据格式不正确')
          vm.modal.buttonLoading = false
        }
      }
      vm.modal.buttonLoading = true
      opt.success = function (params = {}) {
        // 将参数整理成 需要的数据
        let _p = {
          residentId: params.id,
          relationships: params.relationships,
          familyAccount: vm.familyAccount
        }
        ResidentService.establishFamilyRelationships(_p).then(res => {
          if (res.status === 0) {
            vm.$Message.success('新增成功')
            vm.hiddenModal()
            vm.$refs.table.reLoad()
          } else {
            vm.$Message.error('失败')
          }
          vm.modal.buttonLoading = false
        })
      }
      vm.$refs['familymembersForm'].validate(opt)
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
