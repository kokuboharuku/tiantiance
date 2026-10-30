# 天天测

[![构建与部署](https://github.com/kokuboharuku/tiantiance/actions/workflows/pages.yml/badge.svg)](https://github.com/kokuboharuku/tiantiance/actions/workflows/pages.yml)

公开测评与周榜的静态阅读网站，使用 VuePress、GitHub Actions 与 Pages。

**[打开网站](https://tiantiance.blog/)** · [Wiki](https://github.com/kokuboharuku/tiantiance/wiki) · [讨论](https://github.com/kokuboharuku/tiantiance/discussions) · [内容纠错](https://github.com/kokuboharuku/tiantiance/issues/new?template=correction.yml)

## 阅读入口

- [每周评分榜](https://tiantiance.blog/weekly-ranking/)
- [测评专题](https://tiantiance.blog/topics/)与[历史归档](https://tiantiance.blog/archive/)
- [RSS 订阅](https://tiantiance.blog/subscribe/)与[阅读说明](https://tiantiance.blog/reading/)

## 当前内容

文章与周榜由现有天天测内容流程维护，同步后通过 Actions 发布；页面访问不重新计算周榜。部分历史图片依赖原有外部地址。评分与结论反映文章所述时间，请结合测试条件与日期阅读。

## 开发与发布

`npm ci` 后使用 `npm run docs:dev` 开发；发布检查为 `npm run docs:build && npm run verify`。PR 只构建验证，main 通过后由 Actions 发布 Pages，部署成功后通知 IndexNow。通知接受不代表搜索收录。

[参与维护](CONTRIBUTING.md) · [内容使用说明](CONTENT-LICENSE.md) · [路线图](https://github.com/kokuboharuku/tiantiance/wiki/Roadmap)
