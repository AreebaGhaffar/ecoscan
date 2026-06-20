
import React, { useRef } from 'react';

interface ScannerProps {
  onImageSelected: (base64: string, previewUrl: string) => void;
  disabled?: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onImageSelected, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      onImageSelected(base64, previewUrl);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-6 md:mt-10 px-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">What's in your hand?</h2>
        <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed">
          Capture a photo or upload an image to find the perfect spot for it.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`
          relative group flex flex-col items-center justify-center
          w-72 h-72 md:w-80 md:h-80 rounded-full border-[12px] border-emerald-50 bg-white
          shadow-[0_20px_50px_rgba(16,185,129,0.2)] transition-all duration-300
          hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100
        `}
      >
        <div className="bg-emerald-600 p-8 rounded-full text-white shadow-xl group-hover:bg-emerald-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="mt-6 font-bold text-emerald-800 text-2xl">Capture or Upload</span>
      </button>

      <div className="flex items-center gap-3 text-emerald-600/60 font-medium bg-emerald-50/50 px-4 py-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">Eco-friendly identification</span>
      </div>
    </div>
  );
};

export default Scanner;
