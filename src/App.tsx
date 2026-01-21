import { useState } from 'react';

export interface UserData {
  name: string;
  carOwner: boolean;
  carKm: number;
  bikeOwner: boolean;
  bikeKm: number;
  electricityBill: number;
  diet: 'vegan' | 'vegetarian' | 'non-veg';
  acDaily: boolean;
  plasticItems: number;
}

export interface CalculationResult {
  annualCO2: number;
  treesOwed: number;
  score: number;
  status: 'DEFAULTER' | 'SUSTAINABLE';
  carbonHeavyweight: {
    category: 'Travel' | 'Energy' | 'Consumption';
    impact: number;
    treesFromCategory: number;
    description: string;
  };
}

function App() {
  const [mode] = useState<'input' | 'wrapped'>('input');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#00ff9d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      APP BOOTED SUCCESSFULLY
    </div>
  );
}

export default App;
