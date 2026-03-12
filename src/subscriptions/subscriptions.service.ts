import { Injectable } from "@nestjs/common";
import {
  CreateSubscriptionDto,
  StatusSubscription,
} from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { PrismaService } from "src/prisma/prisma.service";

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
          user_id: user_id,
        },
      });
    } catch (error) {
      console.error("Error occurred while creating subscription:", error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.subscription.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error occurred while finding all subscriptions:", error);
      throw error;
    }
  }

  async verifyActiveSubscription(user_id: string) {
    try {
      const activeSubscription = await this.prisma.subscription.findFirst({
        where: {
          user_id: user_id,
          status: StatusSubscription.ACTIVE,
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
            status: StatusSubscription.EXPIRED,
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
