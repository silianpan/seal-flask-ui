import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author 49773
 * @date 2018-10-23
 * @class DrugService
 * @extends {BaseService}
 */
class DrugService extends BaseService {
  /**
   * 修改指定类型的药品
   * @param {条件} params
   */
  static async updateDrug(params) {
    if (_.isNil(params) || _.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/save/need/update`, params)
    }
  }
}
DrugService.baseUrlPrefix = '/api/ehr/drug/drug'
export { DrugService }
