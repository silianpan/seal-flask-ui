<!-- 证卡表单 -->
<template>
<div>
  <Card>
    <Row>
      <ButtonGroup>
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button type='primary' :loading='buttonLoading' @click='handleSaveClick'>
          <Icon custom="iconfont icon-baocun" size=12 /> 保存
        </i-button>
        <i-button type='info' @click.native='connectDevice' v-if="!isDeviceConnect">
          <Icon custom="iconfont icon-lianjieconnecting5" size=12 />连接设备</i-button>
      </ButtonGroup>
    </Row>
    <Alert v-if="isDeviceConnect" type="success" show-icon>设备已连接</Alert>
    <Alert v-else type="warning" show-icon>设备未连接</Alert>
    <Card dis-hover>
      <Row type="flex" justify="center">
        <i-col :xs="24" :sm="24" :md="12" :lg="12">
          <Divider orientation="left">证卡信息</Divider>
          <lega-form ref="cardFormInfo" :form-item-data="cardFormItemData" :form-rules="cardFormRules" @scanPhyCardAction="scanPhyCardAction"></lega-form>
        </i-col>
      </Row>
    </Card>
    <Card v-if="showFamilyInfo"  dis-hover style="margin-top:5px" :class="['animated',{swing:showFamilyInfo} ]">
      <FamilyInfoView :value="familyInfo">
      </FamilyInfoView>
      <Divider orientation="left">家庭成员信息</Divider>
      <LegaTable ref="table" :options="familymemberOptions" @query-data-action="listFamilyMembers">
      </LegaTable>
    </Card>
  </Card>
</div>
</template>

<script>
import {
  FamilyService
} from '@/api/ehr/family'
import {
  CardService,
  ResidentService
} from '@/api/ehr/resident'
import {
  backMixin
} from '@/mixin/back-mixin'
import {
  HfirdService
} from '@/api/hfird'
import FamilyInfoView from '@/view/ehr/family/FamilyInfoView'

