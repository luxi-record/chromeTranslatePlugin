import MD5 from './md5'
// 百度翻译api信息
const appid = '20220825001319281', key = 'MYxDRId8nt4pnPQ35ji9', salt = (new Date).getTime()
function getURL(url, obj) {
    const str = Object.keys(obj).reduce((pre, c) => String(pre) + `${c}=${obj[c]}&`, '?').slice(0, -1)
    return url + str
}

let types = 'en'
// 通过popup设置翻译语言
chrome.runtime.onMessage.addListener((msg, sender, sendMessage) => {
    const { type, isGetType } = msg
    types = type || types
    sendMessage({ type: isGetType && types })
    return true
})

// fetch请求翻译
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (msg) => {
        const { text } = msg, url = "http://api.fanyi.baidu.com/api/trans/vip/translate", sign = MD5(appid + text + salt + key)
        const params = {
            q: encodeURI(text),
            from: 'auto',
            to: types,
            appid,
            salt,
            sign
        }
        const result = await fetch(getURL(url, params), { method: 'GET' }).then((res) => res.json())
        if (result.error_msg) {
            port.postMessage({ msg: '翻译失败！', err: result.error_msg, success: false})
        } else {
            port.postMessage({ msg: result.trans_result, success: true })
        }
    });
})