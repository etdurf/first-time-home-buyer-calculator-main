-- db/seed.sql
-- Sample data for local testing

BEGIN;

-- Clean slate (safe order due to FKs)
TRUNCATE TABLE
  scenario_tip,
  tip,
  term_option_result,
  long_term_analysis,
  affordability_result,
  payment_breakdown,
  monthly_costs,
  mortgage_details,
  scenario,
  "user"
RESTART IDENTITY CASCADE;

-- =========================
-- USERS
-- =========================
INSERT INTO "user" (user_id, email, name, created_at) VALUES
(1, 'alex@example.com', 'Alex Buyer', NOW()),
(2, 'jamie@example.com', 'Jamie Shopper', NOW());

-- =========================
-- SCENARIOS
-- =========================
INSERT INTO scenario (scenario_id, user_id, title, created_at, updated_at) VALUES
(1, 1, 'Starter Home - 30 Year', NOW(), NOW()),
(2, 1, 'Same Home - 15 Year',   NOW(), NOW()),
(3, 2, 'Condo with HOA',        NOW(), NOW());

-- =========================
-- MORTGAGE_DETAILS (1:1)
-- =========================
INSERT INTO mortgage_details
(scenario_id, home_price, annual_income, down_payment_percent, down_payment_amount, interest_rate, selected_term_years)
VALUES
(1, 450000, 120000, 10.000, 45000, 6.7500, 30),
(2, 450000, 120000, 10.000, 45000, 6.7500, 15),
(3, 325000,  95000,  5.000, 16250, 7.1250, 30);

-- =========================
-- MONTHLY_COSTS (1:1)
-- =========================
INSERT INTO monthly_costs
(scenario_id, utilities_monthly, maintenance_monthly, hoa_monthly)
VALUES
(1, 250, 150, 0),
(2, 250, 150, 0),
(3, 220, 120, 180);

-- =========================
-- PAYMENT_BREAKDOWN (1:1)
-- Values are illustrative for demo/testing
-- =========================
INSERT INTO payment_breakdown
(scenario_id, principal_monthly, interest_monthly, property_tax_monthly, insurance_monthly, pmi_monthly,
 piti_total_monthly, total_housing_cost_monthly, loan_amount)
VALUES
(1, 520.00, 1925.00, 375.00, 100.00, 180.00, 3100.00, 3500.00, 405000.00),
(2, 1300.00, 1400.00, 375.00, 100.00, 180.00, 3355.00, 3755.00, 405000.00),
(3, 410.00, 1705.00, 270.00,  85.00, 220.00, 2690.00, 3210.00, 308750.00);

-- =========================
-- AFFORDABILITY_RESULT (1:1)
-- =========================
INSERT INTO affordability_result
(scenario_id, housing_dti_percent, total_dti_percent, monthly_income, remaining_for_other_expenses, status)
VALUES
(1, 29.2, 34.0, 10000.00, 6500.00, 'OK'),
(2, 31.3, 36.5, 10000.00, 6245.00, 'CAUTION'),
(3, 33.8, 41.2,  7916.67, 4706.67, 'HIGH_RISK');

-- =========================
-- TERM_OPTION_RESULT (1:many)
-- Compare multiple terms per scenario
-- =========================
INSERT INTO term_option_result
(term_result_id, scenario_id, term_years, monthly_payment_piti, total_interest, total_cost, interest_savings_vs_30)
VALUES
(1, 1, 30, 3100.00, 288000.00, 693000.00, 0.00),
(2, 1, 15, 3355.00, 165000.00, 570000.00, 123000.00),

(3, 2, 30, 3100.00, 288000.00, 693000.00, 0.00),
(4, 2, 15, 3355.00, 165000.00, 570000.00, 123000.00),

(5, 3, 30, 2690.00, 265000.00, 590000.00, 0.00),
(6, 3, 15, 3050.00, 150000.00, 475000.00, 115000.00);

-- =========================
-- LONG_TERM_ANALYSIS (1:1)
-- =========================
INSERT INTO long_term_analysis
(scenario_id, total_cost_of_home, total_principal, total_interest, total_property_tax, total_insurance, total_pmi, pmi_years_estimate)
VALUES
(1, 825000.00, 405000.00, 288000.00, 135000.00, 36000.00, 21000.00, 7.00),
(2, 690000.00, 405000.00, 165000.00, 135000.00, 36000.00, 21000.00, 7.00),
(3, 705000.00, 308750.00, 265000.00,  97200.00, 30600.00, 28000.00, 9.50);

-- =========================
-- TIPS
-- =========================
INSERT INTO tip (tip_id, title, body, category, sort_order, is_active) VALUES
(1, 'Down payment basics', 'Higher down payments lower your loan amount and can reduce PMI.', 'Basics', 1, TRUE),
(2, 'DTI guideline', 'Many lenders look for housing DTI around ~28% and total DTI around ~36%, but it varies.', 'Affordability', 2, TRUE),
(3, '15 vs 30 year tradeoff', 'Shorter terms raise the payment but usually save a lot of interest over time.', 'Loans', 3, TRUE);

-- =========================
-- SCENARIO_TIP (views tracked)
-- =========================
INSERT INTO scenario_tip (scenario_id, tip_id, viewed_at) VALUES
(1, 1, NOW() - INTERVAL '2 days'),
(1, 2, NOW() - INTERVAL '2 days'),
(1, 3, NOW() - INTERVAL '1 day'),
(3, 2, NOW() - INTERVAL '3 hours');

COMMIT;