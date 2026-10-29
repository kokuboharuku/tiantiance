<script setup lang="ts">
import { computed } from 'vue'
import NativePostItem from 'vuepress-theme-plume/components/Posts/VPPostItem.vue'
import type { ThemePostsItem } from 'vuepress-theme-plume/shared'

const props = defineProps<{ post: ThemePostsItem & { available?: boolean }, index: number }>()
const post = computed(() => props.post.available === false
  ? { ...props.post, path: '', title: `${props.post.title} · 不可访问` }
  : props.post)
</script>

<template>
  <NativePostItem :post="post" :index="index" />
</template>
