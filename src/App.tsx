import { Header } from '@components/Header/Header';
import StopwatchPage from './pages/StopwatchPage/StopwatchPage';

function App() {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <StopwatchPage />
        </div>
      </main>
    </>
  );
}

export default App;
