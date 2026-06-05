<template>
  <div class="container-vs-vm">
    <div class="container-vs-vm-column">
      <p class="container-vs-vm-title">Containerized apps</p>
      <div class="container-vs-vm-top">
        <div class="container-vs-vm-apps">
          <div
            v-for="app in containerApps"
            :key="app"
            class="container-vs-vm-app"
          >
            {{ app }}
          </div>
        </div>
      </div>
      <div class="container-vs-vm-stack">
        <div class="container-vs-vm-layer container-vs-vm-layer--runtime">Docker</div>
        <div class="container-vs-vm-layer container-vs-vm-layer--host">Host Operating System</div>
        <div class="container-vs-vm-layer container-vs-vm-layer--infra">Infrastructure</div>
      </div>
    </div>

    <div class="container-vs-vm-column">
      <p class="container-vs-vm-title">Virtual machines</p>
      <div class="container-vs-vm-top">
        <div class="container-vs-vm-vms">
          <div
            v-for="vm in vmApps"
            :key="vm.app"
            class="container-vs-vm-vm"
          >
            <div class="container-vs-vm-app container-vs-vm-app--vm">{{ vm.app }}</div>
            <div class="container-vs-vm-layer container-vs-vm-layer--guest">Guest OS</div>
          </div>
        </div>
      </div>
      <div class="container-vs-vm-stack">
        <div class="container-vs-vm-layer container-vs-vm-layer--runtime">Hypervisor</div>
        <div class="container-vs-vm-layer container-vs-vm-layer--infra">Infrastructure</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const containerApps = ["App A", "App B", "App C", "App D", "App E", "App F"];

const vmApps = [
  { app: "App A" },
  { app: "App B" },
  { app: "App C" },
];
</script>

<style scoped>
.container-vs-vm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  max-width: 46rem;
  margin: 0.35rem auto 0.75rem;
  font-size: 0.68rem;
}

.container-vs-vm-column {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.container-vs-vm-title {
  margin: 0 0 0.25rem;
  color: var(--nus-text);
  font-size: 0.92em;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.container-vs-vm-top {
  flex: 1 1 auto;
}

.container-vs-vm-stack {
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  margin-top: auto;
}

.container-vs-vm-apps {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.18rem;
  border: 1px dashed color-mix(in srgb, var(--nus-accent), var(--nus-border) 55%);
  border-radius: 0.28rem;
  background: color-mix(in srgb, var(--nus-accent) 6%, var(--nus-bg-elevated));
  padding: 0.28rem 0.32rem 0.32rem;
}

.container-vs-vm-vms {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.28rem;
}

.container-vs-vm-vm {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  border: 1px solid var(--nus-border);
  border-radius: 0.28rem;
  background: var(--nus-bg-elevated);
  padding: 0.22rem;
}

.container-vs-vm-app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.55rem;
  border: 1px solid color-mix(in srgb, var(--nus-accent), var(--nus-border) 45%);
  border-radius: 0.2rem;
  background: color-mix(in srgb, var(--nus-accent) 14%, var(--nus-bg-elevated));
  color: var(--nus-text);
  font-size: 0.78em;
  font-weight: 800;
  line-height: 1.1;
  text-align: center;
  padding: 0.18rem 0.12rem;
}

.container-vs-vm-app--vm {
  min-height: 1.35rem;
}

.container-vs-vm-layer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.55rem;
  border: 1px solid var(--nus-border);
  border-radius: 0.24rem;
  color: var(--nus-text);
  font-size: 0.82em;
  font-weight: 700;
  line-height: 1.15;
  text-align: center;
  padding: 0.22rem 0.35rem;
}

.container-vs-vm-layer--runtime {
  border-color: color-mix(in srgb, var(--nus-accent-hi), var(--nus-border) 40%);
  background: color-mix(in srgb, var(--nus-accent-hi) 12%, var(--nus-bg-elevated));
}

.container-vs-vm-layer--host,
.container-vs-vm-layer--guest {
  background: color-mix(in srgb, var(--nus-muted) 10%, var(--nus-bg-elevated));
}

.container-vs-vm-layer--infra {
  min-height: 1.65rem;
  border-color: color-mix(in srgb, var(--nus-success), var(--nus-border) 45%);
  background: color-mix(in srgb, var(--nus-success) 12%, var(--nus-bg-elevated));
}
</style>
