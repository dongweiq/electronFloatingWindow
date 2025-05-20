# Electron 透明窗口点击穿透实现方案

这个项目展示了如何在 Electron 中创建一个带有点击穿透功能的透明圆形窗口。通过这个实现，我们可以创建不规则形状的窗口，并且让窗口的透明区域支持点击穿透到底层窗口。

## 技术栈

- Electron: v28.0.0
- @electron/remote: v2.1.2

## 核心实现原理

### 1. 窗口配置

在 `main.js` 中，我们通过以下配置创建一个透明窗口：

```javascript
const win = new BrowserWindow({
  width: 380,
  height: 380,
  transparent: true,    // 启用窗口透明
  frame: false,         // 无边框模式
  alwaysOnTop: true,   // 窗口始终置顶
  resizable: false,     // 禁止调整大小
  maximizable: false,   // 禁止最大化
  webPreferences: {
    nodeIntegration: true,      // 启用 Node.js 集成
    contextIsolation: false     // 关闭上下文隔离
  }
});
```

关键配置说明：
- `transparent`: 启用窗口透明支持
- `frame`: 关闭默认窗口边框
- `alwaysOnTop`: 保持窗口始终在最上层
- `nodeIntegration` 和 `contextIsolation`: 允许在渲染进程中使用 Node.js API

### 2. 圆形窗口实现

在 `index.html` 中，通过 CSS 实现圆形窗口效果：

```css
html, body {
    margin: 0;
    padding: 0;
    pointer-events: none;  // 关键：禁用 html 和 body 的鼠标事件
}

#app {
    box-sizing: border-box;
    width: 380px;
    height: 380px;
    border-radius: 190px;     // 创建圆形效果
    border: 1px solid #3498db;
    background: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    pointer-events: auto;     // 关键：启用应用区域的鼠标事件
    /* ... 其他样式 ... */
}
```

关键样式说明：
- `pointer-events: none`: 使 html 和 body 的透明区域可以点击穿透
- `pointer-events: auto`: 使圆形区域内可以正常接收鼠标事件
- `border-radius`: 创建圆形效果

### 3. 点击穿透实现

在 `index.html` 的脚本部分实现点击穿透逻辑：

```javascript
const { getCurrentWindow } = require('@electron/remote');
const win = getCurrentWindow();

window.addEventListener('mousemove', event => {
    let flag = event.target === document.documentElement;
    if (flag) {
        win.setIgnoreMouseEvents(true, { forward: true });
    } else {
        win.setIgnoreMouseEvents(false);
    }
});

win.setIgnoreMouseEvents(true, { forward: true });
```

实现原理：
1. 监听 `mousemove` 事件
2. 当鼠标在透明区域时（即 `document.documentElement`），启用鼠标事件穿透
3. 当鼠标在圆形区域内时，禁用鼠标事件穿透
4. `forward: true` 参数确保即使在穿透模式下，也能接收到鼠标移动事件

### 4. 窗口拖动实现

通过 CSS 实现窗口拖动：

```css
#drag-area {
    width: 100%;
    height: 30px;
    -webkit-app-region: drag;  // 启用拖动
    position: absolute;
    top: 0;
}
```

`-webkit-app-region: drag` 使该区域可以用于拖动整个窗口。

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 运行应用：
```bash
npm start
```

## 注意事项

1. 安全性考虑：
   - `contextIsolation: false` 可能带来安全风险，在生产环境中应当谨慎使用
   - 建议在生产环境中实现适当的安全措施

2. 兼容性：
   - 此实现依赖于 Electron 的特定功能，确保使用兼容的 Electron 版本
   - 某些特性在不同操作系统上可能表现不一致

3. 性能优化：
   - 频繁调用 `setIgnoreMouseEvents` 可能影响性能
   - 考虑使用节流（throttle）优化鼠标移动事件处理

## 扩展可能

1. 自定义形状：
   - 可以通过修改 CSS 的 `border-radius` 或使用 `clip-path` 实现其他形状
   - 可以添加 CSS 动画实现形状变换效果

2. 交互增强：
   - 可以添加最小化、关闭按钮
   - 可以实现窗口大小调整功能
   - 可以添加右键菜单功能

3. 视觉优化：
   - 可以添加阴影效果
   - 可以实现毛玻璃效果
   - 可以添加过渡动画

## 许可证

ISC 