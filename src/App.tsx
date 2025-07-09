import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import HomePage from "./pages/HomePage";
import CluePage from "./pages/CluePage";
import CompletedPage from "./pages/CompletedPage";
import TerminalPage from "./pages/TerminalPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/terminal/:clueId" element={<TerminalPage />} />
          <Route path="/clue/:clueId" element={<CluePage />} />
          <Route path="/completed" element={<CompletedPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
