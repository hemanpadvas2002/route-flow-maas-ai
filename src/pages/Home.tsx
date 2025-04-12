
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Clock, Menu, Bell, X } from 'lucide-react';
import Map from '../components/Map';
import NavigationBar from '../components/NavigationBar';

// Chennai popular locations
const chennaiLocations = [
  "T. Nagar",
  "Anna Nagar",
  "Adyar",
  "Mylapore",
  "Velachery",
  "Chennai Central",
  "Chennai Airport",
  "Egmore",
  "Guindy",
  "Porur",
  "Tambaram",
  "Chromepet",
  "Pallavaram",
  "Besant Nagar",
  "Marina Beach"
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionField, setActiveSuggestionField] = useState<'from' | 'to' | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Mock recent search data
  const recentSearches = [
    { from: 'Anna Nagar', to: 'T. Nagar', time: '9:00 AM' },
    { from: 'Chennai Central', to: 'Chennai Airport', time: '5:30 PM' },
    { from: 'Adyar', to: 'Egmore', time: '10:15 AM' },
  ];

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      navigate('/route-selection', { 
        state: { fromLocation, toLocation } 
      });
    }
  };

  const handleFocus = (field: 'from' | 'to') => {
    setShowRecentSearches(true);
    setIsSearchExpanded(true);
    setShowSuggestions(true);
    setActiveSuggestionField(field);
  };

  const handleBlur = () => {
    // Adding a delay to allow click events on recent searches
    setTimeout(() => {
      setShowRecentSearches(false);
      setShowSuggestions(false);
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

  const selectLocation = (location: string) => {
    if (activeSuggestionField === 'from') {
      setFromLocation(location);
      // Auto-focus the "to" field after selecting "from"
      setActiveSuggestionField('to');
    } else if (activeSuggestionField === 'to') {
      setToLocation(location);
      setShowSuggestions(false);
      
      // If both fields are filled, navigate to route selection
      if (fromLocation) {
        setTimeout(() => {
          navigate('/route-selection', { 
            state: { fromLocation, toLocation: location } 
          });
        }, 300);
      }
    }
  };

  const clearInput = (field: 'from' | 'to') => {
    if (field === 'from') {
      setFromLocation('');
    } else {
      setToLocation('');
    }
  };

  // Filter suggestions based on input
  const filteredLocations = (input: string) => {
    if (!input) return chennaiLocations;
    const lowerInput = input.toLowerCase();
    return chennaiLocations.filter(location => 
      location.toLowerCase().includes(lowerInput)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* App header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex justify-between items-center shadow-sm z-10">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">RouteFlow</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      
      {/* Full-height map section */}
      <div className="flex-1 relative">
        <Map />
      </div>
      
      {/* Bottom search panel - collapsed by default */}
      <div className={`fixed inset-x-0 bottom-16 z-20 transition-transform duration-300 ${isSearchExpanded ? 'translate-y-0' : 'translate-y-[80%]'}`}>
        <div 
          className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg border border-gray-200 dark:border-gray-700 mx-2"
          onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
        >
          {/* Pull tab indicator */}
          <div className="h-1 w-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-2"></div>
          
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Where to?</h2>
            
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="From"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onFocus={() => handleFocus('from')}
                  onBlur={handleBlur}
                />
                {fromLocation && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => clearInput('from')}
                  >
                    <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </button>
                )}
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="To"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  onFocus={() => handleFocus('to')}
                  onBlur={handleBlur}
                />
                {toLocation && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => clearInput('to')}
                  >
                    <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </button>
                )}
              </div>
            </div>
            
            <button
              className={`w-full mt-4 py-3 px-4 rounded-xl font-medium transition-colors ${
                fromLocation && toLocation
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSearch}
              disabled={!fromLocation || !toLocation}
            >
              Find Routes
            </button>
          </div>
          
          {/* Chennai location suggestions */}
          {showSuggestions && (
            <div className="border-t border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              <h2 className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                Chennai Locations
              </h2>
              <ul>
                {filteredLocations(activeSuggestionField === 'from' ? fromLocation : toLocation).map((location, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                    onClick={() => selectLocation(location)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Recent searches */}
          {showRecentSearches && !showSuggestions && (
            <div className="border-t border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              <h2 className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">Recent Searches</h2>
              <ul>
                {recentSearches.map((search, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                    onClick={() => selectRecentSearch(search.from, search.to)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{search.from}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{search.to}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
      
      <NavigationBar />
    </div>
  );
};

export default Home;
