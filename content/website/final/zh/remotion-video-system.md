---
title: "我如何用 React 构建了一个视频渲染系统"
date: "2026-02-22"
excerpt: "没有 GPU，没有 After Effects。只有 React 组件、Remotion，以及运行三个网站的同一个单仓库。"
---

## 视频的问题

我需要为三个品牌制作宣传视频。ShawnOS、GTMOS、ContentOS。每个都需要三种宽高比 - LinkedIn (4:5)、Reels (9:16)、横屏 (16:9)。这就是九个渲染目标。而且每次设计令牌变化，每个视频都需要更新。

我看了 After Effects 模板。看了 Canva。考虑过找人做。每个选项都意味着一个手动管道，在我推送一次颜色变更后就会与网站不同步。

网站已经有了设计系统。数据层。品牌令牌。如果视频也在同一个代码库里呢？

## Remotion 和单仓库优势

Remotion 把 React 组件变成视频帧。你写 JSX。它以 30fps 渲染每一帧。你得到一个 MP4。不需要 GPU。不需要时间线编辑器。只要代码。

关键洞察是把视频应用放进现有的 Turborepo 单仓库，在 `website/apps/video/`。同一个驱动三个网站的 `@shawnos/shared` 包。同样的设计令牌。同样的调色板。当我修改共享包里的一个十六进制值时，网站和视频在下次构建时都会更新。

九个合成存在于一个 `Root.tsx` 中。三个品牌乘以三种宽高比。一个 `useScale()` 钩子将一切标准化到 1080x1350 基准并按比例缩放。一棵组件树可以以任何尺寸渲染。

## 场景架构

视频由通过 `TransitionSeries` 连接的场景构建 - Remotion 的合成工具，处理片段之间的重叠时序。每个场景是一个有固定帧数的 React 组件。

当前 V3 系统运行约10秒，30fps（共310帧）：

- **Hook**（36帧 / 1.2秒） - 开场抓眼球
- **BootWikiBlitz**（110帧 / 3.7秒） - 终端启动序列配合快速切换的 Wiki 卡片
- **Progression**（100帧 / 3.3秒） - RPG 风格等级系统可视化
- **CtaNetwork**（94帧 / 3.1秒） - 带网络图的行动号召

场景之间有10帧的转场重叠。时序配置在 `timing-v2.ts` 中 - 一个文件控制整个视频节奏。

## 组件库

三个组件完成了大部分视觉工作。

**MatrixRain** 使用来自 `@remotion/noise` 的 Perlin 噪声生成确定性的字符雨效果。每一列独立漂移。字符选择由列、行和帧号作为种子。效果是有机的但可复现的 - 同一个种子，同一个输出，每次渲染。

**TypewriterText** 逐帧显示字符，带闪烁光标。已过帧数控制可见字符数。光标以 1Hz 闪烁。简单的数学，干净的效果。

**ParticleField** 使用两个独立的噪声流创建环境浮动粒子，分别用于 x 和 y 漂移。默认40个粒子，限制在画布8%的漂移范围内。通过第三个噪声通道实现微妙的脉冲效果。

三个组件都是确定性的。没有 `Math.random()`。Remotion 要求如此 - 随机值在帧之间变化会破坏渲染。带一致种子的 Perlin 噪声给你有机动画，同时保持可复现性。

## 视觉处理

每个场景都包裹在 `SceneWrapper` 中，应用一致的视觉处理：

- 深色画布背景 (#0D1117)
- 径向暗角（边缘加深）
- 3%透明度的主题色染色
- 粒子场环境噪声
- 通过 SVG feTurbulence 实现的胶片颗粒
- 扫描线叠加（CRT 美学）

结果看起来像终端原生视频。符合 ShawnOS 品牌，不需要任何手动后期处理。

## 代码中的设计令牌

令牌系统在 `tokens.ts` 中：

```
canvas:  #0D1117
green:   #4EC373  (ShawnOS)
teal:    #3DBFA0  (GTMOS)
purple:  #9B72CF  (ContentOS)
amber:   #D2A53C  (辅助色)
```

`SITE_ACCENTS` 将品牌名映射到颜色。BootWikiBlitz 场景在 Wiki 卡片翻转时循环调色板 - 绿色、青色、琥珀色、紫色、绿色。品牌标识在数据中，不是硬编码在组件里。

字体统一使用 JetBrains Mono。等宽字体。与三个网站的终端美学一致。

## 渲染

`npm run render:all` 生成全部九个变体。Remotion 将每个合成渲染为 JPEG 帧，然后编码为 MP4。除了 `package.json` 中的依赖外没有外部依赖。不需要云端渲染农场。在 MacBook 上运行。

渲染输出到 `website/apps/video/out/`，部署到每个网站的 `public/video/` 目录。SQLite 内容索引追踪所有视频文件、它们的品牌、宽高比和部署状态。

## 为什么这很重要

视频系统是与所有其他内容类型共存于同一代码库的一种内容类型。博客文章是 markdown 文件。知识术语是 TypeScript 对象。视频是 React 组件。它们都共享相同的设计令牌、相同的数据层、相同的部署管道。

当我添加新的 Wiki 类别时，BootWikiBlitz 场景可以引用它。当我改变品牌颜色时，视频会更新。当我推送到 main 时，一切一起部署。

没有独立工具。没有手动导出。没有同步问题。单仓库就是系统。

`$ remotion render Root LeadMagnetV3 --codec=h264`
