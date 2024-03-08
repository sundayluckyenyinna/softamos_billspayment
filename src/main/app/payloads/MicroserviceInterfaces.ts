/* eslint-disable*/


export interface BaseRemoteResponse{
   code: number;
   message: string;
}

export interface ApiRemoteResponse<T> extends BaseRemoteResponse{
   data: T;
}

export interface WalletTransactionRequest{
   amount: number;
   agentMobileNumber: string;
   narration: string;
   requestId: string;
}

export interface WalletTransactionData{
  walletId: string;
  status: string;
  agentMobileNumber: string;
  agentEmail: string;
  agentUid: string;
  agentName: string;
  currency: string;
  createdAt: string;
  balance: number;
  transactionStatus: string;
}