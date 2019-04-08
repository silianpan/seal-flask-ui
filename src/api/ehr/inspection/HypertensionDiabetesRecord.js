import api from '@/libs/api'
import _ from 'lodash'
import { BaseService } from '@/api/base-service'
/**
 *
 * 高血压患者 及 2型糖尿病患者 随访服务记录表 控制器
 * @author hsc
 * @date 2018-11-02
 * @class HypertensionDiabetesRecordService
 * @extends {BaseService}
 */
class HypertensionDiabetesRecordService extends BaseService {
  /**
   *
   * 根据患者档案编号查找所有高血压随访记录
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} residentId
   * @returns
   * @memberof HypertensionDiabetesRecordService
   */
  static async findHypertensionInfosByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${
          this.baseUrlPrefix
        }//find/hypertension/infos/by/profileNumber/${profileNumber}`
      )
    }
  }

  /**
   *
   *根据患者档案编号查找2型糖尿病患随访记录
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} id
   * @returns
   * @memberof HypertensionDiabetesRecordService
   */
  static async findDiabetesInfosByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${
          this.baseUrlPrefix
        }//find/diabetes/infos/by/profileNumber/${profileNumber}`
      )
    }
  }
}
HypertensionDiabetesRecordService.baseUrlPrefix =
  '/api/ehr/inspection/hypertensionDiabetesRecord'
export { HypertensionDiabetesRecordService }
