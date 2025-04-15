
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Download } from 'lucide-react';
import TicketCard from '../components/TicketCard';
import NavigationBar from '../components/NavigationBar';

const TicketView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticket } = location.state || {};
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #1E1E2F, #2C2C3A, #3E3E55)' }}>
        <div className="text-center">
          <p className="text-lg text-gray-300">No ticket found</p>
          <button
            className="mt-4 px-4 py-2 maas-button-glow"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Get the transport mode from the first non-walking segment
  const mainSegment = ticket.route.segments.find(s => s.mode !== 'walking');
  const transportMode = mainSegment?.mode || 'bus';

  return (
    <div className="min-h-screen pb-16" style={{ background: 'linear-gradient(to bottom, #1E1E2F, #2C2C3A, #3E3E55)' }}>
      {/* Header */}
      <div className="p-4" style={{ background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-2 text-white" onClick={handleBack}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Your Ticket</h1>
          </div>
          <button onClick={toggleShareOptions} className="text-white">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Ticket Card */}
      <div className="p-6">
        <TicketCard
          ticketId={ticket.id}
          transportMode={transportMode as any}
          startLocation={ticket.fromLocation}
          endLocation={ticket.toLocation}
          departureTime={ticket.route.departureTime}
          arrivalTime={ticket.route.arrivalTime}
          passengerName="John Doe" // In a real app, this would come from user profile
          price={ticket.totalPrice}
          routeIdentifier={mainSegment?.routeIdentifier}
          date={formatDate(ticket.purchaseDate)}
        />
      </div>
      
      {/* Share options */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={toggleShareOptions}>
          <div className="rounded-xl p-5 m-4 w-full max-w-md" style={{ background: 'linear-gradient(to bottom, #222831, #393E46)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-white">Share Ticket</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Email', 'SMS', 'WhatsApp', 'Telegram', 'Copy Link', 'More'].map((option) => (
                <div key={option} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#2C5364] flex items-center justify-center mb-1 text-[#00ADB5]">
                    <span>{option.charAt(0)}</span>
                  </div>
                  <span className="text-sm text-gray-300">{option}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-5 py-2 border border-gray-600 rounded-lg text-gray-300"
              onClick={toggleShareOptions}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="fixed bottom-16 left-0 right-0 p-4 border-t border-gray-700 shadow-md" style={{ background: 'linear-gradient(to bottom, rgba(15, 32, 39, 0.9), rgba(32, 58, 67, 0.9))' }}>
        <button
          className="w-full py-3 mb-3 rounded-lg border border-[#00ADB5] text-[#00ADB5] font-medium flex items-center justify-center hover:ai-glow transition-all"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Ticket
        </button>
        <button
          className="w-full py-3 rounded-lg maas-button-glow"
          onClick={() => navigate('/')}
        >
          Book Another Trip
        </button>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default TicketView;
