import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import MarqueeReviews from '../components/MarqueeReviews';

export default function ReviewsSection() {
  const { content } = useSite();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await api.getReviews();
        if (res.success && res.reviews) {
          setReviews(res.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Title */}
      <div className="relative z-10 text-center max-w-4xl pt-2">
        <h2 className="font-futuristic text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-black uppercase leading-tight">
          CLIENTS REVIEW OF THINGS I HAVE CREATED
        </h2>
        <div className="w-16 h-1 bg-sonez-blue mx-auto mt-3 rounded-full" />
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          Real feedback from founders, collaborators, and clients who trusted SONEZ with their vision.
        </p>
      </div>

      {/* Main Review Carousel Area */}
      <div className="relative z-10 w-full my-auto py-2">
        <MarqueeReviews reviews={reviews} />
      </div>

      {/* Bottom info label */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
          VERIFIED CLIENT TESTIMONIALS • SONEZ
        </span>
      </div>
    </section>
  );
}
