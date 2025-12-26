export interface MonthlyRegistration {
  id: string;
  month: string;
  year: number;
  count: number;
  created_at: string;
}

export interface WeeklyRegistration {
  id: string;
  date_range: string;
  count: number;
  start_date: string;
  end_date: string;
  created_at: string;
  sort_order: number;
}

export interface CountyRegistration {
  id: string;
  county_name: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface SectorRegistration {
  id: string;
  sector_name: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface GrowthMetric {
  id: string;
  date_range: string;
  previous_number: number;
  current_number: number;
  weekly_growth: number;
  weekly_growth_percentage: number;
  created_at: string;
}
