import { NextResponse } from 'next/server';
import { z } from 'zod';

const agendamentoSchema = z.object({
  tenant_id: z.string().uuid(),
  servico_id: z.string().uuid(),
  barbeiro_id: z.string().uuid().nullable(),
  date: z.string(),
  time: z.string(),
  client_name: z.string().min(2),
  client_phone: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = agendamentoSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Comunicação segura PELA REDE INTERNA do Podman (invisível para a internet)
    const n8nUrl = 'http://n8n:5678/webhook/agendar'; 
    
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SaaS-Token': process.env.N8N_WEBHOOK_SECRET || '', // Senha forte no .env
      },
      body: JSON.stringify(parseResult.data),
    });

    if (!n8nResponse.ok) throw new Error('Falha no n8n');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
