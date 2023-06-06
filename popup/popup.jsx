import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import s from './popup.less'

function Popup() {
    const [language, setLanguage] = useState('en')
    const radioChange = (e) => {
        setLanguage(e.target.value)
        chrome.runtime.sendMessage({type: e.target.value})
    }
    const getType = () => {
        chrome.runtime.sendMessage({isGetType: true}, (msg) => {
            if(msg?.type){
                setLanguage(msg.type) 
            }
        })
    }
    useEffect(() => {
        getType()
    }, [])
    return (
        <div className={s.box}>
            <div className={s.radio}>
                <input type={'radio'} name={'language'} checked={language === 'en'} value={'en'} id={'en'} onClick={(e) => radioChange(e)} />
                <label for={'en'}>英文</label>
            </div>
            <div className={s.radio}>
                <input type={'radio'} name={'language'} checked={language === 'zh'} value={'zh'} id={'zh'} onClick={(e) => radioChange(e)} />
                <label for={'zh'}>中文</label>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('box'))
root.render(<Popup />)
