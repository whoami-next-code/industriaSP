import { NextResponse } from 'next/server';

// API interno para autocompletar datos de cliente (DNI/RUC)
// Fuente: https://api.decolecta.com
// Requiere configurar un token en el entorno del frontend:
//  - DECOLECTA_API_TOKEN=sk_... (NO usar NEXT_PUBLIC_ para evitar exponerlo al cliente)

function cleanDigits(s: string) {
  return (s || '').replace(/[^0-9]/g, '');
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const docParam = url.searchParams.get('doc') || '';
    const doc = cleanDigits(docParam);

    if (!doc) {
      return NextResponse.json({ ok: false, error: 'Parámetro doc es requerido' }, { status: 400 });
    }

    const token = process.env.DECOLECTA_API_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: 'DECOLECTA_API_TOKEN no configurado en entorno' }, { status: 500 });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } as const;

    // Determinar si es DNI (8) o RUC (11)
    if (doc.length === 8) {
      // RENIEC DNI
      const endpoint = `https://api.decolecta.com/v1/reniec/dni?numero=${encodeURIComponent(doc)}`;
      const resp = await fetch(endpoint, { headers });
      if (!resp.ok) {
        const text = await resp.text();
        return NextResponse.json({ ok: false, error: `RENIEC error: ${text || resp.statusText}` }, { status: resp.status || 502 });
      }
      const data = await resp.json();
      // Ejemplo de respuesta esperada:
      // { first_name, first_last_name, second_last_name, full_name, document_number }
      const fullName = (data?.full_name || [data?.first_name, data?.first_last_name, data?.second_last_name].filter(Boolean).join(' ')).trim();
      return NextResponse.json({
        ok: true,
        type: 'DNI',
        name: fullName || 'Cliente',
        document: String(data?.document_number || doc),
        address: undefined,
      });
    }

    if (doc.length === 11) {
      // SUNAT RUC
      const endpoint = `https://api.decolecta.com/v1/sunat/ruc/full?numero=${encodeURIComponent(doc)}`;
      const resp = await fetch(endpoint, { headers });
      if (!resp.ok) {
        const text = await resp.text();
        return NextResponse.json({ ok: false, error: `SUNAT error: ${text || resp.statusText}` }, { status: resp.status || 502 });
      }
      const data = await resp.json();
      // Ejemplo de respuesta:
      // { razon_social, numero_documento, direccion, ... }
      return NextResponse.json({
        ok: true,
        type: 'RUC',
        businessName: String(data?.razon_social || ''),
        document: String(data?.numero_documento || doc),
        address: String(data?.direccion || ''),
      });
    }

    return NextResponse.json({ ok: false, error: 'Formato de documento inválido (DNI 8 dígitos, RUC 11 dígitos)' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error interno' }, { status: 500 });
  }
}

// Mock básico de autocompletado por DNI/RUC.
// En producción, esta ruta debe consultar una base de datos o servicio externo (RENIEC/SUNAT).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doc = (searchParams.get('doc') || '').replace(/\D/g, '');

  if (!doc) {
    return NextResponse.json({ error: 'Documento requerido' }, { status: 400 });
  }

  // Respuestas simuladas
  const dniMocks: Record<string, { name: string; address: string }> = {
    '12345678': { name: 'Juan Pérez', address: 'Av. Siempre Viva 123, Lima' },
    '87654321': { name: 'María López', address: 'Jr. Las Flores 456, Arequipa' },
  };
  const rucMocks: Record<string, { businessName: string; address: string }> = {
    '20123456789': { businessName: 'Industrias Ficticias S.A.C.', address: 'Calle Industria 789, Lima' },
  };

  if (doc.length <= 8) {
    const data = dniMocks[doc] || { name: 'Cliente', address: 'Dirección no disponible' };
    return NextResponse.json({ type: 'DNI', ...data });
  }

  if (doc.length === 11) {
    const data = rucMocks[doc] || { businessName: 'Empresa', address: 'Dirección no disponible' };
    return NextResponse.json({ type: 'RUC', ...data });
  }

  return NextResponse.json({ error: 'Documento no válido' }, { status: 400 });
}
