import { getSettings } from "@/lib/settings";
import { ContactForm } from "@/components/site/contact-form";
import { MapPin, MessageCircle, Mail } from "lucide-react";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  const mapSrc = `https://maps.google.com/maps?q=${settings.mapLat},${settings.mapLng}&z=13&output=embed`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">Get in touch</h1>
      <p className="mt-2 text-muted-foreground">Questions or orders? Message us any time.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <MessageCircle className="h-5 w-5 text-[#25D366]" /> <span>{settings.whatsappNumber}</span>
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Mail className="h-5 w-5 text-primary" /> <span>{settings.email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <MapPin className="h-5 w-5 text-primary" /> <span>{settings.addressText}</span>
          </div>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-border">
            <iframe src={mapSrc} title="Location" className="h-full w-full" loading="lazy" />
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
