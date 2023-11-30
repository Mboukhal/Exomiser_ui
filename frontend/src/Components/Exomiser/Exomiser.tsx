// import { Route } from "react-router";
import "./Exomiser.css";

const dropList = (name: string, id: string, options: string[]) => {
  return (
    <div className="flex p-2 gap-4 w-full">
      <label className="flex items-center justify-start min-w-[180px]">
        {name}
      </label>
      <select className="text-center input-style" name={id}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const input = (name: string, id: string) => {
  return (
    <div className="flex p-2 gap-4 w-full">
      <label className="flex items-center justify-start min-w-[180px]">
        {name}
      </label>
      <input className="input-style" type="text" name={id} />
    </div>
  );
};

const FileForm = () => {
  return (
    <>
      <div className="flex flex-col flex-grow">
        {input("First name", "fName")}
        {input("Last name", "lName")}
        {input("ADN", "adn")}
        {dropList("Genome Assembly", "ag", ["hg19", "hg38"])}
        {dropList("Analysis Mode", "am", ["PASS_ONLY"])}
        {input("HPO", "hpo")}
        {input("Proband Sample Name", "psn")}
        {input("Mode Of Inheritance", "moi")}
      </div>
      <div className="flex justify-end gap-2">
        <div className=" flex flex-grow">
          <button className="bt-fun">Set all</button>
        </div>
        <button className="bt-fun">Clear</button>
        <button className="bt-fun">Next</button>
      </div>
    </>
  );
};

const bt_file = (name: string) => {
  return (
    <>
      <div className="flex justify-center items-center w-full gap-2">
        <input
          type="checkbox"
          value=""
          className=" w-8 h-8 text-green-600 bg-gray-100 border-gray-300 rounded  dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        ></input>
        <button className="bt-file">{name}</button>
      </div>
    </>
  );
};

const FileList = () => {
  return (
    <>
      <div className="flex flex-col gap-y-2 items-start w-full ">
        {bt_file("Add file")}
        {bt_file("file 1")}
        {bt_file("file 2")}
        {bt_file("file 3")}
        {bt_file("file 4")}
      </div>
    </>
  );
};

export const Exomiser = () => {
  return (
    <div
      className="flex flex-col w-full p-[20px] "
      style={{ height: "calc(100% - 100px)" }}
    >
      <div className="flex " style={{ height: "calc(100% - 50px)" }}>
        <div className="w-[30%] border-4 main">{FileList()}</div>
        <div className="flex flex-col w-full border-r-4 border-y-4 main pt-[30px]">
          {FileForm()}
        </div>
      </div>
      <div className="flex h-[50px] justify-between pt-[20px] gap-2 px-3">
        <button className="bt-fun">Remove</button>
        <button className="bt-fun">Start</button>
      </div>
    </div>
  );
};
