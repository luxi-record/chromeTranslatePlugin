**插件项目说明(谷歌翻译小插件借助百度翻译API)**：

1. 首先执行 npm run install 安装依赖
2. 再执行 npm run build 生成translatePlugin文件，打开chrome浏览器的扩展程序，加载生成的translatePlugin文件
3. 刷新或者关闭重启浏览器就可以使用插件功能。（***新装了插件扩展一定要刷新页面或者重启浏览器代码功能才生效***）

**浏览器扩展开发，文件夹必须包含`manifest.json`配置描述文件，插件中最主要的三个东西**（popup，background，content）

1. **popup**

   当我们安装一个浏览器扩展时候，我们可以走右上角的一个扩展图标找到我们刚安装的扩展（可以将扩展固定在右上角），当我们点击我们的扩展插件时候会弹出一个页面，这个就是我们的popup.html，我们可以在popup.html中引入js实现一些交互功能。

   我们可以通过popup和background.js进行通信，popup是控制不到我们的浏览器页面的。

2. **background**

   background是运行在浏览器后台脚本，我们可以通过它访问[WebExtension API](https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/API)，可以进行一些fetch请求等。但是它也不可以修改和访问页面的dom和执行上线文。background也可以拥有自己的html页面。

3. **content**

   content是一个运行在页面上的脚本，它可以修改页面。它可以通过chrome.runtime等api和background通信。
   content可调用的api： **chrome.runtime**, **storage**, **i18n**

**一个简单的manifest.json配置**：

```javascript
{
    "version": "1.0",
    "name": "Translate Plugin",
    "manifest_version": 3, // 前面三个是必要字段
    "description": "This is a tool for translate EN to CN or CN to EN",
    "action": { // 代表当前插件在浏览器中（右上角）的悬浮页，图标以及title
        "default_popup": "popup.html",
        "default_icon": "logo/logo.png",
        "default_title": "Translate Pliugin"
    },
    "background": { // 后台运行的脚本，不可访问DOM
        "service_worker": "js/background.js"
        "persistent": false // 是否持久
    },
    "icons": {
        "16": "logo/logo.png"
    },
    "content_scripts": [ // 页面内容脚本，可以访问DOM,插入到目标页面中执行的js
        {
            "matches": [ // 满足matches匹配的域名
                "<all_urls>"
            ],
            "js": [
                "js/content.js"
            ],
            "css": ["inject.css"],
            "run_at": "document_start" // 在文档开始时候执行 | document_idle闲置，| document_end 结束时候
        }
    ],
    "devtools_page": "devtools.html", // 类似点开F12弹出的控制台页面
    // 需要用到的chrome的api
    "permissions": [
        "contextMenus", // 右键菜单
        "declarativeContent", //
		"tabs", // 标签
		"notifications", // 通知
		"webRequest", // web请求
		"webRequestBlocking",
		"storage", // 插件本地存储
        "proxy",
        "declarativeNetRequest"
    ],
    // 右键插件图标时弹出的选项链接到的配置页面
    "options_ui": {
        "page": "options.html",
        "open_in_tab": true // 是否新开一个tab
    },
    // 打开插件的快捷命令
    "commands": {
        "_execute_action": {
            "suggested_key": {
                "default": "Ctrl+Shift+F",
                "mac": "MacCtrl+Shift+F"
            },
            "description": "Opens hello.html"
        }
    }
}
```