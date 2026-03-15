'use client';

interface TabSwitcherProps {
  activeTab: 'generate' | 'convert';
  onTabChange: (tab: 'generate' | 'convert') => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
        <button
          onClick={() => onTabChange('generate')}
          className={`px-6 py-2 rounded-md transition-all ${
            activeTab === 'generate'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ✨ Generate
        </button>
        <button
          onClick={() => onTabChange('convert')}
          className={`px-6 py-2 rounded-md transition-all ${
            activeTab === 'convert'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🖼️ Convert
        </button>
      </div>
    </div>
  );
}
