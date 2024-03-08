/*eslint-disable*/

export interface CdkAirtimeRequestDTO{
  beneficialMobileNumber: string;
  amount: string;
  telco: string;
  referenceId: string;
  comment: string;
}

export class CdkAirtimeResponseDTO {
   responseCode: string;
   responseMessage: string;
   referenceId: string;
   transactionHash: string;
   amount: string;
   telco: string;
   beneficialMobileNumber: string;
}