export default {
  props: {},
  mixins: [backMixin],
  components: {
    FamilyInfoView
  },
  data() {
    return {
      targetRoute: {
        name: 'healthCardList'
      },
      familyInfo: {},
      buttonLoading: false,
      showFamilyInfo: false,
      isDeviceConnect: false, // 设备未连接
      formData: {
        phyCardId: undefined,
        familyAccount: undefined
      },
      cardFormRules: {
        phyCardId: [{
          required: true,
          trigger: 'blur',
          validator: this.phyCardValidator
        }],

        phyCardSerial: [{
          required: true,
          trigger: 'blur',
          // message: '卡面序号不能为空',
          validator: this.phyCardSerialValidator
        }],
        familyAccount: [{
          required: true,
          trigger: 'change',
          message: '家庭户号不能为空'
        }]

      },
      cardFormItemData: [
        [{
          type: 'input',
          prop: 'phyCardSerial',
          label: '医疗卡号',
          tip: '医疗卡号'
        }],
        [{
          type: 'input',
          prop: 'phyCardId',
          label: '物理卡ID',
          disabled: true,
          tip: '请扫描IC号',
          button: true,
          customIcon: 'iconfont icon-saomiao',
          buttonClick: 'scanPhyCardAction',
          iconSize: 12
        }],
        [{
          type: 'dynamic-modal',
          prop: 'familyAccount',
          label: '家庭户号',
          placeholder: '请选择家庭',
          handleClear: () => {
            this.showFamilyInfo = false
          },
          options: {
            title: '选择家庭',
            footerHide: true,
            width: '70%',
            renderHeader: h => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'md-person',
                    size: 30
                  }
                }),
                '选择家庭'
              ])
            },
            renderBody: h => {
              return h('LegaTable', {
                props: {
                  options: {
                    actionsHandle: {
                      select: (params, column) => {
                        let row = params.row || {}
                        this.showFamilyInfo = true
                        this.$refs['cardFormInfo'].setFormFieldsData({
                          familyAccount: row.familyAccount
                        })
                        this.$nextTick(() => {
                          this.familyInfo = JSON.parse(JSON.stringify(row))

                          this.listFamilyMembers({
                            familyAccount: row.familyAccount
                          })
                          this.$refs['cardFormInfo']
                            .getDynamicModalByKey('familyAccount')
                            .remove()
                        })
                      }
                    },
                    permissionPerfix: FamilyService.permissionPerfix,
                    url: `${
                      FamilyService.baseUrlPrefix
                    }/page/has/not/phy/card`,
                    columns: [{
                      key: 'village',
                      title: '乡',
                      render: (h, params) => {
                        let row = params.row || {}
                        let _village = {}
                        try {
                          _village = JSON.parse(row['village'] || '{}')
                        } catch (e) {}
                        return h('span', _village.name || '')
                      }
                    },
                    {
                      key: 'familyAccount',
                      title: '户号'
                    },
                    {
                      key: 'houseOwnerName',
                      title: '户主',
                      render: (h, params) => {
                        let row = params.row || {}
                        if (this._.isNil(row.houseOwnerName)) {
                          return h('div', '暂无')
                        }
                        return h('span', row.houseOwnerName)
                      }
                    },
                    {
                      key: 'address',
                      title: '住址'
                    },
                    {
                      title: '操作',
                      key: 'action',
                      render: ['select']
                    }
                    ],
                    searchOptions: {
                      hiddenItems: [],
                      showItems: [{
                        type: 'input',
                        label: '乡名',
                        prop: 'village',
                        queryType: 'like',
                        tip: '乡名或者乡编号'
                      },
                      {
                        type: 'input',
                        label: '户主',
                        prop: 'houseOwnerName',
                        tip: '请输入户主姓名'
                      }
                      ]
                    }
                  }
                }
              })
            }
          }
        }]
      ],
      familymemberOptions: {
        // queryDataAction: () => {
        // },
        columns: [{
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
        }
        ]
      }
    }
  },
  methods: {
    phyCardSerialValidator: function (rule, value, callBack) {
      const vm = this
      if (this._.isNil(value) || this._.isEmpty(value)) {
        callBack([new Error('医疗卡号不能为空')])
      } else {
        // 判断卡面序号是否重复
        let _params = []
        if (
          !vm._.isNil((vm.formData || {}).id) &&
          !vm._.isEmpty((vm.formData || {}).id)
        ) {
          _params.push({
            field: 'id',
            queryType: 'neq',
            value: vm.formData.id
          })
        }
        _params.push({
          field: 'phyCardSerial',
          queryType: 'eq',
          value: value
        })
        // 验证 卡面 序号 是否 重复
        CardService.countByCondition(_params).then(res => {
          if (res.ok()) {
            if (res.data !== 0) {
              callBack([new Error('医疗卡号已经存在')])
            } else {
              callBack()
            }
          } else {
            callBack(new Error(res.msg))
          }
        })
      }
    },
    phyCardValidator: function (rule, value, callBack = function () {}) {
      const vm = this
      if (vm._.isNil(value) || vm._.isEmpty(value)) {
        callBack([new Error('物理卡号不能为空')])
      } else {
        // 验证此卡是否被绑定
        let _params = []
        if (
          !vm._.isNil((vm.formData || {}).id) &&
          !vm._.isEmpty((vm.formData || {}).id)
        ) {
          _params.push({
            field: 'id',
            queryType: 'neq',
            value: vm.formData.id
          })
        }
        _params.push({
          field: 'phyCardId',
          queryType: 'eq',
          value: value
        })
        // 验证 身份证号码 是否 重复
        CardService.countByCondition(_params).then(res => {
          if (res.ok()) {
            if (res.data !== 0) {
              callBack([new Error('此卡已经被家庭绑定')])
            } else {
              callBack()
            }
          } else {
            callBack(new Error(res.msg))
          }
        })
      }
    },
    // 查询家庭成员信息
    listFamilyMembers: function (params = {}) {
      if (this._.isNil(params.familyAccount) || this._.isEmpty(params.familyAccount)) {
        return
      }
      ResidentService.listFamilyMembers(params.familyAccount).then(res => {
        this.$refs.table.dealResponseData(res)
      })
    },

    connectDevice: function () {
      HfirdService.connect().then(res => {
        if (res.status === 0) {
          this.isDeviceConnect = true
        } else {
          this.$Message.error('设备无法连接,请下载连接设备exe')
        }
      })
    },
    handleSaveClick: function () {
      // 检测表单数据格式
      const vm = this
      if (!vm.isDeviceConnect) {
        vm.$Message.warning('请保持设备连接')
        return
      }
      var opt = {
        fail: function () {
          vm.$Message.error('数据格式不正确')
        }
      }
      let msg = '信息更改成功'
      opt.success = async function (params) {
        if (vm._.isNil(params.id) || vm._.isEmpty(params.id)) {
          msg = '新增成功'
        }
        const resCardData = await HfirdService.readBlockData()
        if (resCardData.status === 0) {
          if (
            !vm._.isNil(resCardData.data) &&
            !vm._.isEmpty(resCardData.data.replace(/\0/g, ''))
          ) {
            vm.$Message.info({
              content: `此卡已被户号为${resCardData.data}绑定,如需操作请先解绑`,
              duration: 5,
              closable: true
            })
          } else {
            // 将参数整理成 需要的数据
            let _p = vm.makeData(params)
            // 写入 familyId 到ic卡中
            const _res = await HfirdService.writeBlockData({
              data: _p.familyAccount
            })
            if (_res.status !== 0) {
              vm.$Message.error('写卡失败,请重新刷卡')
            } else {
              // 如果成功则写入数据库中
              CardService.save(_p).then(res => {
                if (res.status === 0) {
                  vm.$Message.success(msg)
                  // 跳转 到证卡管理界面
                  vm.goBack()
                } else {
                  // 恢复原数据
                  HfirdService.writeBlockData({
                    data: resCardData.data
                  })
                }
              })
            }
          }
        }
      }
      vm.$refs['cardFormInfo'].validate(opt)
      // 写入信息到ic 卡中
      // 保存此条记录
    },
    makeData: function () {
      const vm = this
      let formData = vm.$refs['cardFormInfo'].getFormDatas() || {}
      return formData
    },
    scanPhyCardAction: async function () {
      const vm = this
      // vm.$refs['cardFormInfo'].setFormFieldData('phyCardId', '')
      if (vm.isDeviceConnect) {
        const res = await HfirdService.getCardSerialNumber()
        if (res.status === 0) {
          vm.$refs['cardFormInfo'].setFormFieldData('phyCardId', res.data)
          // 尝试读取卡中数据
          const resCardData = await HfirdService.readBlockData()
          if (resCardData.status === 0) {
            if (
              !vm._.isNil(resCardData.data) &&
              !vm._.isEmpty(resCardData.data.replace(/\0/g, ''))
            ) {
              vm.$Message.info({
                content: `此卡已被户号为${
                  resCardData.data
                }绑定,如需操作请先解绑`,
                duration: 5,
                closable: true
              })
            }
          }
        } else {
          vm.$Message.warning({
            content: '请重新连接设备'
          })
        }
      } else {
        vm.$Message.warning('请连接设备')
      }
    },
    goBack: function () {
      this.$router.push({
        name: 'healthCardList'
      })
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute

    HfirdService.connect().then(res => {
      if (res.status === 0) {
        this.isDeviceConnect = true
      }
    })
  },
  computed: {}
}
</script>

<style scoped>
.ivu-row {
  margin-bottom: 5px;
}
</style>
