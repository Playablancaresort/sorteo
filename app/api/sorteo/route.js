import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { password } = await req.json()

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('participantes')
      .select('*')
      .eq('ganador', false)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Construir tómbola con tickets
    const tombola = []
    data.forEach(p => {
      for (let i = 0; i < p.tickets; i++) {
        tombola.push(p)
      }
    })

    return NextResponse.json({
      participantes: data,
      total: data.length,
      totalTickets: tombola.length,
      conInstagram: data.filter(p => p.sigue_playablanca || p.sigue_magma).length
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
