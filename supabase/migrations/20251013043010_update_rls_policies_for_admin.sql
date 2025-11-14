/*
  # Update RLS Policies for Admin Access

  1. Changes
    - Add INSERT, UPDATE, DELETE policies for authenticated users on all tables
    - Keep existing SELECT policies for public access
  
  2. Security
    - Only authenticated users can modify data
    - Public users can still view the dashboard
*/

-- Monthly Registrations Policies
CREATE POLICY "Authenticated users can insert monthly registrations"
  ON monthly_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update monthly registrations"
  ON monthly_registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete monthly registrations"
  ON monthly_registrations FOR DELETE
  TO authenticated
  USING (true);

-- Weekly Registrations Policies
CREATE POLICY "Authenticated users can insert weekly registrations"
  ON weekly_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update weekly registrations"
  ON weekly_registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete weekly registrations"
  ON weekly_registrations FOR DELETE
  TO authenticated
  USING (true);

-- County Registrations Policies
CREATE POLICY "Authenticated users can insert county registrations"
  ON county_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update county registrations"
  ON county_registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete county registrations"
  ON county_registrations FOR DELETE
  TO authenticated
  USING (true);

-- Sector Registrations Policies
CREATE POLICY "Authenticated users can insert sector registrations"
  ON sector_registrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sector registrations"
  ON sector_registrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sector registrations"
  ON sector_registrations FOR DELETE
  TO authenticated
  USING (true);

-- Growth Metrics Policies
CREATE POLICY "Authenticated users can insert growth metrics"
  ON growth_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update growth metrics"
  ON growth_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete growth metrics"
  ON growth_metrics FOR DELETE
  TO authenticated
  USING (true);