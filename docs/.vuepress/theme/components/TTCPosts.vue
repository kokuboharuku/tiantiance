<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouteLocale } from 'vuepress/client'
import { useCollections, collectionItemRef } from 'vuepress-theme-plume/composables'
import NativePosts from 'vuepress-theme-plume/components/Posts/VPPosts.vue'

const props = defineProps<{ homePosts?:boolean, type?:string, onlyOnce?:boolean, collection?:string }>()
const route = useRoute()
const weekly = computed(() => route.path.startsWith('/weekly-ranking/'))

// Plume applies forced collections in a queued watcher. Select this page's
// collection before its static render, while keeping client navigation native.
if (import.meta.env.SSR && weekly.value) {
  const locale = useRouteLocale().value
  const collection = useCollections().value[locale]?.find(item => item.dir === 'weekly-ranking')
  if (collection) collectionItemRef.value = collection
}
</script>

<template>
  <NativePosts :key="weekly ? 'weekly-ranking' : (props.collection || 'posts')" v-bind="props" :home-posts="weekly || props.homePosts" :collection="weekly ? 'weekly-ranking' : props.collection">
    <template v-for="(_,name) in $slots" #[name]="scope"><slot :name="name" v-bind="scope || {}" /></template>
  </NativePosts>
</template>
