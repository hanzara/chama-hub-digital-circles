-- Reset all wallet balances to zero to remove simulated data
UPDATE user_wallets SET balance = 0 WHERE balance > 0;
UPDATE user_wallets_v2 SET balance = 0 WHERE balance > 0;
UPDATE user_central_wallets SET balance = 0 WHERE balance > 0;
UPDATE member_wallets SET balance = 0 WHERE balance > 0;
UPDATE seller_wallets SET balance = 0 WHERE balance > 0;
UPDATE buyer_wallets SET balance = 0 WHERE balance > 0;