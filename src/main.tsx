import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error logger for sandboxed iframe diagnostics
window.addEventListener('error', (event) => {
  console.error("Intercepted global error:", event.error || event.message);
  try {
    const container = document.createElement('div');
    container.id = "diagnostic-error-banner";
    container.style.position = 'fixed';
    container.style.top = '12px';
    container.style.left = '12px';
    container.style.right = '12px';
    container.style.backgroundColor = '#1e293b';
    container.style.color = '#fda4af';
    container.style.padding = '16px';
    container.style.borderRadius = '12px';
    container.style.border = '1px solid #f43f5e';
    container.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
    container.style.zIndex = '999999';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '11px';
    container.style.lineHeight = '1.5';
    container.style.whiteSpace = 'pre-wrap';
    
    const title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.fontSize = '13px';
    title.style.marginBottom = '6px';
    title.style.color = '#f43f5e';
    title.innerText = "⚠️ Applet Runtime Error detected:";
    
    const msg = document.createElement('div');
    msg.innerText = event.message || (event.error && event.error.message) || "Unknown Script Error";
    
    const stack = document.createElement('pre');
    stack.style.marginTop = '8px';
    stack.style.color = '#94a3b8';
    stack.style.fontSize = '10px';
    stack.style.overflowX = 'auto';
    stack.innerText = event.error && event.error.stack ? event.error.stack : "No stack trace available.";
    
    container.appendChild(title);
    container.appendChild(msg);
    container.appendChild(stack);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "Dismiss";
    closeBtn.style.marginTop = '10px';
    closeBtn.style.backgroundColor = '#f43f5e';
    closeBtn.style.color = '#ffffff';
    closeBtn.style.border = 'none';
    closeBtn.style.padding = '4px 10px';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);

    document.body.appendChild(container);
  } catch (err) {
    console.error("Failed to append diagnostic error banner:", err);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("Intercepted unhandled rejection:", event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

