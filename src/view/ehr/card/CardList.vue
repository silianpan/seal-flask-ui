<!--
健康卡信息表 界面
@author hsc
@date 2018-10-22
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
</div>
</template>

<script>
import LegaTable from '@/components/table/LegaTable'
import {
  CardService
} from '@/api/ehr/resident'
import {
  HfirdService
} from '@/api/hfird'
import {
  mapGetters
} from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      // 被选中的居民
      selectedCard: {},

      options: {
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          view: (params, column) => {
            this.viewClick(params.row || {})
          },
          removeFamilyRelationships: (params, column) => {
            this.removeFamilyRelationships(params.row)
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [{
          type: 'primary',
          name: '开卡',
          icon: 'md-add',
          clickName: 'addClick',
          permissionSuffix: 'btn:card:add'
        }],
        url: `${CardService.baseUrlPrefix}/page/card/info`,
        columns: [
          {
            key: 'phyCardSerial',
            title: '医疗卡号'
          },
          {
            key: 'familyAccount',
            title: '户号'
          },
          {
            key: 'houseOwnerName',
            title: '户主'
          },
          {
            key: 'valliageId',
            title: '乡镇编号',
            render: (h, params) => {
              let row = params.row || {}
              let _village = {}
              try {
                _village = JSON.parse(row['village'] || '{}')
              } catch (e) {

              }
              return (
                <span>{_village.code}</span>
              )
            }
          },
          {
            key: 'valliageName',
            title: '乡镇',
            render: (h, params) => {
              let row = params.row || {}
              let _village = {}
              try {
                _village = JSON.parse(row['village'] || '{}')
              } catch (e) {
              }
              return (
                <span>{_village.name || ''}</span>
              )
            }
          },
          {
            key: 'crtTime',
            title: '开卡日期',
            render: (h, params) => {
              return (
                <span>{this._moment(params.row.crtTime).format('YYYY-MM-DD')}</span>
              )
            }
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'removeFamilyRelationships', permissionSuffix: 'btn:card:removeFamilyRelationships' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'input',
              label: '医疗卡号',
              prop: 'phyCardSerial',
              tip: '医疗卡号'
            },
            {
              type: 'input',
              label: '户号',
              prop: 'familyAccount',
              tip: '户号'
            }
          ]
        }
      }
    }
  },
  methods: {
    /** 查看详情按钮点击 */
    viewClick(row) {

    },
    /** 打开新增弹窗 */
    openCreateModule() {
      this.$router.push({
        name: 'healthCardFormCard',
        params: {
          sourceRoute: this.$route
        }
      })
    },
    // IC卡解绑
    async removeFamilyRelationships(row) {
      let res = await HfirdService.checkCardData()
      if (res.status === 0) {
        if (this._.isEmpty(res.data.replace(/\0/g, ''))) {
          this.$Message.warning('此卡已绑定家庭')
          return
        }
        if (res.data === row.familyAccount) {
          // 重置ic卡
          res = await HfirdService.resetCardData()
          if (res.status === 0) {
            res = await CardService.logicDelete(row.id)
            if (res.ok()) {
              this.$Message.success('解绑成功')
              this.$refs['table'].reLoad()
            } else {
              this.$Message.error(res.msg)
            }
          }
        } else {
          this.$Message.error({
            content: `此卡绑定的家庭户号为${res.data}`,
            duration: 5,
            closable: true
          })
        }
      } else {
        this.$Message.error(res.msg)
      }
    }

  },

  mounted: function () {},
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
