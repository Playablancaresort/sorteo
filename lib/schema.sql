-- Ejecutar esto en Supabase SQL Editor

CREATE TABLE participantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  mail TEXT NOT NULL,
  telefono TEXT NOT NULL,
  hijos TEXT,
  sigue_playablanca BOOLEAN DEFAULT FALSE,
  sigue_magma BOOLEAN DEFAULT FALSE,
  tickets INTEGER DEFAULT 1,
  ganador BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice único por mail para evitar duplicados
CREATE UNIQUE INDEX participantes_mail_idx ON participantes (LOWER(mail));

-- Habilitar Row Level Security
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;

-- Permitir insertar desde el formulario público
CREATE POLICY "Permitir inscripciones" ON participantes
  FOR INSERT WITH CHECK (true);

-- Solo admin puede leer (via service key)
CREATE POLICY "Solo admin puede leer" ON participantes
  FOR SELECT USING (false);
