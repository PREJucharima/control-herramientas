import { AppTheme } from "./config/theme/AppTheme";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </>
  )
}

export default App
