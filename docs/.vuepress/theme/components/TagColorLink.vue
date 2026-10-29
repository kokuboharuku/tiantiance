<script setup lang="ts">
import { computed } from 'vue'
import ScoreTitle from './ScoreTitle.vue'
import NativeLink from 'vuepress-theme-plume/components/VPLink.vue'
import { tagColorStyle } from '../../tagColors'

const props = defineProps<{ tag?: string, href?: string, text?: string, noIcon?: boolean, target?: string, rel?: string }>()
const tagName = computed(() => {
  const position = props.href?.indexOf('?tag=') ?? -1
  if (position < 0) return undefined
  try { return decodeURIComponent(props.href!.slice(position + 5)) } catch { return undefined }
})
const href = computed(() => tagName.value === undefined ? props.href
  : props.href!.slice(0, props.href!.indexOf('?tag=')) + '?tag=' + encodeURIComponent(tagName.value))
const style = computed(() => tagName.value === undefined ? undefined : tagColorStyle(tagName.value))
</script>

<template>
  <NativeLink v-bind="props" :href="href" :style="style"><slot><ScoreTitle v-if="props.text" :text="props.text" /></slot></NativeLink>
</template>
