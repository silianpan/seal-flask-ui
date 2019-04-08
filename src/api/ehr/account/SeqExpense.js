import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 消费流水 接口}
 * @author hsc
 * @date 2018-12-07
 * @class SeqExpenseService
 * @extends {BaseService}
 */
class SeqExpenseService extends BaseService {
  static async pageInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/info`, params)
    }
  }

  /**
   * 分页查询清算消费流水
   * @param {*} params
   */
  static async pageClearAccountSeqExpense(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/clear/account`, params)
    }
  }

  static async listClearAccountSeqExpense(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/list/clear/account`, params)
    }
  }
}
SeqExpenseService.baseUrlPrefix = '/api/ehr/account/seqExpense'
export { SeqExpenseService }
