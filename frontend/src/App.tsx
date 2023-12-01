import "./App.css";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { Exomiser } from "./Components/Exomiser/Exomiser";
import { AppMenu } from "./Components/main/AppMenu";
import { ErrorPage } from "./Components/main/ErrorPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<AppMenu />}></Route>
          <Route path={"/Exomiser"} element={<AppMenu />}>
            <Route path="e" element={<Exomiser />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Route>
          <Route path="/Phenotips" element={<AppMenu />}></Route>
          <Route path="/Phenolyzer" element={<AppMenu />}></Route>
          <Route path="*" element={<AppMenu />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
