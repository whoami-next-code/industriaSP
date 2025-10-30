import axios from 'axios';

type ReniecResponse = {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
};

/**
 * Obtiene datos del ciudadano por DNI utilizando servicios públicos.
 * Intenta varias URLs conocidas y usa un token de entorno.
 * En caso de error, devuelve datos simulados para que la pasarela ficticia funcione.
 */
export async function obtenerDatosPorDNI(dni: string): Promise<ReniecResponse> {
  const token = process.env.API_TOKEN_RENIEC;
  const base = process.env.RENIEC_API_BASE; // opcional: permite sobreescribir la base

  const urls: string[] = [];
  if (base) {
    // Admitir bases tipo apis.net.pe (con query) o apisperu (path)
    if (base.includes('apis.net.pe')) {
      urls.push(`${base}${base.includes('?') ? '&' : '?'}numero=${dni}${token ? `&token=${token}` : ''}`);
    } else {
      urls.push(`${base}/${dni}${token ? `?token=${token}` : ''}`);
    }
  }

  // Candidatos comunes
  urls.push(`https://api.apis.net.pe/v1/dni?numero=${dni}${token ? `&token=${token}` : ''}`);
  urls.push(`https://dniruc.apisperu.com/api/DNI/${dni}${token ? `?token=${token}` : ''}`);

  for (const url of urls) {
    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      // Normalizar campos según proveedor
      const nombres = data.nombres ?? data.nombresCompleto ?? data.nombre;
      const apellidoPaterno = data.apellidoPaterno ?? data.apellido_paterno;
      const apellidoMaterno = data.apellidoMaterno ?? data.apellido_materno;
      if (nombres) {
        return {
          nombres: String(nombres),
          apellidoPaterno: String(apellidoPaterno ?? ''),
          apellidoMaterno: String(apellidoMaterno ?? ''),
        };
      }
      if (data.success && data.data) {
        return {
          nombres: String(data.data.nombres ?? ''),
          apellidoPaterno: String(data.data.apellidoPaterno ?? ''),
          apellidoMaterno: String(data.data.apellidoMaterno ?? ''),
        };
      }
    } catch (err) {
      // continuar con siguiente URL
    }
  }

  // Fallback: datos simulados
  return {
    nombres: 'Cliente',
    apellidoPaterno: 'Demo',
    apellidoMaterno: dni?.slice(-2) || 'XX',
  };
}

