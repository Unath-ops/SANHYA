import { useState } from 'react';
import InputMode from './components/InputMode';
import WrappedMode from './components/WrappedMode';

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
  const [mode, setMode] = useState<'input' | 'wrapped'>('input');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateKarma = (data: UserData): CalculationResult => {
    // Daily emissions
    const carEmission = data.carOwner ? data.carKm * 0.19 : 0;
    const bikeEmission = data.bikeOwner ? data.bikeKm * 0.08 : 0;
    const dietEmission =
      data.diet === 'non-veg'
        ? 3.3
        : data.diet === 'vegetarian'
        ? 1.7
        : 1.0;
    const plasticEmission = data.plasticItems * 0.06;
    const acEmission = data.acDaily ? 4.0 : 0;

    // Annual calculations
    const electricityEmission = (data.electricityBill / 8) * 0.82 * 12;
    const dailyTotal =
      carEmission +
      bikeEmission +
      dietEmission +
      plasticEmission +
      acEmission;

    const annualCO2 = dailyTotal * 365 + electricityEmission;
    const treesOwed = Math.round(annualCO2 / 22);

    const score = Math.max(300, 850 - treesOwed * 10);
    const status = score >= 500 ? 'SUSTAINABLE' : 'DEFAULTER';

    // Carbon heavyweight calculation
    const travelImpact = (carEmission + bikeEmission) * 365;
    const energyImpact = electricityEmission + acEmission * 365;
    const consumptionImpact = (dietEmission + plasticEmission) * 365;

    let carbonHeavyweight: CalculationResult['carbonHeavyweight'];

    if (travelImpact >= energyImpact && travelImpact >= consumptionImpact) {
      const trees = Math.round(travelImpact / 22);
      carbonHeavyweight = {
        category: 'Travel',
        impact: travelImpact,
        treesFromCategory: trees,
        description: `Your transport habits alone destroyed ${trees} tree${trees !== 1 ? 's' : ''}.`,
      };
    } else if (energyImpact >= consumptionImpact) {
      const trees = Math.round(energyImpact / 22);
      carbonHeavyweight = {
        category: 'Energy',
        impact: energyImpact,
        treesFromCategory: trees,
        description: `Your energy usage alone destroyed ${trees} tree${trees !== 1 ? 's' : ''}.`,
      };
    } else {
      const trees = Math.round(consumptionImpact / 22);
      carbonHeavyweight = {
        category: 'Consumption',
        impact: consumptionImpact,
        treesFromCategory: trees,
        description: `Your consumption habits alone destroyed ${trees} tree${trees !== 1 ? 's' : ''}.`,
      };
    }

    return {
      annualCO2,
      treesOwed,
      score,
      status,
      carbonHeavyweight,
    };
  };

  const handleCalculate = (data: UserData) => {
    const calculationResult = calculateKarma(data);
    setUserData(data);
    setResult(calculationResult);
    setMode('wrapped');
  };

  const handleReset = () => {
    setMode('input');
    setUserData(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {mode === 'input' ? (
        <InputMode onCalculate={handleCalculate} />
      ) : (
        <WrappedMode
          userData={userData!}
          result={result!}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
