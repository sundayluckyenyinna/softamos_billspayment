/*eslint-disable*/

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import BillspaymentModule from "./main/app/BillspaymentModule";
import DatasourceConfig from "./main/app/config/DatasourceConfig";
import ApplicationLoggerMiddleware from "./main/app/middlewares/ApplicationLoggerMiddleware";
import AuthenticationMiddleware from "./main/app/middlewares/AuthenticationMiddleware";

@Module({
  imports: [DatasourceConfig.InitSQLDatasourceConfiguration(), BillspaymentModule],
  providers: [ApplicationLoggerMiddleware, AuthenticationMiddleware]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer): any {
  //   consumer
  //     .apply(ApplicationLoggerMiddleware, AuthenticationMiddleware)
  //     .forRoutes({path: "/**", method: RequestMethod.ALL});
  // }
}
