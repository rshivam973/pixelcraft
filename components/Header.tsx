export default function Header() {
  return (
    <header className="relative bg-[#1a1a2e] border-b-4 border-[#2d2d44]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6c5ce7]/20 via-transparent to-[#ff00ff]/20"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 relative">
        <h1 className="pixel-font text-lg md:text-xl text-[#f8f8f8] tracking-wider">
          PIXEL<span className="text-[#00d4ff]">CRAFT</span>
        </h1>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c5ce7] via-[#00d4ff] to-[#ff00ff]"></div>
    </header>
  );
}
