import logo from './logo.svg';
import './App.css';
import DataSetForm from './components/Addskills';
import DataTable from './components/DataTable';
import { Layout } from 'antd';

function App() {
  return (
    <div className="App">
      {/* <DataSetForm/> */}
      <DataTable />
    </div>
  );
}

export default App;
