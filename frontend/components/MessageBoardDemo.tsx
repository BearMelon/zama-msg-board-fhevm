"use client";

import { useState } from "react";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useMessageBoard } from "@/hooks/useMessageBoard";
import { errorNotDeployed } from "./ErrorNotDeployed";

export const MessageBoardDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // useMessageBoard hook
  //////////////////////////////////////////////////////////////////////////////

  const messageBoard = useMessageBoard({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI States
  //////////////////////////////////////////////////////////////////////////////

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  //////////////////////////////////////////////////////////////////////////////
  // UI Styles
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:shadow-xl";

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const cardClass =
    "rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl";

  const titleClass = "font-semibold text-gray-900 text-lg mb-2";

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  //////////////////////////////////////////////////////////////////////////////
  // UI Components
  //////////////////////////////////////////////////////////////////////////////

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <button
            className={buttonClass}
            disabled={isConnected}
            onClick={connect}
          >
            <span className="text-2xl">🔗 Connect to MetaMask</span>
          </button>
        </div>
      </div>
    );
  }

  if (messageBoard.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">FHEVM Message Board</h1>
          <p className="text-blue-100 text-lg">Privacy-preserving messaging on the blockchain</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chain Info */}
          <div className={cardClass}>
            <h3 className={titleClass}>Network</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Chain ID:</span>
                <span className="font-mono font-semibold">{chainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connected:</span>
                <span className="text-green-600 font-semibold">✓</span>
              </div>
            </div>
          </div>

          {/* FHEVM Status */}
          <div className={cardClass}>
            <h3 className={titleClass}>FHEVM Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Instance:</span>
                <span className={`font-semibold ${fhevmInstance ? 'text-green-600' : 'text-red-600'}`}>
                  {fhevmInstance ? '✓ Ready' : '✗ Loading'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-mono text-xs">{fhevmStatus}</span>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className={cardClass}>
            <h3 className={titleClass}>Contract</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-mono text-xs">
                  {messageBoard.contractAddress ? formatAddress(messageBoard.contractAddress) : 'Not deployed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Messages:</span>
                <span className="font-semibold">{messageBoard.messages.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Message Form */}
        <div className={cardClass}>
          <h3 className={titleClass}>✍️ Post New Message</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter message title..."
                className={inputClass}
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter your message..."
                rows={4}
                className={inputClass}
                maxLength={500}
              />
            </div>
            <button
              className={buttonClass}
              disabled={!messageBoard.canAddMessage || !newTitle.trim() || !newContent.trim()}
              onClick={() => {
                console.log('Post button clicked with:', {
                  title: newTitle.trim(),
                  content: newContent.trim(),
                  canAddMessage: messageBoard.canAddMessage
                });
                messageBoard.addMessage(newTitle.trim(), newContent.trim());
                setNewTitle("");
                setNewContent("");
              }}
            >
              {messageBoard.isAddingMessage ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </span>
              ) : (
                "📝 Post Message"
              )}
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={titleClass}>💬 Messages ({messageBoard.messages.length})</h3>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              onClick={messageBoard.refreshMessages}
              disabled={!messageBoard.canGetMessages}
            >
              {messageBoard.isRefreshing ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>

          {messageBoard.messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg">No messages yet. Be the first to post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messageBoard.messages.map((msg) => (
                <div key={msg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {msg.author.slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatAddress(msg.author)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      #{msg.id}
                    </div>
                  </div>

                  {msg.isDecrypted ? (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">{msg.title}</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        onClick={() => messageBoard.decryptMessage(msg.id)}
                        disabled={!messageBoard.canDecryptMessage}
                      >
                        {messageBoard.isDecrypting ? "Decrypting..." : "🔓 Decrypt Message"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Message */}
        {messageBoard.message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">{messageBoard.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
