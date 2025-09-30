# Zama FHEVM Message Board DApp

**Privacy-First Blockchain Messaging**

This innovative DApp demonstrates fully homomorphic encryption (FHE) on Ethereum via FHEVM. Users can post encrypted messages permanently stored on-chain, with content remaining private even from blockchain validators.

## ✨ Key Features

- 🔐 **End-to-End Privacy**: Messages encrypted using FHEVM, decrypted only by authorized users
- 📝 **Immutable Storage**: Messages permanently stored on blockchain, tamper-proof
- 🎨 **Modern UI**: Beautiful gradient design with card-based layout and dark mode
- ⚡ **Real-time Updates**: Live message loading and refresh capabilities
- 🔗 **Wallet Integration**: Full MetaMask integration with network switching

## 🏗️ Tech Stack

### Backend (Smart Contracts)
- **Solidity**: Smart contract development
- **FHEVM**: Fully Homomorphic Encryption Virtual Machine
- **Hardhat**: Contract compilation and deployment
- **SepoliaConfig**: FHEVM network configuration

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Modern utility-first CSS framework
- **@zama-fhe/relayer-sdk**: FHEVM Relayer SDK for production
- **@fhevm/mock-utils**: Local development mock utilities
- **ethers.js**: Ethereum blockchain interaction

## 📁 Project Structure

```
zama-msg-board-fhevm/
├── fhevm-hardhat-template/          # Smart contract project
│   ├── contracts/MessageBoard.sol   # Main message board contract
│   ├── deploy/                      # Deployment scripts
│   └── test/                        # Contract tests
├── frontend/                        # Next.js frontend application
│   ├── components/
│   │   ├── MessageBoardDemo.tsx     # Main message board component
│   │   └── ErrorNotDeployed.tsx     # Error handling component
│   ├── hooks/
│   │   ├── useMessageBoard.tsx      # Message board business logic
│   │   └── useMetaMaskEthersSigner.tsx # Wallet connection hook
│   ├── abi/                         # Generated contract ABIs
│   └── fhevm/                       # FHEVM utilities and types
└── Fhevm0.8_Reference.md            # FHEVM development reference
```

## 📋 Smart Contract Features

### MessageBoard.sol Contract

```solidity
contract MessageBoard is SepoliaConfig {
    struct Message {
        address author;
        uint256 timestamp;
        euint256 title;      // Encrypted title
        euint256 content;    // Encrypted content
        bool exists;
    }

    // Core functions
    function addMessage(...) external;        // Add message
    function getMessageMetadata(...) external view; // Get metadata
    function getMessageTitle(...) external view;     // Get encrypted title
    function getMessageContent(...) external view;   // Get encrypted content
    function requestMessageDecryption(...) external; // Request decryption
}
```

### Privacy Protection Mechanism

1. **Encrypted Input**: Messages are encrypted client-side before sending to blockchain
2. **Access Control**: FHEVM ACL system controls who can decrypt messages
3. **Temporary Authorization**: Support for temporary access grants to other users
4. **Signature Verification**: Relayer validates decryption request legitimacy

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 7.0.0
- MetaMask browser extension
- Local Hardhat node (for development)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/BearMelon/zama-msg-board-fhevm.git
   cd zama-msg-board-fhevm
   ```

2. **Install contract dependencies**
   ```bash
   cd fhevm-hardhat-template
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start local Hardhat node**
   ```bash
   cd ../fhevm-hardhat-template
   npx hardhat node
   ```

5. **Deploy contracts** (new terminal)
   ```bash
   cd fhevm-hardhat-template
   npx hardhat deploy --network localhost --tags MessageBoard
   ```

6. **Generate ABIs**
   ```bash
   cd ../frontend
   npm run gen-messageboard-abi
   ```

7. **Start frontend dev server**
   ```bash
   npm run dev:mock
   ```

8. **Access the application**
   Open browser to `http://localhost:3000`

## 📖 Usage Guide

### Connect Wallet

1. Click "🔗 Connect to MetaMask" button
2. Approve connection request in MetaMask
3. Ensure connected to local Hardhat network (localhost:8545)

### Post Messages

1. Enter message title in "Title" field
2. Enter message content in "Content" field
3. Click "📝 Post Message" button
4. Wait for transaction confirmation

### View Messages

1. Message list loads automatically
2. Click "🔄 Refresh" to manually refresh
3. Click "🔓 Decrypt Message" to view encrypted content

## 🔧 Development vs Production Mode

### Development Mode (Mock)
- Uses `@fhevm/mock-utils` for local simulation
- No real FHEVM network required
- Perfect for rapid development and testing
- Command: `npm run dev:mock`

### Production Mode
- Uses real `@zama-fhe/relayer-sdk`
- Connects to FHEVM network (Sepolia testnet)
- Requires FHEVM Relayer service
- Command: `npm run dev`

## 🔐 FHEVM Integration Details

### SDK Initialization Flow

```typescript
// 1. Load SDK
await fhevmLoadSDK();

// 2. Initialize SDK
await fhevmInitSDK();

// 3. Create FHEVM instance
const instance = await relayerSDK.createInstance(config);
```

### Encrypted Input Processing

```typescript
// Create encrypted input
const input = instance.createEncryptedInput(contractAddress, signerAddress);
input.add32(BigInt(value));

// Encrypt
const encrypted = await input.encrypt();

// Send to contract
await contract.addMessage(encrypted.handles[0], encrypted.inputProof);
```

### Decryption Flow

```typescript
// 1. Get decryption signature
const sig = await FhevmDecryptionSignature.loadOrSign(
  instance, [contractAddress], signer, storage
);

// 2. Request decryption
const result = await instance.userDecrypt(
  [{ handle, contractAddress }],
  sig.privateKey, sig.publicKey, sig.signature,
  sig.contractAddresses, sig.userAddress,
  sig.startTimestamp, sig.durationDays
);

// 3. Get plaintext
const clearValue = result[handle];
```

## 🛡️ Security Considerations

1. **Access Control**: Only message authors can decrypt their own messages
2. **Temporary Authorization**: Support for temporary access grants to other users
3. **Replay Protection**: Decryption requests include timestamp and signature validation
4. **Network Security**: Contracts run on FHEVM, providing additional security layer

## 🚀 Deployment Status

- ✅ **Smart Contract**: Deployed on Sepolia testnet
- ✅ **Contract Address**: `0x673B3b40fc67b78ef9CB5d95b902Ea6c4531212A`
- ✅ **Frontend**: Static export ready for hosting
- ✅ **GitHub Repository**: https://github.com/BearMelon/zama-msg-board-fhevm

## 🔮 Future Enhancements

- [ ] Image upload support
- [ ] Message liking system
- [ ] User reputation system
- [ ] Message search functionality
- [ ] Multi-language support

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project!

## 📄 License

BSD-3-Clause-Clear License

## 🙏 Acknowledgments

- [Zama](https://zama.ai/) - FHEVM technology provider
- [FHEVM Documentation](https://docs.zama.ai/fhevm) - Official documentation
- [fhevm-react-template](https://github.com/zama-ai/fhevm-react-template) - Project template
