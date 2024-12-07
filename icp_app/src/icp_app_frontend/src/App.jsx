import React, { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "declarations/wallet_contract";

const WalletApp = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferPrincipal, setTransferPrincipal] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [subAccountName, setSubAccountName] = useState("");

  // Canister bağlantısı
  const agent = new HttpAgent();
  const canisterId = "your-canister-id-here"; // Gerçek canister ID'nizi buraya ekleyin
  const walletActor = Actor.createActor(idlFactory, { agent, canisterId });

  // Hesap oluşturma
  const createAccount = async () => {
    setLoading(true);
    try {
      const newAccount = await walletActor.createAccount();
      setAccount(newAccount);
      setError(null);
    } catch (err) {
      setError("Hesap oluşturulurken hata oluştu");
    }
    setLoading(false);
  };

  // Alt hesap ekleme
  const addSubAccount = async () => {
    setLoading(true);
    try {
      const updatedAccount = await walletActor.addSubAccount(subAccountName);
      setAccount(updatedAccount);
      setSubAccountName("");
      setError(null);
    } catch (err) {
      setError("Alt hesap eklenirken hata oluştu");
    }
    setLoading(false);
  };

  // Para yükleme
  const depositFunds = async () => {
    setLoading(true);
    try {
      const newBalance = await walletActor.deposit(Number(depositAmount));
      // Bakiye güncelleme
      setDepositAmount("");
      setError(null);
    } catch (err) {
      setError("Para yüklenirken hata oluştu");
    }
    setLoading(false);
  };

  // Para çekme
  const withdrawFunds = async () => {
    setLoading(true);
    try {
      const newBalance = await walletActor.withdraw(Number(withdrawAmount));
      // Bakiye güncelleme
      setWithdrawAmount("");
      setError(null);
    } catch (err) {
      setError("Para çekilirken hata oluştu");
    }
    setLoading(false);
  };

  // Token transfer
  const transferToken = async () => {
    setLoading(true);
    try {
      const toPrincipal = Principal.fromText(transferPrincipal);
      const result = await walletActor.transferToken(
        toPrincipal,
        Number(transferAmount)
      );
      setTransferAmount("");
      setTransferPrincipal("");
      setError(null);
    } catch (err) {
      setError("Token transferi yapılırken hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ICP Multi-Wallet</h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Hesap Oluşturma */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Hesap İşlemleri</h2>
          <button
            onClick={createAccount}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Hesap Oluştur
          </button>

          {/* Alt Hesap Ekleme */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Alt Hesap Adı"
              value={subAccountName}
              onChange={(e) => setSubAccountName(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={addSubAccount}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Alt Hesap Ekle
            </button>
          </div>
        </div>

        {/* Para Yükleme & Çekme */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Para İşlemleri</h2>

          {/* Para Yükleme */}
          <div className="mb-4">
            <input
              type="number"
              placeholder="Yüklenecek Miktar"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={depositFunds}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Para Yükle
            </button>
          </div>

          {/* Para Çekme */}
          <div>
            <input
              type="number"
              placeholder="Çekilecek Miktar"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={withdrawFunds}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Para Çek
            </button>
          </div>
        </div>

        {/* Token Transfer */}
        <div className="border p-4 rounded col-span-full">
          <h2 className="font-semibold mb-2">Token Transfer</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Alıcı Principal ID"
              value={transferPrincipal}
              onChange={(e) => setTransferPrincipal(e.target.value)}
              className="border p-2 rounded flex-grow"
            />
            <input
              type="number"
              placeholder="Transfer Miktarı"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={transferToken}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Transfer Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletApp;
