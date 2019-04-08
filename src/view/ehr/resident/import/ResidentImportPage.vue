<!--  -->
<template>
<div class="import-user-data-container">
  <Card>
    <p slot="title">
      批量导入居民信息
    </p>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="20" :lg="20">
         <Steps :current="currentStep">
            <Step title="设置区域" content="设置导入居民所在乡镇信息" ></Step>
            <Step title="读取文件内容" content="选择居民信息的excel文件"></Step>
            <!-- <Step title="数据导入" content="数据导入"></Step> -->
            <Step title="完成" content="完成导入"></Step>
        </Steps>
      </i-col>
    </Row>
    <!-- 第一步 -->
    <Row v-show="currentStep === 0" type="flex" justify="center">
      <i-col :xs="24" :sm="12" :md="12" :lg="12">
        <lega-form  ref="areaInfoForm" :form-item-data="areaItemData" :form-rules="areaFormRules" >
        </lega-form>
      </i-col>
    </Row>
    <Spin fix size="large" v-show="isLoading">{{loadingText || '正在读取数据...'}}</Spin>
    <!-- 第二步 -->
    <div v-show="currentStep === 1">
    <Row >
          <i-col>
            <Upload type="drag" action="" :before-upload="handleBeforeUpload" :accect="SheetJSFT">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p></p>
              </div>
            </Upload>
          </i-col>
        </Row>
        <Row type="flex" justify="center">
          <i-col :xs="24" :sm="24" :md="20" :lg="20">
            <Alert show-icon>
                {{areaDataTip}}
                <Icon type="ios-bulb-outline" slot="icon"></Icon>
            </Alert>
            <Table :height="400"  :columns="tableColumns" :data="tableData">
            </Table>
            <div  style="font-size:12px;color:grey">
              <span>待录入居民数 </span> <span style="font-size:16px;color:red">{{tableData.length || 0}}</span> 人
               <!-- <span>（其中 女性 {{tableData.length || 0}} 人 ，男性 {{tableData.length || 0}} 人）</span> -->
            </div>
            <div style="font-size:12px;color:grey">
              <span>估计录入家庭数 </span> <span style="font-size:16px;color:red">{{importFamilyData.length || 0}}</span> 户
            </div>
          </i-col>
        </Row>
    </div>
    <Row v-show="currentStep === 2" type="flex" justify="center">
      <i-col :xs="24" :sm="24" :md="20" :lg="20" >
        <!-- 完成 -->
        <div style="text-align:center;width:100%">
            <Icon custom="iconfont icon-oval70copy" size="52" color="#52c41a"></Icon>
            <div>
              完成
            </div>
            <div>
               <a @click="handleDownloadImportResult">{{downloadExlFileName}}.xlsx </a>
            </div>
        </div>
        <!-- 失败 -->
      </i-col>
    </Row>
    <Row type="flex" justify="center" v-if="currentStep!==2">
      <i-col :xs="24" :sm="24" :md="20" :lg="20" style="text-align:center">
             <ButtonGroup>
              <Button type="primary" :disabled="currentStep===0 || nextBtnLoading"  @click="handleStepPre">
                  <Icon type="ios-arrow-back"></Icon>
                  上一步
              </Button>
              <Button type="primary" v-if="currentStep!==1" :loading="nextBtnLoading" @click="handleStepNext">
                  下一步
                  <Icon type="ios-arrow-forward"></Icon>
              </Button>
              <Button type="primary" v-if="currentStep===1" :loading="nextBtnLoading"  @click="handleClickImportAction">
                  导入
                  <Icon custom="iconfont icon-export" size=12></Icon>
              </Button>
          </ButtonGroup>
      </i-col>
    </Row>
  </Card>
