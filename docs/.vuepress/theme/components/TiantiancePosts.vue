<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vuepress/client'
import NativePosts from 'vuepress-theme-plume/components/Posts/VPPosts.vue'

const props = defineProps<{ homePosts?:boolean, type?:string, onlyOnce?:boolean, collection?:string }>()
const route = useRoute()
const weekly = computed(() => route.path.startsWith('/weekly-ranking/'))
</script>

<template>
  <NativePosts :key="weekly ? 'weekly-ranking' : (props.collection || 'posts')" v-bind="props" :home-posts="weekly || props.homePosts" :collection="weekly ? 'weekly-ranking' : props.collection">
    <template v-for="(_,name) in $slots" #[name]="scope"><slot :name="name" v-bind="scope || {}" /></template>
  </NativePosts>
</template>
