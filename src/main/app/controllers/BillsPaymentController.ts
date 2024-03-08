/*eslint-disable*/


import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { AirtimeVendResponse, ApiResponse, BadRequestPayload, InternalServerError } from "../payloads/ResponsePayload";
import BillsPaymentService from "../services/BillsPaymentService";
import AirtimeRequest from "../payloads/RequestPayload";


@ApiTags('Agent account service')
@ApiBadRequestResponse({ description: "Bad request response", status: HttpStatus.BAD_REQUEST, type: BadRequestPayload })
@ApiCreatedResponse({ status: HttpStatus.CREATED })
@ApiInternalServerErrorResponse({ description: "Server error",  type: InternalServerError })
@ApiBearerAuth()
@Controller({ path: '/bills'})
export default class BillsPaymentController{


  constructor(private readonly billsPaymentService: BillsPaymentService) {
  }

   @Post('/airtime/vending')
   @ApiOperation({ description: "This API make airtime purchase"})
   @ApiOkResponse({description: "Successful response", status: 200, type: ApiResponse<AirtimeVendResponse>})
   async handleAirtimeVendingRequest(@Body() request: AirtimeRequest): Promise<ApiResponse<AirtimeVendResponse>>{
       return this.billsPaymentService.processAirtimeVendRequest(request);
   }
}