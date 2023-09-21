import { BrowserRouter, Route, Routes } from "react-router-dom";
import PropertiesPannel from './Pages/PropertiesPannel'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/PropertiesPannel" element={<PropertiesPannel />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
