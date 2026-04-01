import { PlanType, StatusPayment } from "@prisma/client";

export class CreateSubscriptionDto {
  status: StatusPayment = StatusPayment.PENDING;
  plan!: PlanType;
  start_date: Date = new Date();
  end_date: Date = new Date();
}
