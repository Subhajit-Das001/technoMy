import React, { useState } from 'react';
import { ShoppingCart, Star, Phone, Globe, User, Menu } from 'lucide-react';
import T11 from '../../Assets/merch/t11.jpeg';
import T12 from '../../Assets/merch/t12.jpeg';
import T21 from '../../Assets/merch/t21.jpg';
import T22 from '../../Assets/merch/t22.jpg';
import T31 from '../../Assets/merch/t31.jpg';
import T32 from '../../Assets/merch/t32.jpg';
import T41 from '../../Assets/merch/t41.jpg';
import T42 from '../../Assets/merch/t42.jpg';
import T51 from '../../Assets/merch/t51.jpg';
import T52 from '../../Assets/merch/t52.jpg';
import T61 from '../../Assets/merch/t61.jpeg';
import T62 from '../../Assets/merch/t62.jpeg';
import T71 from '../../Assets/merch/t71.jpeg';
import T72 from '../../Assets/merch/t72.jpeg';
import T81 from '../../Assets/merch/t81.jpg';
import T82 from '../../Assets/merch/t82.jpg';
import axios from 'axios';


const TechnothonMerch = () => {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3001";

  // Define the grid layout and images for flip
  const grid = [
    [
      { front: T11, back: T12, key: 't1' },
      { front: T21, back: T22, key: 't2', big: true },
      { front: T31, back: T32, key: 't3' }
    ],
    [
      { front: T41, back: T42, key: 't4' },
      null, // Center big cell occupies this
      { front: T51, back: T52, key: 't5' }
    ],
    [
      { front: T61, back: T62, key: 't6' },
      { front: T71, back: T72, key: 't7' },
      { front: T81, back: T82, key: 't8' }
    ]
  ];

  const handleStartShopping = async () => {
    try {
      await axios.post(`${baseURL}/api/merch/click`);
      // Redirect in same tab
      window.location.href = 'https://trendydice.in';
    } catch (err) {
      console.error('Error tracking merch click:', err);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Topmost Black Offer Header */}
      <div style={{
        width: '100%',
        background: '#111',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '1.1rem',
        padding: '0.75rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        letterSpacing: '0.5px',
      }}>
        Use coupon code T300 to get 25% and Buy 2 items for 35%..
      </div>

      {/* Main Content - Card Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8" style={{ marginTop: '3.2rem' }}>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Product Images */}
            <div className="p-4 flex flex-col items-center justify-start">
              <style>{`
                .flip-container { perspective: 1000px; width: 100%; height: 100%; }
                .flipper { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
                .flip-container:hover .flipper { transform: rotateY(180deg); }
                .flip-front, .flip-back {
                  position: absolute; width: 100%; height: 100%; backface-visibility: hidden; object-fit: cover; border-radius: 12px;
                }
                .flip-back { transform: rotateY(180deg); }
              `}</style>
              <div
                className="grid gap-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  minHeight: 320,
                  maxWidth: 420,
                  width: '100%',
                }}
              >
                {/* Row 1, Col 1 */}
                <div className="aspect-square flex items-center justify-center" style={{ gridRow: 1, gridColumn: 1 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T11} alt="t11" className="flip-front" />
                      <img src={T12} alt="t12" className="flip-back" />
                    </div>
                  </div>
                </div>
                {/* Center big cell: spans 2 rows and 2 columns */}
                <div
                  className="aspect-square flex items-center justify-center"
                  style={{ gridRow: '1 / span 2', gridColumn: '2 / span 2' }}
                >
                  <div className="flip-container" style={{ width: '100%', height: '100%' }}>
                    <div className="flipper">
                      <img src={T41} alt="t21" className="flip-front" />
                      <img src={T42} alt="t22" className="flip-back" />
                    </div>
                  </div>
                </div>
                {/* Row 1, Col 3 */}
                {/* <div className="aspect-square flex items-center justify-center" style={{ gridRow: 1, gridColumn: 4 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T31} alt="t31" className="flip-front" />
                      <img src={T32} alt="t32" className="flip-back" />
                    </div>
                  </div>
                </div> */}
                {/* Row 2, Col 1 */}
                <div className="aspect-square flex items-center justify-center" style={{ gridRow: 2, gridColumn: 1 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T31} alt="t41" className="flip-front" />
                      <img src={T32} alt="t42" className="flip-back" />
                    </div>
                  </div>
                </div>
                {/* Row 2, Col 4 */}
                {/* <div className="aspect-square flex items-center justify-center" style={{ gridRow: 2, gridColumn: 4 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T51} alt="t51" className="flip-front" />
                      <img src={T52} alt="t52" className="flip-back" />
                    </div>
                  </div>
                </div> */}
                {/* Row 3, Col 1 */}
                <div className="aspect-square flex items-center justify-center" style={{ gridRow: 3, gridColumn: 1 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T61} alt="t61" className="flip-front" />
                      <img src={T62} alt="t62" className="flip-back" />
                    </div>
                  </div>
                </div>
                {/* Row 3, Col 2 */}
                <div className="aspect-square flex items-center justify-center" style={{ gridRow: 3, gridColumn: 2 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T71} alt="t71" className="flip-front" />
                      <img src={T72} alt="t72" className="flip-back" />
                    </div>
                  </div>
                </div>
                {/* Row 3, Col 3 */}
                <div className="aspect-square flex items-center justify-center" style={{ gridRow: 3, gridColumn: 3 }}>
                  <div className="flip-container">
                    <div className="flipper">
                      <img src={T21} alt="t81" className="flip-front" />
                      <img src={T22} alt="t82" className="flip-back" />
                    </div>
                  </div>
                </div>
              </div>
              {/* CTA Button and Website Link below images */}
              <div className="flex flex-col items-center w-full mt-4">
                <button
                  className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-full mb-2"
                  style={{ fontSize: '1rem' }}
                  onClick={handleStartShopping}
                >
                  Start shopping
                </button>
                <div className="bg-white p-2 rounded-lg text-center border border-gray-200 w-full" style={{ fontSize: '0.98rem' }}>
                  <p className="text-gray-600 mb-1">Visit our store at</p>
                  <span className="text-blue-600 font-semibold text-base">trendydice.in</span>
                </div>
              </div>
            </div>
            {/* Right Side - Product Info */}
            <div className="p-4 bg-gray-50" style={{ minWidth: 320, maxWidth: 420 }}>
              <div className="space-y-2">
                <div className="space-y-4">
                  {/* <p className="text-sm text-gray-600 uppercase tracking-wide">
                    #1 most trusted technothlon merch platform
                  </p> */}
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    Technothlon Merch
                    <br />
                    Collection
                  </h1>
                  <p className="text-base text-gray-600">
                    Grab your Technothlon merch on <strong>trendydice.in</strong> website now
                  </p>
                </div>
                {/* Pricing & Offers */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-2 border-dashed border-blue-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Special Offers</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-200">
                      <span className="font-medium text-gray-900">Use coupon code T300</span>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        25% OFF
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200">
                      <span className="font-medium text-gray-900">Buy 2 items</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        35% OFF
                      </span>
                    </div>
                  </div>
                </div>
                {/* Product Types & Pricing */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">T-shirt Design Options</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2 rounded-lg border-2 border-gray-200 bg-blue-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Oversized</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Relaxed fit, premium cotton</p>
                    </div>
                    <div className="p-2 rounded-lg border-2 border-gray-200 bg-blue-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Round Neck</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Classic fit, comfortable wear</p>
                    </div>
                  </div>
                </div>
                {/* Features */}
                {/* <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-700">Premium quality guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-700">Fast shipping across India</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-700">Easy returns & exchanges</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Below Card */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-semibold text-gray-900">Trustpilot</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-green-400 text-green-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2">4.7 / 5</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">based on 1713 reviews</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-semibold text-gray-900">Shopify</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-green-400 text-green-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2">4.8 / 5</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">based on 632 reviews</p>
          </div>
        </div> */}
      </div>

      {/* Contact Button */}
      {/* <div className="fixed bottom-6 right-6">
        <button className="bg-black text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-800 transition-colors shadow-lg">
          <Phone className="w-4 h-4" />
          <span>Contact Us</span>
        </button>
      </div> */}
    </div>
  );
};

export default TechnothonMerch;