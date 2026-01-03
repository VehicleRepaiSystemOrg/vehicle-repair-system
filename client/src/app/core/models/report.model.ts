// Models for reports and sales overview

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface Transaction {
  date: string; // ISO date string
  customer: string;
  vehicle: string;
  service: string;
  amount: number; // stored as cents or dollars depending on backend conventions
}

export interface SalesReport {
  totalSales: number; // e.g., 120000
  salesByService: Record<string, number>; // e.g., { "Oil Change": 30000 }
  trend: ChartData; // line chart data
  recentSales: Transaction[];
}

// TODO: Extend interfaces with pagination/metadata when integrating with the backend API
