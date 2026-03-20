import { Controller, Post, Body } from "@nestjs/common";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("mercadopago")
  async handleMercadoPagoWebhook(@Body() body: any) {
    console.log("Webhook recebido:", body);

    if (body.type === "payment") {
      await this.webhookService.processPayment(body.data.id);
    }

    return { received: true };
  }
}
