/*eslint-disable*/

import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import Environment from "../config/Environment";
import Agent from "../models/Agent";
import MessagePatternCommand from "./MessagePatternCommand";
import { Currency } from "../commons/Currency";
import { WalletTransactionRequest } from "../payloads/MicroserviceInterfaces";

@Injectable()
export default class ApplicationEventPublisher{

   constructor(@Inject(Environment.getProperty("microservice.config.wallet.name")) private readonly client: ClientProxy) {
   }

   public async publishWalletBalanceWithdrawalRequest(requestPayload: WalletTransactionRequest): Promise<object> {
      const pattern: { cmd: string } = { cmd: MessagePatternCommand.DEBIT_WALLET };
      return await this.client.send<any>(pattern, requestPayload).toPromise();
   }

   public async publishWalletBalanceCreditRequest(requestPayload: WalletTransactionRequest): Promise<object> {
      const pattern: { cmd: string } = { cmd: MessagePatternCommand.DEBIT_WALLET };
      return await this.client.send<any>(pattern, requestPayload).toPromise();
   }

   public async publishWalletTransactionRequest(request: WalletTransactionRequest, messagePattern: MessagePatternCommand): Promise<object> {
      return this.client.send<any>({ cmd: messagePattern }, request);
   }
}