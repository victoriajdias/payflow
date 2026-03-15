import "dotenv/config";
import { Injectable } from "@nestjs/common";
import { MercadoPagoConfig, Preference } from "mercadopago";

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    });
  }

  async createPreference(items: any, payment_id: string) {
    const preference = new Preference(this.client);
    const body = {
      items: items,
      back_urls: {
        success: "/success",
        failure: "/failure",
        pending: "/pending",
      },
      auto_return: "approved",
      notification_url: "https://example.com/webhook",
      external_reference: payment_id,
    };
    const result = await preference.create({ body });

    return result;
  }
}
