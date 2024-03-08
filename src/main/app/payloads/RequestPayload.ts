/*eslint-disable*/

import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export default class AirtimeRequest{

  @ApiProperty({ name: "agentMobileNumber", type: String })
  agentMobileNumber: string;

  @ApiProperty({ name: "beneficialMobileNumber", type: String })
  beneficialMobileNumber: string;

  @ApiProperty({ name: "beneficialEmailAddress", type: String })
  beneficialEmailAddress: string;

  @ApiProperty({ name: "airtimeAmount", type: String })
  airtimeAmount: number;

  @ApiProperty({ name: "telco", type: String })
  @IsIn(["MTN", "GLO"])
  telco: string;

  @ApiProperty({ name: "requestId", type: String })
  requestId: string;
}