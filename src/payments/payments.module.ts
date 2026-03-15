import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { MercadoPagoService } from "./mercadopago.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, MercadoPagoService],
})
export class PaymentsModule {}
