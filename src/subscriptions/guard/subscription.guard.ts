import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { SubscriptionsService } from "../subscriptions.service";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const user_id = user.user_id;
    const hasActiveSubscription = await this.subscriptionsService.verifyActiveSubscription(
      user_id
    );
    return hasActiveSubscription;
  }
}
