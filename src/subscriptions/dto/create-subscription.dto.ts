export enum StatusSubscription {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export class CreateSubscriptionDto {
  status: StatusSubscription;
  start_date: Date;
  end_date: Date;
}
