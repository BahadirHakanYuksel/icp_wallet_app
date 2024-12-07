export const idlFactory = ({ IDL }) => {
  const SubAccount = IDL.Record({ 'balance' : IDL.Nat, 'name' : IDL.Text });
  const Account = IDL.Record({
    'balance' : IDL.Nat,
    'owner' : IDL.Principal,
    'subAccounts' : IDL.Vec(SubAccount),
  });
  const TransferResult = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'addSubAccount' : IDL.Func([IDL.Text], [IDL.Opt(Account)], []),
    'createAccount' : IDL.Func([], [Account], []),
    'deposit' : IDL.Func([IDL.Nat], [TransferResult], []),
    'getAccountBalance' : IDL.Func([], [IDL.Nat], []),
    'transferToken' : IDL.Func([IDL.Principal, IDL.Nat], [TransferResult], []),
    'withdraw' : IDL.Func([IDL.Nat], [TransferResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
