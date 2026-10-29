import { defineClientConfig } from 'vuepress/client'
import { watch } from 'vue'
import { usePostsData } from 'vuepress-theme-plume/composables'
import type { ThemePostsItem } from 'vuepress-theme-plume/shared'
import ranking from '../../data/weekly-ranking.json'
// import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

// import CustomComponent from './theme/components/Custom.vue'

 import './theme/styles/custom.css'

export default defineClientConfig({
  setup() {
    const posts = usePostsData()
    const weeklyPosts = ranking.posts as ThemePostsItem[]

    // Reapply after theme data HMR; the theme's native lists, tags and archives
    // consume this same snapshot in its persisted rank order.
    watch(posts, () => {
      posts.value['/weekly-ranking/'] = weeklyPosts
    }, { immediate: true })

  },
  enhance({ app }) {
    // built-in components
    // app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    // app.component('CustomComponent', CustomComponent)
  },
})
