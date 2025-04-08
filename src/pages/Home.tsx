
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Clock } from 'lucide-react';
import Map from '../components/Map';
import NavigationBar from '../components/NavigationBar';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // Mock recent search data
  const recentSearches = [
    { from: 'Home', to: 'Office', time: '9:00 AM' },
    { from: 'Mall', to: 'Stadium', time: '5:30 PM' },
    { from: 'Airport', to: 'Hotel Royal', time: '10:15 AM' },
  ];

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      navigate('/route-selection', { 
        state: { fromLocation, toLocation } 
      });
    }
  };

  const handleFocus = () => {
    setShowRecentSearches(true);
  };

  const handleBlur = () => {
    // Adding a delay to allow click events on recent searches
    setTimeout(() => {
      setShowRecentSearches(false);
    }, 200);
  };

  const selectRecentSearch = (from: string, to: string) => {
    setFromLocation(from);
    setToLocation(to);
    setShowRecentSearches(false);
    
    // Navigate after a short delay to show the filled inputs
    setTimeout(() => {
      navigate('/route-selection', { 
        state: { fromLocation: from, toLocation: to } 
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Map section */}
      <div className="h-[60vh] relative">
        <Map />
        
        {/* Search overlay */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4">Where to?</h1>
              
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="From"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="To"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              
              <button
                className={`w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors ${
                  fromLocation && toLocation
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSearch}
                disabled={!fromLocation || !toLocation}
              >
                Find Routes
              </button>
            </div>
            
            {/* Recent searches */}
            {showRecentSearches && (
              <div className="border-t border-gray-200 max-h-60 overflow-y-auto">
                <h2 className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">Recent Searches</h2>
                <ul>
                  {recentSearches.map((search, index) => (
                    <li 
                      key={index} 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() => selectRecentSearch(search.from, search.to)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium">{search.from}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium">{search.to}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {search.time}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick access section */}
      <div className="mt-4 px-4">
        <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Home', icon: '🏠', destination: 'Office' },
            { label: 'Work', icon: '💼', destination: 'Home' },
            { label: 'Station', icon: '🚉', destination: 'Mall' },
            { label: 'Airport', icon: '✈️', destination: 'City Center' },
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200"
              onClick={() => {
                setFromLocation(item.label);
                setToLocation(item.destination);
                setTimeout(() => {
                  navigate('/route-selection', { 
                    state: { fromLocation: item.label, toLocation: item.destination } 
                  });
                }, 300);
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                <span className="text-lg">{item.icon}</span>
              </div>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>To {item.destination}</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default Home;
