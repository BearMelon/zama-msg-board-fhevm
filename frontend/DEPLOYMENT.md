# FHEVM Message Board - 静态部署说明

## 📦 静态文件位置

静态文件已生成在 `frontend/out/` 目录中，包含：

```
/out/
├── index.html          # 主页面
├── 404.html           # 404错误页面
├── _next/             # Next.js静态资源
│   └── static/
│       ├── chunks/    # JavaScript代码块
│       └── css/       # 样式文件
├── icon.png           # 应用图标
└── zama-logo.svg      # Zama logo
```

## 🚀 部署到Web服务器

### 方法1: 使用Nginx
```bash
# 复制文件到Nginx目录
sudo cp -r out/* /var/www/html/

# 配置Nginx (添加CORS头)
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        index index.html;

        # FHEVM需要的CORS头
        add_header Cross-Origin-Opener-Policy same-origin;
        add_header Cross-Origin-Embedder-Policy require-corp;

        try_files $uri $uri/ /index.html;
    }
}
```

### 方法2: 使用Apache
```bash
# 复制文件到Apache目录
sudo cp -r out/* /var/www/html/

# 创建.htaccess文件
cat > /var/www/html/.htaccess << EOF
<IfModule mod_headers.c>
    Header set Cross-Origin-Opener-Policy "same-origin"
    Header set Cross-Origin-Embedder-Policy "require-corp"
</IfModule>

RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF
```

### 方法3: 使用Vercel/Netlify
```bash
# 上传out目录到Vercel或Netlify
# 这些平台会自动处理静态文件部署
```

### 方法4: 使用GitHub Pages
```bash
# 如果使用GitHub Pages，需要设置basePath
# 在next.config.ts中添加: basePath: '/your-repo-name'
```

## ⚠️ 重要注意事项

1. **HTTPS必需**: FHEVM应用必须通过HTTPS提供服务
2. **CORS头**: 必须设置正确的CORS头以支持FHEVM功能
3. **MetaMask集成**: 用户需要安装MetaMask钱包
4. **网络选择**: 应用会自动连接到Sepolia测试网

## 🔗 合约信息

- **合约地址**: `0x673B3b40fc67b78ef9CB5d95b902Ea6c4531212A`
- **网络**: Sepolia测试网 (Chain ID: 11155111)
- **交易哈希**: `0x2516c39a39edbf03e2c32ae535a391ec0b6c41e73ad1207808b1ac7a4006184b`

## 🛠️ 重新生成静态文件

```bash
cd frontend
npm run gen-messageboard-abi  # 更新ABI
npm run export               # 生成静态文件
```

## 🌐 测试部署

部署完成后，在浏览器中打开网站，应该能看到：
1. Zama FHEVM SDK Quickstart界面
2. "🔗 Connect to MetaMask" 按钮
3. 成功连接钱包后显示留言板界面

## 📋 功能特性

- ✅ 完全加密的链上留言板
- ✅ FHEVM支持的隐私保护
- ✅ MetaMask钱包集成
- ✅ Sepolia测试网部署
- ✅ 响应式设计
- ✅ 静态部署，无需服务器
