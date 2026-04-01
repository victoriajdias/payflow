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
        success: `${process.env.APP_URL}/success`,
        failure: `${process.env.APP_URL}/failure`,
        pending: `${process.env.APP_URL}/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.WEBHOOK_URL}`,
      external_reference: payment_id,
    };
    const result = await preference.create({ body });

    return result;
  }
}
