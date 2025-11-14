/*
  # YSO Registration Analytics Database Schema

  1. New Tables
    - `monthly_registrations`
      - `id` (uuid, primary key)
      - `month` (text) - Month name
      - `year` (integer) - Year
      - `count` (integer) - Number of registrations
      - `created_at` (timestamptz)
    
    - `weekly_registrations`
      - `id` (uuid, primary key)
      - `date_range` (text) - Date range for the week
      - `count` (integer) - Number of registrations
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamptz)
    
    - `county_registrations`
      - `id` (uuid, primary key)
      - `county_name` (text) - County name
      - `count` (integer) - Number of YSOs
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `sector_registrations`
      - `id` (uuid, primary key)
      - `sector_name` (text) - Sector working group name
      - `count` (integer) - Number of YSOs
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `growth_metrics`
      - `id` (uuid, primary key)
      - `date_range` (text)
      - `previous_number` (integer)
      - `current_number` (integer)
      - `weekly_growth` (integer)
      - `weekly_growth_percentage` (decimal)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (dashboard is public)
*/

CREATE TABLE IF NOT EXISTS monthly_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL,
  year integer NOT NULL,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weekly_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_range text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS county_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county_name text NOT NULL UNIQUE,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sector_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_name text NOT NULL UNIQUE,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS growth_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_range text NOT NULL,
  previous_number integer NOT NULL,
  current_number integer NOT NULL,
  weekly_growth integer NOT NULL,
  weekly_growth_percentage decimal(5,3) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE monthly_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE county_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access to monthly registrations"
  ON monthly_registrations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to weekly registrations"
  ON weekly_registrations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to county registrations"
  ON county_registrations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to sector registrations"
  ON sector_registrations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to growth metrics"
  ON growth_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample data from the report
INSERT INTO monthly_registrations (month, year, count) VALUES
  ('June', 2025, 34),
  ('July', 2025, 64),
  ('August', 2025, 55),
  ('September', 2025, 35)
ON CONFLICT DO NOTHING;

INSERT INTO weekly_registrations (date_range, count, start_date, end_date) VALUES
  ('1/9/2025-7/9/2025', 11, '2025-09-01', '2025-09-07'),
  ('8/9/2025-15/9/2025', 6, '2025-09-08', '2025-09-15'),
  ('16/9/2025-22/9/2025', 9, '2025-09-16', '2025-09-22'),
  ('23/9/2025-29/9/2025', 9, '2025-09-23', '2025-09-29')
ON CONFLICT DO NOTHING;

INSERT INTO county_registrations (county_name, count) VALUES
  ('Baringo', 2), ('Bomet', 6), ('Bungoma', 40), ('Busia', 25),
  ('Elgeyo-Marakwet', 3), ('Embu', 2), ('Garissa', 5), ('Homa Bay', 20),
  ('Isiolo', 5), ('Kajiado', 8), ('Kakamega', 18), ('Kericho', 10),
  ('Kiambu', 23), ('Kilifi', 10), ('Kirinyaga', 7), ('Kisii', 7),
  ('Kisumu', 23), ('Kitui', 5), ('Kwale', 24), ('Laikipia', 3),
  ('Lamu', 1), ('Machakos', 16), ('Makueni', 23), ('Mandera', 18),
  ('Marsabit', 4), ('Meru', 10), ('Migori', 7), ('Mombasa', 35),
  ('Murang''a', 16), ('Nairobi City', 137), ('Nakuru', 11), ('Nandi', 11),
  ('Narok', 5), ('Nyamira', 4), ('Nyandarua', 5), ('Nyeri', 8),
  ('Samburu', 4), ('Siaya', 11), ('Taita-Taveta', 6), ('Tana River', 6),
  ('Tharaka-Nithi', 7), ('Trans Nzoia', 11), ('Turkana', 10), ('Uasin Gishu', 13),
  ('Vihiga', 2), ('Wajir', 5), ('West Pokot', 3)
ON CONFLICT DO NOTHING;

INSERT INTO sector_registrations (sector_name, count) VALUES
  ('Environment, Climate Action and Agriculture', 254),
  ('Employment and Enterprise Development', 88),
  ('Leadership, Governance and Values', 26),
  ('Health and Wellbeing', 48),
  ('Peace and Security', 44),
  ('Talent Development and Innovation', 80),
  ('Education and Research', 28),
  ('Youth Professionalization', 51)
ON CONFLICT DO NOTHING;

INSERT INTO growth_metrics (date_range, previous_number, current_number, weekly_growth, weekly_growth_percentage) VALUES
  ('23/9/2025-29/9/2025', 610, 619, 9, 1.475)
ON CONFLICT DO NOTHING;