// import { Route } from "react-router";
import { useCallback, useState } from "react";
import "./Exomiser.css";
import { useDropzone } from "react-dropzone";
import { TformOptions } from "./Exomiser.d";

export const Exomiser = () => {
  const [options, setOptions] = useState<TformOptions[] | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter only files with the .vcf extension
      const vcfFiles = acceptedFiles.filter((file) =>
        file.name.endsWith(".vcf")
      );

      // Remove duplicates
      const dupFilter = [...new Set(vcfFiles)];
      // Alert for non-.vcf files
      const nonVcfFiles = acceptedFiles.filter(
        (file) => !file.name.endsWith(".vcf")
      );
      if (nonVcfFiles.length > 0) {
        alert(
          `The following files are not .vcf: ${nonVcfFiles
            .map((file) => file.name)
            .join(", ")}`
        );
      }

      // Remove duplicates file - options
      const setDupFilter = dupFilter.filter((file) => {
        const isDuplicate = options?.some(
          (option) => option.file.name === file.name
        );

        if (isDuplicate) {
          alert(`The file ${file.name} is already in the list`);
        }

        return !isDuplicate;
      });

      console.log(setDupFilter.length);
      const newfile: TformOptions[] = [];
      // Add files to options
      setDupFilter.forEach((file, index) => {
        newfile.push({
          id: (options && options?.length + index) || index,
          file: file,
          firstName: "",
          lastName: "",
          adn: "",
          genomeAssembly: "",
          analysisMode: "",
          hpo: "",
          probandSampleName: "",
          modeOfInheritance: "",
        });
      });
      setOptions([...(options || []), ...newfile]);
    },
    [options]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const btAddFile = () => {
    return (
      <div className="bt-check-box">
        <input type="checkbox" value="" className="check-box"></input>
        <div {...getRootProps()} className="bt-file">
          <input {...getInputProps()} />
          <span> Add Files </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col w-full p-[20px] "
      style={{ height: "calc(100% - 100px)" }}
    >
      <div className="flex w-full" style={{ height: "calc(100% - 50px)" }}>
        <div className="w-fit border-4 main ">
          <div className="flex flex-col gap-y-2 items-start w-full ">
            {btAddFile()}
            {options && options.length !== 0 && (
              <div className="flex flex-col items-start w-full gap-2">
                {options.map((file) => bt_file(file.file.name, file.id))}
              </div>
            )}
          </div>
        </div>
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

// {
//   files : {
//     file: {
//          filePath: '',
//          firstName: '';
//          lastName: '';
//          adn: '';
//          genomeAssembly: '';
//          analysisMode: '';
//          hpo: '';
//          probandSampleName: '';
//          modeOfInheritance: '';
//         }
//   }
//  }

const dropList = (name: string, id: string, options: string[]) => {
  return (
    <div className="flex p-2 gap-4 w-full">
      <label className="flex items-center justify-start min-w-[180px]">
        {name}
      </label>
      <select className="text-center input-style" name={id}>
        {options.map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
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

const bt_file = (name: string, id: number) => {
  return (
    <div className="bt-check-box" key={id}>
      <input type="checkbox" value="" className="check-box"></input>
      <button className="bt-file font-light">{name}</button>
    </div>
  );
};

// const FileList = () => {
//   return (
//     <>
//       <div className="flex flex-col gap-y-2 items-start w-full ">
//         {bt_file("Add file")}
//         {bt_file("file 1")}
//         {bt_file("file 2")}
//         {bt_file("file 3")}
//         {bt_file("file 4")}
//       </div>
//     </>
//   );
// };
