-- aid_donors.last_donation is a display string in the source data
-- ("12 أكتوبر 2023", Arabic month name), not a parseable timestamp — store it
-- as text rather than losing/rejecting it trying to force a timestamptz.
alter table aid_donors alter column last_donation type text using last_donation::text;
