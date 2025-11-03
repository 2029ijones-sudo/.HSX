// MistDB_Frontend.js - Ultimate Frontend Database & Language Extension for Mist.hsx

/**
 * MistDB - Frontend-only in-browser database using localStorage
 * Automatically stores and retrieves user code without files
 */
class MistDB {
    constructor(dbName = 'MistHSX_DB') {
        this.dbName = dbName;
        const existing = localStorage.getItem(this.dbName);
        this.data = existing ? JSON.parse(existing) : { users: {} };
    }

    save() {
        localStorage.setItem(this.dbName, JSON.stringify(this.data));
    }

    addUser(userId, userCode = '') {
        if (!this.data.users[userId]) {
            this.data.users[userId] = { code: userCode, createdAt: new Date() };
            this.save();
            return true;
        }
        return false;
    }

    updateUserCode(userId, userCode) {
        if (this.data.users[userId]) {
            this.data.users[userId].code = userCode;
            this.data.users[userId].updatedAt = new Date();
            this.save();
            return true;
        }
        return false;
    }

    getUserCode(userId) {
        return this.data.users[userId] ? this.data.users[userId].code : null;
    }

    deleteUser(userId) {
        if (this.data.users[userId]) {
            delete this.data.users[userId];
            this.save();
            return true;
        }
        return false;
    }

    listUsers() {
        return Object.keys(this.data.users);
    }

    // Versioning system for user code
    addVersion(userId, codeVersion) {
        if (!this.data.users[userId]) return false;
        if (!this.data.users[userId].versions) this.data.users[userId].versions = [];
        this.data.users[userId].versions.push({ code: codeVersion, timestamp: new Date() });
        this.save();
        return true;
    }

    getVersions(userId) {
        return this.data.users[userId]?.versions || [];
    }
}

/**
 * MistSyntax - Advanced frontend helpers for HSX
 */
class MistSyntax {
    static wrapJS(code) {
        return `<script type="text/javascript">\n${code}\n</script>`;
    }

    static wrapHTML(html) {
        return `<div>${html}</div>`;
    }

    static wrapCSS(css) {
        return `<style>\n${css}\n</style>`;
    }

    static wrapAnimation(cssAnim) {
        return `<style>\n@keyframes ${cssAnim.name} { ${cssAnim.keyframes} }\n</style>`;
    }

    static ifElse(condition, trueBlock, falseBlock = '') {
        return condition ? trueBlock : falseBlock;
    }

    static loop(array, callback) {
        return array.map(callback).join('');
    }

    static includeMedia(src, type = 'img', alt = '') {
        switch (type) {
            case 'img': return `<img src="${src}" alt="${alt}"/>`;
            case 'video': return `<video src="${src}" controls></video>`;
            case 'audio': return `<audio src="${src}" controls></audio>`;
            default: return '';
        }
    }

    static dynamicImport(url) {
        return import(url);
    }

    static runPython(pyCode) {
        if (!window.pyodide) return Promise.reject('Pyodide not loaded');
        return window.pyodide.runPythonAsync(pyCode);
    }

    static debounce(func, wait = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    static throttle(func, limit = 300) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    static createElement(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        for (const key in props) el[key] = props[key];
        children.forEach(child => el.appendChild(child));
        return el;
    }
}

/**
 * MistMedia - Frontend media and animation support
 */
class MistMedia {
    static preloadImages(...urls) {
        return urls.map(url => {
            const img = new Image();
            img.src = url;
            return img;
        });
    }

    static createCanvas(width = 300, height = 150) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    static playAudio(url) {
        const audio = new Audio(url);
        audio.play();
        return audio;
    }
}

/**
 * Mist.hsx Extended API
 */
const Mist = {
    DB: MistDB,
    Syntax: MistSyntax,
    Media: MistMedia,
    version: '1.0.0-frontend-max'
};

// Example: Auto-load Pyodide for Python integration
if (!window.pyodide) {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
    script.onload = async () => {
        window.pyodide = await loadPyodide();
        console.log('Pyodide loaded!');
    };
    document.head.appendChild(script);
}

export default Mist;
