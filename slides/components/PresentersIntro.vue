<script setup lang="ts">
import { assetUrl } from "../utils/assets";

const tienCheng = {
	index: "01",
	name: "Tien Cheng",
	photo: assetUrl("presenters/tiencheng.webp"),
	program: "Y1 CS",
	affiliationUrl: "https://www.nushackers.org/",
	photoPosition: "center 28%",
};

const putt = {
	index: "02",
	name: "Putt",
	photo: assetUrl("presenters/putt.webp"),
	program: "Y1 BAIS",
	affiliationUrl: "https://www.nushackers.org/",
	photoPosition: "center 32%",
};
</script>

<template>
  <div class="presenters-intro">
    <div class="nus-terminal-eyebrow presenters-eyebrow">
      <span>~</span><span>/</span>presenters
    </div>

    <PresenterCard v-bind="tienCheng" />
    <PresenterCard v-bind="putt" />
  </div>
</template>
