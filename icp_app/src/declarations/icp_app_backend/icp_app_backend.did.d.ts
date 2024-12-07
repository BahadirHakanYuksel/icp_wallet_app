import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'balance' : bigint,
  'owner' : Principal,
  'subAccounts' : Array<SubAccount>,
}
export interface SubAccount { 'balance' : bigint, 'name' : string }
export type TransferResult = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addSubAccount' : ActorMethod<[string], [] | [Account]>,
  'createAccount' : ActorMethod<[], Account>,
  'deposit' : ActorMethod<[bigint], TransferResult>,
  'getAccountBalance' : ActorMethod<[], bigint>,
  'transferToken' : ActorMethod<[Principal, bigint], TransferResult>,
  'withdraw' : ActorMethod<[bigint], TransferResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
