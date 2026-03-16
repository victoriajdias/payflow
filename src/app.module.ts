import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { PaymentsModule } from "./payments/payments.module";
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [AuthModule, UsersModule, SubscriptionsModule, PaymentsModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
