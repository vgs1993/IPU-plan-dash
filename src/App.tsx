import { Header } from './components/Header';
import { TimelinePlanner } from './components/TimelinePlanner';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header title="IPU Planning" />
      <div className="app-body">
        <main className="main-content full-width">
          <TimelinePlanner 
            selectedPlatforms={[]}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
