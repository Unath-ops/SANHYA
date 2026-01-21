import { useState } from 'react'
import InputMode from './components/InputMode'
import WrappedMode from './components/WrappedMode'

export interface UserData {
  name: string
  carOwner: boolean
  carKm: number
  bikeOwner: boolean
  bikeKm: number
  electricityBill: number
  diet: 'vegan' | 'vegetarian' | 'non-veg'
  acDaily: boolean
  plasticItems: number
}

export interface CalculationResult {
  annualCO2: number
  treesOwed: number
  score: number
  status: 'DEFAULTER' | 'SUSTAINABLE'
  carbonHeavyweight: {
    category: 'Travel' | 'Energy' | 'Consumption'
    impact: number
    treesFromCategory: number
    description: string
  }
}

/* =======================
   🔥 CALCULATION LOGIC
   ======================= */
function calculateResult(data: UserData): CalculationResult {
  const travel =
    (data.carOwner ? data.carKm * 365 * 0.21 : 0) +
    (data.bikeOwner ? data.bikeKm * 365 * 0.09 : 0)

  const energy = data.electricityBill * 12 * 0.82

  const diet =
    data.diet === 'vegan' ? 100 :
    data.diet === 'vegetarian' ? 300 : 700

  const plastic = data.plasticItems * 365 * 0.02

  const breakdown = [
    { category: 'Travel', value: travel },
    { category: 'Energy', value: energy },
    { category: 'Consumption', value: diet + plastic },
  ] as const

  const culprit = breakdown.reduce((a, b) =>
    b.value > a.value ? b : a
  )

  const annualCO2 = Math.round(travel + energy + diet + plastic)
  const treesOwed = Math.ceil(annualCO2 / 21)
  const score = Math.max(0, 100 - Math.floor(annualCO2 / 100))

  return {
    annualCO2,
    treesOwed,
    score,
    status: score < 50 ? 'DEFAULTER' : 'SUSTAINABLE',
    carbonHeavyweight: {
      category: culprit.category,
      impact: Math.round(culprit.value),
      treesFromCategory: Math.ceil(culprit.value / 21),
      description: `${culprit.category} is your biggest carbon offender.`,
    },
  }
}

/* =======================
   🧠 APP ROOT
   ======================= */
export default function App() {
  const [mode, setMode] = useState<'input' | 'wrapped'>('input')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [result, setResult] = useState<CalculationResult | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {mode === 'input' ? (
        <InputMode
          onCalculate={(data: UserData) => {
            const calc = calculateResult(data)
            setUserData(data)
            setResult(calc)
            setMode('wrapped')
          }}
        />
      ) : (
        <WrappedMode
          userData={userData!}
          result={result!}
          onReset={() => {
            setMode('input')
            setUserData(null)
            setResult(null)
          }}
        />
      )}
    </div>
  )
}
