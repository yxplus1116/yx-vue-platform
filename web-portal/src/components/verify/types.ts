// 行为验证码模式，当前主要用于弹窗场景
export type BehaviorVerifyMode = 'pop' | 'fixed'

// 验证码类型，当前门户端先落滑块验证
export type BehaviorVerifyCaptchaType = 'blockPuzzle'

// 验证区域尺寸配置
export interface BehaviorVerifySize {
  // 区域宽度
  width: string

  // 区域高度
  height: string
}

// 行为验证码成功后回传给业务层的数据
export interface BehaviorVerifySuccessPayload {
  // 发短信接口需要的验证码校验串
  captchaVerification: string
}

// 外部通过 ref 可调用的验证码组件方法
export interface BehaviorVerifyExpose {
  // 打开验证码弹层
  show: () => void

  // 主动关闭验证码弹层
  close: () => void

  // 刷新验证码内容
  refresh: () => void
}
