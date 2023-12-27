import axios from "axios";
import { Option, TformOptions, hpoType } from "./Exomiser.d";

export const loadOptions = async (inputValue: string) => {
  try {
    const response = await axios.get(
      `https://hpo.jax.org/api/hpo/search?q=${inputValue}`
    );
    const data = response.data;
    const options: hpoType[] = data.terms.map((item: Option) => ({
      label: `${item.id} - ${item.name}`,
      value: item.id,
    }));

    return options;
  } catch (error) {
    console.error("Error loading options:", error);
    return [];
  }
};

// add hpo to options as string in format option[0] = hpo[0] -> "value1,value2,value3"
const addHpoToOptions = (hpo: hpoType[], options: TformOptions[]) => {
  options.forEach((option, index) => {
    options[index].hpo = "";
    const id = option.id;
    hpo.forEach((item) => {
      if (item.id === id) {
        if (options[index].hpo) options[index].hpo += `, `;
        options[index].hpo += `"${item.value}"`;
      }
    });
  });
};

export const handleFileUpload = (
  hpo: hpoType[],
  data: TformOptions[] | null,
  sendFormData: (formData: FormData) => Promise<void>
) => {
  // Create a new FormData object
  const formData = new FormData();

  // Append the file to the FormData object
  if (!data) return;

  addHpoToOptions(hpo, data);

  formData.append("userId", "test01");
  data.forEach((config, index) => {
    const obj: Record<string, string | number> = {
      id: index,
      firstName: config.firstName,
      lastName: config.lastName,
      adn: config.adn,
      genomeAssembly: config.genomeAssembly,
      analysisMode: config.analysisMode,
      hpo: config.hpo,
      probandSampleName: config.probandSampleName,
      modeOfInheritance: config.modeOfInheritance,
    };

    formData.append(index.toString(), JSON.stringify(obj));
    formData.append(`file${index.toString()}`, config.file);
    // console.log(`file${index.toString()}`, config.file);
  });

  // Send the FormData to the backend
  sendFormData(formData);
};
