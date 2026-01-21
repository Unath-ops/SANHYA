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

function App() {
  const [mode, setMode] = useState<'input' | 'wrapped'>('input')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [result, setResult] = useState<CalculationResult | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {mode === 'input' ? (
        <InputMode
          onCalculate={(data: UserData, calc: CalculationResult) => {
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

export default App
