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
      notification_url:
        "https://df49-2804-7f0-6402-e672-fcf9-f536-d9d-8e7f.ngrok-free.app/webhook/mercadopago",
      external_reference: payment_id,
    };
    const result = await preference.create({ body });

    return result;
  }
}
