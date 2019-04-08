import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 中药处方药 接口}
 * @author panliu
 * @date 2018-11-02
 * @class ChinesePrescriptionDrugService
 * @extends {BaseService}
 */
class ChinesePrescriptionDrugService extends BaseService {
  /**
   * 按条件查找中药处方中药品信息
   * @author hsc
   * @date 2019-01-16
   * @static
   * @param {*} params
   * @returns
   * @memberof ChinesePrescriptionDrugService
   */
  static async findInfoByCondition(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/find/info/by/condition`, params)
    }
  }
}
ChinesePrescriptionDrugService.baseUrlPrefix =
  '/api/ehr/diagnose/chinesePrescriptionDrug'
export { ChinesePrescriptionDrugService }
