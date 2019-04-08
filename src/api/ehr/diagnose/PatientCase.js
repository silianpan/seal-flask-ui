import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 患者病历 接口}
 * @author panliu
 * @date 2018-11-02
 * @class PatientCaseService
 * @extends {BaseService}
 */
class PatientCaseService extends BaseService {
  /**
   * 根据条件查找病例信息
   * @author hsc
   * @date 2019-01-16
   * @static
   * @param {*} params
   * @returns
   * @memberof PatientCaseService
   */
  static async findCaseInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/find/case/info`, params)
    }
  }
  static async findHistoryChargeByCaseId(caseId) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${this.baseUrlPrefix}/find/history/charge/by/caseId/${caseId}`
      )
    }
  }
}
PatientCaseService.baseUrlPrefix = '/api/ehr/diagnose/patientCase'
export { PatientCaseService }
