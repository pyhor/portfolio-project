import english from '../../public/locales/en.json'
import simplifiedChinese from '../../public/locales/zh-cn.json'
import traditionalChinese from '../../public/locales/zh-tw.json'
import cantonese from '../../public/locales/yue-hk.json'
import malay from '../../public/locales/ms.json'

// Every supported language is available before the first render and offline.
export const CATALOGS = { en: english, 'zh-cn': simplifiedChinese, 'zh-tw': traditionalChinese, 'yue-hk': cantonese, ms: malay }
