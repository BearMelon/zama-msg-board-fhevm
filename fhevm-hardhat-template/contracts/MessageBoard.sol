// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint256, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHEVM Message Board Contract
/// @author FHEVM Message Board DApp
/// @notice A message board contract using FHEVM for privacy-preserving messaging
contract MessageBoard is SepoliaConfig {
    struct Message {
        address author;
        uint256 timestamp;
        euint256 title;      // Encrypted title
        euint256 content;    // Encrypted content
        bool exists;
    }

    // Array to store all message IDs
    uint256[] private messageIds;

    // Mapping from message ID to Message struct
    mapping(uint256 => Message) private messages;

    // Counter for message IDs
    uint256 private nextMessageId = 1;

    // Events
    event MessageAdded(uint256 indexed messageId, address indexed author, uint256 timestamp);
    event MessageDecryptionRequested(uint256 indexed messageId, address indexed requester);

    /// @notice Get the total number of messages
    /// @return The total count of messages
    function getMessageCount() external view returns (uint256) {
        return messageIds.length;
    }

    /// @notice Get all message IDs
    /// @return Array of all message IDs
    function getAllMessageIds() external view returns (uint256[] memory) {
        return messageIds;
    }

    /// @notice Get message metadata (without encrypted content)
    /// @param messageId The ID of the message
    /// @return author The address of the message author
    /// @return timestamp The timestamp when the message was created
    /// @return exists Whether the message exists
    function getMessageMetadata(uint256 messageId) external view returns (
        address author,
        uint256 timestamp,
        bool exists
    ) {
        Message storage message = messages[messageId];
        return (message.author, message.timestamp, message.exists);
    }

    /// @notice Get encrypted title of a message
    /// @param messageId The ID of the message
    /// @return The encrypted title
    function getMessageTitle(uint256 messageId) external view returns (euint256) {
        require(messages[messageId].exists, "Message does not exist");
        return messages[messageId].title;
    }

    /// @notice Get encrypted content of a message
    /// @param messageId The ID of the message
    /// @return The encrypted content
    function getMessageContent(uint256 messageId) external view returns (euint256) {
        require(messages[messageId].exists, "Message does not exist");
        return messages[messageId].content;
    }

    /// @notice Add a new message to the board
    /// @param encryptedTitle The encrypted title of the message
    /// @param titleProof The proof for the title encryption
    /// @param encryptedContent The encrypted content of the message
    /// @param contentProof The proof for the content encryption
    function addMessage(
        externalEuint32 encryptedTitle,
        bytes calldata titleProof,
        externalEuint32 encryptedContent,
        bytes calldata contentProof
    ) external {
        // Decrypt and validate the encrypted inputs using external handles
        euint32 title = FHE.fromExternal(encryptedTitle, titleProof);
        euint32 content = FHE.fromExternal(encryptedContent, contentProof);

        // Convert to euint256 for storage
        euint256 title256 = FHE.asEuint256(title);
        euint256 content256 = FHE.asEuint256(content);

        // Create new message
        uint256 messageId = nextMessageId++;
        messages[messageId] = Message({
            author: msg.sender,
            timestamp: block.timestamp,
            title: title256,
            content: content256,
            exists: true
        });

        // Add to message list
        messageIds.push(messageId);

        // Allow the author to decrypt their own messages
        FHE.allow(title256, msg.sender);
        FHE.allow(content256, msg.sender);
        FHE.allowThis(title256);
        FHE.allowThis(content256);

        emit MessageAdded(messageId, msg.sender, block.timestamp);
    }

    /// @notice Request decryption for a specific message
    /// @param messageId The ID of the message to decrypt
    function requestMessageDecryption(uint256 messageId) external {
        require(messages[messageId].exists, "Message does not exist");

        Message storage message = messages[messageId];

        // Allow the requester to decrypt this message
        FHE.allowTransient(message.title, msg.sender);
        FHE.allowTransient(message.content, msg.sender);

        emit MessageDecryptionRequested(messageId, msg.sender);
    }

    /// @notice Make a message publicly decryptable
    /// @param messageId The ID of the message
    function makeMessagePublic(uint256 messageId) external {
        require(messages[messageId].exists, "Message does not exist");
        require(messages[messageId].author == msg.sender, "Only author can make message public");

        Message storage message = messages[messageId];

        FHE.makePubliclyDecryptable(message.title);
        FHE.makePubliclyDecryptable(message.content);
    }
}
