import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Properties from "@/components/Properties";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { Property } from "@/lib/supabase/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const properties = (data as Property[] | null) ?? [];

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Properties properties={properties} />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
