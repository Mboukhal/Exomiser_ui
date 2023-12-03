// import { Route } from "react-router";
import { useCallback, useState } from "react";
import "./Exomiser.css";
import { useDropzone } from "react-dropzone";
import { TformOptions } from "./Exomiser.d";

export const Exomiser = () => {
  const [options, setOptions] = useState<TformOptions[] | null>(null);
  const [activeForm, setActiveForm] = useState<number | null>(null);

  const inputHandleChange = (fieldName: string, newValue: string) => {
    setOptions((prevOptions) => {
      if (!prevOptions) return prevOptions;

      const updatedOptions = prevOptions.map((option, index) => {
        if (index === (activeForm || 0)) {
          return {
            ...option,
            [fieldName]: newValue,
          };
        }
        return option;
      });

      return updatedOptions;
    });
  };

  const UpdateDropList = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setOptions((prevOptions) => {
      if (!prevOptions) return prevOptions;

      const updatedOptions = prevOptions.map((option, index) => {
        if (index === (activeForm || 0)) {
          return {
            ...option,
            [name]: value,
          };
        }
        return option;
      });

      return updatedOptions;
    });
  };

  const dropList = (name: string, id: string, optionsList: string[]) => {
    const opt = options && options[activeForm || 0][id];
    if (!opt) return;
    return (
      <div className="flex p-2 gap-4 w-full">
        <label className="flex items-center justify-start min-w-[167px]">
          {name}
        </label>
        <select
          className="text-center input-style"
          name={id}
          onChange={UpdateDropList}
          value={opt?.toString()}
        >
          {optionsList.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const UpdateSetThisToAllFiles = () => {
    setOptions((prevOptions) => {
      if (!prevOptions) return prevOptions;

      const updatedOptions = prevOptions.map((option, index) => {
        if (index !== (activeForm || 0)) {
          return {
            ...option,
            firstName: prevOptions[0].firstName,
            lastName: prevOptions[0].lastName,
            adn: prevOptions[0].adn,
            genomeAssembly: prevOptions[0].genomeAssembly,
            analysisMode: prevOptions[0].analysisMode,
            hpo: prevOptions[0].hpo,
            probandSampleName: prevOptions[0].probandSampleName,
            modeOfInheritance: prevOptions[0].modeOfInheritance,
          };
        }
        return option;
      });

      return updatedOptions;
    });
  };

  const updateClear = () => {
    setOptions((prevOptions) => {
      if (!prevOptions) return prevOptions;

      const updatedOptions = prevOptions.map((option, index) => {
        if (index === (activeForm || 0)) {
          return {
            ...option,
            firstName: "",
            lastName: "",
            adn: "",
            genomeAssembly: "hg19",
            analysisMode: "PASS_ONLY",
            hpo: "",
            probandSampleName: "",
            modeOfInheritance: "",
          };
        }
        return option;
      });

      return updatedOptions;
    });
  };

  const updateRemoveAllFiles = () => {
    if (!options) return;
    const shouldRemove = window.confirm(
      "Are you sure you want to remove all files?"
    );
    if (!shouldRemove) return;
    setOptions(null);
    setActiveForm(null);
  };

  const FileForm = () => {
    const opt = options && options[activeForm || 0];
    if (!opt) return <>no file</>;

    return (
      <>
        <div className="flex flex-col flex-grow py-2">
          <label className="flex justify-center font-bold">
            {opt.file.name}
          </label>
          {input("First name", "firstName")}
          {input("Last name", "lastName")}
          {input("ADN", "adn")}
          {input("HPO", "hpo")}
          {input("Proband Sample Name", "probandSampleName")}
          {input("Mode Of Inheritance", "modeOfInheritance")}
          {dropList("Genome Assembly", "genomeAssembly", ["hg19", "hg38"])}
          {dropList("Analysis Mode", "analysisMode", ["PASS_ONLY"])}
        </div>
        <div className="flex justify-end gap-2">
          <div className=" flex flex-grow">
            <button className="bt-fun" onClick={UpdateSetThisToAllFiles}>
              Set all
            </button>
          </div>
          <button className="bt-fun" onClick={updateClear}>
            Clear
          </button>
          <button
            className="bt-fun"
            onClick={() => {
              activeForm !== null && options.length - 1 > activeForm
                ? setActiveForm(activeForm + 1)
                : setActiveForm(0);
            }}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const input = (name: string, fieldName: string) => {
    const opt = options && options[activeForm || 0];
    if (opt)
      return (
        <div className="flex p-2 gap-4 w-full">
          <label className="flex items-center justify-start min-w-[167px]">
            {name}
          </label>
          <input
            className="input-style"
            type="text"
            name={fieldName}
            value={opt[fieldName]?.toString()}
            onChange={(event) =>
              inputHandleChange(fieldName, event.target.value)
            }
          />
        </div>
      );
  };

  const bt_file = (name: string, id: number) => {
    return (
      <div className="bt-check-box" key={id}>
        <input type="checkbox" value="" className="check-box"></input>
        <button
          className={`bt-file font-light ${
            activeForm === id && ` bg-yellow-300 text-slate-600 w-fit-content`
          }`}
          onClick={() => {
            setActiveForm(id);
            console.log(id);
          }}
        >
          {name}
        </button>
      </div>
    );
  };

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
        return !isDuplicate;
      });

      const newfile: TformOptions[] = [];
      // Add files to options
      setDupFilter.forEach((file, index) => {
        newfile.push({
          id: (options && options?.length + index) || index,
          file: file,
          firstName: "",
          lastName: "",
          adn: "",
          genomeAssembly: "hg19",
          analysisMode: "PASS_ONLY",
          hpo: "",
          probandSampleName: "",
          modeOfInheritance: "",
        });
        setActiveForm(0);
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
        <div
          {...getRootProps()}
          className="bt-file bg-blue-500 border-2 border-black whitespace-nowrap "
        >
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
        <div className="min-w-[30%] md:min-w-fit border-4 main ">
          <div className="flex flex-col w-full gap-y-2 items-start ">
            {btAddFile()}
            {options && options.length !== 0 && (
              <div className="flex flex-col items-start w-full gap-2">
                {options.map((file) => bt_file(file.file.name, file.id))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full border-r-4 border-y-4 main">
          {FileForm()}
        </div>
      </div>
      <div className="flex h-[50px] justify-between pt-[20px] gap-2 px-3">
        <button className="bt-fun" onClick={updateRemoveAllFiles}>
          Remove
        </button>
        <button
          className="bt-fun"
          onClick={() => console.log(options[activeForm])}
        >
          Start
        </button>
      </div>
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
