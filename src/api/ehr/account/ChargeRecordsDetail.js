import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 充值记录详细表 接口}
 * @author hsc
 * @date 2018-12-04
 * @class ChargeRecordsDetailService
 * @extends {BaseService}
 */
class ChargeRecordsDetailService extends BaseService {
  /**
   *
   * 根据充值流水号查询充值详细
   * @author hsc
   * @date 2018-12-06
   * @static
   * @param {*} seqId
   * @returns
   * @memberof ChargeRecordsDetailService
   */
  static async findChargeDetailInfoBySeq(seqId) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/infos/by/seq/${seqId}`)
    }
  }
}
ChargeRecordsDetailService.baseUrlPrefix =
  '/api/ehr/account/chargeRecordsDetail'

export { ChargeRecordsDetailService }
