export const APP_ENV = process.env.NEXT_PUBLIC_ENV || 'development'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === 'true'
export const PAGE_KEY = Date.now()
export const BUILD_RUN_ID = process.env.NEXT_PUBLIC_BUILD_RUN_ID

// 静态资源文件
export const STATIC_SOURCE_URL = process.env.NEXT_PUBLIC_STATIC_SOURCE_URL || ''

// 品牌域名
export const BRAND_DOMAIN = process.env.NEXT_PUBLIC_BRAND_DOMAIN || ''
export const IS_DEV_MODE = process.env.NEXT_PUBLIC_IS_DEV_MODE === 'true'

// 否开启VSconsole调试
export const SHOW_VCONSOLE = process.env.NEXT_PUBLIC_SHOWVCONSOLE === 'true'

// google授权登录相关
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
export const GOOGLE_REDIRECT_URI = '/auth/google'
export const GOOGLE_SCOPE = 'profile email'

// datadog
// RUM管理: https://app.datadoghq.eu/rum/list?fromUser=false&refresh_mode=sliding&from_ts=1749978230964&to_ts=1750064630964&live=true
// logs接入: https://app.datadoghq.eu/logs/onboarding/client
// Client Tokens: https://app.datadoghq.eu/organization-settings/client-tokens
export const DATADOG_SITE = process.env.NEXT_PUBLIC_DATADOG_SITE
export const DATADOG_SERVICE = process.env.NEXT_PUBLIC_DATADOG_SERVICE
export const DATADOG_RUM_APPID = process.env.NEXT_PUBLIC_DATADOG_RUM_APPID
export const DATADOG_RUM_CLIENTTOKEN = process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENTTOKEN
//  上报RUM的用户userId
export const DATADOG_RUM_ALLOWEDUSERS = process.env.NEXT_PUBLIC_DATADOG_RUM_ALLOWEDUSERS?.split?.(',') || []
export const DATADOG_LOG_CLIENTTOKEN = process.env.NEXT_PUBLIC_DATADOG_LOG_CLIENTTOKEN

// 在任何地方都能用
export const IS_SERVER_RUNTIME = typeof window === 'undefined'
export const IS_CLIENT_RUNTIME = typeof window !== 'undefined'

// token 的变量名
export const STORAGE_TOKEN_KEY = 'token'
// HOOKS id 全局变量
export const GLOBAL_URL_PARAMS = {
  HOOKS_ID: '',
}
