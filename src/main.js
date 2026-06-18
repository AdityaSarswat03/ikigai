import './style.css';

// --------------------------------------------------
// DATA DEFINITIONS
// --------------------------------------------------

const pipelineSteps = [
  { id: 1, name: 'Validating Input', tooltip: 'Verify JSON parameter schema validity', duration: 400 },
  { id: 2, name: 'Loading & Parsing', tooltip: 'Compile specification and extract Markdown properties', duration: 500 },
  { id: 3, name: 'Recalling Context', tooltip: 'Scan system brain database for templates', duration: 400 },
  { id: 4, name: 'gap_scanner', tooltip: 'Analyze schema API coverage and security loopholes', duration: 600 },
  { id: 5, name: 'Planning Steps', tooltip: 'Generate compilation pipeline plan', duration: 300 },
  { id: 6, name: 'Generating Examples', tooltip: 'Synthesize LLM demonstration tool prompts', duration: 500 },
  { id: 7, name: 'Enriching (parallel)', tooltip: 'Run 13 workers in parallel to populate details', duration: 800 },
  { id: 8, name: 'Collecting Results', tooltip: 'Merge outputs from parallel runners', duration: 300 },
  { id: 9, name: 'Applying Patches', tooltip: 'Apply 7 manual patches to final schema', duration: 400 },
  { id: 10, name: 'Evaluating Quality', tooltip: 'Perform quality checks on documentation tags', duration: 500 },
  { id: 11, name: 'Reflecting on Progress', tooltip: 'Perform self-reflection logic checklist', duration: 400 },
  { id: 12, name: 'Writing Output', tooltip: 'Save compiled schema file to disk config folder', duration: 350 },
  { id: 13, name: 'Saving Results', tooltip: 'Write process metrics to SQLite history catalog', duration: 300 },
  { id: 14, name: 'dlq_processor', tooltip: 'Validate outstanding dead-letter messages', duration: 600 }
];

const logsData = [
  // Step 1
  { stepId: 1, type: 'info', msg: 'Enrichment run started | Logger: app' },
  { stepId: 1, type: 'step', msg: 'Validating Input' },
  { stepId: 1, type: 'info', msg: 'Checking JSON parameters: name="a", path="/configs/server.json"' },
  { stepId: 1, type: 'done', msg: 'Validating Input - complete' },
  // Step 2
  { stepId: 2, type: 'step', msg: 'Loading & Parsing' },
  { stepId: 2, type: 'info', msg: 'Parsing OpenAPI 3.0 specification file...' },
  { stepId: 2, type: 'info', msg: 'Found 3 tools loaded from spec' },
  { stepId: 2, type: 'done', msg: 'Loading & Parsing - complete' },
  // Step 3
  { stepId: 3, type: 'step', msg: 'Recalling Context' },
  { stepId: 3, type: 'info', msg: 'Searching local model storage for active project templates' },
  { stepId: 3, type: 'info', msg: 'Retrieved context parameters from brain storage' },
  { stepId: 3, type: 'done', msg: 'Recalling Context - complete' },
  // Step 4
  { stepId: 4, type: 'step', msg: 'gap_scanner' },
  { stepId: 4, type: 'info', msg: 'Scanning server schemas for missing property declarations' },
  { stepId: 4, type: 'info', msg: 'All validation criteria resolved. No gaps found.' },
  { stepId: 4, type: 'done', msg: 'gap_scanner - complete' },
  // Step 5
  { stepId: 5, type: 'step', msg: 'Planning Steps' },
  { stepId: 5, type: 'info', msg: 'Formulating step definitions for parallel pipeline runner' },
  { stepId: 5, type: 'done', msg: 'Planning Steps - complete' },
  // Step 6
  { stepId: 6, type: 'step', msg: 'Generating Examples' },
  { stepId: 6, type: 'info', msg: 'Generating tool calls examples for LLM model prompts' },
  { stepId: 6, type: 'done', msg: 'Generating Examples - complete' },
  // Step 7
  { stepId: 7, type: 'step', msg: 'Enriching (parallel)' },
  { stepId: 7, type: 'info', msg: 'Running parallel workers to update descriptions' },
  { stepId: 7, type: 'info', msg: '13 pipeline steps completed' },
  { stepId: 7, type: 'done', msg: 'Enriching (parallel) - complete' },
  // Step 8
  { stepId: 8, type: 'step', msg: 'Collecting Results' },
  { stepId: 8, type: 'info', msg: 'Collecting and filtering parallel outputs' },
  { stepId: 8, type: 'done', msg: 'Collecting Results - complete' },
  // Step 9
  { stepId: 9, type: 'step', msg: 'Applying Patches' },
  { stepId: 9, type: 'info', msg: 'Applying 7 patches to generated configuration schema...' },
  { stepId: 9, type: 'done', msg: 'Applying Patches - complete | 7 patches' },
  // Step 10
  { stepId: 10, type: 'step', msg: 'Evaluating Quality' },
  { stepId: 10, type: 'info', msg: 'Executing quality check metrics against LLM-descriptions' },
  { stepId: 10, type: 'done', msg: 'Evaluating Quality - complete' },
  // Step 11
  { stepId: 11, type: 'step', msg: 'Reflecting on Progress' },
  { stepId: 11, type: 'info', msg: 'Analyzing execution stack vs requirements' },
  { stepId: 11, type: 'done', msg: 'Reflecting on Progress - complete' },
  // Step 12
  { stepId: 12, type: 'step', msg: 'Writing Output' },
  { stepId: 12, type: 'info', msg: 'Writing outputs to final config file' },
  { stepId: 12, type: 'done', msg: 'Writing Output - complete' },
  // Step 13
  { stepId: 13, type: 'step', msg: 'Saving Results' },
  { stepId: 13, type: 'info', msg: 'Updating catalog history database' },
  { stepId: 13, type: 'done', msg: 'Saving Results - complete' },
  // Step 14
  { stepId: 14, type: 'step', msg: 'dlq_processor' },
  { stepId: 14, type: 'info', msg: 'Processing outstanding dead-letter queues...' },
  { stepId: 14, type: 'info', msg: 'DLQ processing finished. No outstanding items found.' },
  { stepId: 14, type: 'done', msg: 'dlq_processor - complete' }
];

