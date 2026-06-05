<script setup lang="ts">
import { assetUrl } from "../utils/assets";

interface App {
	name: string;
	logo: string;
	dotColor: string;
	annotation?: string;
}

const apps: App[] = [
	{
		name: "Calculator",
		logo: assetUrl("logos/Calculator_(iOS_26)_app_icon.webp"),
		dotColor: "var(--nus-success)",
	},
	{
		name: "Minecraft",
		logo: assetUrl("logos/minecraft_bedrock_icon.svg"),
		dotColor: "color-mix(in srgb, var(--nus-success), var(--nus-warning) 20%)",
		annotation: "Multiplayer needs a server",
	},
	{
		name: "Spotify",
		logo: assetUrl("logos/Spotify_App_Logo.svg"),
		dotColor: "var(--nus-warning)",
		annotation: "Has an offline mode",
	},
	{
		name: "Instagram",
		logo: assetUrl("logos/Instagram_logo_2016.svg"),
		dotColor: "var(--nus-accent)",
	},
	{
		name: "Grab",
		logo: assetUrl("logos/grab_app_icon.svg"),
		dotColor: "var(--nus-danger)",
	},
];
</script>

<template>
  <div class="app-spectrum">
    <div class="app-spectrum-grid">
      <div
        v-click="6"
        class="needs-server-region"
        aria-hidden="true"
      />

      <div
        v-for="(app, i) in apps"
        :key="app.name"
        v-click="i + 1"
        class="station"
        :style="{ gridColumn: i + 1, '--station-color': app.dotColor }"
      >
        <p
          class="station-annotation"
          :class="{ 'station-annotation--empty': !app.annotation }"
        >
          {{ app.annotation ?? "\u00a0" }}
        </p>
        <div class="station-icon-wrap">
          <img
            :src="app.logo"
            :alt="app.name"
            class="station-logo"
          />
        </div>
        <p class="station-name">{{ app.name }}</p>
        <div class="station-connector" aria-hidden="true" />
      </div>

      <div class="spectrum-bar-row">
        <div class="spectrum-bar-track" aria-hidden="true">
          <div class="spectrum-bar-channel" />
          <div class="spectrum-bar" />
        </div>
        <div
          v-for="(app, i) in apps"
          :key="`marker-${app.name}`"
          v-click="i + 1"
          class="spectrum-marker"
          :style="{ gridColumn: i + 1, '--marker-color': app.dotColor }"
        >
          <span class="spectrum-dot" />
        </div>
      </div>

      <div class="axis-label axis-label--offline">
        <span class="axis-eyebrow">Fully offline</span>
        <span class="axis-detail">
          No server needed<br />
          Just distribute the app
        </span>
      </div>
      <div class="axis-label axis-label--cloud">
        <span class="axis-eyebrow">Cloud-heavy</span>
      </div>

      <div v-click="6" class="server-callout">
        <div class="server-bracket" aria-hidden="true">
          <span class="server-bracket-wing server-bracket-wing--left" />
          <span class="server-bracket-notch" />
          <span class="server-bracket-wing server-bracket-wing--right" />
        </div>
        <p class="server-callout-label">
          Needs a server running somewhere
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-spectrum {
  --spectrum-cols: 5;
  position: relative;
  margin: 1.35rem auto 0;
  max-width: 60rem;
  padding: 0 1rem 0.25rem;
  font-size: 0.9rem;
}

.app-spectrum::before {
  position: absolute;
  top: 2.5rem;
  right: 8%;
  left: 8%;
  z-index: 0;
  height: 5.5rem;
  border-radius: 50%;
  background: radial-gradient(
    ellipse 100% 80% at 50% 0%,
    color-mix(in srgb, var(--nus-accent), transparent 94%) 0%,
    transparent 72%
  );
  content: "";
  pointer-events: none;
}

:global(.dark) .app-spectrum::before {
  background: radial-gradient(
    ellipse 100% 80% at 50% 0%,
    color-mix(in srgb, var(--nus-accent), transparent 97%) 0%,
    transparent 70%
  );
}

.app-spectrum-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(var(--spectrum-cols), minmax(0, 1fr));
  grid-template-rows: auto 2.85rem auto auto;
  column-gap: 0.5rem;
  row-gap: 0;
}

.needs-server-region {
  grid-column: 3 / -1;
  grid-row: 1;
  z-index: 0;
  margin: 0.15rem -0.15rem 0;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--nus-danger), transparent 91%) 0%,
    color-mix(in srgb, var(--nus-danger), transparent 97%) 42%,
    transparent 100%
  );
  box-shadow: inset 0 2px 0 color-mix(in srgb, var(--nus-danger), transparent 55%);
  pointer-events: none;
  transition: opacity 0.3s;
}

:global(.dark) .needs-server-region {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--nus-danger), transparent 94%) 0%,
    color-mix(in srgb, var(--nus-danger), transparent 98%) 45%,
    transparent 100%
  );
  box-shadow: inset 0 2px 0 color-mix(in srgb, var(--nus-danger), transparent 62%);
}

.station {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-row: 1;
  min-width: 0;
  transition: opacity 0.3s;
}

.station-annotation {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 1.95rem;
  margin: 0;
  padding: 0 0.2rem;
  color: var(--nus-muted);
  font-size: 0.64rem;
  font-weight: 600;
  line-height: 1.15;
  text-align: center;
  text-wrap: balance;
}

