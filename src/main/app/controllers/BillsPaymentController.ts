/*eslint-disable*/


import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags
} from "@nestjs/swagger";
import { Controller, HttpStatus } from "@nestjs/common";
import { BadRequestPayload, InternalServerError } from "../payloads/ResponsePayload";


@ApiTags('Agent account service')
@ApiBadRequestResponse({ description: "Bad request response", status: HttpStatus.BAD_REQUEST, type: BadRequestPayload })
@ApiCreatedResponse({ status: HttpStatus.CREATED })
@ApiInternalServerErrorResponse({ description: "Server error",  type: InternalServerError })
@ApiBearerAuth()
@Controller({ path: '/bills'})
export default class BillsPaymentController{

}