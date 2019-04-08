import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 西药处方 接口}
 * @author panliu
 * @date 2018-11-02
 * @class WesternPrescriptionService
 * @extends {BaseService}
 */
class WesternPrescriptionService extends BaseService {
  /**
   *
   *按条件查找西药处方信息
   * @author hsc
   * @date 2019-01-16
   * @static
   * @param {*} params
   * @returns
   * @memberof WesternPrescriptionService
   */
  static async findInfoByCondition(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/find/info/by/condition`, params)
    }
  }
}
WesternPrescriptionService.baseUrlPrefix =
  '/api/ehr/diagnose/westernPrescription'
export { WesternPrescriptionService }
