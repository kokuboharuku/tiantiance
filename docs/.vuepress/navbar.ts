/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
    { text: '机场测评', link: '/' },
    { text: '每周评分榜', link: '/weekly-ranking/' },
    { text: '专题', link: '/topics/' },
    { text: '归档', link: '/archive/' },
    { text: '订阅', link: '/subscribe/' },
    { text: 'Wiki', link: 'https://github.com/kokuboharuku/tiantiance/wiki' },
])
