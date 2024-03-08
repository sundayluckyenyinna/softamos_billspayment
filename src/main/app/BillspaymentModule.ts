/*eslint-disable*/

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Agent from "./models/Agent";
import AgentAuth from "./models/AgentAuth";
import AgentWallet from "./models/AgentWallet";
import AgentRepository from "./repositories/AgentRepository";
import AgentAuthRepository from "./repositories/AgentAuthRepository";
import AgentVirtualAccount from "./models/AgentVirtualAccount";
import AgentVirtualAccountRepository from "./repositories/AgentVirtualAccountRepository";
import AgentWalletRepository from "./repositories/AgentWalletRepository";
import AgentWalletTransactionRepository from "./repositories/AgentWalletTransactionRepository";
import AgentWalletTransaction from "./models/AgentWalletTransaction";
import ApplicationLoggerMiddleware from "./middlewares/ApplicationLoggerMiddleware";
import AuthenticationMiddleware from "./middlewares/AuthenticationMiddleware";
import CdkBillProcessor from "./integration/cdkbills/CdkBillProcessor";
import BillsPaymentController from "./controllers/BillsPaymentController";
import BillsPaymentService from "./services/BillsPaymentService";

@Module({
  imports: [ TypeOrmModule.forFeature([Agent, AgentAuth, AgentWallet, AgentVirtualAccount, AgentWalletTransaction])],
  providers: [
    AgentRepository, AgentAuthRepository, AgentVirtualAccountRepository,
    AgentWalletRepository, AgentWalletTransactionRepository, ApplicationLoggerMiddleware, AuthenticationMiddleware,
    CdkBillProcessor, BillsPaymentService
  ],
  controllers: [BillsPaymentController],
  exports: [AgentRepository]
})

export default class BillspaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ApplicationLoggerMiddleware, AuthenticationMiddleware)
      .forRoutes({path: "/**", method: RequestMethod.ALL});
  }

}