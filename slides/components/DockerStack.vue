<template>
  <div class="docker-stack">
    <div
      v-for="(layer, index) in layers"
      :key="layer.id"
      v-click="index + 1"
      class="docker-stack-row transition-opacity duration-300"
    >
      <div class="docker-stack-layer" :class="`docker-stack-layer--${layer.tone}`">
        <span class="docker-stack-layer-label">{{ layer.label }}</span>
        <span class="docker-stack-layer-desc">{{ layer.description }}</span>
      </div>
      <div class="docker-stack-annotations" aria-label="Alternatives at this layer">
        <span
          v-for="option in layer.options"
          :key="option"
          class="docker-stack-chip"
        >
          {{ option }}
        </span>
        <span v-if="layer.hint" class="docker-stack-hint">{{ layer.hint }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const layers = [
  {
    id: "desktop",
    label: "Desktop app",
    description: "Optional on Mac / Windows",
    tone: "tooling",
    options: ["Docker Desktop", "OrbStack"],
    hint: "Pick one. All give you the same docker command.",
  },
  {
    id: "cli",
    label: "CLI",
    description: "The docker command you type",
    tone: "cli",
    options: ["docker build", "docker run", "docker compose"],
    hint: "Talks to whatever runtime is installed.",
  },
  {
    id: "engine",
    label: "Engine / Runtime",
    description: "Actually starts and manages containers",
    tone: "engine",
    options: ["Docker Engine", "Podman", "containerd"],
    hint: "Swappable. Same images, different daemon.",
  },
  {
    id: "standard",
    label: "Standard",
    description: "OCI image format",
    tone: "standard",
    options: ["Docker Hub", "GHCR"],
    hint: "Why images built here run on Render, Kubernetes, Podman.",
  },
] as const;
</script>

<style scoped>
.docker-stack {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: 46rem;
  margin: 0.35rem auto 0;
  font-size: 0.72rem;
}

.docker-stack-row {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.35fr);
  gap: 0.55rem;
  align-items: center;
}

.docker-stack-layer {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
  border: 1px solid var(--nus-border);
  border-radius: 0.32rem;
  background: var(--nus-bg-elevated);
  padding: 0.38rem 0.5rem;
  min-height: 2.55rem;
  justify-content: center;
}

.docker-stack-layer::before {
  position: absolute;
  content: none;
}

.docker-stack-layer--tooling {
  border-color: color-mix(in srgb, var(--nus-muted), var(--nus-border) 55%);
}

.docker-stack-layer--cli {
  border-color: color-mix(in srgb, var(--nus-accent-hi), var(--nus-border) 45%);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--nus-accent-hi), transparent 84%);
}

.docker-stack-layer--engine {
  border-color: color-mix(in srgb, var(--nus-accent), var(--nus-border) 40%);
  background: color-mix(in srgb, var(--nus-accent) 8%, var(--nus-bg-elevated));
}

.docker-stack-layer--standard {
  border-color: color-mix(in srgb, var(--nus-success), var(--nus-border) 50%);
}

.docker-stack-layer-label {
  color: var(--nus-text);
  font-size: 0.95em;
  font-weight: 800;
  line-height: 1.15;
}

.docker-stack-layer-desc {
  color: var(--nus-muted);
  font-size: 0.82em;
  font-weight: 600;
  line-height: 1.25;
}

.docker-stack-annotations {
  display: flex;
  flex-wrap: wrap;
  gap: 0.28rem;
  align-items: center;
}

.docker-stack-chip {
  border: 1px solid var(--nus-border);
  border-radius: 0.22rem;
  background: var(--nus-code-bg);
  color: var(--nus-text);
  font-size: 0.78em;
  font-weight: 700;
  line-height: 1.2;
  padding: 0.18rem 0.38rem;
  white-space: nowrap;
}

.docker-stack-hint {
  flex: 1 1 100%;
  color: var(--nus-faint);
  font-size: 0.74em;
  font-style: italic;
  line-height: 1.25;
}
</style>
