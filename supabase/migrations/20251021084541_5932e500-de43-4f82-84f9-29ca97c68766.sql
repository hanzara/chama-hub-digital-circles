-- Update marketplace chama prices based on member count (20 KES per member)
UPDATE public.chamas
SET purchase_amount = max_members * 20
WHERE is_marketplace_chama = true
  AND name LIKE 'Chama Group %-%';