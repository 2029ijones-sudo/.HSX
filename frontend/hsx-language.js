// ====================================================
// Mist HSX — Browser Runtime Mega File
// ====================================================

// 🧩 Core Engine
class HSXEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId) || document.body;
    this.components = {};
    this.renders = [];
    this.meta = {};
    this.state = {};
    this.imported = new Set();
  }

  async run(hsxText, fromFile = null) {
    const lines = hsxText.split("\n");
    for (const line of lines) {
      await this.parseLine(line.trim(), fromFile);
    }
    this.renderAll();
  }

  async parseLine(line, fromFile) {
    if (!line || line.startsWith("//")) return;

    // === Comments ===
    if (line.startsWith("hsx comment")) {
      console.log("💬", line.match(/"(.+)"/)?.[1]);
    }

    // === Meta ===
    else if (line.startsWith("hsx meta")) {
      const [, key, val] = line.match(/hsx meta (\w+) "(.*?)"/) || [];
      if (key && val) {
        this.meta[key] = val;
        if (key === "title") document.title = val;
      }
    }

    // === Imports ===
    else if (line.startsWith("hsx import")) {
      const match = line.match(/"(.*?)"/);
      if (!match) return;
      const path = match[1];
      if (this.imported.has(path)) return;
      this.imported.add(path);
      const res = await fetch(path);
      const text = await res.text();
      await this.run(text, path);
    }

    // === Component Definition ===
    else if (line.startsWith("hsx define component")) {
      const name = line.split(" ")[3];
      this.currentComponent = { name, content: "" };
    } else if (line === "hsx end") {
      if (this.currentComponent) {
        this.components[this.currentComponent.name] = this.currentComponent.content;
        this.currentComponent = null;
      }
    } else if (this.currentComponent) {
      this.currentComponent.content += line + "\n";
    }

    // === Render ===
    else if (line.startsWith("hsx render")) {
      const name = line.split(" ")[2];
      this.renders.push(name);
    }

    // === Attach ===
    else if (line.startsWith("hsx attach")) {
      const [type, url] = line.match(/"(.*?)"/g).map(s => s.replace(/"/g, ""));
      this.attachMedia(line, type, url);
    }

    // === JS Blocks ===
    else if (line.startsWith("{js")) {
      this.inJS = true;
      this.jsBuffer = "";
    } else if (this.inJS && line.startsWith("}")) {
      this.inJS = false;
      this.runJS(this.jsBuffer);
    } else if (this.inJS) {
      this.jsBuffer += line + "\n";
    }

    // === State Declaration ===
    else if (line.startsWith("hsx state")) {
      const [, key, val] = line.match(/hsx state (\w+)\s*=\s*(.*)/) || [];
      if (key) this.state[key] = eval(val);
    }
  }

  // === Media Handler ===
  attachMedia(line, type, url) {
    if (line.includes("image")) {
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "100%";
      this.container.appendChild(img);
    } else if (line.includes("video")) {
      const vid = document.createElement("video");
      vid.src = url;
      vid.controls = true;
      this.container.appendChild(vid);
    }
  }

  // === JS Execution ===
  runJS(code) {
    try { new Function(code)(); }
    catch (e) { console.error("🛑 JS error:", e); }
  }

  // === Rendering ===
  renderAll() {
    for (const name of this.renders) {
      const content = this.components[name];
      if (!content) continue;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = this.interpolateProps(content);
      this.container.appendChild(wrapper);
    }
  }

  interpolateProps(content) {
    return content.replace(/{prop:(\w+)}/g, (match, key) => {
      return this.currentProps?.[key] || "";
    });
  }

  // === State Management ===
  setState(key, val) {
    this.state[key] = val;
    document.querySelectorAll(`[data-state="${key}"]`).forEach(el => {
      el.textContent = val;
    });
  }
}

// ====================================================
// 🔧 Optional Helper for Loading Main File
// ====================================================

window.addEventListener("DOMContentLoaded", async () => {
  const engine = new HSXEngine("app");
  window.engine = engine;
  const res = await fetch("main.hsx");
  const text = await res.text();
  await engine.run(text);
});
