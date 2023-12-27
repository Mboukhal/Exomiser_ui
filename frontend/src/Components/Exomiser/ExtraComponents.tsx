export const dropList = (name: string, id: string, optionsList: string[]) => {
  const opt = options && options[activeForm || 0][id];
  if (!opt) return;
  return (
    <div className="flex p-2 gap-4 w-full">
      <label className="flex items-center justify-start min-w-[167px]">
        {name}
      </label>
      <select
        className="text-center input-style bg-white"
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
