interface VerifySizeConfig {
  // 验证区域宽度
  width: string

  // 验证区域高度
  height: string
}

interface VerifySizeContext {
  // 验证组件根节点
  root: HTMLElement

  // 图片区域尺寸配置
  imgSize: VerifySizeConfig

  // 滑块条尺寸配置
  barSize: VerifySizeConfig
}

interface VerifySizeResult {
  // 图片区域实际宽度
  imgWidth: string

  // 图片区域实际高度
  imgHeight: string

  // 滑块条实际宽度
  barWidth: string

  // 滑块条实际高度
  barHeight: string
}

function resolveVerifySize(value: string, parentSize: number) {
  if (value.includes('%')) {
    return `${(Number.parseInt(value, 10) / 100) * parentSize}px`
  }

  return value
}

// 百分比尺寸要按当前容器换算成实际像素，滑块验证会依赖这个结果计算位置
export function resetVerifySize(context: VerifySizeContext): VerifySizeResult {
  const parentWidth = context.root.parentElement?.offsetWidth || window.innerWidth
  const parentHeight = context.root.parentElement?.offsetHeight || window.innerHeight

  return {
    imgWidth: resolveVerifySize(context.imgSize.width, parentWidth),
    imgHeight: resolveVerifySize(context.imgSize.height, parentHeight),
    barWidth: resolveVerifySize(context.barSize.width, parentWidth),
    barHeight: resolveVerifySize(context.barSize.height, parentHeight),
  }
}
