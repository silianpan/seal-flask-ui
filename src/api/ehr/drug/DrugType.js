import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供  接口}
 * @author 49773
 * @date 2018-10-23
 * @class DrugTypeService
 * @extends {BaseService}
 */
class DrugTypeService extends BaseService {
  /**
   * 获取指定id的直接子类型，直接子类型的直接子类型数量和对应的药品数量
   * @param {条件} params
   */
  static async getType(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/type`, params)
    }
  }
  /**
   * 获取没有类型的药品数量
   * @param {条件} params
   */
  static async getNullNum() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/null/num`)
    }
  }
}
DrugTypeService.baseUrlPrefix = '/api/ehr/drug/drugType'
export { DrugTypeService }
