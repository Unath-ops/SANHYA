import { useState } from 'react';
import { Leaf, Car, Bike, Zap, UtensilsCrossed, Wind, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import type { UserData } from '../App';
import LoadingTransition from './LoadingTransition';

interface InputModeProps {
  onCalculate: (data: UserData) => void;
}

export default function InputMode({ onCalculate }: InputModeProps) {
  const [isCalculating, setIsCalculating] = useState(false);
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    // Show loading animation for 1.5 seconds
    setTimeout(() => {
      onCalculate(formData);
    }, 1500);
  };

  if (isCalculating) {
    return <LoadingTransition />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <header className="pt-8 pb-6 px-6 text-center animate-slide-down">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Leaf className="w-10 h-10 text-[#00ff9d]" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
            SANKHYA
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[#00ff9d] mb-2">
          Let's Audit Your Karma.
        </h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Answer honestly. The Earth is watching.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 pb-24 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div className="glass-card p-6 rounded-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Label htmlFor="name" className="text-lg font-medium mb-3 block">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-lg"
            />
          </div>

          {/* Transport */}
          <div className="glass-card p-6 rounded-2xl space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Car className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Transport</h3>
            </div>

            {/* Car */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="car-owner" className="text-base">Car Owner</Label>
                <Switch
                  id="car-owner"
                  checked={formData.carOwner}
                  onCheckedChange={(checked) => setFormData({ ...formData, carOwner: checked })}
                />
              </div>
              {formData.carOwner && (
                <div className="space-y-2 animate-expand">
                  <Label className="text-sm text-gray-400">
                    Daily kilometers: {formData.carKm} km
                  </Label>
                  <Slider
                    value={[formData.carKm]}
                    onValueChange={([value]) => setFormData({ ...formData, carKm: value })}
                    min={0}
                    max={100}
                    step={5}
                    className="slider-primary"
                  />
                </div>
              )}
            </div>

            {/* Bike */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-5 h-5 text-[#00ff9d]" />
                  <Label htmlFor="bike-owner" className="text-base">Bike Owner</Label>
                </div>
                <Switch
                  id="bike-owner"
                  checked={formData.bikeOwner}
                  onCheckedChange={(checked) => setFormData({ ...formData, bikeOwner: checked })}
                />
              </div>
              {formData.bikeOwner && (
                <div className="space-y-2 animate-expand">
                  <Label className="text-sm text-gray-400">
                    Daily kilometers: {formData.bikeKm} km
                  </Label>
                  <Slider
                    value={[formData.bikeKm]}
                    onValueChange={([value]) => setFormData({ ...formData, bikeKm: value })}
                    min={0}
                    max={50}
                    step={2}
                    className="slider-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Energy */}
          <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Energy</h3>
            </div>
            <Label className="text-sm text-gray-400">
              Monthly electricity bill: ₹{formData.electricityBill}
            </Label>
            <Slider
              value={[formData.electricityBill]}
              onValueChange={([value]) => setFormData({ ...formData, electricityBill: value })}
              min={0}
              max={15000}
              step={100}
              className="slider-primary"
            />
          </div>

          {/* Diet */}
          <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Diet</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['vegan', 'vegetarian', 'non-veg'] as const).map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setFormData({ ...formData, diet })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.diet === diet
                      ? 'border-[#00ff9d] bg-[#00ff9d]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="font-medium capitalize">
                    {diet === 'non-veg' ? 'Non-Veg' : diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Habits */}
          <div className="glass-card p-6 rounded-2xl space-y-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-2">
              <Wind className="w-6 h-6 text-[#00ff9d]" />
              <h3 className="text-xl font-semibold">Habits</h3>
            </div>

            {/* AC */}
            <div className="flex items-center justify-between">
              <Label htmlFor="ac-daily" className="text-base">AC used daily?</Label>
              <Switch
                id="ac-daily"
                checked={formData.acDaily}
                onCheckedChange={(checked) => setFormData({ ...formData, acDaily: checked })}
              />
            </div>

            {/* Plastic */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-[#00ff9d]" />
                <Label className="text-sm text-gray-400">
                  Plastic items used daily: {formData.plasticItems}
                </Label>
              </div>
              <Slider
                value={[formData.plasticItems]}
                onValueChange={([value]) => setFormData({ ...formData, plasticItems: value })}
                min={0}
                max={10}
                step={1}
                className="slider-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 rounded-xl"
            >
              CALCULATE MY DEBT
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm animate-fade-in"
        style={{ color: '#d4af37', opacity: 0.7, animationDelay: '0.7s' }}
      >
        Developed by the Department of Statistics, NLU
      </footer>
    </div>
  );
}
