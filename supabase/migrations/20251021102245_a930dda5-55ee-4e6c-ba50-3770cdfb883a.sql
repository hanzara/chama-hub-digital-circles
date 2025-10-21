-- Reset all simulated chama savings data to zero
UPDATE chamas SET total_savings = 0 WHERE total_savings > 0;

-- Also ensure all member balances are zero (in case there's any simulated data)
UPDATE chama_members 
SET 
  savings_balance = 0,
  total_contributed = 0,
  mgr_balance = 0
WHERE savings_balance > 0 OR total_contributed > 0 OR mgr_balance > 0;