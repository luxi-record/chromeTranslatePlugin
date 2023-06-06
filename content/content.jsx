import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const div = document.createElement('div')
div.id = 'chrome-plugin-root'
div.setAttribute('style', 'position: absolute;z-index: 9999;')
document.body.insertBefore(div, document.body.children[0])

const root = ReactDOM.createRoot(document.getElementById('chrome-plugin-root'));
root.render(<App />)