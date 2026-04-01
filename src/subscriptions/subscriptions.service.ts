import { Injectable } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusPayment } from "@prisma/client";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, user_id: string) {
    try {
      return await this.prisma.subscription.create({
        data: {
          status: createSubscriptionDto.status,
          start_date: createSubscriptionDto.start_date,
          end_date: createSubscriptionDto.end_date,
          plan: createSubscriptionDto.plan,
          user_id: user_id,
        },
      });
    } catch (error) {
      console.error("Error occurred while creating subscription:", error);
      throw error;
    }
  }

 async findActiveByUser(user_id: string) {
  const now = new Date();

  return await this.prisma.subscription.findFirst({
    where: {
      user_id,
      status: "ACTIVE",
      start_date: {
        lte: now,
      },
      end_date: {
        gte: now,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

  async verifyActiveSubscription(user_id: string) {
    try {
      const activeSubscription = await this.prisma.subscription.findFirst({
        where: {
          user_id: user_id,
          status: StatusPayment.ACTIVE,
        },
      });
      return !!activeSubscription;
    } catch (error) {
      console.error(
        "Error occurred while verifying active subscription:",
        error
      );
      throw error;
    }
  }

  async verifyEndDateSubscription(user_id: string) {
    try {
      const currentDate = new Date();
      const expiredSubscription = await this.prisma.subscription.findFirst({
        where: {
          user_id: user_id,
          end_date: {
            lt: currentDate,
          },
        },
      });
      if (expiredSubscription) {
        await this.prisma.subscription.update({
          where: {
            id: expiredSubscription.id,
          },
          data: {
            status: StatusPayment.EXPIRED,
          },
        });
      }
      return !!expiredSubscription;
    } catch (error) {
      console.error(
        "Error occurred while verifying end date subscription:",
        error
      );
      throw error;
    }
  }
}
