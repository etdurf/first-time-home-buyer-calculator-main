-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('john.doe@example.com', 'hashed_password_1', 'John', 'Doe'),
('jane.smith@example.com', 'hashed_password_2', 'Jane', 'Smith'),
('bob.johnson@example.com', 'hashed_password_3', 'Bob', 'Johnson'),
('alice.williams@example.com', 'hashed_password_4', 'Alice', 'Williams');

-- Insert sample properties
INSERT INTO properties (user_id, address, city, state, zip_code, purchase_price) VALUES
(1, '123 Oak Street', 'San Francisco', 'CA', '94102', 750000),
(2, '456 Elm Avenue', 'Los Angeles', 'CA', '90001', 550000),
(3, '789 Maple Drive', 'Seattle', 'WA', '98101', 650000),
(4, '321 Pine Road', 'Portland', 'OR', '97201', 480000);

-- Insert sample mortgages
INSERT INTO mortgages (property_id, principal, interest_rate, loan_term_years, monthly_payment) VALUES
(1, 600000, 6.5, 30, 3790.00),
(2, 440000, 6.75, 30, 2920.00),
(3, 520000, 6.25, 15, 4130.00),
(4, 384000, 6.9, 20, 2890.00);

-- Insert sample home assessments
INSERT INTO home_assessments (property_id, affordability_score, estimated_monthly_cost, long_term_cost, assessment_notes) VALUES
(1, 72, 4200, 1512000, 'Good affordability - property is within market range for the area'),
(2, 85, 3150, 1134000, 'Excellent affordability - good value compared to similar properties'),
(3, 68, 4800, 864000, 'Moderate affordability - shorter loan term increases monthly cost'),
(4, 90, 3200, 768000, 'Very good affordability - strong value and manageable payments');

-- Insert sample buyer tips
INSERT INTO buyer_tips (user_id, tip_text, category, is_favorited) VALUES
(1, 'Always get a pre-approval letter before house hunting', 'Getting Started', true),
(2, 'Save at least 20% for a down payment to avoid PMI', 'Financing', false),
(3, 'Get a home inspection before closing on a property', 'Due Diligence', true),
(4, 'Compare interest rates from multiple lenders', 'Financing', true);

-- Insert sample mortgage settings
INSERT INTO mortgage_settings (user_id, loan_term, home_price, down_payment_percent, interest_rate, annual_income) VALUES
(1, 30, 750000, 20, 6.5, 150000),
(2, 15, 550000, 25, 6.75, 120000),
(3, 20, 650000, 15, 6.25, 130000),
(4, 30, 480000, 10, 6.9, 90000);
