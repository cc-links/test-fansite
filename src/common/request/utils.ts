import { XException } from '../exception'
import { RequestErrorCodeEnum } from '../exception/requestCodeEnum'

// 通用 customErrorCapture 高阶函数
export const createBusinessErrorCapture = (handleBusinessCode: (response: any, exception: any) => any) => {
  return (response: any, exception: any) => {
    // 1. 先处理不是ENT-http的异常
    if (exception && exception?.code !== RequestErrorCodeEnum['NET-http']) {
      return exception
    }
    // 2. 处理业务自定义的 responseCode
    const businessResult = handleBusinessCode(response, exception)
    // 如果业务处理返回了结果，说明有业务错误，返回业务处理结果
    if (businessResult) {
      return businessResult
    }
    // 如果业务处理返回undefined，说明没有业务错误，直接返回response.data
    if (!businessResult) {
      // 3. 最后处理前置捕获到的公共异常
      if (XException.isXException(exception)) {
        return exception
      } else {
        return response.data
      }
    }
  }
}
