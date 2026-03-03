import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin, Navigation, CreditCard, Users } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { lastMileServices, getPickupPoints, calculateFare, calculateEta } from './lastMileData';
import { LastMileServiceType, RideMode, PickupPoint } from './types';

interface LastMileConnectivityProps {
  transitStopName: string;
  transitStopCoords: [number, number];
  destinationName?: string;
  lastMileDistanceKm?: number;
  onBook: (service: LastMileServiceType, fare: number, eta: number) => void;
}

const LastMileConnectivity: React.FC<LastMileConnectivityProps> = ({
  transitStopName,
  transitStopCoords,
  destinationName = 'Final Destination',
  lastMileDistanceKm = 2.5,
  onBook,
}) => {
  const [selectedService, setSelectedService] = useState<LastMileServiceType | null>(null);
  const [rideMode, setRideMode] = useState<RideMode>('private');
  const [selectedPickup, setSelectedPickup] = useState<string>('pp-1');

  const pickupPoints = useMemo(() => getPickupPoints(transitStopCoords), [transitStopCoords]);
  const currentPickup = pickupPoints.find((p) => p.id === selectedPickup) || pickupPoints[0];

  const selectedServiceData = lastMileServices.find((s) => s.id === selectedService);

  const handleBook = () => {
    if (!selectedServiceData) return;
    const isShared = rideMode === 'shared';
    const fare = calculateFare(selectedServiceData, lastMileDistanceKm, isShared);
    const eta = calculateEta(selectedServiceData, lastMileDistanceKm);
    onBook(selectedService!, fare, eta);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Navigation className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Last Mile Connectivity</h3>
      </div>

      {/* Route info */}
      <Card className="bg-muted/50">
        <CardContent className="p-2.5">
          <div className="flex items-start gap-2 text-xs">
            <div className="flex flex-col items-center gap-0.5 pt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="w-px h-5 bg-border" />
              <MapPin className="h-3 w-3 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-medium text-foreground">{transitStopName}</p>
                <p className="text-muted-foreground">Transit stop • Pickup: {currentPickup.name} ({currentPickup.distance})</p>
              </div>
              <div>
                <p className="font-medium text-foreground">{destinationName}</p>
                <p className="text-muted-foreground">{lastMileDistanceKm} km away</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickup selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {pickupPoints.map((pp) => (
          <button
            key={pp.id}
            onClick={() => setSelectedPickup(pp.id)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs transition-colors ${
              selectedPickup === pp.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            📍 {pp.name} • {pp.walkTime}
          </button>
        ))}
      </div>

      {/* Ride mode toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Shared ride</span>
        </div>
        <Switch
          checked={rideMode === 'shared'}
          onCheckedChange={(checked) => setRideMode(checked ? 'shared' : 'private')}
        />
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-2 gap-2">
        {lastMileServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            distanceKm={lastMileDistanceKm}
            rideMode={rideMode}
            selected={selectedService === service.id}
            onSelect={(id) => setSelectedService(id as LastMileServiceType)}
          />
        ))}
      </div>

      {/* Book button */}
      {selectedService && (
        <Button
          className="w-full mobility-blue-gradient hover:opacity-90"
          onClick={handleBook}
        >
          <CreditCard className="h-4 w-4 mr-1.5" />
          Book {selectedServiceData?.name} • ₹
          {calculateFare(
            selectedServiceData!,
            lastMileDistanceKm,
            rideMode === 'shared'
          )}
        </Button>
      )}
    </div>
  );
};

export default LastMileConnectivity;
