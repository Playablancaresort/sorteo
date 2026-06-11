import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { nombre, apellido, mail, telefono, hijos, sigue_playablanca, sigue_magma } = await req.json()

    if (!nombre || !apellido || !mail || !telefono) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const siguePlayablanca = sigue_playablanca === 'si'
    const sigueMagma = sigue_magma === 'si'
    const tickets = sigueMagma ? 3 : siguePlayablanca ? 2 : 1

    const { error } = await supabaseAdmin
      .from('participantes')
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        mail: mail.trim().toLowerCase(),
        telefono: telefono.trim(),
        hijos: hijos || null,
        sigue_playablanca: siguePlayablanca,
        sigue_magma: sigueMagma,
        tickets
      })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este correo ya está inscrito. Solo se permite una inscripción por persona.' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno. Intenta nuevamente.' }, { status: 500 })
  }
}
