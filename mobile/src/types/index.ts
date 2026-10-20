export interface FuelPriceItem {
  id: string;
  location?: string;
  name?: string;
  price: string;
}

export interface FuelPrices {
  diesel: FuelPriceItem[];
  aviationAndPetrol: FuelPriceItem[];
  updatedAt: string;
}

export interface MarketPrices {
  fuels: string[];
  sources: string[];
  prices: Record<string, Record<string, string>>;
}

export type CityName = 'Astana' | 'Almaty' | 'Dostyk';

export interface Tank {
  id: number;
  name: string;
  city: CityName;
  content: string;
  value: number;
  max: number;
  color: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  trending: number;
  img: string;
}

export interface UserPermissions {
  viewTanks: string; // 'all' or 'some'
  canEditPrices: boolean;
  canEditTanks: boolean;
  canAddNews: boolean;
  canViewMarketPrices: boolean;
  canEditMarketPrices: boolean;
}

export interface User {
  username: string;
  password?: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  position: string;
  birthDate: string;
  cabinet: string;
  photo: string | null;
  permissions: UserPermissions;
  lastSeen?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface CityInfo {
  name: CityName;
  label: string;
  count: number;
}
