import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'

const publicKey
  = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAM51dgYtMyF+tTQt80sfFOpSV27a7t9u'
  + 'aUVeFrdGiVxscuizE7H8SMntYqfn9lp8a5GH5P1/GGehVjUD2gF/4kcCAwEAAQ=='

const defaultAesKey = 'XwKsGlMcdPMEhR1B'

/** 和后台管理保持同一套 RSA 公钥 */
export function encryptByRsa(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(txt)
}

// 行为验证码校验参数走 AES 加密，算法和 admin 端保持一致
export function encryptByAes(word: string, keyWord = defaultAesKey) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const value = CryptoJS.enc.Utf8.parse(word)

  return CryptoJS.AES.encrypt(value, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
}
