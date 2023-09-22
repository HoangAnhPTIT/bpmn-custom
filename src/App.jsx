import { BrowserRouter, Route, Routes } from "react-router-dom";
import PropertiesPannel from './Pages/PropertiesPannel'
import CamundaProperties from "./Pages/CamundaProperties";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/PropertiesPannel" element={<PropertiesPannel />}/>
        <Route path="/CamundaProperties" element={<CamundaProperties />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