// --------------------------------------------------
// GLOBAL STATE
// --------------------------------------------------
let currentSimulationTimeout = null;
let printedLogs = []; // Stores printed log objects {type, text}
let activeFilter = 'all';

// DOM Elements
const pipelineContainer = document.getElementById('pipeline-flow-container');
const logsTerminal = document.getElementById('logs-terminal');
const btnReplay = document.getElementById('btn-replay');
const btnCopyLogs = document.getElementById('btn-copy-logs');
const btnFinish = document.getElementById('btn-finish');
const filterChips = document.querySelectorAll('.filter-chip');

// --------------------------------------------------
// PIPELINE RENDERER
// --------------------------------------------------
function initPipelineElements() {
  pipelineContainer.innerHTML = '';
  
  pipelineSteps.forEach((step, idx) => {
    // 1. Create pipeline node
    const node = document.createElement('div');
    node.className = `pipeline-node status-pending`;
    node.id = `node-${step.id}`;
    node.setAttribute('data-tooltip', step.tooltip);
    
    // Status circle
    const statusIcon = document.createElement('div');
    statusIcon.className = 'node-status-icon';
    statusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="1"></circle>
      </svg>
    `;
    
    // Text label
    const nameSpan = document.createElement('span');
    nameSpan.className = 'pipeline-node-name';
    nameSpan.textContent = step.name;
    
    node.appendChild(statusIcon);
    node.appendChild(nameSpan);
    pipelineContainer.appendChild(node);
    
    // 2. Add connector line if not the last node
    if (idx < pipelineSteps.length - 1) {
      const connector = document.createElement('div');
      connector.className = 'pipeline-connector';
      connector.id = `connector-${step.id}`;
      connector.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      `;
      pipelineContainer.appendChild(connector);
    }
  });
}

// --------------------------------------------------
// TERMINAL RENDERER
// --------------------------------------------------
function printLogLine(type, message) {
  const logObj = { type, msg: message };
  printedLogs.push(logObj);
  
  // Render immediately if it matches the current active filter
  if (shouldShowLog(type, activeFilter)) {
    renderLogItem(logObj);
  }
}

function renderLogItem(log) {
  const row = document.createElement('div');
  row.className = `log-row log-${log.type}`;
  
  const prefixSpan = document.createElement('span');
  prefixSpan.className = 'log-prefix';
  prefixSpan.textContent = `[${log.type}]`;
  
  const msgSpan = document.createElement('span');
  msgSpan.className = 'log-message';
  msgSpan.textContent = log.msg;
  
  row.appendChild(prefixSpan);
  row.appendChild(msgSpan);
  
  // Insert before terminal cursor if it exists, otherwise append
  const cursor = logsTerminal.querySelector('.terminal-cursor');
  if (cursor) {
    logsTerminal.insertBefore(row, cursor);
  } else {
    logsTerminal.appendChild(row);
  }
  
  // Scroll to bottom
  logsTerminal.scrollTop = logsTerminal.scrollHeight;
}

