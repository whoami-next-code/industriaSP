'use client';

import React from 'react';
import { ShoppingCart, User, CreditCard, CheckCircle } from 'lucide-react';

export type StepKey = 'carrito' | 'datos' | 'pago' | 'confirmacion';

interface ProgressStepsProps {
  current: StepKey;
  className?: string;
}

const steps: { key: StepKey; label: string; icon: React.ReactNode }[] = [
  { key: 'carrito', label: 'Carrito', icon: <ShoppingCart className="w-5 h-5" /> },
  { key: 'datos', label: 'Datos', icon: <User className="w-5 h-5" /> },
  { key: 'pago', label: 'Pago', icon: <CreditCard className="w-5 h-5" /> },
  { key: 'confirmacion', label: 'Confirmación', icon: <CheckCircle className="w-5 h-5" /> },
];

export default function ProgressSteps({ current, className = '' }: ProgressStepsProps) {
  const currentIndex = steps.findIndex(s => s.key === current);

  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.key} className="flex-1 flex items-center">
            <div className={`flex items-center px-3 py-2 rounded-full border transition-colors duration-200 ${
              isCurrent ? 'border-blue-500 bg-blue-50 text-blue-700' : isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 bg-gray-50 text-gray-500'
            }`}>
              <span className="mr-2">{step.icon}</span>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

