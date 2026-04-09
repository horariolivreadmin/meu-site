"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Instagram, MessageCircle, MapPin, Video, ArrowLeft, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Tenant } from "@/lib/tenants"

const DEFAULT_SLOTS = ["09:00", "09:30", "10:00", "11:00", "14:00", "15:00", "16:30", "17:00", "18:00"];

export default function ClientBookingPage({ tenant }: { tenant: Tenant }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    servicoId: null as string | null,
    barbeiroId: null as string | null,
    date: undefined as Date | undefined,
    time: null as string | null,
    clientName: "",
    clientPhone: ""
  })

  // Motor Dinâmico de Telas (Funil)
  const steps = [
    { id: 'SERVICOS', title: 'Escolha o Serviço' },
    ...(tenant.has_team ? [{ id: 'EQUIPE', title: 'Profissional' }] : []),
    { id: 'DATA_HORA', title: 'Data e Hora' },
    { id: 'DADOS_CLIENTE', title: 'Seus Dados' }
  ];

  const currentStep = steps[currentStepIndex];
  const nextStep = () => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex(i => Math.max(i - 1, 0));

  const handleFinalizar = async () => {
    if (!formData.date || !formData.time || !formData.clientName || !formData.clientPhone) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoading(true)
    try {
      // Frontend Burro: Chama a sua própria API, não o n8n!
      const response = await fetch('/api/agendar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenant.id,
          servico_id: formData.servicoId,
          barbeiro_id: formData.barbeiroId,
          date: format(formData.date, "yyyy-MM-dd"),
          time: formData.time,
          client_name: formData.clientName,
          client_phone: formData.clientPhone
        })
      })

      if (!response.ok) throw new Error("Erro na API")

      toast.success("Agendamento Confirmado!", {
        description: `Te esperamos dia ${format(formData.date, "dd/MM")} às ${formData.time}.`,
        duration: 5000,
      })

      setTimeout(() => window.location.reload(), 2000)
    } catch (e) {
      toast.error("Erro ao conectar", { description: "Tente novamente ou chame no WhatsApp." })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'SERVICOS':
        return (
          <div className="grid grid-cols-1 gap-3 animate-in fade-in">
            {tenant.services?.map((svc) => (
              <Card 
                key={svc.id} 
                className={`p-4 cursor-pointer transition-all hover:border-[var(--primary-color)] ${formData.servicoId === svc.id ? 'border-2 border-[var(--primary-color)] bg-gray-50 dark:bg-zinc-800' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, servicoId: svc.id, barbeiroId: null });
                  nextStep();
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{svc.name}</h4>
                    <p className="text-sm text-gray-500">{svc.duration_minutes} min</p>
                  </div>
                  <span className="font-bold text-[var(--primary-color)]">
                    R$ {svc.price.toString().replace('.', ',')}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'EQUIPE':
        const barbeirosCapacitados = tenant.team?.filter((membro) => 
          formData.servicoId && membro.skills?.includes(formData.servicoId)
        ) || [];

        return (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in">
             <Button variant="ghost" size="icon" onClick={prevStep} className="absolute -top-12 left-4">
                <ArrowLeft size={20} />
             </Button>
            {barbeirosCapacitados.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500">Nenhum profissional disponível.</p>
            ) : (
              barbeirosCapacitados.map((membro) => (
                <Card 
                  key={membro.id}
                  className="p-4 flex flex-col items-center cursor-pointer hover:border-[var(--primary-color)] transition-all"
                  onClick={() => {
                    setFormData({ ...formData, barbeiroId: membro.id });
                    nextStep();
                  }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3" style={{ backgroundColor: 'var(--primary-color)' }}>
                    {membro.name.charAt(0)}
                  </div>
                  <h4 className="font-medium text-center">{membro.name}</h4>
                </Card>
              ))
            )}
          </div>
        );

      case 'DATA_HORA':
        return (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4">
             <Button variant="ghost" size="icon" onClick={prevStep} className="absolute -top-12 left-4">
                <ArrowLeft size={20} />
             </Button>
            {!formData.date ? (
               <div className="w-full flex justify-center bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-2 shadow-sm">
                 <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(d) => setFormData({ ...formData, date: d })}
                    locale={ptBR}
                 />
               </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-4 mt-4">
                {DEFAULT_SLOTS.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    onClick={() => {
                      setFormData({ ...formData, time });
                      nextStep();
                    }}
                    className="rounded-xl h-12 border-gray-200 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );

      case 'DADOS_CLIENTE':
        return (
          <div className="flex-1 flex flex-col space-y-4 animate-in zoom-in-95">
             <Button variant="ghost" size="icon" onClick={prevStep} className="absolute -top-12 left-4">
                <ArrowLeft size={20} />
             </Button>
            <div className="space-y-1.5">
              <Label>Seu Nome</Label>
              <Input 
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Seu WhatsApp</Label>
              <Input 
                type="tel"
                value={formData.clientPhone}
                onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
              />
            </div>
            <Button 
              className="w-full h-14 mt-6 text-white font-bold"
              style={{ backgroundColor: 'var(--primary-color)' }}
              onClick={handleFinalizar}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirmar Agendamento"}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4" style={{ "--primary-color": tenant.primary_color } as React.CSSProperties}>
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 relative pt-12">
          {/* Header Social simplificado aqui... (mantenha o seu original) */}
          <CardContent className="p-6 min-h-[400px] flex flex-col">
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase text-center">{currentStep.title}</h2>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
