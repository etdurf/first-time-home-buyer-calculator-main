-- db/schema.sql
-- PostgreSQL schema matching the Mermaid ERD

-- Optional: create a database (run separately as a superuser if you want)
-- CREATE DATABASE homebuyer_db;
-- \c homebuyer_db

BEGIN;

-- =========================
-- USER
-- =========================
CREATE TABLE IF NOT EXISTS "user" (
user_id     SERIAL PRIMARY KEY,
email       TEXT NOT NULL UNIQUE,
name        TEXT NOT NULL,
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- SCENARIO
-- =========================
CREATE TABLE IF NOT EXISTS scenario (
scenario_id  SERIAL PRIMARY KEY,
user_id      INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
title        TEXT NOT NULL,
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenario_user_created
ON scenario(user_id, created_at DESC);

-- =========================
-- 1:1 DETAIL TABLES (scenario_id is PK + FK)
-- =========================
CREATE TABLE IF NOT EXISTS mortgage_details (
scenario_id          INT PRIMARY KEY REFERENCES scenario(scenario_id) ON DELETE CASCADE,
home_price           NUMERIC(12,2) NOT NULL CHECK (home_price >= 0),
annual_income        NUMERIC(12,2) NOT NULL CHECK (annual_income >= 0),
down_payment_percent NUMERIC(6,3)  NOT NULL CHECK (down_payment_percent >= 0 AND down_payment_percent <= 100),
down_payment_amount  NUMERIC(12,2) NOT NULL CHECK (down_payment_amount >= 0),
interest_rate        NUMERIC(6,4)  NOT NULL CHECK (interest_rate >= 0), -- percent APR (e.g., 6.7500)
selected_term_years  INT NOT NULL CHECK (selected_term_years IN (10, 15, 20, 30))
);

CREATE TABLE IF NOT EXISTS monthly_costs (
scenario_id          INT PRIMARY KEY REFERENCES scenario(scenario_id) ON DELETE CASCADE,
utilities_monthly    NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (utilities_monthly >= 0),
maintenance_monthly  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (maintenance_monthly >= 0),
hoa_monthly          NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (hoa_monthly >= 0)
);

CREATE TABLE IF NOT EXISTS payment_breakdown (
scenario_id                INT PRIMARY KEY REFERENCES scenario(scenario_id) ON DELETE CASCADE,
principal_monthly          NUMERIC(12,2) NOT NULL CHECK (principal_monthly >= 0),
interest_monthly           NUMERIC(12,2) NOT NULL CHECK (interest_monthly >= 0),
property_tax_monthly       NUMERIC(12,2) NOT NULL CHECK (property_tax_monthly >= 0),
insurance_monthly          NUMERIC(12,2) NOT NULL CHECK (insurance_monthly >= 0),
pmi_monthly                NUMERIC(12,2) NOT NULL CHECK (pmi_monthly >= 0),
piti_total_monthly         NUMERIC(12,2) NOT NULL CHECK (piti_total_monthly >= 0),
total_housing_cost_monthly NUMERIC(12,2) NOT NULL CHECK (total_housing_cost_monthly >= 0),
loan_amount                NUMERIC(12,2) NOT NULL CHECK (loan_amount >= 0)
);

CREATE TABLE IF NOT EXISTS affordability_result (
scenario_id                  INT PRIMARY KEY REFERENCES scenario(scenario_id) ON DELETE CASCADE,
housing_dti_percent          NUMERIC(6,3) NOT NULL CHECK (housing_dti_percent >= 0),
total_dti_percent            NUMERIC(6,3) NOT NULL CHECK (total_dti_percent >= 0),
monthly_income               NUMERIC(12,2) NOT NULL CHECK (monthly_income >= 0),
remaining_for_other_expenses NUMERIC(12,2) NOT NULL,
status                       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS long_term_analysis (
scenario_id         INT PRIMARY KEY REFERENCES scenario(scenario_id) ON DELETE CASCADE,
total_cost_of_home  NUMERIC(14,2) NOT NULL CHECK (total_cost_of_home >= 0),
total_principal     NUMERIC(14,2) NOT NULL CHECK (total_principal >= 0),
total_interest      NUMERIC(14,2) NOT NULL CHECK (total_interest >= 0),
total_property_tax  NUMERIC(14,2) NOT NULL CHECK (total_property_tax >= 0),
total_insurance     NUMERIC(14,2) NOT NULL CHECK (total_insurance >= 0),
total_pmi           NUMERIC(14,2) NOT NULL CHECK (total_pmi >= 0),
pmi_years_estimate  NUMERIC(6,2)  NOT NULL CHECK (pmi_years_estimate >= 0)
);

-- =========================
-- TERM_OPTION_RESULT (1:many)
-- =========================
CREATE TABLE IF NOT EXISTS term_option_result (
term_result_id         SERIAL PRIMARY KEY,
scenario_id            INT NOT NULL REFERENCES scenario(scenario_id) ON DELETE CASCADE,
term_years             INT NOT NULL CHECK (term_years IN (10, 15, 20, 30)),
monthly_payment_piti   NUMERIC(12,2) NOT NULL CHECK (monthly_payment_piti >= 0),
total_interest         NUMERIC(14,2) NOT NULL CHECK (total_interest >= 0),
total_cost             NUMERIC(14,2) NOT NULL CHECK (total_cost >= 0),
interest_savings_vs_30 NUMERIC(14,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_term_option_scenario
ON term_option_result(scenario_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_term_option_per_scenario
ON term_option_result(scenario_id, term_years);

-- =========================
-- TIP + SCENARIO_TIP (tracking)
-- =========================
CREATE TABLE IF NOT EXISTS tip (
tip_id      SERIAL PRIMARY KEY,
title       TEXT NOT NULL,
body        TEXT NOT NULL,
category    TEXT,
sort_order  INT NOT NULL DEFAULT 0,
is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS scenario_tip (
scenario_id INT NOT NULL REFERENCES scenario(scenario_id) ON DELETE CASCADE,
tip_id      INT NOT NULL REFERENCES tip(tip_id) ON DELETE CASCADE,
viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
PRIMARY KEY (scenario_id, tip_id, viewed_at)
);

CREATE INDEX IF NOT EXISTS idx_scenario_tip_scenario
ON scenario_tip(scenario_id);

CREATE INDEX IF NOT EXISTS idx_scenario_tip_tip
ON scenario_tip(tip_id);

COMMIT;