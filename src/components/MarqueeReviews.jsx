import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export default function MarqueeReviews({ reviews = [] }) {
  // If list is short, duplicate items to ensure infinite seamless scrolling loop
  const displayList = reviews.length > 0 ? [...reviews, ...reviews, ...reviews] : [];

  return (
    <div className="w-full overflow-hidden py-6 relative group">
      {/* Subtle fade edges for ultra-premium look */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Continuous Marquee Track */}
      <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
        {displayList.map((review, idx) => (
          <div
            key={`${review.id}-${idx}`}
            className="w-[300px] sm:w-[380px] p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-black/30 shrink-0 select-none"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (review.rating || 5)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-gray-500 ml-1.5 font-mono">
                  5.0
                </span>
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 leading-relaxed font-sans italic line-clamp-4">
                "{review.review_text}"
              </p>
            </div>

            {/* Client info footer (no profile image) */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="font-bold-display text-sm font-bold text-black truncate">
                  {review.client_name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-sonez-blue shrink-0" title="Verified Client" />
              </div>
              <div className="text-xs text-gray-500 truncate">
                {review.client_role}{review.client_company ? ` • ${review.client_company}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
