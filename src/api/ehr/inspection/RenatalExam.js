import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 妇女产前检查记录表（包括第2~5次） 接口}
 * @author hsc
 * @date 2018-11-02
 * @class RenatalExamService
 * @extends {BaseService}
 */
class RenatalExamService extends BaseService {
  /**
   *根据档案和孕次查找此次怀孕2~5次检查服务记录信息
   *
   * @author hsc
   * @date 2019-01-21
   * @static
   * @param {*} profileNumber
   * @param {*} times
   * @returns
   * @memberof RenatalExamService
   */
  static async find2To5InfosByConditions(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(
        `${this.baseUrlPrefix}/find/2/5/infos/by/conditions`,
        params
      )
    }
  }

  /**
   *根据档案和孕次查找此次怀孕产前检查服务记录信息
   *
   * @author hsc
   * @date 2019-01-21
   * @static
   * @param {*} profileNumber
   * @param {*} times
   * @returns
   * @memberof RenatalExamService
   */
  static async findFirstInfoByConditions(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(
        `${this.baseUrlPrefix}/find/first/info/by/conditions`,
        params
      )
    }
  }

  /**
   *根据档案编号查看产前和产后的孕次记录
   * @author hsc
   * @date 2019-01-22
   * @static
   * @param {*} profileNumber
   * @returns
   * @memberof RenatalExamService
   */
  static async findGestationalTimesByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${
          this.baseUrlPrefix
        }/find/gestational/times/by/profileNumber/${profileNumber}`
      )
    }
  }
}
RenatalExamService.baseUrlPrefix = '/api/ehr/inspection/renatalExam'
export { RenatalExamService }