function shouldShowLog(logType, filter) {
  if (filter === 'all') return true;
  if (filter === 'info' && logType === 'info') return true;
  if (filter === 'step' && logType === 'step') return true;
  if (filter === 'done' && logType === 'done') return true;
  return false;
}

function clearTerminal() {
  logsTerminal.innerHTML = '';
  // Append cursor
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';
  logsTerminal.appendChild(cursor);
  printedLogs = [];
}

function applyLogFilter(filter) {
  activeFilter = filter;
  
  // Highlight active filter chip
  filterChips.forEach(chip => {
    if (chip.getAttribute('data-filter') === filter) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  
  // Re-render terminal body excluding cursor
  const cursor = logsTerminal.querySelector('.terminal-cursor');
  logsTerminal.innerHTML = '';
  
  printedLogs.forEach(log => {
    if (shouldShowLog(log.type, filter)) {
      renderLogItem(log);
    }
  });
  
  if (cursor) {
    logsTerminal.appendChild(cursor);
  }
}

// --------------------------------------------------
// SIMULATION RUNNER
// --------------------------------------------------
function runSimulation() {
  // Clear any active running timeouts
  if (currentSimulationTimeout) {
    clearTimeout(currentSimulationTimeout);
  }
  
  clearTerminal();
  initPipelineElements();
  
  let currentStepIdx = 0;
  
  function executeNextStep() {
    if (currentStepIdx >= pipelineSteps.length) {
      // Final Finished State
      printLogLine('done', 'Server connection process completed successfully.');
      printLogLine('done', 'Your new MCP server "a" is fully operational.');
      
      // Update Stepper item visually (glowing success check or state)
      const lastStepItem = document.querySelector('.step-item.active');
      if (lastStepItem) {
        lastStepItem.classList.add('completed');
      }
      return;
    }
    
    const step = pipelineSteps[currentStepIdx];
    const nodeEl = document.getElementById(`node-${step.id}`);
    const connEl = document.getElementById(`connector-${step.id}`);
    
    // 1. Mark active
    nodeEl.className = 'pipeline-node status-processing';
    nodeEl.querySelector('.node-status-icon').innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
      </svg>
    `;
    if (connEl) connEl.classList.add('active');
    
    // 2. Stream logs associated with this step
    const stepLogs = logsData.filter(log => log.stepId === step.id);
    let logDelay = 0;
    
    stepLogs.forEach((log) => {
      setTimeout(() => {
        printLogLine(log.type, log.msg);
      }, logDelay);
      logDelay += step.duration / (stepLogs.length || 1);
    });
    
    // 3. Complete step after duration
    currentSimulationTimeout = setTimeout(() => {
      nodeEl.className = 'pipeline-node status-complete';
      nodeEl.querySelector('.node-status-icon').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      if (connEl) {
        connEl.classList.remove('active');
        connEl.style.color = 'var(--success)';
      }
      
      currentStepIdx++;
      executeNextStep();
    }, step.duration);
  }
  
  executeNextStep();
}

// --------------------------------------------------
// UTILITY ACTIONS
// --------------------------------------------------
function copyLogsToClipboard() {
  const logText = printedLogs.map(l => `[${l.type.toUpperCase()}] ${l.msg}`).join('\n');
  
  // Fallback copy implementation
  const textarea = document.createElement('textarea');
  textarea.value = logText;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    
    // Show visual checkmark success
    btnCopyLogs.classList.add('success');
    const btnSpan = btnCopyLogs.querySelector('span');
    btnSpan.textContent = 'Copied!';
    
    // Reset icon after delay
    setTimeout(() => {
      btnCopyLogs.classList.remove('success');
      btnSpan.textContent = 'Copy Logs';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy logs: ', err);
  } finally {
    document.body.removeChild(textarea);
  }
}

function triggerFinishOverlay() {
  // Create beautiful full screen/modal particles overlay
  const overlay = document.createElement('div');
  overlay.className = 'success-modal-overlay';
  overlay.innerHTML = `
    <div class="success-modal-card">
      <div class="success-badge-container">
        <div class="success-badge-glow"></div>
        <div class="success-icon-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      <h2>Server Setup Completed!</h2>
      <p class="modal-card-desc">Your MCP server <strong>a</strong> has been successfully configured, enriched, and connected. The server is ready to handle agent request endpoints.</p>
      
      <div class="modal-card-details">
        <div class="detail-row">
          <div class="detail-label-wrapper">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>Server Alias</span>
          </div>
          <strong class="detail-badge alias">a</strong>
        </div>
        
        <div class="detail-row">
          <div class="detail-label-wrapper">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <span>Active Status</span>
          </div>
          <div class="detail-status-pill">
            <span class="status-indicator pulse"></span>
            <strong>Active</strong>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label-wrapper">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>Active Routes</span>
          </div>
          <strong class="detail-badge routes">3 endpoints loaded</strong>
        </div>
      </div>
      
      <button class="btn-primary-modal" id="btn-close-modal">
        <span>Got it, Let's build</span>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  `;
  
  // Append styles for the modal dynamically to avoid cluttering main style file
  const style = document.createElement('style');
  style.id = 'modal-style';
  style.innerHTML = `
    .success-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(12px);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeInOverlay 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .success-modal-card {
      background-color: #ffffff;
      border-radius: var(--radius-xl);
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25), 
                  0 0 0 1px rgba(0, 0, 0, 0.05),
                  0 0 40px rgba(79, 70, 229, 0.05);
      width: 90%;
      max-width: 480px;
      padding: 2.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      border: 1px solid var(--border-color);
      animation: modalScaleUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      position: relative;
    }
    .success-badge-container {
      position: relative;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    .success-badge-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--success);
      opacity: 0.15;
      animation: pulseGlow 2s infinite alternate;
    }
    .success-icon-badge {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
      z-index: 2;
    }
    .success-icon-badge svg {
      width: 28px;
      height: 28px;
    }
    .success-modal-card h2 {
      font-size: 1.65rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary) 0%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.025em;
    }
    .modal-card-desc {
      font-size: 0.925rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .modal-card-details {
      background-color: #fafbfc;
      border-radius: var(--radius-lg);
      width: 100%;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      border: 1px solid var(--border-color);
      margin-bottom: 0.5rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }
    .detail-label-wrapper {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .detail-icon {
      width: 16px;
      height: 16px;
      color: var(--text-light);
    }
    .detail-badge {
      font-size: 0.775rem;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-weight: 600;
    }
    .detail-badge.alias {
      background-color: var(--primary-soft);
      color: var(--primary);
    }
    .detail-badge.routes {
      background-color: #f3e8ff;
      color: #7c3aed;
    }
    .detail-status-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--success-soft);
      color: var(--success-text);
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.775rem;
    }
    .status-indicator {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--success);
    }
    .status-indicator.pulse {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulseGreen 1.5s infinite;
    }
    
    /* CTA button inside the modal */
    .btn-primary-modal {
      background: linear-gradient(135deg, var(--primary) 0%, #6366f1 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.35);
      padding: 0.875rem 2rem;
      font-size: 0.95rem;
      font-weight: 650;
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-primary-modal:hover {
      background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);
      box-shadow: 0 6px 20px 0 rgba(79, 70, 229, 0.5);
      transform: translateY(-2px);
    }
    .btn-primary-modal:hover .arrow-icon {
      transform: translateX(4px);
    }
    .btn-primary-modal:active {
      transform: translateY(-0.5px) scale(0.985);
      box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
    }
    .btn-primary-modal .arrow-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }
    
    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalScaleUp {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes pulseGlow {
      0% { transform: scale(0.95); opacity: 0.15; }
      100% { transform: scale(1.15); opacity: 0.3; }
    }
    @keyframes pulseGreen {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  
  // Close handler
  document.getElementById('btn-close-modal').addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.head.removeChild(style);
  });
}

// --------------------------------------------------
// EVENT LISTENERS & INITS
// --------------------------------------------------
function init() {
  // Run simulation on load
  runSimulation();
  
  // Replay run trigger
  btnReplay.addEventListener('click', runSimulation);
  
  // Clipboard copy logs
  btnCopyLogs.addEventListener('click', copyLogsToClipboard);
  
  // Finish button modal
  btnFinish.addEventListener('click', triggerFinishOverlay);
  
  // Filters setup
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const filter = e.target.getAttribute('data-filter');
      applyLogFilter(filter);
    });
  });
}

// Start immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
