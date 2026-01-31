-- Maintain contiguous positions inside a status column for a client
-- Call signature from app: rpc('shift_lead_positions', { p_client_id, p_status, p_position })
-- Behavior: increments positions >= p_position by 1 within the same status and client
-- Safe for concurrent calls via single UPDATE statement

CREATE OR REPLACE FUNCTION public.shift_lead_positions(
  p_client_id uuid,
  p_status text,
  p_position int
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.leads AS l
  SET position = COALESCE(position, 0) + 1
  WHERE l.client_id = p_client_id
    AND l.status = p_status
    AND COALESCE(l.position, 0) >= p_position;
END;
$$;

COMMENT ON FUNCTION public.shift_lead_positions(uuid, text, int)
  IS 'Shifts lead positions within a status for a client to avoid collisions when inserting/moving';
