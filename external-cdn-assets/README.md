# External CDN / Object Storage Assets

这个文件夹用于记录后续可迁移到外部 CDN / 对象存储的静态资源。

推荐迁移对象：体积较大的背景图、序列帧、音频文件。迁移后，在 React 中把本地 import 改成稳定 HTTPS URL，例如：

```ts
const imageUrl = "https://your-cdn.example.com/silent-shadows/file.png";
```

注意：我无法在本地直接完成 CDN 上传；需要你提供对象存储/CDN 地址或上传后的 URL。拿到 URL 后，再把对应本地 import 替换为外链，并删除本地文件以继续降低 Make media 数量。
