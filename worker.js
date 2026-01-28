// worker.js - Updated with YOUR GitHub URL
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Serve the runtime file directly from YOUR GitHub repo
    if (url.pathname === '/hsx-runtime.js') {
      // Always fetch fresh from GitHub
      const runtimeContent = await fetchRuntimeFromGitHub();
      return new Response(runtimeContent, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=60', // 1 minute cache
          'X-HSX-Source': 'https://raw.githubusercontent.com/2029ijones-sudo/.HSX/main/frontend/hsx-runtime.js'
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
      const runtimeContent = await fetchRuntimeFromGitHub();
      const versionMatch = runtimeContent.match(/HSX v([\d.]+)/) || runtimeContent.match(/v([\d.]+) FULL/);
      
      return new Response(JSON.stringify({
        version: versionMatch ? versionMatch[1] : '0.72+',
        source: 'https://raw.githubusercontent.com/2029ijones-sudo/.HSX/main/frontend/hsx-runtime.js',
        updated: new Date().toISOString(),
        endpoints: ['/hsx-runtime.js', '/api/execute', '/api/load', '/api/version', '/health']
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 5. Health check
    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }
    
    // Default: Show usage with YOUR URL
    const workerUrl = new URL(request.url);
    return new Response(`
HSX Runtime API Worker
=====================
Runtime Source: https://raw.githubusercontent.com/2029ijones-sudo/.HSX/main/frontend/hsx-runtime.js
Worker URL: ${workerUrl.origin}

USAGE:
1. In HTML:
<script src="${workerUrl.origin}/hsx-runtime.js"></script>
<script>
  const hsx = new HSXRuntime();
  hsx.execute('hsx define component Hello\\n<h1>HSX via API</h1>\\nhsx end');
</script>

2. Execute code via API:
curl -X POST ${workerUrl.origin}/api/execute \\
  -H "Content-Type: application/json" \\
  -d '{"code": "hsx define component Test\\\\nHello API\\\\nhsx end"}'

3. Load HSX file via API:
curl -X POST ${workerUrl.origin}/api/load \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/file.hsx"}'

Auto-updates when GitHub file changes.
    `.trim(), {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Fetch runtime directly from YOUR GitHub
async function fetchRuntimeFromGitHub() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/2029ijones-sudo/.HSX/main/frontend/hsx-runtime.js',
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub fetch failed: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch from GitHub:', error);
    // Fallback to embedded version
    return getFallbackRuntime();
  }
}

// Handle execution
async function handleExecute(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { code } = await request.json();
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'No code provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Load runtime from YOUR GitHub
    const runtimeCode = await fetchRuntimeFromGitHub();
    
    // Execute in worker context
    const result = await executeHSXInWorker(runtimeCode, code);
    
    return new Response(JSON.stringify({
      success: true,
      output: result.output,
      components: Object.keys(result.components || {}),
      data: result.data,
      runtime: result.runtimeVersion,
      timestamp: new Date().toISOString()
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
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
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
    
    // Load runtime from YOUR GitHub
    const runtimeCode = await fetchRuntimeFromGitHub();
    
    // Execute the loaded code
    const result = await executeHSXInWorker(runtimeCode, hsxCode);
    
    return new Response(JSON.stringify({
      success: true,
      loaded: true,
      sourceUrl: url,
      components: Object.keys(result.components || {}),
      data: result.data,
      runtime: result.runtimeVersion
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
  // Extract version
  const versionMatch = runtimeCode.match(/HSX v([\d.]+)/) || runtimeCode.match(/v([\d.]+) FULL/);
  const runtimeVersion = versionMatch ? versionMatch[1] : '0.72+';
  
  try {
    // Create a sandbox environment
    const sandbox = {
      console: {
        log: (...args) => ({ type: 'log', args }),
        error: (...args) => ({ type: 'error', args })
      },
      document: {
        body: {
          appendChild: () => ({ type: 'append' }),
          innerHTML: '',
          style: {}
        },
        createElement: (tag) => ({
          style: {},
          src: '',
          controls: false,
          width: 0,
          height: 0,
          innerHTML: ''
        })
      },
      fetch: async (url) => {
        return {
          ok: true,
          text: () => Promise.resolve('')
        };
      }
    };
    
    // Wrap runtime to work in worker
    const wrappedRuntime = runtimeCode
      .replace('window.HSXRuntime=HSXRuntime;', 'globalThis.HSXRuntime = HSXRuntime;')
      .replace(/window\.addEventListener\("DOMContentLoaded".*?}\)\);/gs, '')
      .replace(/if\(location\.search\.includes\("hsxFiles="\)\).*?hsx\.load\(location\.pathname\);/gs, '')
      .replace(/document\./g, 'globalThis.document.')
      .replace(/window\./g, 'globalThis.');
    
    // Create the execution script
    const script = `
try {
  ${wrappedRuntime}
  
  const hsx = new HSXRuntime();
  const logs = [];
  const errors = [];
  
  // Override console for capture
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push({ type: 'log', args: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)) });
  console.error = (...args) => errors.push({ type: 'error', args: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)) });
  
  // Execute the HSX code
  hsx.execute(\`${hsxCode.replace(/`/g, '\\`').replace(/\\/g, '\\\\').replace(/\n/g, '\\n')}\`);
  
  // Restore console
  console.log = originalLog;
  console.error = originalError;
  
  return {
    success: true,
    components: Object.keys(hsx.components),
    data: hsx.data,
    logs: logs,
    errors: errors
  };
} catch (e) {
  return {
    success: false,
    error: e.message,
    stack: e.stack
  };
}
`;
    
    // Execute in isolated context
    const func = new Function(...Object.keys(sandbox), script);
    const result = func(...Object.values(sandbox));
    
    return {
      success: result.success,
      output: result.success ? 'Execution completed' : result.error,
      components: result.components || [],
      data: result.data || {},
      logs: result.logs || [],
      errors: result.errors || [],
      runtimeVersion: runtimeVersion
    };
    
  } catch (error) {
    return {
      success: false,
      output: `Worker execution error: ${error.message}`,
      components: [],
      data: {},
      runtimeVersion: runtimeVersion
    };
  }
}

// Fallback runtime in case GitHub is down
function getFallbackRuntime() {
  return `// HSX Runtime Fallback v0.72+
console.log('HSX Runtime loaded (fallback mode)');
export class HSXRuntime {
  constructor() {
    console.log('HSX Runtime initialized - using fallback version');
  }
  async execute(code) {
    console.log('HSX code executed (fallback):', code.substring(0, 50) + '...');
    return { success: true };
  }
}`;
}
