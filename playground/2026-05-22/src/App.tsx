import { env } from './shared/config/env'

function App() {
  console.log('개발 모드:' + env.VITE_APP_ENV)

  return <div>app</div>
}

export default App
