import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Define o domínio principal (Produção vs Local)
  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname.replace(".horariolivre.online", "")
      : hostname.replace(".localhost:3000", "");

  // Se for o domínio principal, não faz nada (mostra a Home)
  if (currentHost === "horariolivre.online" || currentHost === "www" || currentHost === "localhost:3000") {
    return NextResponse.next();
  }

  // Ignora arquivos internos do Next.js e API
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.includes(".")) {
    return NextResponse.next();
  }

  // Reescreve internamente: subdominio.site.com -> /subdominio
  url.pathname = `/${currentHost}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};