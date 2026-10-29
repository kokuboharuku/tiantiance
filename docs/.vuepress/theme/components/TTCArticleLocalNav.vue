<script setup lang="ts">
import NativeLocalNav from 'vuepress-theme-plume/components/VPLocalNav.vue'
import { useData, usePostsPageData } from 'vuepress-theme-plume/composables'
const props = defineProps<{ open: boolean, showOutline: boolean }>()
defineEmits<{ openMenu: [] }>()
const { isPostsLayout } = usePostsPageData()
const { frontmatter } = useData()
</script>

<template>
  <!-- Collection lists have no article outline. Preserve native navigation on content pages. -->
  <NativeLocalNav
    v-if="!isPostsLayout && frontmatter.pageLayout !== 'home'"
    v-bind="props"
    @open-menu="$emit('openMenu')"
  />
</template>
