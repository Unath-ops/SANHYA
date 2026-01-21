import React, { useState } from 'react'
import {
  Leaf,
  Car,
  Bike,
  Zap,
  UtensilsCrossed,
  Wind,
  Trash2,
} from 'lucide-react'
import type { UserData } from '../App'
import LoadingTransition from './LoadingTransition'

interface InputModeProps {
  onCalculate: (data: UserData) => void
}

export default function InputMode({ onCalculate }: InputModeProps) {
  const [isCalculating, setIsCalculating] = useState(false)

  const [formData, setFormData] = useState<UserData>({
    name: '',
    carOwner: false,
    carKm: 20,
    bikeOwner: false,
    bikeKm: 10,
    electricityBill: 2000,
    diet: 'vegetarian',
    acDaily: false,
    plasticItems: 3,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    setTimeout(() => {
      onCalculate(formData)
    }, 1500)
  }

  if (isCalculating) {
    return <LoadingTransition />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="pt-8 pb-6 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Leaf className="w-10 h-10 text-[#00ff9d]" />
          <h1 className="text-3xl font-serif font-bold">SANKHYA</h1>
        </div>
        <h2 className="text-2xl font-serif text-[#00ff9d] mb-2">
          Let&apos;s Audit Your Karma.
        </h2>
        <p className="text-sm text-gray-400">
          Answer honestly. The Earth is watching.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 pb-28 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Name */}
          <div className="glass-card p-6 rounded-2xl">
            <label className="block mb-3 text-lg font-medium">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your name"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Transport */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Transport</h3>
            </div>

            {/* Car */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Car Owner</span>
                <input
                  type="checkbox"
                  checked={formData.carOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, carOwner: e.target.checked })
                  }
                  className="accent-[#00ff9d]"
                />
              </div>

              {formData.carOwner && (
                <>
                  <p className="text-sm text-gray-400">
                    Daily kilometers: {formData.carKm} km
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={formData.carKm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        carKm: Number(e.target.value),
                      })
                    }
                    className="w-full accent-[#00ff9d]"
                  />
                </>
              )}
            </div>

            {/* Bike */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Bike className="w-4 h-4" />
                  Bike Owner
                </span>
                <input
                  type="checkbox"
                  checked={formData.bikeOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, bikeOwner: e.target.checked })
                  }
                  className="accent-[#00ff9d]"
                />
              </div>

              {formData.bikeOwner && (
                <>
                  <p className="text-sm text-gray-400">
                    Daily kilometers: {formData.bikeKm} km
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={2}
                    value={formData.bikeKm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bikeKm: Number(e.target.value),
                      })
                    }
                    className="w-full accent-[#00ff9d]"
                  />
                </>
              )}
            </div>
          </div>

          {/* Energy */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Energy</h3>
            </div>
            <p className="text-sm text-gray-400">
              Monthly electricity bill: ₹{formData.electricityBill}
            </p>
            <input
              type="range"
              min={0}
              max={15000}
              step={100}
              value={formData.electricityBill}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  electricityBill: Number(e.target.value),
                })
              }
              className="w-full accent-[#00ff9d]"
            />
          </div>

          {/* Diet */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Diet</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['vegan', 'vegetarian', 'non-veg'] as const).map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setFormData({ ...formData, diet })}
                  className={`p-4 rounded-xl border ${
                    formData.diet === diet
                      ? 'border-[#00ff9d] bg-[#00ff9d]/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {diet === 'non-veg'
                    ? 'Non-Veg'
                    : diet.charAt(0).toUpperCase() + diet.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Habits */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Habits</h3>
            </div>

            <div className="flex justify-between">
              <span>AC used daily?</span>
              <input
                type="checkbox"
                checked={formData.acDaily}
                onChange={(e) =>
                  setFormData({ ...formData, acDaily: e.target.checked })
                }
                className="accent-[#00ff9d]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Plastic items daily: {formData.plasticItems}
              </p>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={formData.plasticItems}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    plasticItems: Number(e.target.value),
                  })
                }
                className="w-full accent-[#00ff9d]"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-[#00ff9d] text-black font-semibold text-lg"
          >
            CALCULATE MY DEBT
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-[#d4af37] opacity-70">
        Developed by the Department of Statistics, NLU
      </footer>
    </div>
  )
}