</div>
</template>
<script>
import XLSX from 'xlsx'
import saveAs from 'file-saver'
import { ResidentService } from '@/api/ehr/resident'
import { TreeUtil } from '@/utils/TreeUtil'
import { RegexUtil } from '@/utils/RegexUtil'
const rABS = (typeof FileReader) && FileReader.prototype && FileReader.prototype.readAsBinaryString
const villageDatas = TreeUtil.loadAreaTreeDatas('540330', 'village').map(function(item) {
  return {
    code: item.value,
    name: item.title
  }
})
const ExcelHeadersConfig = {
  '序号': {
    field: 'seq'
  },
  '户主姓名': {
    field: 'householdsName'
  },
  '本人姓名': {
    field: 'name',
    required: true
  },
  '性别': {
    field: 'gender'
  },
  '出生年月': {
    field: 'birthday'
  },
  '身份证号': {
    field: 'idNumber',
    required: true
  },
  '与户主关系': {
    field: 'householdersRelationship',
    required: true
  },
  '户口性质': {

  }
}
export default {
  props: {},
  components: {

  },
  data() {
    return {
      /** 下一步按钮 loading */
      nextBtnLoading: false,
      // 区域表单信息
      areaInfoFormData: {
        // 省
        province: {
          'code': '540000',
          'name': '西藏自治区'
        },
        //
        city: {
          'code': '540300',
          'name': '昌都市'
        },
        //
        county: {
          'code': '540330',
          'name': '边坝县'
        },
        village: {

        }
      },
      // 步骤条动作
      stepsAction: {
        0: {
          beforeNext: (callback) => {
            let opt = {
              success: (params) => {
                let village = villageDatas.find((i) => i.code === params.villageCode)
                this.areaInfoFormData.village = village
                this.areaInfoFormData.address = params.address
                console.log(params, this.areaInfoFormData)
                if (this._.isFunction(callback)) {
                  let success = true
                  callback(success)
                }
              },
              fail: (params) => {
                let success = false
                callback(success)
              }
            }
            this.$refs.areaInfoForm.validate(opt)
          }
        },
        1: {
          beforeNext: (callback) => {
            let tag = false
            if (this.workbook) {
              tag = true
            }
            if (!tag) {
              this.$Message.info('请选择文件')
            } else {
              this.loadingText = '正在分析数据...'
              this.isLoading = true
              setTimeout(() => {
                this.isLoading = false
              }, 1000)
            }
            callback(tag)
          }
        }
      },
      // 区域表单项
      areaItemData: [
        [
          {
            type: 'select',
            prop: 'villageCode',
            label: '乡镇',
            tip: '暂支持昌市边坝县11个乡镇',
            valueField: 'code',
            keyField: 'name',
            r: rowItem => {
              return villageDatas
            }
          }
        ],
        [
          {
            type: 'input',
            prop: 'address',
            label: '村(居)',
            tip: '详细地址信息'
          }
        ]
      ],
      // 区域表单规则
      areaFormRules: {
        villageCode: [
          {
            required: true,
            message: '请选择区域',
            trigger: 'chagne'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }
        ]
      },
      rABS: rABS,
      SheetJSFT: [
        'xlsx', 'xls', 'csv'
      ].map(function (x) {
        return '.' + x
      }).join(','),
      workbook: null,
      // 当前步骤
      currentStep: 0,
      // 表格columns
      tableColumns: [],
      // 表格数据
      tableData: [],
      importFamilyData: [],
      // showDragFile: true,
      // 页面loading 状态
      isLoading: false,
      // 页面loading显示文本
      loadingText: '正在读取数据...',
      importData: {
        residentCnt: 0,
        data: []
      },
      importResult: {}
    }
  },
  methods: {
    handleDownloadImportResult() {
      const fileName = this.downloadExlFileName
      // const data = this.
      var downLoadData = this.tableData.map(row => {
        let _r = { ...row }
        _r['导入状态'] = (this.importResult[row['身份证号']] || {}).importStatus || '未导入'
        return _r
      })
      const wopts2 = { bookType: 'xlsx', bookSST: false, type: 'binary' }// 这里的数据是用来定义导出的格式类型
      downloadExl(downLoadData, fileName, wopts2)
      function downloadExl(data, fileName, wopts) {
        const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
        wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)// 通过json_to_sheet转成单页(Sheet)数据
        saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' }), fileName + '.' + (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType))
      }
      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          let buf = new ArrayBuffer(s.length)
          let view = new Uint8Array(buf)
          for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
          return buf
        } else {
          let buf = new Array(s.length)
          for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
          return buf
        }
      }
    },
    async upLoadData() {
      const data = this.importData.data
      if (this.importData.data.length === 0) {
        this.$Message.info('数据为空')
        return
      }
      const result = {}
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        const start = Date.now()
        const res = await ResidentService.importResidentInfo(this._.defaultsDeep([], [element]))

        //  姓名 身份证号 录入状态
        if (res.status === 0) {
          (res.data || []).forEach((item) => {
            let { importStatus } = item
            result[item.idNumber] = { importStatus: importStatus }
            if (item.isHouseholder) {
              (item.familyMembers || []).forEach(_i => {
                let importStatus = _i.importStatus
                result[_i.idNumber] = { importStatus }
              })
            }
          })
        } else {
          break
        }
        const end = Date.now()
        this.loadingText = `正在分析处理数据(预计时间:${((end - start) * (data.length - index) / 1000)}秒)`
        console.log('预计时间', start, end, (end - start) * data.length)
        console.log(res)
      }
      this.importResult = result
    },
    handleClickImportAction() {
      let tag = false
      if (this.workbook) {
        tag = true
      }
      if (!tag) {
        this.$Message.info('请选择文件')
        return
      }
      this.nextBtnLoading = true
      this.isLoading = true
      this.loadingText = '正在导入,请稍等...'
      setTimeout(() => {
        this.upLoadData().then(() => {
          this.$Message.info('导入结束')
          this.nextBtnLoading = false
          this.isLoading = false
          this.currentStep++
        })
      }, 500)
    },
    fileConvertToWorkbook(file) {
      let reader = new FileReader()
      let fixdata = (data) => {
        let o = ''
        let l = 0
        let w = 10240
        for (; l < data.byteLength / w; ++l) {
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        }
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      }
      return new Promise((resolve, reject) => {
        try {
          reader.onload = (renderEvent) => {
            let data = renderEvent.target.result
            if (this.rABS) {
              /* if binary string, read with type 'binary' */
              resolve(XLSX.read(data, {
                type: 'binary'
              }))
            } else {
              /* if array buffer, convert to base64 */
              let arr = fixdata(data)
              resolve(XLSX.read(btoa(arr), {
                type: 'base64'
              }))
            }
          }
          reader.onerror = (error) => {
            reject(error)
          }
          if (this.rABS) {
            reader.readAsBinaryString(file)
          } else {
            reader.readAsArrayBuffer(file)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    handleBeforeUpload(file) {
      // var reader = new FileReader()
      this.isLoading = true
      this.loadingText = '正在读取数据...'
      setTimeout(() => {
        this.fileConvertToWorkbook(file)
          .then((workbook) => {
            let xlsxArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
            this.workbook = workbook
            this.initTable(
              this.xlsxArrToTableArr(xlsxArr)
            )
            this.loadingText = '正在分析处理数据...'
            setTimeout(() => {
              this.analysisData()
              this.isLoading = false
            }, 5000)
          })
          .catch((err) => {
            console.error(err)
            this.isLoading = false
          })
      }, 500)
      return false
    },
    convertData(row, isHouseholder = false) {
      let _d = {}
      Object.keys(row || {}).map((cnfield) => {
        const enField = ExcelHeadersConfig[cnfield].field
        if (cnfield in ExcelHeadersConfig && enField) {
          _d[enField] = (row || {})[cnfield]
        }
      })
      _d.isRight = false
      _d.isHouseholder = isHouseholder
      _d.importStatus = '待录入'
      if (_d.idNumber) {
        if (RegexUtil.testIdNumber(_d.idNumber)) {
          _d.isRight = true
        }
      }
      return Object.assign(_d, this.areaInfo)
    },
    /** 分析table 数据 */
    analysisData() {
      const tableData = this.tableData
      let familyData = tableData.filter((row) => {
        return row['户主姓名'] === row['本人姓名'] && row['与户主关系'] === '户主'
      }) || []
      let importFamilyData = []
      let currentFamily = null
      let onlyResidentInfo = []
      tableData.forEach((row, index) => {
        if (row['户主姓名'] === row['本人姓名'] && row['与户主关系'] === '户主') {
          if (currentFamily) {
            importFamilyData.push({ ...currentFamily })
          }
          currentFamily = this.convertData({ ...row }, true)
        } else {
          if (!currentFamily) {
            onlyResidentInfo.push({ ...row })
          } else {
            if (!currentFamily.familyMembers) {
              currentFamily.familyMembers = []
            }
            if (currentFamily.name === row['户主姓名']) {
              currentFamily.familyMembers.push(this.convertData({ ...row }))
            }
            if (importFamilyData.length === (familyData.length - 1)) {
              importFamilyData.push({ ...currentFamily })
            }
          }
        }
      })
      this.importFamilyData = importFamilyData
      this.importData = {
        residentCnt: tableData.length,
        data: Object.assign([], importFamilyData, onlyResidentInfo)
      }
    },
    initTable({
      data,
      header
    }) {
      this.tableColumns = header.map(h => {
        return {
          title: h,
          key: h
        }
      })
      this.tableData = data
    },
    xlsxArrToTableArr(xlsxArr) {
      let tableArr = []
      let length = 0
      let maxLength = 0
      let maxLengthIndex = 0
      xlsxArr.forEach((item, index) => {
        length = Object.keys(item).length
        if (maxLength < length) {
          maxLength = length
          maxLengthIndex = index
        }
      })
      let tableHeader = Object.keys(xlsxArr[maxLengthIndex])
      let rowItem = {}
      xlsxArr.forEach((item) => {
        rowItem = {}
        for (let i = 0; i < maxLength; i++) {
          rowItem[tableHeader[i]] = item[tableHeader[i]] || ''
        }
        tableArr.push(rowItem)
      })
      return {
        header: tableHeader,
        data: tableArr
      }
    },

    handleStepNext() {
      this.nextBtnLoading = true
      const currentStepAction = this.stepsAction[this.currentStep] || {}
      if (this._.isFunction(currentStepAction.beforeNext)) {
        currentStepAction.beforeNext((tag) => {
          if (tag) {
            this.currentStep++
          }
          this.nextBtnLoading = false
        })
      } else {
        this.currentStep++
        this.nextBtnLoading = false
      }
    },
    handleStepPre() {
      this.currentStep--
    }
  },
  mounted: function () {},
  computed: {
    areaDataTip() {
      let { province, city, county, village } = this.areaInfoFormData
      return `${province.name}/${city.name}/${county.name}/${village.name} (居民信息)`
    },
    downloadExlFileName() {
      return `${this._moment().format('YYYY-MM-DD')}${this.areaDataTip}导入结果`
    },
    areaInfo() {
      let _d = {}
      Object.keys(this.areaInfoFormData).map((field) => {
        if (field !== 'address') { _d[field] = JSON.stringify(this.areaInfoFormData[field] || {}) } else {
          _d[field] = this.areaInfoFormData[field]
        }
      })
      // 标识 哪个地区的居民
      _d.area = this.areaInfoFormData['village'].code
      return _d
    }
  }
}
</script>

<style  lang="less" scoped>
.import-user-data-container {
  .ive-row {
    margin-bottom: 10px;
  }
  .ivu-row-flex {
    margin-bottom: 10px;
  }
}
</style>
