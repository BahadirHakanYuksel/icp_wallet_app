import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

actor WalletManager {
  type Account = {
    owner: Principal;
    balance: Nat;
    subAccounts: [SubAccount];
  };

  type SubAccount = {
    name: Text;
    balance: Nat;
  };

  type TransferResult = Result.Result<Nat, Text>;

  private var accounts = HashMap.HashMap<Principal, Account>(10, Principal.equal, Principal.hash);

  // Yeni hesap oluşturma
  public shared(msg) func createAccount() : async Account {
    let existingAccount = accounts.get(msg.caller);
    switch (existingAccount) {
      case (null) {
        let newAccount : Account = {
          owner = msg.caller;
          balance = 0;
          subAccounts = [];
        };
        accounts.put(msg.caller, newAccount);
        newAccount;
      };
      case (?account) { account };
    };
  };

  // Alt hesap ekleme
  public shared(msg) func addSubAccount(name: Text) : async ?Account {
    var account = accounts.get(msg.caller);
    switch (account) {
      case (null) { null };
      case (?existingAccount) {
        let updatedSubAccounts = Array.append(
          existingAccount.subAccounts, 
          [{name = name; balance = 0}]
        );
        let updatedAccount : Account = {
          owner = existingAccount.owner;
          balance = existingAccount.balance;
          subAccounts = updatedSubAccounts;
        };
        accounts.put(msg.caller, updatedAccount);
        ?updatedAccount;
      };
    };
  };

  // Para yükleme
  public shared(msg) func deposit(amount: Nat) : async TransferResult {
    var account = accounts.get(msg.caller);
    switch (account) {
      case (null) { #err("Hesap bulunamadı") };
      case (?existingAccount) {
        let updatedAccount : Account = {
          owner = existingAccount.owner;
          balance = existingAccount.balance + amount;
          subAccounts = existingAccount.subAccounts;
        };
        accounts.put(msg.caller, updatedAccount);
        #ok(updatedAccount.balance);
      };
    };
  };

  // Para çekme
  public shared(msg) func withdraw(amount: Nat) : async TransferResult {
    var account = accounts.get(msg.caller);
    switch (account) {
      case (null) { #err("Hesap bulunamadı") };
      case (?existingAccount) {
        if (existingAccount.balance < amount) {
          #err("Yetersiz bakiye");
        } else {
          let updatedAccount : Account = {
            owner = existingAccount.owner;
            balance = existingAccount.balance - amount;
            subAccounts = existingAccount.subAccounts;
          };
          accounts.put(msg.caller, updatedAccount);
          #ok(updatedAccount.balance);
        };
      };
    };
  }; 

  // Token transfer
  public shared(msg) func transferToken(
    to: Principal, 
    amount: Nat
  ) : async TransferResult {
    var fromAccount = accounts.get(msg.caller);
    var toAccount = accounts.get(to);

    switch (fromAccount, toAccount) {
      case (null, _) { #err("Gönderen hesap bulunamadı") };
      case (_, null) { #err("Alıcı hesap bulunamadı") };
      case (?from, ?receiver) {
        if (from.balance < amount) {
          #err("Yetersiz bakiye");
        } else {
          let updatedFromAccount : Account = {
            owner = from.owner;
            balance = from.balance - amount;
            subAccounts = from.subAccounts;
          };

          let updatedToAccount : Account = {
            owner = receiver.owner;
            balance = receiver.balance + amount;
            subAccounts = receiver.subAccounts;
          };

          accounts.put(msg.caller, updatedFromAccount);
          accounts.put(to, updatedToAccount);
          
          #ok(updatedFromAccount.balance);
        };
      };
    };
  };

  // Hesap bakiyesi sorgulama
  public shared(msg) func getAccountBalance() : async Nat {
    let account = accounts.get(msg.caller);
    switch (account) {
      case (null) { 0 };
      case (?existingAccount) { existingAccount.balance };
    };
  };
}