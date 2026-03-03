export type LastMileServiceType = 'auto' | 'car-taxi' | 'bike-taxi' | 'shared-auto';
export type RideMode = 'private' | 'shared';

export interface LastMileService {
  id: LastMileServiceType;
  name: string;
  emoji: string;
  baseFare: number;
  perKmRate: number;
  sharedDiscount: number; // percentage
  avgSpeed: number; // km/h for ETA calc
  capacity: number;
  available: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  distance: string; // from transit stop
  walkTime: string;
  coords: [number, number];
}

export interface LastMileBooking {
  service: LastMileServiceType;
  rideMode: RideMode;
  fare: number;
  eta: number; // minutes
  pickupPoint: PickupPoint;
  distanceKm: number;
}
