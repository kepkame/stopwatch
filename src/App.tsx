import Header from './components/Header/Header';
import LapList from './components/LapList/LapList';
import Controls from './components/Controls/Controls';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <Header />
      <main>
        <div className="container">
          <Controls />
          <LapList measuring={[]} />
        </div>
      </main>
    </Provider>
  );
}

export default App;
