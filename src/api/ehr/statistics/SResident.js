import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供健康证居民登记统计分析接口
 * @author 49773
 * @date 2019-01-10
 * @class SResidentService
 * @extends {BaseService}
 */
class SResidentService extends BaseService {
  /**
   * 获取居民登记统计信息
   * @param {条件} params
   */
  static async getResidentInfo(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/resident/info`, params)
    }
  }

  /**
   * 获取重点人群统计信息
   */
  static async getFocusGroupInfo() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/focus/group/info`)
    }
  }

  /**
   * 获取指定乡镇的慢性病情况
   */
  static async getDiseaseTypeInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/disease/type/info`, params)
    }
  }
}
SResidentService.baseUrlPrefix = '/api/ehr/statistics/resident'
export { SResidentService }
