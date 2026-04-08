// 行为验证码查询参数
export interface BehaviorCaptchaReq {
  // 验证码类型，常见值为 blockPuzzle
  captchaType?: string

  // 前端完成行为验证后提交给短信接口的校验串
  captchaVerification?: string

  // 设备或客户端唯一标识，当前可选
  clientUid?: string
}

// 行为验证码接口返回结果
export interface BehaviorCaptchaResp {
  // 背景图 base64
  originalImageBase64: string

  // 滑块缺口坐标信息
  point: {
    // 缺口横坐标
    x: number

    // 缺口纵坐标
    y: number
  }

  // 滑块图 base64
  jigsawImageBase64: string

  // 后端签发的验证 token
  token: string

  // 行为验证码 AES 加密密钥
  secretKey: string

  // 点选验证码用到的词组，滑块场景可忽略
  wordList: string[]
}

// 行为验证码校验请求参数
export interface CheckBehaviorCaptchaReq {
  // 验证码类型
  captchaType?: string

  // 经 AES 加密后的坐标信息
  pointJson: string

  // 本次验证 token
  token: string
}

// 行为验证码校验结果
export interface CheckBehaviorCaptchaResp {
  // 业务响应码
  repCode: string

  // 业务响应文案
  repMsg: string
}
