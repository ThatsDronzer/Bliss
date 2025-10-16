'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  demoUser, 
  vendorData, 
  coinRules, 
  helpArticles, 
  packages, 
  budgetCategories, 
  trendingDeals, 
  quickResponses, 
  supportedLanguages 
} from '@/lib/chat-data';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface SuggestedAction {
  label: string;
  action: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('en');
  const [lastContext, setLastContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const suggestedActions: SuggestedAction[] = [
    { label: "View Packages 📦", action: "Show me your event packages" },
    { label: "Find Venue 🏰", action: "I want to find a venue" },
    { label: "Special Deals 🎉", action: "What special deals do you have?" },
    { label: "Budget Guide 💰", action: "Help me plan within my budget" },
    { label: "Event Planning 📅", action: "I need help planning my event" },
    { label: "Check Coins ⭐", action: "How many coins do I have?" }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = supportedLanguages.find(lang => lang.code === language)?.greeting || "How can I help you today?";
      handleBotResponse(`Hi! 👋 ${greeting}\n\nI can help you plan your perfect event! Choose from the options below or type your question. 🎉`);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatBudgetResponse = (category: keyof typeof budgetCategories) => {
    const cat = budgetCategories[category];
    return `Here are our ${category} options (${cat.range}) 💫\n\n` +
           `Recommended Venues:\n${cat.venues.map(v => `• ${v}`).join('\n')}\n\n` +
           `Catering Options:\n• ${cat.catering}\n\n` +
           `Decoration Package:\n• ${cat.decoration}\n\n` +
           "Would you like to:\n" +
           "1. See available dates\n" +
           "2. Book a venue visit\n" +
           "3. Get a custom quote";
  };

  const handleUserMessage = async (message: string) => {
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    
    const lowerMessage = message.toLowerCase();
    let response = '';

    try {
      // Package related queries
      if (lowerMessage.includes('package') || lowerMessage.includes('pricing')) {
        response = "Here are our celebration packages 🎊:\n\n";
        Object.entries(packages).forEach(([key, pkg]) => {
          response += `${pkg.name} (₹${pkg.price.toLocaleString()}) 💫\n`;
          response += `Best for: ${pkg.bestFor}\n`;
          response += "Includes:\n";
          pkg.includes.forEach(item => response += `• ${item}\n`);
          response += "\n";
        });
        response += "Would you like to know more about any specific package? 🤔";
        setLastContext('packages');
      }
      // Budget related queries
      else if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
        if (lowerMessage.includes('under 1') || lowerMessage.includes('economic')) {
          response = formatBudgetResponse('economic');
        } else if (lowerMessage.includes('premium')) {
          response = formatBudgetResponse('premium');
        } else if (lowerMessage.includes('luxury')) {
          response = formatBudgetResponse('luxury');
        } else {
          response = "Let me help you find options within your budget 💰\n\n";
          Object.entries(budgetCategories).forEach(([key, category]) => {
            response += `${key.toUpperCase()} (${category.range}) 💫\n`;
            response += `• Venues: ${category.venues.join(', ')}\n`;
            response += `• Catering: ${category.catering}\n`;
            response += `• Decoration: ${category.decoration}\n\n`;
          });
          response += "Which budget category interests you? 🤔";
        }
        setLastContext('budget');
      }
      // Special deals and trending offers
      else if (lowerMessage.includes('deal') || lowerMessage.includes('offer') || lowerMessage.includes('special')) {
        response = "Check out our trending deals! 🌟\n\n";
        trendingDeals.forEach(deal => {
          response += `${deal.title} 🎉\n`;
          response += `• ${deal.description}\n`;
          response += `• ${deal.discount}\n`;
          response += `• Valid till: ${deal.validTill}\n\n`;
        });
        response += "Would you like to know more about any of these deals? 💫";
        setLastContext('deals');
      }
    // Find venue/service query
      else if (lowerMessage.includes('find') || lowerMessage.includes('book')) {
      const city = lowerMessage.includes('delhi') ? 'delhi' : 
                   lowerMessage.includes('mumbai') ? 'mumbai' : null;
      
      if (!city) {
          response = "Please specify a city (Delhi or Mumbai) for your search. 🏙️\n" +
                    "For example: 'Find venues in Delhi' or 'Book catering in Mumbai'\n\n" +
                    "Also, let me know your guest count and budget for better recommendations! 🎯";
      } else {
        const service = lowerMessage.includes('venue') ? 'venue' : 
                         lowerMessage.includes('catering') ? 'catering' :
                         lowerMessage.includes('decor') ? 'decoration' : null;
        
        if (!service || !vendorData[city][service]) {
            response = `What type of service are you looking for in ${city}? We offer:\n` +
                      "• Venues (Halls, Gardens) 🏰\n" +
                      "• Catering Services 🍽️\n" +
                      "• Decoration Services 🎨\n\n" +
                      quickResponses.preferences.join('\n');
        } else {
          const vendors = vendorData[city][service];
            response = `Here are top rated ${service}s in ${city} 🌟:\n\n`;
            
            vendors.forEach(v => {
              response += `${v.name} (${v.rating}★)\n`;
              if (v.type === 'venue') {
                response += `• Capacity: ${v.capacity} guests\n`;
              } else if (v.type === 'catering') {
                response += `• ${v.price.toLocaleString()} INR ${v.priceUnit}\n`;
              } else if (v.type === 'decoration') {
                response += `• Style: ${v.style}\n`;
              }
              response += `• Price: ₹${v.price.toLocaleString()}\n\n`;
            });
            
            response += "Would you like to:\n" +
                       "1. View more details about any vendor\n" +
                       "2. Schedule a visit/tasting\n" +
                       "3. Start booking process\n\n" +
                       "Also, check out our packages for better value! 💫";
          }
        }
        setLastContext('search');
      }
      // Follow-up on last context
      else if (lastContext === 'packages' && (lowerMessage.includes('basic') || lowerMessage.includes('premium') || lowerMessage.includes('luxury'))) {
        const packageKey = Object.keys(packages).find(key => lowerMessage.includes(key)) as keyof typeof packages;
        if (packageKey) {
          const pkg = packages[packageKey];
          response = `Here's more about our ${pkg.name} 📦\n\n` +
                    `Perfect for: ${pkg.bestFor}\n` +
                    `Price: ₹${pkg.price.toLocaleString()}\n\n` +
                    "Detailed Inclusions:\n" +
                    pkg.includes.map(item => `• ${item}`).join('\n') + '\n\n' +
                    "Would you like to:\n" +
                    "1. Book this package\n" +
                    "2. Customize the package\n" +
                    "3. See other packages";
        }
      }
      // Event planning guidance
      else if (lowerMessage.includes('plan') || lowerMessage.includes('timeline')) {
        response = helpArticles.eventPlanning.content.replace(/•/g, '📅') + '\n\n' +
                  "Would you like me to help you create a customized timeline? 📋";
        setLastContext('planning');
      }
      // Services overview
      else if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        response = helpArticles.services.content.replace(/•/g, '💫');
      }
      // Coin balance and usage
      else if (lowerMessage.includes('coin')) {
        if (lowerMessage.includes('have') || lowerMessage.includes('balance')) {
      response = `You currently have ${demoUser.coins} coins! 🌟\n` +
                    `You can use up to ${coinRules.maxRedeemPercentage}% of your next booking's value as a discount. 💝\n\n` +
                    "Would you like to:\n" +
                    "1. Learn how to earn more coins\n" +
                    "2. Use coins for booking\n" +
                    "3. Check coin expiry";
        } else {
      response = helpArticles.coinSystem.content.replace(/•/g, '💎');
    }
        setLastContext('coins');
      }
      // Booking process
      else if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
      if (demoUser.bookings.length === 0) {
          response = helpArticles.bookingGuide.content.replace(/•/g, '✨') + '\n\n' +
                    quickResponses.date.join('\n');
      } else {
        const booking = demoUser.bookings[0];
        response = `Here is your latest booking 🎉:\n` +
                  `Service: ${booking.service} ✨\n` +
                  `Vendor: ${booking.vendor} 🏢\n` +
                  `Location: ${booking.location} 📍\n` +
                  `Date: ${booking.date} 📅\n` +
                    `Price: ₹${booking.price.toLocaleString()} 💰\n\n` +
                    `Need to modify this booking? Let me know! 🤝`;
        }
        setLastContext('booking');
      }
      // Cancellation policy
      else if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
        response = helpArticles.cancellationPolicy.content.replace(/•/g, '📋');
      }
      // Language selection
      else if (lowerMessage.includes('hindi') || lowerMessage.includes('language')) {
        response = "You can chat with me in:\n" +
                  supportedLanguages.map(lang => `• ${lang.name}`).join('\n') + '\n\n' +
                  "Which language would you prefer? 🌐";
        setLastContext('language');
    }
    // Fallback message
    else {
        response = "Hi! I'm your event planning assistant! 🎉 I can help you with:\n" +
                  "• Finding perfect venues 🏰\n" +
                  "• Booking catering services 🍽️\n" +
                  "• Arranging decorations 🎨\n" +
                  "• Event planning tips 📅\n" +
                  "• Managing bookings 📋\n" +
                  "• Using reward coins 🌟\n\n" +
                  "What would you like to know about? 😊";
        setLastContext(null);
      }
    } catch (error) {
      response = "I apologize, but I'm having trouble processing that request. 😅\n" +
                "Could you please rephrase or try one of the suggested options below? 🙏";
      console.error('Error in chat processing:', error);
      setLastContext(null);
    }

    setTimeout(() => {
      handleBotResponse(response);
    }, 500);

    setInputValue('');
  };

  const handleBotResponse = (response: string) => {
    setMessages(prev => [...prev, { type: 'bot', content: response }]);
  };

  const handleSuggestedAction = (action: string) => {
    handleUserMessage(action);
  };

  return (
    <div className="hidden lg:block fixed bottom-4 right-4 z-[9999]">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pink-500 hover:bg-pink-400 text-white rounded-full p-4 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.25)' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-pink-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Wedding Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-pink-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Actions */}
          {messages.length <= 2 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {suggestedActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedAction(action.action)}
                    className="px-4 py-2 text-sm border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputValue.trim()) {
                  handleUserMessage(inputValue.trim());
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 