
export interface Vehicle {
  id: string;
  type: 'bus' | 'metro' | 'train';
  route: string;
  position: [number, number];
  heading: number;
  status: 'on-time' | 'delayed' | 'out-of-service';
  capacity: 'low' | 'medium' | 'high';
  accessible: boolean;
  eta: string;
}

export interface Station {
  id: string;
  name: string;
  type: 'bus' | 'metro' | 'train';
  position: [number, number];
  accessible: boolean;
  lines: string[];
  arrivals: Array<{
    line: string;
    destination: string;
    eta: string;
  }>;
}

export interface Route {
  id: string;
  name: string;
  type: 'bus' | 'metro' | 'train';
  color: string;
  path: Array<[number, number]>;
}

export interface RouteSegment {
  id: string;
  mode: 'walking' | 'bus' | 'metro' | 'train' | 'taxi' | 'ferry' | 'cycling';
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  duration: number; // in minutes
  distance: number; // in km
  routeIdentifier?: string; // e.g., Bus #42, Yellow Line, etc.
  price?: number;
}

export interface RouteOption {
  id: string;
  segments: RouteSegment[];
  totalDuration: number;
  totalDistance: number;
  totalPrice: number;
  departureTime: string;
  arrivalTime: string;
  crowdLevel?: 'low' | 'medium' | 'high';
}
