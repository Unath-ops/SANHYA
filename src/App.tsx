import { useState } from 'react';
import InputMode from './components/InputMode';
import WrappedMode from './components/WrappedMode';
import { ThemeProvider } from 'next-themes';

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
      data.diet === 'non-veg' ? 3.3 : 
      data.diet === 'vegetarian' ? 1.7 : 
      1.0;
    const plasticEmission = data.plasticItems * 0.06;
    const acEmission = data.acDaily ? 4.0 : 0;

    // Annual calculations
    const electricityEmission = (data.electricityBill / 8) * 0.82 * 12;
    const dailyTotal = carEmission + bikeEmission + dietEmission + plasticEmission + acEmission;
    const annualCO2 = (dailyTotal * 365) + electricityEmission;
    const treesOwed = Math.round(annualCO2 / 22);

    const score = Math.max(300, 850 - (treesOwed * 10));
    const status = score >= 500 ? 'SUSTAINABLE' : 'DEFAULTER';

    // Calculate carbon heavyweight
    const travelImpact = (carEmission + bikeEmission) * 365;
    const energyImpact = electricityEmission + (acEmission * 365);
    const consumptionImpact = (dietEmission + plasticEmission) * 365;

    let carbonHeavyweight: CalculationResult['carbonHeavyweight'];

    if (travelImpact >= energyImpact && travelImpact >= consumptionImpact) {
      const treesFromTravel = Math.round(travelImpact / 22);
      const mainSource = data.carOwner && carEmission > bikeEmission ? 'car' : 'bike';
      
      carbonHeavyweight = {
        category: 'Travel',
        impact: travelImpact,
        treesFromCategory: treesFromTravel,
        description: `Your ${mainSource} usage alone destroyed ${treesFromTravel} tree${treesFromTravel !== 1 ? 's' : ''}.`
      };
    } else if (energyImpact >= consumptionImpact) {
      const treesFromEnergy = Math.round(energyImpact / 22);
      const mainSource = data.acDaily && (acEmission * 365) > electricityEmission / 2 ? 'AC' : 'electricity';

      carbonHeavyweight = {
        category: 'Energy',
        impact: energyImpact,
        treesFromCategory: treesFromEnergy,
        description: `Your ${mainSource} usage alone destroyed ${treesFromEnergy} tree${treesFromEnergy !== 1 ? 's' : ''}.`
      };
    } else {
      const treesFromConsumption = Math.round(consumptionImpact / 22);
      const mainSource = (dietEmission * 365) > (plasticEmission * 365) ? 'diet' : 'plastic consumption';

      carbonHeavyweight = {
        category: 'Consumption',
        impact: consumptionImpact,
        treesFromCategory: treesFromConsumption,
        description: `Your ${mainSource} alone destroyed ${treesFromConsumption} tree${treesFromConsumption !== 1 ? 's' : ''}.`
      };
    }

    return { annualCO2, treesOwed, score, status, carbonHeavyweight };
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {mode === 'input' ? (
          <InputMode key="input" onCalculate={handleCalculate} />
        ) : (
          <WrappedMode 
            key="wrapped" 
            userData={userData!} 
            result={result!} 
            onReset={handleReset} 
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
