import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { getSmsCaptcha, registerPortalUser } from '@/apis'
import type { BehaviorVerifyExpose, BehaviorVerifySuccessPayload } from '@/components/verify'
import { encryptByRsa } from '@/utils/encrypt'
import * as Regexp from '@/utils/regexp'
import type { RegisterFormState } from '../types'

const CAPTCHA_DURATION = 60

// 注册页的表单状态、短信验证码和提交流程统一收在这个 hook 里
export function useRegisterForm() {
  const router = useRouter()

  // 注册表单数据
  const form = reactive<RegisterFormState>({
    username: '',
    phone: '',
    captcha: '',
    password: '',
  })

  // 注册提交中的加载状态
  const loading = ref(false)

  // 短信验证码发送中的加载状态
  const captchaLoading = ref(false)

  // 验证码倒计时剩余秒数
  const captchaTime = ref(CAPTCHA_DURATION)

  // 验证码倒计时是否正在进行
  const captchaDisabled = ref(false)

  // 倒计时定时器，离开页面前要及时清理
  const captchaTimer = ref<number | undefined>()

  // 行为验证码组件实例，发短信前会先弹出它
  const verifyRef = ref<BehaviorVerifyExpose>()

  // 获取验证码按钮文案，发送中和倒计时阶段都会跟着变化
  const captchaButtonText = computed(() => {
    if (captchaLoading.value) {
      return '发送中...'
    }

    if (captchaDisabled.value) {
      return `重新发送(${captchaTime.value}s)`
    }

    return '获取验证码'
  })

  function clearCaptchaTimer() {
    if (captchaTimer.value) {
      window.clearInterval(captchaTimer.value)
      captchaTimer.value = undefined
    }
  }

  // 重置验证码发送状态，通常在倒计时结束或发送失败时调用
  function resetCaptchaState() {
    clearCaptchaTimer()
    captchaTime.value = CAPTCHA_DURATION
    captchaDisabled.value = false
  }

  // 验证注册用户名
  function validateUsername() {
    if (!form.username.trim()) {
      Message.warning('请输入用户名')
      return false
    }

    return true
  }

  // 验证手机号格式
  function validatePhone() {
    if (!form.phone.trim()) {
      Message.warning('请输入手机号')
      return false
    }

    if (!Regexp.Phone.test(form.phone.trim())) {
      Message.warning('请输入正确的手机号')
      return false
    }

    return true
  }

  // 验证短信验证码
  function validateCaptcha() {
    if (!form.captcha.trim()) {
      Message.warning('请输入短信验证码')
      return false
    }

    return true
  }

  // 验证登录密码
  function validatePassword() {
    if (!form.password) {
      Message.warning('请输入登录密码')
      return false
    }

    return true
  }

  function startCaptchaCountdown() {
    captchaDisabled.value = true
    captchaTime.value = CAPTCHA_DURATION
    clearCaptchaTimer()

    captchaTimer.value = window.setInterval(() => {
      captchaTime.value -= 1

      if (captchaTime.value <= 0) {
        resetCaptchaState()
      }
    }, 1000)
  }

  // 点击获取验证码时，先弹出行为验证码
  function handleOpenBehaviorVerify() {
    if (captchaLoading.value || captchaDisabled.value) {
      return
    }

    if (!validatePhone()) {
      return
    }
    verifyRef.value?.show()
  }

  // 行为验证码通过后，才真正调用短信发送接口
  async function handleBehaviorVerifySuccess(payload: BehaviorVerifySuccessPayload) {
    try {
      captchaLoading.value = true
      await getSmsCaptcha(form.phone.trim(), {
        captchaVerification: payload.captchaVerification,
      })
      Message.success('验证码已发送，请注意查收')
      startCaptchaCountdown()
    } catch {
      resetCaptchaState()
    } finally {
      captchaLoading.value = false
    }
  }

  // 提交注册，密码继续按现有 RSA 规则加密后再发送
  async function handleRegister() {
    if (!validateUsername() || !validatePhone() || !validateCaptcha() || !validatePassword()) {
      return
    }

    try {
      loading.value = true
      await registerPortalUser({
        username: form.username.trim(),
        phone: form.phone.trim(),
        captcha: form.captcha.trim(),
        password: encryptByRsa(form.password) || '',
      })
      Message.success('注册成功，请登录')
      await router.push('/auth/login')
    } finally {
      loading.value = false
    }
  }

  onBeforeUnmount(() => {
    clearCaptchaTimer()
  })

  return {
    form,
    loading,
    captchaLoading,
    captchaDisabled,
    captchaButtonText,
    verifyRef,
    handleOpenBehaviorVerify,
    handleBehaviorVerifySuccess,
    handleRegister,
  }
}
