function App() {
  const [mode, setMode] = useState<'input' | 'wrapped'>('input')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [result, setResult] = useState<CalculationResult | null>(null)

  return (
    <div className="bg-[#0a0a0a] text-white">
      <div className="min-h-screen w-full">
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
    </div>
  )
}
