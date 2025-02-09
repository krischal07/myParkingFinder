import React from "react";
import { Search, MapPin, Clock, CreditCard, Phone, Cable } from "lucide-react";
import landing_page from "../../assets/landingPage.png";
import landing_page2 from "../../assets/landing_page2.png";
import { SignInButton } from "@clerk/clerk-react";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-white text-black">
        <div className="container mx-auto px-6 py-20">
          <div className="w-full h-72 flex justify-between">
            <div className="flex flex-col items-center justify-center ">
              <h1 className="text-5xl font-bold mb-6">
                Find the<span className="text-blue-500">🚗Perfect</span>
                <span className="text-green-700"> Parking 🚲</span> <br />
                <span className="flex  justify-center">
                  <span className="">Spot in Seconds</span>
                </span>
              </h1>
              <p className="text-xl italic mb-8">
                {/* Discover and reserve parking spaces near you. Save time and avoid
              the hassle of searching for parking. */}
                Parking made easy, wherever you go
              </p>
              <button className="btn btn-active btn-neutral w-42">
                <SignInButton mode="modal" asChild>
                  <span>Get Started</span>
                </SignInButton>
              </button>
            </div>
            <div>
              <img className="w-[400px]" src={landing_page2} />
            </div>

            {/* <div className="flex gap-4 bg-white rounded-lg p-2 max-w-2xl">
              <input
                type="text"
                placeholder="Enter location..."
                className="flex-1 px-4 py-2 text-gray-700 focus:outline-none"
              />
              <button className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-400">
                Search
              </button>
            </div> */}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            🚀 Why Choose MyParkingFinder?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<MapPin size={32} />}
              title="Real-time Availability"
              description="Find available parking spots in real-time with live updates and accurate information."
            />
            <FeatureCard
              icon={<Clock size={32} />}
              title="Easy Booking"
              description="Reserve your parking spot in advance and save time with our seamless booking system."
            />
            <FeatureCard
              icon={<Cable size={32} />}
              title="User Friendly"
              description="Enjoy a simple and intuitive interface designed for effortless navigation, ensuring a smooth and hassle-free experience for all users."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Find Your Perfect Parking Spot?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Download our app now and never worry about parking again!
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800">
              Download for iOS
            </button>
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800">
              Download for Android
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyParkingFinder</h3>
              <p className="text-gray-400">Making parking hassle-free.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Phone size={24} className="text-gray-400" />
                <Search size={24} className="text-gray-400" />
                <MapPin size={24} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MyParkingFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="text-center p-6 rounded-lg">
      <div className="inline-block p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;
