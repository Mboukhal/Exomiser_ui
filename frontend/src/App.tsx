import "./App.css";
import { Exomiser } from "./Components/Exomiser/Exomiser";
const App = () => {
  return (
    <>
      <div className="fixed flex flex-col h-screen w-screen top-[50px]">
        <Exomiser />
      </div>
    </>
  );
};

export default App;
