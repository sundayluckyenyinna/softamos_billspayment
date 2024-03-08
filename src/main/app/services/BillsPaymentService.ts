/*eslint-disable*/


import { HttpStatus, Injectable } from "@nestjs/common";
import AirtimeRequest from "../payloads/RequestPayload";
import { AirtimeVendResponse, ApiResponse } from "../payloads/ResponsePayload";
import Agent from "../models/Agent";
import { ApiRemoteResponse, WalletTransactionData, WalletTransactionRequest } from "../payloads/MicroserviceInterfaces";
import AgentRepository from "../repositories/AgentRepository";
import ApplicationEventPublisher from "../event/ApplicationEventPublisher";
import { TransactionStatus } from "../commons/TransactionStatus";
import { CdkAirtimeRequestDTO, CdkAirtimeResponseDTO } from "../integration/cdkbills/CdkRequest";
import CdkBillProcessor from "../integration/cdkbills/CdkBillProcessor";
import { CdkResponseCode } from "../integration/cdkbills/CdkResponseCode";
import Environment from "../config/Environment";
import ApiException from "../exceptions/ApiException";

@Injectable()
export default class BillsPaymentService{

    constructor(
      private readonly agentRepository: AgentRepository,
      private readonly cdkBillsService: CdkBillProcessor,
      private readonly eventPublisher: ApplicationEventPublisher
    ){}

    async processAirtimeVendRequest(requestPayload: AirtimeRequest): Promise<ApiResponse<AirtimeVendResponse>>{
        const vendResponse: AirtimeVendResponse = new AirtimeVendResponse();
        vendResponse.requestId = requestPayload.requestId;
        vendResponse.telco = requestPayload.telco;
        vendResponse.airtimeAmount = requestPayload.airtimeAmount;
        vendResponse.agentMobileNumber = requestPayload.agentMobileNumber;
        vendResponse.beneficialMobileNumber = requestPayload.beneficialMobileNumber;
        vendResponse.beneficialEmailAddress = requestPayload.beneficialEmailAddress;

        const agent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: requestPayload.agentMobileNumber }});
        if(!agent){
            ApiException.throwNewInstance(HttpStatus.NOT_FOUND, `Agent with mobile number ${requestPayload.agentMobileNumber} not found`);
        }

        // TODO: Do business custom validations
        // Debit the agent wallet for the transaction
        const debitRequest: WalletTransactionRequest = {
            agentMobileNumber: requestPayload.agentMobileNumber,
            amount: requestPayload.airtimeAmount,
            narration: 'Airtime purchase',
            requestId: String("REQ_AIRTIME_" + new Date().getTime())
        }
        const debitResponse: ApiRemoteResponse<WalletTransactionData> = await this.eventPublisher.publishWalletBalanceWithdrawalRequest(debitRequest) as ApiRemoteResponse<WalletTransactionData>;
        if(debitResponse.code === HttpStatus.OK && debitResponse.data.transactionStatus === TransactionStatus.COMPLETED){
            const remoteAirtimeRequest: CdkAirtimeRequestDTO = {
                beneficialMobileNumber: requestPayload.beneficialMobileNumber,
                amount: String(requestPayload.airtimeAmount),
                telco: requestPayload.telco,
                referenceId: requestPayload.requestId,
                comment: "Airtime request"
            }
            const cdkResponse: CdkAirtimeResponseDTO = await this.cdkBillsService.processAirtimePurchaseFromVendor(remoteAirtimeRequest);
            if(cdkResponse && cdkResponse.responseCode === CdkResponseCode.SUCCESS){
                vendResponse.transactionStatus = TransactionStatus.COMPLETED;
                const commissionPercent: string = Environment.getProperty("commission.bills-payment.airtime.".concat(requestPayload.telco.toUpperCase()));
                this.processBillPaymentCommission(Number(commissionPercent), requestPayload.airtimeAmount, agent);
                return new ApiResponse<AirtimeVendResponse>(HttpStatus.OK, "Successful airtime purchase", vendResponse);
            }
            vendResponse.transactionStatus = TransactionStatus.FAILED;
            return new ApiResponse<AirtimeVendResponse>(HttpStatus.SERVICE_UNAVAILABLE, cdkResponse.responseMessage, vendResponse);
        }
        vendResponse.transactionStatus = debitResponse.data ? debitResponse.data.transactionStatus : TransactionStatus.FAILED;
        return new ApiResponse<AirtimeVendResponse>(debitResponse.code, debitResponse.message, vendResponse);
    }


    private async processBillPaymentCommission(commissionPercent: number, amount: number, agent: Agent): Promise<void> {
        const commission: number = (commissionPercent / 100) * amount;
        const walletTransactionRequest: WalletTransactionRequest = {
            agentMobileNumber: agent.mobileNumber,
            amount: commission,
            narration: 'Airtime commission',
            requestId: String("REQ_AIRTIME_" + new Date().getTime())
        }
        await this.eventPublisher.publishWalletBalanceCreditRequest(walletTransactionRequest);
    }
}