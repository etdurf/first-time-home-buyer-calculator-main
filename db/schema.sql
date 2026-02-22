-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  purchase_price DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mortgages table
CREATE TABLE IF NOT EXISTS mortgages (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  principal DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 3) NOT NULL,
  loan_term_years INTEGER NOT NULL,
  monthly_payment DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create home_assessments table
CREATE TABLE IF NOT EXISTS home_assessments (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  affordability_score INTEGER,
  estimated_monthly_cost DECIMAL(12, 2),
  long_term_cost DECIMAL(12, 2),
  assessment_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create buyer_tips table
CREATE TABLE IF NOT EXISTS buyer_tips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tip_text TEXT NOT NULL,
  category VARCHAR(50),
  is_favorited BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mortgage_settings table to store user preferences
CREATE TABLE IF NOT EXISTS mortgage_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  loan_term INTEGER DEFAULT 30,
  home_price DECIMAL(12, 2),
  down_payment_percent DECIMAL(5, 2),
  interest_rate DECIMAL(5, 3),
  annual_income DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_mortgages_property_id ON mortgages(property_id);
CREATE INDEX idx_assessments_property_id ON home_assessments(property_id);
CREATE INDEX idx_buyer_tips_user_id ON buyer_tips(user_id);
CREATE INDEX idx_mortgage_settings_user_id ON mortgage_settings(user_id);
