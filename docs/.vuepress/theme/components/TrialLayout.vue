<script setup lang="ts">
import { computed, ref } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import { useData } from 'vuepress-theme-plume/composables'
import articles from '../../../../data/articles.json'
const {page}=useData()
const current=computed(()=>articles.find(a=>a.path===page.value.path))
const related=computed(()=>current.value?articles.filter(a=>a.path!==current.value!.path).sort((a,b)=>Number(b.merchant===current.value!.merchant)-Number(a.merchant===current.value!.merchant)||b.date.localeCompare(a.date)).slice(0,3):[])
const url=computed(()=>`https://tiantiance.blog${page.value.path}`)
const discussion=computed(()=>`https://github.com/kokuboharuku/tiantiance/discussions/new?category=q-a&title=${encodeURIComponent(page.value.title)}&body=${encodeURIComponent(url.value)}`)
const correction=computed(()=>`https://github.com/kokuboharuku/tiantiance/issues/new?template=correction.yml&title=${encodeURIComponent('内容纠错：'+page.value.title)}&article=${encodeURIComponent(url.value)}`)
const copied=ref(false), fallback=ref(false)
async function share(){try{await navigator.clipboard.writeText(url.value);copied.value=true}catch{fallback.value=true}}
</script>
<template>
  <Layout>
    <template #doc-footer-before>
      <section v-if="current" class="ttc-reader-tools" aria-label="文章交流与相关测评">
        <h2>交流与分享</h2>
        <p><a :href="discussion">讨论这篇测评</a> · <a :href="correction">内容纠错</a> · <button type="button" @click="share">{{copied?'链接已复制':'复制文章链接'}}</button></p>
        <label v-if="fallback">复制此链接：<input :value="url" readonly @focus="($event.target as HTMLInputElement).select()"></label>
        <h2>相关测评</h2>
        <ul><li v-for="item in related" :key="item.path"><a :href="item.path">{{item.title}}</a> · {{item.date}}</li></ul>
        <p><a href="/topics/">测评专题</a> · <a href="/archive/">全部归档</a> · <a href="/subscribe/">RSS 订阅</a></p>
      </section>
    </template>
  </Layout>
</template>
<style scoped>
.ttc-reader-tools{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--vp-c-divider)}
.ttc-reader-tools p,.ttc-reader-tools li{line-height:1.9;overflow-wrap:anywhere}
.ttc-reader-tools button{color:var(--vp-c-brand-1);text-decoration:underline;cursor:pointer}
.ttc-reader-tools input{display:block;width:100%;border:1px solid var(--vp-c-divider);padding:.5rem}
</style>
