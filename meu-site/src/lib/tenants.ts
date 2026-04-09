import { query } from './db';
import { z } from 'zod';
import { unstable_cache } from 'next/cache';

export type Service = { id: string; name: string; price: number; duration_minutes: number };
export type TeamMember = { id: string; name: string; skills: string[] };

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  primary_color: string;
  whatsapp: string;
  has_team: boolean;
  services: Service[];
  team: TeamMember[];
}

const slugSchema = z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "Slug inválido");

export const getTenantBySlug = unstable_cache(
  async (slug: string): Promise<Tenant | null> => {
    const parseResult = slugSchema.safeParse(slug);
    if (!parseResult.success) return null;

    const sql = `
      SELECT 
        t.*,
        COALESCE(
          (SELECT json_agg(s.*) FROM services s WHERE s.tenant_id = t.id AND s.is_active = true), 
          '[]'::json
        ) as services,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', tm.id,
              'name', tm.name,
              'skills', COALESCE((
                SELECT json_agg(ts.service_id) 
                FROM team_services ts 
                WHERE ts.team_member_id = tm.id
              ), '[]'::json)
            )
          ) FROM team_members tm WHERE tm.tenant_id = t.id AND tm.is_active = true), 
          '[]'::json
        ) as team
      FROM tenants t
      WHERE t.slug = $1 LIMIT 1
    `;

    const result = await query(sql, [parseResult.data]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  ['tenant-query-cache-mvp'],
  { revalidate: 86400 } // Cache de 24 horas
);
