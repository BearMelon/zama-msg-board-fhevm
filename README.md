# FHEVM Message Board DApp

一个基于FHEVM的隐私保护链上留言板DApp，用户可以在区块链上发布加密留言，确保隐私性和不可篡改性。

## 功能特性

- 🔐 **隐私保护**: 使用FHEVM技术加密留言内容，确保只有授权用户能查看
- 📝 **链上存储**: 留言永久保存在区块链上，不可篡改
- 🎨 **美观界面**: 现代化的渐变设计和卡片式布局
- ⚡ **实时更新**: 支持实时加载和刷新留言
- 🔗 **钱包集成**: 完整的MetaMask集成和网络切换

## 技术栈

### 后端 (智能合约)
- **Solidity**: 智能合约开发
- **FHEVM**: 完全同态加密虚拟机
- **Hardhat**: 合约编译和部署工具
- **SepoliaConfig**: FHEVM网络配置

### 前端
- **Next.js 15**: React框架
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 现代化CSS框架
- **@zama-fhe/relayer-sdk**: FHEVM Relayer SDK
- **@fhevm/mock-utils**: 本地开发模拟工具
- **ethers.js**: 以太坊交互库

## 项目结构

```
zama_msg_board/
├── fhevm-hardhat-template/          # 智能合约项目
│   ├── contracts/MessageBoard.sol   # 留言板合约
│   ├── deploy/                      # 部署脚本
│   └── test/                        # 合约测试
├── frontend/                        # Next.js前端应用
│   ├── components/
│   │   ├── MessageBoardDemo.tsx     # 主留言板组件
│   │   └── ErrorNotDeployed.tsx     # 错误处理组件
│   ├── hooks/
│   │   ├── useMessageBoard.tsx      # 留言板业务逻辑
│   │   └── useMetaMaskEthersSigner.tsx # 钱包连接
│   ├── abi/                         # 生成的合约ABI
│   └── fhevm/                       # FHEVM工具和类型
└── Fhevm0.8_Reference.md            # FHEVM开发参考文档
```

## 智能合约功能

### MessageBoard.sol 合约特性

```solidity
contract MessageBoard is SepoliaConfig {
    struct Message {
        address author;
        uint256 timestamp;
        euint256 title;      // 加密标题
        euint256 content;    // 加密内容
        bool exists;
    }

    // 核心功能
    function addMessage(...) external;        // 添加留言
    function getMessageMetadata(...) external view; // 获取元数据
    function getMessageTitle(...) external view;     // 获取加密标题
    function getMessageContent(...) external view;   // 获取加密内容
    function requestMessageDecryption(...) external; // 请求解密
}
```

### 隐私保护机制

1. **加密输入**: 留言标题和内容在客户端加密后发送到链上
2. **访问控制**: 使用FHEVM的ACL系统控制谁能解密留言
3. **临时授权**: 支持为特定用户临时授权查看留言
4. **签名验证**: 通过Relayer验证解密请求的合法性

## 快速开始

### 环境要求

- Node.js >= 20
- npm >= 7.0.0
- MetaMask浏览器扩展
- 本地Hardhat节点 (用于开发)

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd zama_msg_board
   ```

2. **安装合约依赖**
   ```bash
   cd fhevm-hardhat-template
   npm install
   ```

3. **安装前端依赖**
   ```bash
   cd ../frontend
   npm install
   ```

4. **启动本地Hardhat节点**
   ```bash
   cd ../fhevm-hardhat-template
   npx hardhat node
   ```

5. **部署合约** (新终端)
   ```bash
   cd fhevm-hardhat-template
   npx hardhat deploy --network localhost --tags MessageBoard
   ```

6. **生成ABI**
   ```bash
   cd ../frontend
   npm run gen-messageboard-abi
   ```

7. **启动前端开发服务器**
   ```bash
   npm run dev:mock
   ```

8. **访问应用**
   打开浏览器访问 `http://localhost:3000`

## 使用说明

### 连接钱包

1. 点击"🔗 Connect to MetaMask"按钮
2. 在MetaMask中批准连接请求
3. 确保连接到本地Hardhat网络 (localhost:8545)

### 发布留言

1. 在"Title"字段输入留言标题
2. 在"Content"字段输入留言内容
3. 点击"📝 Post Message"按钮
4. 等待交易确认

### 查看留言

1. 留言列表会自动加载显示
2. 点击"🔄 Refresh"按钮手动刷新
3. 点击"🔓 Decrypt Message"查看加密留言内容

## 开发模式 vs 生产模式

### 开发模式 (Mock)
- 使用 `@fhevm/mock-utils` 本地模拟
- 无需真实的FHEVM网络
- 适合快速开发和测试
- 命令: `npm run dev:mock`

### 生产模式
- 使用真实的 `@zama-fhe/relayer-sdk`
- 连接到FHEVM网络 (Sepolia测试网)
- 需要FHEVM Relayer服务
- 命令: `npm run dev`

## FHEVM集成详解

### SDK初始化流程

```typescript
// 1. 加载SDK
await fhevmLoadSDK();

// 2. 初始化SDK
await fhevmInitSDK();

// 3. 创建FHEVM实例
const instance = await relayerSDK.createInstance(config);
```

### 加密输入处理

```typescript
// 创建加密输入
const input = instance.createEncryptedInput(contractAddress, signerAddress);
input.add256(BigInt(value));

// 加密
const encrypted = await input.encrypt();

// 发送到合约
await contract.addMessage(encrypted.handles[0], encrypted.inputProof);
```

### 解密流程

```typescript
// 1. 获取解密签名
const sig = await FhevmDecryptionSignature.loadOrSign(
  instance, [contractAddress], signer, storage
);

// 2. 请求解密
const result = await instance.userDecrypt(
  [{ handle, contractAddress }],
  sig.privateKey, sig.publicKey, sig.signature,
  sig.contractAddresses, sig.userAddress,
  sig.startTimestamp, sig.durationDays
);

// 3. 获取明文
const clearValue = result[handle];
```

## 安全考虑

1. **访问控制**: 只有留言作者能解密自己的留言
2. **临时授权**: 支持为其他用户临时授权查看
3. **重放保护**: 解密请求包含时间戳和签名验证
4. **网络安全**: 合约在FHEVM上运行，提供额外的安全层

## 扩展功能

- [ ] 支持图片上传
- [ ] 留言点赞功能
- [ ] 用户声誉系统
- [ ] 留言搜索功能
- [ ] 多语言支持

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

BSD-3-Clause-Clear License

## 致谢

- [Zama](https://zama.ai/) - FHEVM技术提供者
- [FHEVM Documentation](https://docs.zama.ai/fhevm) - 官方文档
- [fhevm-react-template](https://github.com/zama-ai/fhevm-react-template) - 项目模板