.station-annotation--empty {
  visibility: hidden;
}

.station-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
}

.station-icon-wrap::before {
  position: absolute;
  inset: 0;
  border-radius: 1.05rem;
  background: radial-gradient(
    circle at 50% 58%,
    color-mix(in srgb, var(--station-color), transparent 58%) 0%,
    color-mix(in srgb, var(--station-color), transparent 88%) 48%,
    transparent 72%
  );
  content: "";
  opacity: 0.9;
}

.station-logo {
  position: relative;
  z-index: 1;
  width: 3.15rem;
  height: 3.15rem;
  border-radius: 0.72rem;
  object-fit: contain;
  filter: drop-shadow(0 5px 14px rgb(10 10 10 / 16%));
}

:global(.dark) .station-logo {
  filter: drop-shadow(0 8px 20px rgb(0 0 0 / 42%));
}

.station-name {
  margin: 0.42rem 0 0;
  color: var(--nus-text);
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
}

.station-connector {
  flex: 1 1 auto;
  width: 1.5px;
  min-height: 0.7rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--station-color), transparent 72%) 0%,
    var(--station-color) 100%
  );
  opacity: 0.45;
}

.spectrum-bar-row {
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-row: 2;
  grid-template-columns: repeat(var(--spectrum-cols), minmax(0, 1fr));
  align-items: center;
  height: 2.85rem;
}

.spectrum-bar-track {
  position: relative;
  display: flex;
  grid-column: 1 / -1;
  grid-row: 1;
  align-items: center;
  height: 100%;
  padding: 0 0.1rem;
}

.spectrum-bar-channel {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--nus-border), transparent 25%);
  border-radius: 999px;
  background: color-mix(in srgb, var(--nus-code-bg), var(--nus-bg) 40%);
  box-shadow: inset 0 1px 2px rgb(10 10 10 / 6%);
  transform: translateY(-50%);
}

:global(.dark) .spectrum-bar-channel {
  background: color-mix(in srgb, var(--nus-bg-elevated), var(--nus-bg) 30%);
  box-shadow: inset 0 1px 3px rgb(0 0 0 / 28%);
}

.spectrum-bar {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--nus-success) 0%,
    color-mix(in srgb, var(--nus-success), var(--nus-warning) 18%) 22%,
    var(--nus-warning) 48%,
    var(--nus-accent) 72%,
    var(--nus-danger) 90%,
    color-mix(in srgb, var(--nus-danger), #7f1d1d 30%) 100%
  );
  box-shadow: 0 0 12px color-mix(in srgb, var(--nus-warning), transparent 82%);
}

:global(.dark) .spectrum-bar {
  box-shadow: 0 0 16px color-mix(in srgb, var(--nus-warning), transparent 88%);
}

.spectrum-marker {
  position: relative;
  z-index: 2;
  display: flex;
  grid-row: 1;
  justify-content: center;
  transition: opacity 0.3s;
}

.spectrum-dot {
  display: block;
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 50%;
  background: var(--marker-color);
  box-shadow:
    0 0 0 2.5px var(--nus-bg),
    0 0 0 3.5px var(--marker-color),
    0 2px 10px color-mix(in srgb, var(--marker-color), transparent 45%);
}

:global(.dark) .spectrum-dot {
  box-shadow:
    0 0 0 2.5px var(--nus-bg),
    0 0 0 3.5px var(--marker-color),
    0 2px 12px color-mix(in srgb, var(--marker-color), transparent 35%);
}

.axis-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-row: 3;
  margin-top: 0.55rem;
  text-align: center;
}

.axis-label--offline {
  grid-column: 1;
  align-items: flex-start;
  text-align: left;
}

.axis-label--cloud {
  grid-column: 5;
  align-items: flex-end;
  text-align: right;
}

.axis-eyebrow {
  color: var(--nus-text);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  line-height: 1.2;
  text-transform: uppercase;
}

.axis-label--offline .axis-eyebrow {
  color: var(--nus-success);
}

.axis-label--cloud .axis-eyebrow {
  color: var(--nus-danger);
}

.axis-detail {
  margin-top: 0.2rem;
  color: var(--nus-faint);
  font-size: 0.64rem;
  font-weight: 500;
  line-height: 1.35;
}

.server-callout {
  grid-column: 3 / -1;
  grid-row: 4;
  margin-top: 0.65rem;
  padding: 0 0.15rem;
  text-align: center;
  transition: opacity 0.3s;
}

.server-bracket {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 0.85rem;
  margin: 0 0.35rem 0.45rem;
  gap: 0;
}

.server-bracket-wing {
  flex: 1;
  height: 0.55rem;
  border: 1px solid var(--nus-danger);
  border-top: none;
}

.server-bracket-wing--left {
  border-right: none;
  border-bottom-left-radius: 0.2rem;
}

.server-bracket-wing--right {
  border-left: none;
  border-bottom-right-radius: 0.2rem;
}

.server-bracket-notch {
  flex: 0 0 0;
  width: 0;
  height: 0;
  margin: 0 0 -1px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--nus-danger);
}

.server-callout-label {
  margin: 0;
  color: var(--nus-danger);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
</style>
