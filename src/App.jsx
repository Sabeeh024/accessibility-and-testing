import QuantityStepper from './QuantityStepper'
import UserProfile from './UserProfile'

function App() {
  return (
    <main>
      <h1>Quantity stepper</h1>
      <QuantityStepper />
      <h1>User profile</h1>
      <UserProfile userId="1" />
    </main>
  )
}

export default App
