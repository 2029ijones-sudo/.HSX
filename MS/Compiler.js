const MSCompiler = (() => {
  // Helper: clean and normalize lines
  function cleanLines(text) {
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('//')); // remove empty lines and comments
  }

  // Parse raw .MS content into JS object
  function parse(msText) {
    const lines = cleanLines(msText);
    const mod = {
      stats: {},
      onLoad: {},
      state: {},
      update: {},
      loaded: false,
      moddedItems: [],
      createdItems: [],
      errors: []
    };

    let currentSection = null;
    let currentCustomItem = null;

    for (let line of lines) {
      // === MOD LOAD ===
      if (line.startsWith('mod load')) {
        const logoMatch = line.match(/logo:(\w+)/);
        if (logoMatch) mod.logo = logoMatch[1];
      } else if (line.startsWith('item name')) {
        mod.name = line.replace('item name', '').trim();
      } else if (line.startsWith('mod load appear message')) {
        mod.startupMessage = line.replace('mod load appear message', '').trim();
      }

      // === MOD CUSTOM STATS ===
      else if (line.startsWith('mod custom')) {
        const statName = line.replace('mod custom', '').trim();
        currentSection = 'stats';
        if (!mod.stats[statName]) mod.stats[statName] = {};
        currentCustomItem = statName;
      } else if (/^(power|health|swordPower|rotating|turning)/.test(line)) {
        let [key, ...rest] = line.split(/\s+/);
        let val = rest.join(' ');

        if (!isNaN(parseFloat(val))) val = parseFloat(val);
        else if (val.toLowerCase() === 'true') val = true;
        else if (val.toLowerCase() === 'false') val = false;

        if (currentCustomItem) mod.stats[currentCustomItem][key] = val;
        else mod.stats[key] = val;
      }

      // === ONLOAD EVENTS ===
      else if (line.startsWith('mod upon loaded if failed:') || line.startsWith('fire_mods upon loaded:error')) {
        const msg = line.split(':').slice(1).join(':').trim();
        if (line.startsWith('fire_mods')) mod.errors.push(msg);
        else mod.onLoad.failed = msg;
      } else if (line.startsWith('mod upon loaded if succeed:') || line.startsWith('fire_mods upon loaded:success')) {
        const msg = line.split(':').slice(1).join(':').trim();
        mod.onLoad.success = msg;
      }

      // === MOD STATE ===
      else if (line.startsWith('new mod eq to')) {
        const parts = line.replace('new mod eq to', '').trim().split(':');
        mod.state.type = parts[0].trim();
        mod.state.logo = parts[1]?.trim() || mod.logo;
      }

      // === MOD UPDATE ===
      else if (line.startsWith('mod update eq date')) {
        const datePart = line.replace('mod update eq date', '').trim();
        mod.update.date = datePart.split('eq')[0].trim();
        mod.update.enabled = datePart.includes('true');
      } else if (line.startsWith('mod updated:success')) {
        mod.update.result = mod.update.result || {};
        mod.update.result.success = line.includes('true');
      } else if (line.startsWith('mod updated:failed')) {
        mod.update.result = mod.update.result || {};
        mod.update.result.failed = line.includes('true');
      }

      // === MOD LOADED FLAG ===
      else if (line.startsWith('mod loaded: equal')) {
        mod.loaded = line.includes('true');
      }

      // === MODDED ITEMS ===
      else if (line.startsWith('modded items eq create')) {
        currentSection = 'moddedItems';
      } else if (line.startsWith('create')) {
        // e.g., create super:sword png image eq sword:png
        const parts = line.split('eq').map(p => p.trim());
        mod.createdItems.push({
          name: parts[0].replace('create', '').trim(),
          image: parts[1] || null,
          enabled: parts[2] ? parts[2].toLowerCase() === 'true' : true
        });
      } else if (line.startsWith('mod items equal')) {
        mod.moddedItems.push(line.replace('mod items equal', '').trim());
      }
    }

    // Validate required fields
    if (!mod.name) throw new Error('MS Compiler Error: mod name is required.');
    if (!mod.logo) throw new Error('MS Compiler Error: mod logo is required.');

    return mod;
  }

  // Load .MS file from URL or path
  async function load(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const text = await response.text();
    return parse(text);
  }

  return { parse, load };
})();
