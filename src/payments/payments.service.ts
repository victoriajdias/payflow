import { Injectable } from "@nestjs/common";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PlanType, StatusPayment } from "@prisma/client";
import { MercadoPagoService } from "./mercadopago.service";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mercadoPagoService: MercadoPagoService
  ) {}

  async createPayment(user_id: string, plan_type: string) {
    let amount;

    if (plan_type === "MONTHLY") {
      amount = 29.9;
    }

    if (plan_type === "YEARLY") {
      amount = 299;
    }

    if (!amount) {
      throw new Error("Invalid plan type");
    }

    try {
      const payment = await this.prisma.payment.create({
        data: {
          amount: amount,
          status: StatusPayment.PENDING,
          plan_type: plan_type as PlanType,
          payment_id: null,
          user_id: user_id,
        },
      });

      const items = [
        {
          title: `Subscription ${plan_type}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: amount,
        },
      ];

      const preference = await this.mercadoPagoService.createPreference(
        items,
        payment.id
      );

      await this.prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          payment_id: preference.id,
        },
      });

      return { payment_id: payment.id, checkout_url: preference.init_point };
    } catch (error) {
      throw new Error("Failed to create payment", { cause: error });
    }
  }
}
