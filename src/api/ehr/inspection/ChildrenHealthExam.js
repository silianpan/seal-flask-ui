import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 儿童健康检查记录表（整合1~8月龄、12~30月龄、3~6岁三张表格） 接口}
 * @author hsc
 * @date 2018-11-02
 * @class ChildrenHealthExamService
 * @extends {BaseService}
 */
class ChildrenHealthExamService extends BaseService {
  /**
   *
   * 根据档案编号查找1~8月龄健康检查记录
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} residentId
   * @returns
   * @memberof ChildrenHealthExamService
   */
  static async findInfos18MonthlyByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${this.baseUrlPrefix}/find/infos/1/8/by/profileNumber/${profileNumber}`
      )
    }
  }

  /**
   *根据档案编号查找12~30月龄健康检查记录
   * @author hsc
   * @date 2019-01-21
   * @static
   * @param {*} profileNumber
   * @returns
   * @memberof ChildrenHealthExamService
   */
  static async findInfos1230MonthlyByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${
          this.baseUrlPrefix
        }/find/infos/12/30/by/profileNumber/${profileNumber}`
      )
    }
  }

  /**
   *
   *根据档案编号查找3~6岁健康检查记录
   * @author hsc
   * @date 2019-01-21
   * @static
   * @param {*} profileNumber
   * @returns
   * @memberof ChildrenHealthExamService
   */
  static async findInfos3672MonthlyByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${
          this.baseUrlPrefix
        }/find/infos/36/72/by/profileNumber/${profileNumber}`
      )
    }
  }
}

ChildrenHealthExamService.baseUrlPrefix =
  '/api/ehr/inspection/childrenHealthExam'
export { ChildrenHealthExamService }
