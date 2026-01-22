-- HABILITAR REALTIME PARA DASHBOARD
-- Ejecutar esto en Supabase SQL Editor para activar actualizaciones en tiempo real

-- 1. Habilitar Realtime para la tabla leads
-- Esto permite que los clientes se suscriban a cambios (INSERT, UPDATE, DELETE)
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- 2. Habilitar Realtime para la tabla projects
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- 3. (Opcional) Habilitar para activity_logs si quieres monitorear actividad en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;

-- 4. (Opcional) Habilitar para comments si quieres notificaciones de comentarios en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- VERIFICAR QUE ESTÁ HABILITADO:
-- Ejecuta esto para ver todas las tablas con Realtime activo:
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Deberías ver:
-- public | leads
-- public | projects
-- (y opcionalmente activity_logs y comments)
