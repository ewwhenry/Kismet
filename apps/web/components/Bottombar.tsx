'use client';

import { useState } from 'react';
import { Home, Hash, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomBarProps {
  className?: string;
}

export function Bottombar({ className }: BottomBarProps) {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'feed',
      label: 'Feed',
      icon: Hash,
    },
    {
      id: 'chats',
      label: 'Chats',
      icon: MessageCircle,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <div
      className={cn(
        'fixed bottom-0 w-full h-16 backdrop-blur-lg border-t px-4 py-2 safe-area-pb',
        className,
      )}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]',
                'hover:bg-gray-100 active:scale-95',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              <Icon
                size={16}
                className={cn(
                  'transition-all duration-200',
                  isActive ? 'scale-110' : 'scale-100',
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium mt-1 transition-all duration-200',
                  isActive ? 'text-blue-600' : 'text-gray-500',
                )}
              >
                {tab.label}
              </span>
              {/* {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1 animate-pulse" />
              )} */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
