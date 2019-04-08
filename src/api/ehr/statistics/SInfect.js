import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供传染病统计分析接口
 * @author 49773
 * @date 2019-01-19
 * @class SInfectService
 * @extends {BaseService}
 */
class SInfectService extends BaseService {
  /**
   * 获取传染病情况
   * @param {条件} params
   */
  static async getInfectInfo(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/infect/info`, params)
    }
  }

  /**
   * 获取传染病类型情况
   * @param {条件} params
   */
  static async getInfectType(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/infect/type`, params)
    }
  }

  /**
   * 获取各种传染病数量
   * @param {条件} params
   */
  static async getInfectDisease(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/infect/disease`, params)
    }
  }
}
SInfectService.baseUrlPrefix = '/api/ehr/statistics/infect'
export { SInfectService }
