
/*
  This file is auto-generated.
  Command: 'npm run gen-messageboard-abi'
*/
export const MessageBoardABI = {
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "MessageAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "requester",
          "type": "address"
        }
      ],
      "name": "MessageDecryptionRequested",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedTitle",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "titleProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "encryptedContent",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "contentProof",
          "type": "bytes"
        }
      ],
      "name": "addMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllMessageIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "getMessageContent",
      "outputs": [
        {
          "internalType": "euint256",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMessageCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "getMessageMetadata",
      "outputs": [
        {
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "getMessageTitle",
      "outputs": [
        {
          "internalType": "euint256",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "makeMessagePublic",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "requestMessageDecryption",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

