// worker.js - Deployed from same repo as hsx-runtime.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Serve the runtime file directly from repo
    if (url.pathname === '/hsx-runtime.js') {
      // Read from the actual file in the repo
      const runtimeContent = await readFileFromRepo('./frontend/hsx-runtime.js');
      return new Response(runtimeContent, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }
    
    // 2. Execute API endpoint
    if (url.pathname === '/api/execute') {
      return handleExecute(request);
    }
    
    // 3. Load API endpoint
    if (url.pathname === '/api/load') {
      return handleLoad(request);
    }
    
    // 4. Get version
    if (url.pathname === '/api/version') {
      return new Response(JSON.stringify({
        version: '0.72+',
        updated: new Date().toISOString(),
        endpoints: ['/hsx-runtime.js', '/api/execute', '/api/load', '/api/version']
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 5. Health check
    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }
    
    // Default: Show usage
    return new Response(`
HSX Runtime API Worker
=====================
Usage:
1. Include in HTML: <script src="https://your-worker.workers.dev/hsx-runtime.js"></script>
2. Execute code: POST /api/execute with JSON { "code": "hsx ..." }
3. Load files: POST /api/load with JSON { "url": "..." }

The runtime auto-updates when you push to repo.
    `.trim(), {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Helper to read file from the same repo (Cloudflare Workers specific)
async function readFileFromRepo(filePath) {
  // In Cloudflare Workers, files in the same deployment are accessible
  // You need to configure wrangler.toml to include the frontend folder
  
  // Method 1: Using import if configured as module
  // return (await import(filePath)).default;
  
  // Method 2: Using KV if you stored it there
  // return await env.HSX_RUNTIME.get('content');
  
  // Method 3: Using R2 if you stored it there
  // const object = await env.HSX_BUCKET.get(filePath);
  // return await object.text();
  
  // Method 4: Direct fetch from repo (if public)
  const repoUrl = `https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/${filePath}`;
  const response = await fetch(repoUrl);
  return await response.text();
}

// Handle execution
async function handleExecute(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { code } = await request.json();
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'No code provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Load runtime
    const runtimeCode = await readFileFromRepo('./frontend/hsx-runtime.js');
    
    // Execute in isolated context
    const result = await executeHSXInWorker(runtimeCode, code);
    
    return new Response(JSON.stringify({
      success: true,
      output: result.output,
      components: result.components,
      data: result.data
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle loading external HSX files
async function handleLoad(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { url } = await request.json();
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'No URL provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch the HSX file
    const response = await fetch(url);
    const hsxCode = await response.text();
    
    // Load runtime
    const runtimeCode = await readFileFromRepo('./frontend/hsx-runtime.js');
    
    // Execute the loaded code
    const result = await executeHSXInWorker(runtimeCode, hsxCode);
    
    return new Response(JSON.stringify({
      success: true,
      loaded: true,
      url: url,
      components: result.components,
      data: result.data
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Execute HSX in worker context
async function executeHSXInWorker(runtimeCode, hsxCode) {
  // Create a simple sandbox
  const sandbox = {
    console: {
      log: (...args) => console.log('[HSX]', ...args),
      error: (...args) => console.error('[HSX]', ...args)
    },
    document: {
      body: {
        appendChild: () => {},
        innerHTML: '',
        style: {}
      },
      createElement: (tag) => ({
        style: {},
        src: '',
        controls: false
      })
    },
    fetch: fetch,
    Date: Date,
    JSON: JSON
  };
  
  // Wrap the runtime code to work in worker
  const wrappedRuntime = runtimeCode
    .replace('window.HSXRuntime=HSXRuntime;', 'globalThis.HSXRuntime = HSXRuntime;')
    .replace('window.addEventListener("DOMContentLoaded"', '// DOM event removed')
    .replace(/document\./g, 'globalThis.document.')
    .replace(/window\./g, 'globalThis.');
  
  // Execute the runtime
  const executeCode = `
${wrappedRuntime}

// Create instance and execute
const hsx = new HSXRuntime();
hsx.execute(\`${hsxCode.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`);

// Return results
return {
  components: hsx.components,
  data: hsx.data,
  context: hsx.context
};
`;
  
  try {
    // Use Function constructor for isolation
    const func = new Function(...Object.keys(sandbox), executeCode);
    const result = func(...Object.values(sandbox));
    
    return {
      output: 'Execution completed',
      components: result.components || {},
      data: result.data || {}
    };
  } catch (error) {
    return {
      output: `Error: ${error.message}`,
      components: {},
      data: {}
    };
  }
}
