import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { password, ganadorId } = await req.json()

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
    }

    // Marcar como ganador en Supabase
    const { data: ganador, error } = await supabaseAdmin
      .from('participantes')
      .update({ ganador: true })
      .eq('id', ganadorId)
      .select()
      .single()

    if (error) throw error

    // Generar código único
    const codigo = 'PB' + Date.now().toString(36).toUpperCase()

    // Enviar certificado por mail
    await resend.emails.send({
      from: 'Playa Blanca Resort <hola@playablanca.cl>',
      to: ganador.mail,
      subject: '🎉 ¡Felicitaciones! Ganaste una estadía en Playa Blanca Resort',
      html: certificadoHTML(ganador, codigo)
    })

    return NextResponse.json({ ok: true, ganador, codigo })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al confirmar ganador' }, { status: 500 })
  }
}

function certificadoHTML(ganador, codigo) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado de Premio · Playa Blanca Resort</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#1B3F6B;border-radius:20px 20px 0 0;padding:36px 40px;text-align:center;">
            <p style="color:#A8C8E0;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Playa Blanca Resort · Tongoy</p>
            <h1 style="color:#ffffff;font-size:32px;font-weight:900;margin:0;line-height:1.2;">¡Felicitaciones!</h1>
            <p style="color:#D4A843;font-size:16px;margin:10px 0 0;font-style:italic;">Te has ganado una estadía en Playa Blanca Resort</p>
          </td>
        </tr>

        <!-- CUERPO -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="color:#2c3e50;font-size:16px;line-height:1.7;margin:0 0 24px;">
              Hola <strong>${ganador.nombre}</strong>, disfruta 2 noches frente al mar en la bahía de Playa Blanca, Tongoy — uno de los rincones más bellos del norte chico de Chile.
            </p>

            <!-- PREMIO -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:16px;margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="color:#1B3F6B;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">Tu premio incluye</p>
                <p style="color:#2c3e50;font-size:14px;margin:0 0 8px;">✅ 2 noches de alojamiento</p>
                <p style="color:#2c3e50;font-size:14px;margin:0 0 8px;">✅ Departamento para 6 personas con vista al mar</p>
                <p style="color:#2c3e50;font-size:14px;margin:0 0 8px;">✅ Acceso a piscina temperada y jacuzzi</p>
                <p style="color:#2c3e50;font-size:14px;margin:0 0 8px;">✅ 1 hora de pádel o pickleball</p>
                <p style="color:#2c3e50;font-size:14px;margin:0;">✅ Ropa de cama y toallas incluidas</p>
              </td></tr>
            </table>

            <!-- CÓDIGO -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1B3F6B;border-radius:16px;margin-bottom:28px;">
              <tr><td style="padding:24px;text-align:center;">
                <p style="color:#A8C8E0;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Tu código de premio</p>
                <p style="color:#D4A843;font-size:28px;font-weight:900;letter-spacing:4px;margin:0;">${codigo}</p>
              </td></tr>
            </table>

            <!-- CONDICIONES -->
            <p style="color:#1B3F6B;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Vigencia y condiciones</p>
            <p style="color:#666;font-size:13px;line-height:1.7;margin:0 0 20px;">
              Válido hasta el <strong>30 de junio de 2027</strong>, sujeto a disponibilidad. No aplica en: temporada de verano (enero–febrero), Semana Santa, Fiestas Patrias, fines de semana largos y festivos nacionales.
            </p>

            <!-- CÓMO RESERVAR -->
            <p style="color:#1B3F6B;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">¿Cómo reservar?</p>
            <p style="color:#666;font-size:13px;line-height:1.7;margin:0;">
              Escríbenos a <a href="mailto:reservas@playablanca.cl" style="color:#1B3F6B;font-weight:700;">reservas@playablanca.cl</a> indicando tu código <strong>${codigo}</strong>, fechas deseadas y número de personas.
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#1B3F6B;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
            <p style="color:#ffffff;font-size:14px;margin:0 0 4px;">www.playablanca.cl · @playablancaresort</p>
            <p style="color:#A8C8E0;font-size:13px;margin:0;font-style:italic;">La aventura de estar juntos</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `
}
