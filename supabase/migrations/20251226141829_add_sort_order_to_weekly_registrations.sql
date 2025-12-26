/*
  # Add sort_order column to weekly_registrations

  1. Changes
    - Add `sort_order` column to track custom drag-and-drop ordering
    - Set default values based on creation order
*/

DO $$
DECLARE
  v_counter INTEGER := 0;
  v_record RECORD;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'weekly_registrations' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE weekly_registrations ADD COLUMN sort_order INTEGER DEFAULT 0;
    
    FOR v_record IN SELECT id FROM weekly_registrations ORDER BY start_date ASC LOOP
      UPDATE weekly_registrations SET sort_order = v_counter WHERE id = v_record.id;
      v_counter := v_counter + 1;
    END LOOP;
  END IF;
END $$;
