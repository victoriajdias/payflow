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
import { PaymentsService } from "./payments.service";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { CurrentUser } from "src/auth/decorator/currentuser";
import { AuthGuard } from "src/auth/guard/auth.guard";

@UseGuards(AuthGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body("plan_type") plan_type: string) {
    const user_id = user.user_id;
    return this.paymentsService.createPayment(user_id, plan_type);
  }
}
