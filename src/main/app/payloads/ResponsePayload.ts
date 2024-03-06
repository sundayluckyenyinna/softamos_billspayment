/*eslint-disable*/


import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";


export class BaseResponse{

  @ApiProperty({ name: "code", description: "Response code", default: HttpStatus.OK })
  code: number;

  @ApiProperty({ name: "message", description: "Response message"})
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

}

export class ApiResponse<T> extends BaseResponse{

  @ApiProperty({ name: "data", description: "Response data" })
  data: T | undefined;

  constructor(code: number, message: string, data: T | undefined) {
    super(code, message);
    this.data = data;
  }
}

