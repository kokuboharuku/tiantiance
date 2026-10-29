# 天天测 · 静态部署试验版

独立的 VuePress 静态内容快照，用于验证 GitHub Actions + Pages 部署。阅读入口：https://gd.tiantiance.blog/ 。

文章与周榜来自2026-10-29的公开内容快照，不会自动跟随正式站更新，不接受业务写入。页面禁止搜索收录，不接入正式站访问统计。

开发：`npm ci`、`npm run docs:dev`。
发布验证：`npm run docs:build && npm run verify`。Actions仅发布main；PR只构建验证。
