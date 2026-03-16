import "dotenv/config";
import { Injectable } from "@nestjs/common";
import MercadoPagoConfig, { Payment } from "mercadopago";

@Injectable()
export class WebhookService {
  private client: MercadoPagoConfig;
  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });
  }

  async processPayment(payment_id: string) {
    const payment = new Payment(this.client);

    const result = await payment.get({
      id: payment_id,
    });

    const status = result.status;

    // console.log("Status do pagamento:", status);
  }
}
