import axios from "axios";
import React, { useState } from "react";
import { MultiValue } from "react-select";
import AsyncSelect from "react-select/async";

type Option = {
  id: string;
  name: string;
};

type dataType = {
  label: string;
  value: string;
};

const SearchComponent: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<dataType[]>([]);

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await axios.get(
        `https://hpo.jax.org/api/hpo/search?q=${inputValue}`
      );
      const data = response.data;
      const options: dataType[] = data.terms.map((item: Option) => ({
        label: `${item.id} - ${item.name}`,
        value: item.id,
      }));

      return options;
    } catch (error) {
      console.error("Error loading options:", error);
      return [];
    }
  };

  const handleChange = (newValue: MultiValue<dataType>) => {
    if (newValue) {
      const newItems: dataType[] = newValue.map((item: dataType) => ({
        label: item.label,
        value: item.value,
      }));
      setSelectedItems(newItems);
    }
  };

  return (
    <div className="flex flex-col">
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
      />
      <button
        className="flex self-end bg-gray-400 p-2 text-white px-8 rounded-md my-8 mr-8"
        onClick={() => console.log(selectedItems)}
      >
        Print
      </button>
    </div>
  );
};

export default SearchComponent;
