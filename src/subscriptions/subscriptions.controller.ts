import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { CurrentUser } from "src/auth/decorator/currentuser";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { SubscriptionGuard } from "./guard/subscription.guard";

@UseGuards(SubscriptionGuard)
@UseGuards(AuthGuard)
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post("create")
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: any
  ) {
    const user_id = user.user_id;
    return this.subscriptionsService.create(createSubscriptionDto, user_id);
  }

  @Get("me")
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get("verify-active")
  verifyActiveSubscription(@CurrentUser() user: any) {
    const user_id = user.user_id;
    return this.subscriptionsService.verifyActiveSubscription(user_id);
  }

  @Get("verify-end-date")
  verifyEndDateSubscription(@CurrentUser() user: any) {
    const user_id = user.user_id;
    return this.subscriptionsService.verifyEndDateSubscription(user_id);
  }
}
