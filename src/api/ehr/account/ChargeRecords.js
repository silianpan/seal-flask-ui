import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 充值记录 接口}
 * @author hsc
 * @date 2018-12-04
 * @class ChargeRecordsService
 * @extends {BaseService}
 */
class ChargeRecordsService extends BaseService {
  /**
   * 充值接口
   * @author hsc
   * @date 2018-12-06
   * @static
   * @param {*} params
   * @returns
   * @memberof ChargeRecordsService
   */
  static async saveInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/save/info`, params)
    }
  }

  /**
   *
   *
   * @author hsc
   * @date 2019-01-15
   * @static
   * @param {*} params
   * @returns
   * @memberof ChargeRecordsService
   */
  static async pageInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/info`, params)
    }
  }
}
ChargeRecordsService.baseUrlPrefix = '/api/ehr/account/chargeRecords'
export { ChargeRecordsService }
