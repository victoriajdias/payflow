import { Injectable } from "@nestjs/common";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PlanType, StatusPayment } from "@prisma/client";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

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
      return { payment };
    } catch (error) {
      throw new Error("Failed to create payment", { cause: error });
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
