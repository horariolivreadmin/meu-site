import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="px-6 py-4 flex justify-between items-center border-b bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-black dark:text-white" />
          Agenda Barber
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="#funcionalidades">Como Funciona</Link>
          <Link href="#precos">Preços</Link>
          <Link href="#contato">Contato</Link>
        </nav>
        <Button asChild className="rounded-full font-bold">
          <Link href="https://wa.me/5551999999999">Contratar Agora</Link>
        </Button>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Sistema de Gestão Soberano
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Sua barbearia no piloto automático.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Agendamentos ilimitados, lembretes via WhatsApp e zero comissão por corte. 
            A tecnologia que as grandes franquias usam, agora na sua mão.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full" asChild>
              <Link href="https://wa.me/5551999999999">Quero Testar</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white dark:bg-zinc-900" asChild>
              <Link href="/golden">Ver Demonstração</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section id="funcionalidades" className="py-20 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-amber-500" />}
            title="Agendamento em 3 Cliques"
            description="Seu cliente não precisa baixar app nem fazer cadastro longo. É clicar, agendar e cortar."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
            title="Blindagem de Agenda"
            description="Reduza faltas em 40% com lembretes automáticos no WhatsApp e confirmação de presença."
          />
          <FeatureCard 
            icon={<CalendarCheck className="w-8 h-8 text-blue-500" />}
            title="Site Personalizado"
            description="Tenha um link exclusivo (ex: agenda.com/sua-barbearia) com a sua logo e suas cores."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-zinc-400 text-sm bg-zinc-50 dark:bg-zinc-950 border-t">
        © {new Date().getFullYear()} Agenda Barber. Tecnologia Soberana.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-none bg-zinc-50 dark:bg-zinc-800/50">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}