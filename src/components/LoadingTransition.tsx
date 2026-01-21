export default function LoadingTransition() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a] animate-fade-in">
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin-slow"
          style={{
            borderTopColor: '#d4af37',
            borderRightColor: '#d4af37',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-4 rounded-full border-4 border-transparent animate-spin-reverse"
          style={{
            borderBottomColor: '#00ff9d',
            borderLeftColor: '#00ff9d',
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-8 rounded-full border-4 border-transparent animate-spin-slower"
          style={{
            borderTopColor: '#d4af37',
            borderBottomColor: '#d4af37',
          }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#00ff9d] animate-pulse" />
        </div>
      </div>
      <p className="absolute bottom-1/3 text-gray-400 text-sm animate-fade-in-delayed">
        Calculating your karma...
      </p>
    </div>
  );
}
