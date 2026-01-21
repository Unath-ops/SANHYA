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

  const culprit = breakdown.reduce((a, b) => (b.value > a.value ? b : a))

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
