<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ text: string }>()
// Support old frozen titles while displaying only the awarded score.
const score = computed(() => /^(.*?)( ★ )(\d+)(?:\/\d+)?( · 不可访问)?$/u.exec(props.text))
</script>
<template>
  <template v-if="score">{{ score[1] }} <span class="ttc-rating-star">★ {{ score[3] }}</span>{{ score[4] }}</template>
  <template v-else>{{ text }}</template>
</template>
