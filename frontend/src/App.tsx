import "./App.css";
import { Exomiser } from "./Components/Exomiser/Exomiser";
// import SearchComponent from "./Components/text";
const App = () => {
  return (
    <>
      <div className="fixed flex flex-col h-screen w-screen top-[50px]">
        <Exomiser />
        {/* <SearchComponent /> */}
      </div>
    </>
  );
};

export default App;
