import React, { useRef, useState, useEffect, useMemo } from "react";
import s from './index.less'

export default function App() {
    const port = useRef(chrome.runtime.connect({ name: "content_script" }))
    const translateString = useRef('')
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [show, setShow] = useState(false)
    const [content, setContent] = useState()
    const contentStyle = useMemo(() => {
        const style = content ? {
            padding: 5,
            boxShadow: '0px 0px 5px red',
            minWidth: document.documentElement.offsetWidth / 4,
            color: 'red'
        } : {}
        return style
    }, [content])
    // 通信请求翻译
    const translate = () => {
        port.current.postMessage({ text: translateString.current || '' })
    }
    // 接收翻译信息
    const addMessageListener = () => {
        port.current.onMessage.addListener((msg) => {
            if (msg.success) {
                let res = ''
                msg.msg.forEach((el) => {
                    res += el.dst
                })
                setContent(res)
                translateString.current = ''
            } else {
                setContent('服务器出错啦！')
            }
        })
    }
    // 防抖
    const debounce = (fn) => {
        let time = null
        return function () {
            if (time) clearTimeout(time)
            time = setTimeout(() => fn(), 500)
        }
    }
    // 选择文字
    const selection = () => {
        const string = document.getSelection().toString()
        translateString.current = string
        if (string) {
            setShow(true)
        } else {
            setShow(false)
        }
    }
    // 阻止事件继续传递
    const prevent = (e) => {
        e.stopPropagation()
    }
    // 鼠标抬起
    const mouseUp = (e) => {
        setShow(false)
        setPosition({ x: e.pageX, y: e.pageY })
        setContent('')
    }
    useEffect(() => {
        document.addEventListener('selectionchange', debounce(selection))
        document.addEventListener('mouseup', mouseUp)
        addMessageListener()
    }, [])
    return (
        <div
            className={s.box}
            onMouseUp={(e) => prevent(e)}
            style={{
                top: `${position.y - 50}px`,
                left: `${position.x}px`,
                display: show ? 'block' : 'none',
                maxWidth: document.documentElement.offsetWidth,
                ...contentStyle
            }}>
            {content ? content : <button onClick={translate}>翻译</button>}
        </div>
    )
}