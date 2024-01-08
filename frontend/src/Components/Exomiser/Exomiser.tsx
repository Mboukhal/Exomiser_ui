// import { Route } from "react-router";
import { useCallback, useEffect, useState } from "react";
import "./Exomiser.css";
import { useDropzone } from "react-dropzone";
import { TformOptions, hpoType } from "./Exomiser.d";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { handleFileUpload, loadOptions } from "./utils";
import { MultiValue } from "react-select";
import { Result, Progress } from "./Result";

const current_url = window.location.href;
const domain_name = new URL(current_url).hostname;

const BACKEND = `http://${domain_name}:5001`;

export const Exomiser = () => {
  const [options, setOptions] = useState<TformOptions[] | null>(null);
  const [activeForm, setActiveForm] = useState<number | null>(null);
  const [hpo, setHpo] = useState<hpoType[]>([]);

  const [zipFile, setZipFile] = useState<string[] | null>(null);

  const [selectKey, setSelectKey] = useState(0);

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

  const UpdateSetThisToAllFiles = () => {
    // hpo
    const hpoValue = [...hpo].filter((item) => item.id === selectKey);

    if (!options) return;
    setHpo([]);

    for (let index = 0; index < options.length; index++) {
      hpoValue.map((item) => {
        const newItem = { ...item };
        newItem.id = index;
        setHpo((prev) => [...prev, newItem]);
      });
    }

    setOptions((prevOptions) => {
      if (!prevOptions) return prevOptions;

      const updatedOptions = prevOptions.map((option, index) => {
        if (index !== (activeForm || 0)) {
          return {
            ...option,
            firstName: prevOptions[selectKey].firstName,
            lastName: prevOptions[selectKey].lastName,
            adn: prevOptions[selectKey].adn,
            genomeAssembly: prevOptions[selectKey].genomeAssembly,
            analysisMode: prevOptions[selectKey].analysisMode,
            probandSampleName: prevOptions[selectKey].probandSampleName,
            modeOfInheritance: prevOptions[selectKey].modeOfInheritance,
          };
        }
        return option;
      });
      return updatedOptions;
    });
  };

  const updateClear = () => {
    setHpo(hpo.filter((item) => item.id !== selectKey));
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
            // hpo: "",
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
    setHpo([]);
  };

  // id: 0,
  // hpo: newValue.map((item) => item.value).join(","),
  const FileForm = () => {
    const opt = options && options[activeForm || 0];
    if (!opt)
      return (
        <div
          className="flex justify-center items-center h-full select-none"
          style={{ fontSize: "300%" }}
        >
          No file
        </div>
      );

    const handleChange = (newDataSelect: MultiValue<hpoType>) => {
      // console.log(newDataSelect);
      const data = newDataSelect[newDataSelect.length - 1];

      const isSet = hpo.some(
        (item) => item.id === selectKey && item.label === data.label
      );

      // console.log(!isSet);

      if (!isSet) {
        const newItems: hpoType = {
          id: selectKey,
          label: data.label,
          value: data.value,
        };
        setHpo([...hpo, newItems]);
        return;
      }
    };

    return (
      <>
        <div className="flex flex-col flex-grow py-2">
          <label className="flex w-fit self-center font-bold border-b-2 border-blue-500 text-blue-500 mb-4">
            {opt.file.name}
          </label>
          {input("First name", "firstName")}
          {input("Last name", "lastName")}
          {input("ADN", "adn")}
          <div className="flex p-2 gap-4 w-full">
            <label className="flex items-center justify-start min-w-[167px]">
              HPO
            </label>
            <AsyncSelect
              key={Math.random()}
              className=" !w-full bg-white border-4 border-gray-300 rounded-md font-medium hover:border-blue-200 focus:border-blue-400 focus:outline-none"
              isMulti
              // cacheOptions
              defaultOptions
              loadOptions={loadOptions}
              onChange={handleChange}
              value={hpo.filter((item) => item.id === selectKey)}
              components={{
                MultiValueRemove: () => null,
                DropdownIndicator: () => null,
                ClearIndicator: () => null,
              }}
            />
          </div>
          {/* clear hpo*/}
          <div className="flex p-2 gap-4 w-full justify-end">
            <button
              className="bt-fun"
              onClick={() => {
                setHpo(hpo.filter((item) => item.id !== selectKey));
              }}
            >
              clear hpo
            </button>
          </div>

          {/*input("Proband Sample Name", "probandSampleName")}
          {input("Mode Of Inheritance", "modeOfInheritance")}
          {dropList("Genome Assembly", "genomeAssembly", ["hg19", "hg38"])}
    {dropList("Analysis Mode", "analysisMode", ["PASS_ONLY"])*/}
        </div>
        <div className="flex justify-end gap-2">
          <div className=" flex flex-grow">
            <button
              className={`bt-fun ${options && options.length <= 1 && `hidden`}`}
              onClick={UpdateSetThisToAllFiles}
            >
              Set all
            </button>
          </div>
          <button className="bt-fun" onClick={updateClear}>
            Clear
          </button>
          <button
            className={`bt-fun ${options && options.length <= 1 && `hidden`}`}
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
        {/* <input type="checkbox" value="" className="check-box"></input> */}
        <button
          className={`bt-file font-light ${
            activeForm === id && ` bg-blue-300 text-slate-600 w-fit-content`
          } ${
            options &&
            (options[id].firstName === "" || options[id].adn === "") &&
            `bg-yellow-300 !text-black ${activeForm === id && `bg-yellow-100`}`
          }
           ${
             hpo.filter((item) => item.id == id).length === 0 &&
             `bg-red-500 !text-white ${
               activeForm === id && `!bg-red-300 !text-white`
             }`
           }
          `}
          onClick={() => {
            setActiveForm(id);
            // console.log(id);
          }}
        >
          {name}
        </button>
      </div>
    );
  };

  const onDrop = useCallback(
    // files validation ".vcf" || ".gz"
    (acceptedFiles: File[]) => {
      // Filter only files with the .vcf extension
      const vcfFiles = acceptedFiles.filter(
        (file) => file.name.endsWith(".vcf") || file.name.endsWith(".gz")
      );

      // Remove duplicates
      const dupFilter = [...new Set(vcfFiles)];
      // Alert for non-.vcf files
      const nonVcfFiles = acceptedFiles.filter(
        (file) => !file.name.endsWith(".vcf") && !file.name.endsWith(".gz")
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
        const newId = (options && options?.length + index) || index;

        newfile.push({
          id: newId,
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
      <div className="bt-check-box select-none cursor-pointer">
        {/* <input type="checkbox" value="" className="check-box"></input> */}
        <div className="bt-file bg-blue-500 border-2 border-black whitespace-nowrap ">
          <input {...getInputProps()} />
          <span className="px-5">Add Files (.vcf or .gz)</span>
        </div>
      </div>
    );
  };

  const sendFormData = async (formData: FormData) => {
    try {
      // Make a POST request to the backend endpoint
      setActiveForm(-2);
      const response = await axios.post(BACKEND + "/api/submitForm", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response from the backend
      console.log("Backend Response:", response.data);

      setZipFile(response.data["files"]);
      setActiveForm(-1);

      // setActiveForm(-1);
    } catch (error) {
      // Handle errors
      console.error("Error sending form data, backend");
    }
  };

  useEffect(() => {
    // Update the key whenever activeForm changes
    setSelectKey(activeForm || 0);
  }, [activeForm]);

  if (activeForm === -1)
    return (
      <div>
        <Result backend={BACKEND} files={zipFile} />
      </div>
    );

  if (activeForm === -2) return <Progress backend={BACKEND} />;

  return (
    <div
      className="flex flex-col w-full p-[20px] "
      style={{ height: "calc(100% - 100px)" }}
    >
      <div className="flex w-full" style={{ height: "calc(100% - 50px)" }}>
        <div
          className="min-w-[30%] md:min-w-fit border-4 main"
          {...getRootProps()}
        >
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
      <div className="flex h-[50px] justify-between pt-[20px] gap-2 p-3">
        <button className="bt-fun" onClick={updateRemoveAllFiles}>
          Remove All
        </button>
        <button
          className="bt-fun"
          onClick={() => {
            if (!options) return;
            handleFileUpload(hpo, options, sendFormData);
            // console.log(hpo);
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
};
