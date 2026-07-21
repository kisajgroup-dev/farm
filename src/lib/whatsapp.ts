import { UNIT_LABEL } from "@/lib/utils";

export interface WhatsAppLineItem {
  name: string;
  quantity: number;
  unit: string;
}

/** Build a wa.me deep link with a prefilled order message. */
export function buildWhatsAppOrderLink(
  phone: string,
  items: WhatsAppLineItem[],
  location = ""
): string {
  const digits = phone.replace(/[^0-9]/g, "");
  const lines = items.map(
    (i) => `• ${i.name} — ${i.quantity} ${UNIT_LABEL[i.unit] ?? i.unit}`
  );
  const message =
    `Hello! I would like to order:\n\n` +
    `${lines.join("\n")}\n\n` +
    `Delivery location: ${location || "____"}\n` +
    `Name: ____`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppContactLink(phone: string, text = "Hello!"): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
