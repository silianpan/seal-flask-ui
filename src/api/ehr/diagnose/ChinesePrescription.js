import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 中药处方 接口}
 * @author panliu
 * @date 2018-11-02
 * @class ChinesePrescriptionService
 * @extends {BaseService}
 */
class ChinesePrescriptionService extends BaseService {
  /**
   *
   *根据病例id查找民族药/中药处方
   * @author hsc
   * @date 2019-01-17
   * @static
   * @param {*} caseId
   * @returns
   * @memberof ChinesePrescriptionService
   */
  static async findInfoByCaseId(caseId) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/find/info/by/case/id/${caseId}`)
    }
  }
}
ChinesePrescriptionService.baseUrlPrefix =
  '/api/ehr/diagnose/chinesePrescription'
export { ChinesePrescriptionService }
