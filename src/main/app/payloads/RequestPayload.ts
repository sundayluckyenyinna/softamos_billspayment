/*eslint-disable*/

import { ApiProperty } from "@nestjs/swagger";

export default class AirtimeRequest{

  @ApiProperty({ name: "agentMobileNumber", type: String })
  agentMobileNumber: string;

  @ApiProperty({ name: "beneficialMobileNumber", type: String })
  beneficialMobileNumber: string;

  @ApiProperty({ name: "beneficialEmailAddress", type: String })
  beneficialEmailAddress: string;

  @ApiProperty({ name: "airtimeAmount", type: String })
  airtimeAmount: string;
}