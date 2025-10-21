-- Remove the user from marketplace chamas they shouldn't be members of
-- This ensures marketplace chamas show up in "Available Chamas" instead of "My Chamas"

-- First, ensure purchased_by is null for the marketplace chamas (except those actually purchased)
UPDATE public.chamas
SET purchased_by = NULL
WHERE is_marketplace_chama = true
  AND name LIKE 'Chama Group %-%';

-- Remove any chama_members entries for these marketplace chamas
-- This will make them appear in "Available Chamas" instead of user's chamas list
DELETE FROM public.chama_members
WHERE chama_id IN (
  SELECT id FROM public.chamas 
  WHERE is_marketplace_chama = true 
  AND name LIKE 'Chama Group %-%'
);