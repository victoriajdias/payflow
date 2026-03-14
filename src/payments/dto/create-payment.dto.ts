import { PlanType, StatusPayment } from "@prisma/client";

export class CreatePaymentDto {
  amount?: number;
  status: StatusPayment;
  plan_type: PlanType;
  payment_id: string;
}
