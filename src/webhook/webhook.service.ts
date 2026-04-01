import "dotenv/config";
import { Injectable } from "@nestjs/common";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { StatusPayment } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WebhookService {
  private client: MercadoPagoConfig;

  constructor(private readonly prisma: PrismaService) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });
  }

  async processPayment(payment_id: string) {
    const payment = new Payment(this.client);

    const result = await payment.get({
      id: payment_id,
    });

    const status = result.status;

    const internalPaymentId = result.external_reference;

    if (!internalPaymentId) {
      throw new Error("Missing external_reference");
    }

    const dbPayment = await this.prisma.payment.findUnique({
      where: {
        id: internalPaymentId,
      },
    });

    if (!dbPayment) {
      throw new Error("Payment not found");
    }

    if (status === "approved" || status === "authorized") {
      if (!dbPayment.plan_type) {
        throw new Error("Invalid plan type");
      }

      await this.prisma.payment.update({
        where: {
          id: dbPayment.id,
        },
        data: {
          status: StatusPayment.ACTIVE,
        },
      });

      const hasActive = await this.prisma.subscription.findFirst({
        where: {
          user_id: dbPayment.user_id,
          status: "ACTIVE",
        },
      });

      if (hasActive) {
        return;
      }

      await this.prisma.subscription.create({
        data: {
          user_id: dbPayment.user_id,
          status: "ACTIVE",
          plan: dbPayment.plan_type,
          start_date: new Date(),
          end_date: calcularData(dbPayment.plan_type),
        },
      });
    } else {
      await this.prisma.payment.update({
        where: {
          id: dbPayment.id,
        },
        data: {
          status: StatusPayment.INACTIVE,
        },
      });
    }
  }
}

function calcularData(plan_type: string): Date {
  const now = new Date();

  if (plan_type === "MONTHLY") {
    return new Date(now.setMonth(now.getMonth() + 1));
  }

  if (plan_type === "YEARLY") {
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }

  throw new Error("Invalid plan type");
}
