<template>
  <div class="womm-flow">
    <div v-click="1" class="womm-stage transition-opacity duration-300">
      <div class="terminal-card terminal-card--ok">
        <div class="terminal-chrome" aria-hidden="true">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
          <span class="terminal-title">you@macbook</span>
        </div>
        <pre class="terminal-body"><code><span class="line-prompt">$ </span>python main.py
<span class="line-muted">Python 3.12.2</span>
<span class="line-ok">Uvicorn running on http://127.0.0.1:8000</span></code></pre>
      </div>
    </div>

    <div v-click="2" class="womm-connector transition-opacity duration-300" aria-hidden="true">
      <span class="womm-arrow">↓</span>
      <span class="womm-connector-label">git push</span>
    </div>

    <div v-click="3" class="womm-stage transition-opacity duration-300">
      <div class="terminal-card terminal-card--fail">
        <div class="terminal-chrome" aria-hidden="true">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
          <span class="terminal-title">teammate@ubuntu</span>
        </div>
        <pre class="terminal-body"><code><span class="line-prompt">$ </span>python main.py
<span class="line-muted">Python 3.10.12</span>
<span class="line-err">ImportError: libssl.so.3: cannot open shared object file</span></code></pre>
      </div>
    </div>

    <div v-click="4" class="womm-connector womm-connector--short transition-opacity duration-300" aria-hidden="true">
      <span class="womm-arrow">↓</span>
      <span class="womm-connector-label">deploy</span>
    </div>

    <div v-click="4" class="womm-stage transition-opacity duration-300">
      <div class="terminal-card terminal-card--fail">
        <div class="terminal-chrome" aria-hidden="true">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
          <span class="terminal-title">render-prod</span>
        </div>
        <pre class="terminal-body"><code><span class="line-prompt">$ </span>python main.py
<span class="line-err">ModuleNotFoundError: No module named 'sentence_transformers'</span></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.womm-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  max-width: 34rem;
  margin: 0 auto;
  padding: 0.25rem 0 0.5rem;
  font-size: 0.72rem;
}

.womm-stage {
  width: 100%;
}

.terminal-card {
  overflow: hidden;
  border: 1px solid var(--nus-border);
  border-radius: 0.35rem;
  background: var(--nus-code-bg);
  box-shadow: var(--nus-shadow);
}

.terminal-card--ok {
  border-color: color-mix(in srgb, var(--nus-success), var(--nus-border) 50%);
}

.terminal-card--fail {
  border-color: color-mix(in srgb, var(--nus-danger), var(--nus-border) 45%);
}

.terminal-chrome {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border-bottom: 1px solid var(--nus-border);
  padding: 0.28rem 0.5rem;
}

.dot {
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 50%;
}

.dot-red {
  background: #ef4444;
}

.dot-yellow {
  background: #fbbf24;
}

.dot-green {
  background: #10b981;
}

.terminal-title {
  margin-left: 0.3rem;
  color: var(--nus-faint);
  font-size: 0.68rem;
  font-weight: 600;
}

.terminal-body {
  margin: 0;
  padding: 0.4rem 0.55rem 0.45rem;
  background: transparent;
  border: 0;
  box-shadow: none;
  line-height: 1.45;
}

.terminal-body code {
  display: block;
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 0.95em;
  font-weight: 500;
  white-space: pre-wrap;
}

.line-prompt {
  color: var(--nus-text);
  font-weight: 700;
}

.line-muted {
  color: var(--nus-faint);
}

.line-ok {
  color: var(--nus-success);
  font-weight: 700;
}

.line-err {
  color: var(--nus-danger);
  font-weight: 700;
}

.womm-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
  padding: 0.1rem 0;
}

.womm-connector--short {
  padding: 0;
}

.womm-arrow {
  color: var(--nus-accent-hi);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
}

.womm-connector-label {
  border: 1px solid var(--nus-border);
  border-radius: 0.2rem;
  background: var(--nus-bg-elevated);
  color: var(--nus-text);
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.2;
  padding: 0.15rem 0.4rem;
}

.womm-connector-hint {
  font-size: 0.62rem;
  font-style: italic;
  line-height: 1.2;
}
</style>
