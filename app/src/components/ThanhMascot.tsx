import React from 'react';

export type MascotPose = 'presenting' | 'front' | 'desk';

interface ThanhMascotProps {
  pose?: MascotPose;
  speechText?: React.ReactNode;
  className?: string;
  avatarOnly?: boolean;
}

export const ThanhMascot: React.FC<ThanhMascotProps> = ({
  pose = 'presenting',
  speechText,
  className = '',
  avatarOnly = false,
}) => {
  if (avatarOnly) {
    return (
      <div className={`relative inline-block w-10 h-10 border border-[var(--border)] bg-[var(--bg-2)] overflow-hidden shrink-0 ${className}`}>
        <img
          src="/assets/mascot-front.svg"
          alt="ThanhETF Beaver"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative select-none flex flex-col items-center md:items-start ${className}`}
      data-pose={pose}
    >
      {/* Contextual Conversational Speech Bubble */}
      {speechText && (
        <div className="relative mb-3 z-20 max-w-[240px] px-3.5 py-2.5 text-xs font-medium leading-relaxed rounded-[10px] bg-[#FAF5EA] text-[#0F3620] shadow-[0_6px_18px_rgba(0,0,0,0.25)] border border-[#E0D7C5]">
          <div>{speechText}</div>
          {/* Downward Speech Tail Arrow */}
          <div className="absolute -bottom-1.5 left-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#FAF5EA]" />
        </div>
      )}

      {/* Mascot Illustration with smooth hover micro-interaction */}
      <div className="w-32 sm:w-40 md:w-48 h-auto transition-transform duration-300 hover:scale-105 pointer-events-auto filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
        {pose === 'presenting' && (
          <img
            src="/assets/mascot-presenting.svg"
            alt="ThanhETF Beaver Presenting"
            className="w-full h-auto"
          />
        )}
        {pose === 'front' && (
          <img
            src="/assets/mascot-front.svg"
            alt="ThanhETF Beaver Frontal"
            className="w-full h-auto"
          />
        )}
        {pose === 'desk' && (
          <img
            src="/assets/mascot-desk.svg"
            alt="ThanhETF Beaver at Desk"
            className="w-full h-auto"
          />
        )}
      </div>

      <div className="mt-2 text-center md:text-left">
        <div className="text-xs font-bold font-display text-[var(--fg-1)]">ThanhETF Beaver</div>
        <div className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider">CANADIAN ETF COPILOT</div>
      </div>
    </div>
  );
};
