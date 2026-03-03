import { LastMileService, PickupPoint } from './types';

export const lastMileServices: LastMileService[] = [
  {
    id: 'auto',
    name: 'Auto',
    emoji: '🛺',
    baseFare: 30,
    perKmRate: 12,
    sharedDiscount: 40,
    avgSpeed: 20,
    capacity: 3,
    available: true,
  },
  {
    id: 'car-taxi',
    name: 'Car Taxi',
    emoji: '🚕',
    baseFare: 50,
    perKmRate: 18,
    sharedDiscount: 30,
    avgSpeed: 25,
    capacity: 4,
    available: true,
  },
  {
    id: 'bike-taxi',
    name: 'Bike Taxi',
    emoji: '🏍️',
    baseFare: 20,
    perKmRate: 8,
    sharedDiscount: 0,
    avgSpeed: 30,
    capacity: 1,
    available: true,
  },
  {
    id: 'shared-auto',
    name: 'Shared Auto',
    emoji: '🛺',
    baseFare: 15,
    perKmRate: 6,
    sharedDiscount: 0, // already shared pricing
    avgSpeed: 15,
    capacity: 6,
    available: true,
  },
];

export const getPickupPoints = (transitStopCoords: [number, number]): PickupPoint[] => {
  const [lng, lat] = transitStopCoords;
  return [
    {
      id: 'pp-1',
      name: 'Gate A Exit',
      distance: '50m',
      walkTime: '1 min',
      coords: [lng + 0.0005, lat + 0.0003],
    },
    {
      id: 'pp-2',
      name: 'Main Road Stand',
      distance: '120m',
      walkTime: '2 min',
      coords: [lng - 0.0008, lat + 0.0005],
    },
    {
      id: 'pp-3',
      name: 'Opposite Junction',
      distance: '200m',
      walkTime: '3 min',
      coords: [lng + 0.001, lat - 0.0004],
    },
  ];
};

export const calculateFare = (
  service: LastMileService,
  distanceKm: number,
  isShared: boolean
): number => {
  let fare = service.baseFare + service.perKmRate * distanceKm;
  if (isShared && service.sharedDiscount > 0) {
    fare = fare * (1 - service.sharedDiscount / 100);
  }
  return Math.round(fare);
};

export const calculateEta = (service: LastMileService, distanceKm: number): number => {
  const travelTime = (distanceKm / service.avgSpeed) * 60;
  const waitTime = 2 + Math.random() * 5; // 2-7 min wait
  return Math.round(travelTime + waitTime);
};
