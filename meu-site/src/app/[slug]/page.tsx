import { getTenantBySlug } from "@/lib/tenants";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ClientBookingPage from "./client-page";

interface PageProps {
  params: { slug: string };
}

// 1. Gera o Título da Página Dinamicamente (SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tenant = await getTenantBySlug(params.slug);
  
  if (!tenant) {
    return { title: "Horário Livre" };
  }

  return {
    title: `Agendar - ${tenant.name}`,
    description: `Agende seu horário na ${tenant.name}`,
  };
}

// 2. Componente Principal do Servidor
export default async function Page({ params }: PageProps) {
  // Busca dados no Banco de Dados
  const tenant = await getTenantBySlug(params.slug);

  // Se o cliente não existir no banco, retorna erro 404
  if (!tenant) {
    notFound();
  }

  // Renderiza a página do cliente passando os dados do banco
  return <ClientBookingPage tenant={tenant} />;
}