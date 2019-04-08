import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 妇女产后访视记录表 接口}
 * @author hsc
 * @date 2018-11-02
 * @class PostpartumVisitService
 * @extends {BaseService}
 */
class PostpartumVisitService extends BaseService {
  /**
   *
   *根据档案和孕次查找此次怀孕产后检查服务记录信息
   * @author hsc
   * @date 2019-01-21
   * @static
   * @param {*} profileNumber
   * @param {*} times
   * @returns
   * @memberof PostpartumVisitService
   */
  static async findAfterInfosByConditions(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(
        `${this.baseUrlPrefix}/find/after/infos/by/conditions`,
        params
      )
    }
  }

  /**
   * 根据档案和孕次查找此次怀孕产后42天检查服务记录信息
   * @author hsc
   * @date 2019-01-21
   * @static
   * @param {*} profileNumber
   * @param {*} times
   * @returns
   * @memberof PostpartumVisitService
   */
  static async findAfter42daysInfosByConditions(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(
        `${this.baseUrlPrefix}/find/after42days/infos/by/conditions`,
        params
      )
    }
  }
}
PostpartumVisitService.baseUrlPrefix = '/api/ehr/inspection/postpartumVisit'
export { PostpartumVisitService }
