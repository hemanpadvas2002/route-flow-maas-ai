
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Train, Taxi, Walking, Ferry, Bike } from 'lucide-react';
import TicketCard from '../components/TicketCard';
import NavigationBar from '../components/NavigationBar';

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  // Mock ticket data
  const activeTickets = [
    {
      id: 'TIX123456',
      transportMode: 'bus',
      startLocation: 'Central Station',
      endLocation: 'Business Park',
      departureTime: '15:30',
      arrivalTime: '16:10',
      passengerName: 'John Doe',
      price: 25,
      routeIdentifier: 'Route 42',
      date: 'Fri, Apr 8, 2025',
      expired: false,
    },
    {
      id: 'TIX789012',
      transportMode: 'metro',
      startLocation: 'Airport Terminal',
      endLocation: 'City Center',
      departureTime: '18:45',
      arrivalTime: '19:15',
      passengerName: 'John Doe',
      price: 35,
      routeIdentifier: 'Blue Line',
      date: 'Sat, Apr 9, 2025',
      expired: false,
    },
  ];

  const pastTickets = [
    {
      id: 'TIX345678',
      transportMode: 'train',
      startLocation: 'North Station',
      endLocation: 'South Station',
      departureTime: '10:30',
      arrivalTime: '11:45',
      passengerName: 'John Doe',
      price: 120,
      routeIdentifier: 'Express 7',
      date: 'Wed, Apr 1, 2025',
      expired: true,
    },
    {
      id: 'TIX901234',
      transportMode: 'bus',
      startLocation: 'Market Street',
      endLocation: 'University Campus',
      departureTime: '09:15',
      arrivalTime: '09:45',
      passengerName: 'John Doe',
      price: 20,
      routeIdentifier: 'Route 15',
      date: 'Mon, Mar 30, 2025',
      expired: true,
    },
    {
      id: 'TIX567890',
      transportMode: 'ferry',
      startLocation: 'Harbor Point',
      endLocation: 'Island Terminal',
      departureTime: '12:00',
      arrivalTime: '12:45',
      passengerName: 'John Doe',
      price: 75,
      routeIdentifier: 'Bay Ferry',
      date: 'Sat, Mar 28, 2025',
      expired: true,
    },
  ];

  const tickets = activeTab === 'active' ? activeTickets : pastTickets;

  const handleViewTicket = (ticketId: string) => {
    // In a real app, we would get the ticket data from a database
    // For simplicity, we're just navigating to the same ticket view
    navigate('/ticket-view', { 
      state: { 
        ticket: {
          id: ticketId,
          route: {
            departureTime: tickets.find(t => t.id === ticketId)?.departureTime,
            arrivalTime: tickets.find(t => t.id === ticketId)?.arrivalTime,
            segments: []
          },
          fromLocation: tickets.find(t => t.id === ticketId)?.startLocation,
          toLocation: tickets.find(t => t.id === ticketId)?.endLocation,
          totalPrice: tickets.find(t => t.id === ticketId)?.price,
          purchaseDate: new Date().toISOString()
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">My Tickets</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'active' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Active Tickets
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'past' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past Tickets
        </button>
      </div>
      
      {/* Ticket List */}
      <div className="p-4">
        {tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} 
                className="cursor-pointer transform transition-transform active:scale-98"
                onClick={() => handleViewTicket(ticket.id)}
              >
                <TicketCard
                  ticketId={ticket.id}
                  transportMode={ticket.transportMode as any}
                  startLocation={ticket.startLocation}
                  endLocation={ticket.endLocation}
                  departureTime={ticket.departureTime}
                  arrivalTime={ticket.arrivalTime}
                  passengerName={ticket.passengerName}
                  price={ticket.price}
                  routeIdentifier={ticket.routeIdentifier}
                  date={ticket.date}
                  expired={ticket.expired}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-200 rounded-full p-4 mb-4">
              <Ticket className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No tickets found</h3>
            <p className="text-gray-500 mb-6">You don't have any {activeTab} tickets</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => navigate('/')}
            >
              Book a Trip
            </button>
          </div>
        )}
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default TicketsPage;
