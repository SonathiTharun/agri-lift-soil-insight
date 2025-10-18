import React, { useState } from "react";
import { motion } from "framer-motion";

interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: string;
  image: string;
}

const ExpertConsultation: React.FC = () => {
  const [experts] = useState<Expert[]>([
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      specialty: "Bee Biology & Health",
      experience: 15,
      rating: 4.9,
      hourlyRate: 500,
      availability: "Mon-Fri, 10 AM - 6 PM",
      image: "👨‍🔬",
    },
    {
      id: "2",
      name: "Priya Sharma",
      specialty: "Honey Production & Marketing",
      experience: 12,
      rating: 4.8,
      hourlyRate: 450,
      availability: "Tue-Sat, 2 PM - 8 PM",
      image: "👩‍💼",
    },
    {
      id: "3",
      name: "Vikram Singh",
      specialty: "Equipment & Farm Setup",
      experience: 18,
      rating: 4.9,
      hourlyRate: 550,
      availability: "Mon-Thu, 9 AM - 5 PM",
      image: "👨‍🔧",
    },
    {
      id: "4",
      name: "Lakshmi Devi",
      specialty: "Organic Beekeeping",
      experience: 10,
      rating: 4.7,
      hourlyRate: 400,
      availability: "Wed-Sun, 11 AM - 7 PM",
      image: "👩‍🌾",
    },
  ]);

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 pb-16">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto text-center py-12 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          📚 Expert Bee Farming Advice
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Connect with experienced beekeepers and get personalized guidance for your farm
        </p>
      </motion.section>

      {/* Experts Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-6xl mx-auto mb-12 px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert, idx) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur rounded-2xl shadow-lg overflow-hidden border border-purple-200"
            >
              {/* Avatar */}
              <div className="bg-gradient-to-br from-purple-300 to-indigo-400 h-32 flex items-center justify-center text-6xl">
                {expert.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-1">{expert.name}</h3>
                <p className="text-sm text-purple-600 font-semibold mb-3">{expert.specialty}</p>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-semibold">{expert.experience} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{expert.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-semibold">₹{expert.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-xs">{expert.availability}</span>
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedExpert(expert);
                    setShowBooking(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  Book Consultation
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">📖 Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Beginner's Guide to Beekeeping",
              icon: "📚",
              description: "Learn the basics of starting your bee farm",
            },
            {
              title: "Honey Production Techniques",
              icon: "🍯",
              description: "Advanced methods to maximize honey yield",
            },
            {
              title: "Disease Management",
              icon: "🏥",
              description: "Identify and treat common bee diseases",
            },
            {
              title: "Seasonal Management",
              icon: "🌍",
              description: "Year-round care and maintenance tips",
            },
            {
              title: "Equipment Selection",
              icon: "🔧",
              description: "Choose the right tools for your farm",
            },
            {
              title: "Marketing Your Honey",
              icon: "📊",
              description: "Strategies to sell your products effectively",
            },
          ].map((resource, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-purple-200 cursor-pointer"
            >
              <p className="text-4xl mb-3">{resource.icon}</p>
              <h3 className="text-lg font-bold text-purple-800 mb-2">{resource.title}</h3>
              <p className="text-gray-700 text-sm">{resource.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Booking Modal */}
      {showBooking && selectedExpert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowBooking(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              Book Consultation with {selectedExpert.name}
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input type="time" className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (hours)</label>
                <select className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                <textarea placeholder="Describe your consultation needs..." rows={3} className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              </div>

              <div className="bg-purple-100 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Total Cost:</strong> ₹{selectedExpert.hourlyRate}
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  Confirm Booking
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ExpertConsultation;

