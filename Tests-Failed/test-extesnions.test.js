/**
 * MyHSX_Extension.js
 * Advanced frontend language extension for HSX
 * Version 1.0.0
 */

class MyHSXHelpers {
    // === Component Helpers ===
    static card(title, content, color = "#eee", width = "300px") {
        return `<div style="border:1px solid #333; padding:10px; margin:10px; width:${width}; background:${color}; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.2)">
                  <h3>${title}</h3>
                  <p>${content}</p>
                </div>`;
    }

    static modal(title, content, id = "modal") {
        return `<div id="${id}" style="position:fixed; top:0; left:0; width:100%; height:100%; display:none; justify-content:center; align-items:center; background:rgba(0,0,0,0.6);">
                  <div style="background:white; padding:20px; border-radius:8px; max-width:400px;">
                    <h3>${title}</h3>
                    <p>${content}</p>
                    <button onclick="document.getElementById('${id}').style.display='none'">Close</button>
                  </div>
                </div>`;
    }

    static alertBox(message, type="info") {
        const colors = {info:"#2196F3", success:"#4CAF50", warning:"#FF9800", error:"#F44336"};
        return `<div style="padding:10px; margin:10px 0; color:white; background:${colors[type]||colors.info}; border-radius:5px;">${message}</div>`;
    }

    // === Loop & Conditional Helpers ===
    static repeat(array, callback) {
        return array.map(callback).join('');
    }

    static ifElse(condition, trueBlock, falseBlock='') {
        return condition ? trueBlock : falseBlock;
    }

    // === DOM Helpers ===
    static createElement(tag, props={}, children=[]) {
        const el = document.createElement(tag);
        for (const key in props) el[key] = props[key];
        children.forEach(child => el.appendChild(child));
        return el;
    }

    static setHTML(selector, html) {
        const el = document.querySelector(selector);
        if(el) el.innerHTML = html;
    }

    static appendHTML(selector, html) {
        const el = document.querySelector(selector);
        if(el) el.innerHTML += html;
    }

    static remove(selector) {
        const el = document.querySelector(selector);
        if(el) el.remove();
    }

    // === Media Helpers ===
    static includeMedia(src, type='img', alt='') {
        switch(type) {
            case 'img': return `<img src="${src}" alt="${alt}" style="max-width:100%;"/>`;
            case 'video': return `<video src="${src}" controls style="max-width:100%;"></video>`;
            case 'audio': return `<audio src="${src}" controls></audio>`;
            default: return '';
        }
    }

    static preloadImages(...urls) {
        return urls.map(url => { const img=new Image(); img.src=url; return img; });
    }

    static playAudio(url) {
        const audio = new Audio(url);
        audio.play();
        return audio;
    }

    static createCanvas(width=300, height=150) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    // === Math Helpers ===
    static random(min=0,max=1) {
        return Math.random()*(max-min)+min;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static sum(array) {
        return array.reduce((acc,val)=>acc+val,0);
    }

    static average(array) {
        return array.length ? this.sum(array)/array.length : 0;
    }

    // === JS Utilities ===
    static debounce(func, wait=300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(()=>func(...args), wait);
        };
    }

    static throttle(func, limit=300) {
        let inThrottle;
        return (...args) => {
            if(!inThrottle){
                func(...args);
                inThrottle=true;
                setTimeout(()=>inThrottle=false, limit);
            }
        };
    }

    static sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    // === Python Integration (Pyodide) ===
    static runPython(pyCode) {
        if(!window.pyodide) return Promise.reject('Pyodide not loaded');
        return window.pyodide.runPythonAsync(pyCode);
    }

    // === Misc Helpers ===
    static log(msg) { console.log("💬 MyHSX Log:", msg); }
    static warn(msg) { console.warn("⚠️ MyHSX Warning:", msg); }
    static error(msg) { console.error("❌ MyHSX Error:", msg); }
}

// === Export Global Object ===
const MyHSX = {
    Helpers: MyHSXHelpers,
    version: "1.0.0"
};

export default MyHSX;
