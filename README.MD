# HSX VS Code Extension

![HSX Logo](icon/logo.png)

---

![GitHub Checks](https://img.shields.io/github/checks-status/sussybocca/.HSX/main)

---

## 🧩 Overview

**HSX** is a lightweight, flexible scripting language powered by a JavaScript runtime engine (`hsx-runtime.js`).  
It is designed to make building websites, tools, and interactive applications **fast, simple, and human-friendly**.

HSX is not just a file format — it is a **runtime-based language**.  
Everything HSX does is driven by its runtime, which means you don’t need a compiler, build step, or complex toolchain.

HSX combines:
- HTML-like structure
- JavaScript execution
- Python via Pyodide
- Modules, workflows, data, metadata, emotions, and media  

into a **single unified scripting experience**.

With HSX, you can:
- Create `.hsx` programs that control entire applications
- Combine JavaScript, Python, UI, and logic in one file
- Build systems without strict syntax rules or heavy debugging overhead
- Run HSX anywhere a browser or JS engine exists

---

## ✨ Why HSX?

Traditional languages are strict, complex, and time-consuming.  
HSX is built for **speed, creativity, and accessibility**.

HSX avoids:
- Rigid syntax errors
- Long setup processes
- Heavy frameworks
- Painful debugging loops

Instead, HSX focuses on:
- **Human-readable commands**
- **Flexible execution**
- **Fast prototyping**
- **Low mental load**

This makes HSX especially useful for beginners, rapid builders, and people who struggle with the strictness of traditional coding environments.

---

## 🚀 Core Features

### Language & Runtime
- **Custom runtime engine** (`hsx-runtime.js`)
- No compiler required — load and execute directly
- Runs in browsers and JavaScript environments

### Integrated Systems
- JavaScript execution blocks `{js }`
- Python execution blocks `{py }` via Pyodide
- HSX control blocks `{hsx }`
- Media attachment (images, audio, video)
- Components and UI rendering
- Module system with `.ps` and `.ks` modules
- Fun Mode (multi-code execution blocks)
- Data export system
- Metadata system
- Emotion system (symbol-based reactions)
- Custom storage and databases
- Workflow and automation support

### Developer Experience
- Extremely forgiving syntax
- Minimal error interruptions
- Designed for rapid creation and experimentation
- Easy learning curve

---

## 🧰 VS Code Extension Features

- Syntax highlighting for HSX
- Custom HSX commands and blocks
- Quick creation of new `.hsx` files
- Template generation with runtime included
- Bundled dependencies and runtime setup

---

## 📦 Installation

1. Download the latest `.vsix` package from  
   **HSX Releases**  
   https://github.com/sussybocca/.HSX/releases
2. In VS Code:
   - Open **Extensions**
   - Click **...** (top-right)
   - Select **Install from VSIX...**
3. Choose the downloaded file
4. Reload VS Code

---

## 🧪 Usage

### Create a New HSX File
- Press `Ctrl+Shift+P` / `Cmd+Shift+P`
- Run **Create New HSX File**
- Start writing your HSX program

### Run HSX in a Web Page

```html
<script src="hsx-runtime.js"></script>
<script>
  const hsx = new HSXRuntime();
  hsx.load("app.hsx");
</script>
No build tools.
No compilation.
Just load and run.

🗂 Recommended Project Structure
text
Copy code
project/
├─ index.html
├─ engine/
│  └─ hsx-runtime.js
├─ site/
│  └─ app.hsx
├─ Pages/
│  └─ content.txt
└─ .github/
   └─ workflows/
      └─ publish.yml
🧠 Philosophy
HSX proves that you don’t need to publish a new programming language to change how people code.
All you need is a powerful runtime and a better way of thinking about software.

HSX makes coding:

Faster

Easier

Less stressful

More creative

© 2026 HSX Project
All rights reserved.
