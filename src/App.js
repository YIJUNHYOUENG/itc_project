/*import axios from "axios";
import { useEffect } from "react";
import './App.css';

function App() {
  const callApi = async () => {
    axios.get("http://localhost:5000/api/").then((req) => console.log(req.data.test));
  }

  useEffect(() => {
    callApi();
  }, []);

  return <div>test</div>;
}

export default App;*/


import Router from "./Router/Router"
import "./App.css"

function App() {
  return (
    <div style={{width:"100%", height:"100%"}}>
      <Router/> 
    </div>
  );
}

//<Route path="/" element={} />
export default App;