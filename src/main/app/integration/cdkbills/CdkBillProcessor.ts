/*eslint-disable*/

import { Injectable } from "@nestjs/common";
import { CdkAirtimeRequestDTO, CdkAirtimeResponseDTO } from "./CdkRequest";
import { CdkResponseCode } from "./CdkResponseCode";
import AppHelper from "../../utils/AppHelper";

@Injectable()
export default class CdkBillProcessor {


    async processAirtimePurchaseFromVendor(requestDTO: CdkAirtimeRequestDTO): Promise<CdkAirtimeResponseDTO>{
       const mockResponse: CdkAirtimeResponseDTO = new CdkAirtimeResponseDTO();
       mockResponse.beneficialMobileNumber = requestDTO.beneficialMobileNumber;
       mockResponse.amount = requestDTO.amount;
       mockResponse.responseCode = CdkResponseCode.SUCCESS;
       mockResponse.responseMessage = "Successful airtime purchase";
       mockResponse.telco = requestDTO.telco;
       mockResponse.referenceId = "CDK_".concat(String(new Date().getTime()));
       mockResponse.transactionHash = AppHelper.generateUUID();
       return Promise.resolve(mockResponse);
    }

}