import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 健康卡信息表 接口}
 * @author hsc
 * @date 2018-09-18
 * @class CardService
 * @extends {BaseService}
 */
class CardService extends BaseService {
  /**
   *
   * 分页查询证卡信息（其中包括部分家庭信息）
   * @author hsc
   * @date 2018-10-22
   * @static
   * @param {*} query
   * @returns
   * @memberof CardService
   */
  static async pageCardInfo(query) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/card/info`, query)
    }
  }
}
CardService.baseUrlPrefix = '/api/ehr/resident/card'
export { CardService }
