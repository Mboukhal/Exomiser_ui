export const Result = ({
  files,
  backend,
}: {
  files: string[] | null;
  backend: string;
}) => {
  const backend_download = backend + "/download/";

  const handleDownload = (filePath?: string) => () => {
    if (filePath) {
      // Create a temporary link and click it to trigger the download
      console.log(filePath);
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop() || "downloaded_file"; // Provide a default if filename is not available
      document.body.appendChild(link);
      // console.log(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadAll = () => {
    if (!files) {
      return;
    }

    const divElements: HTMLAnchorElement[] = [];

    // Append links for each file to the container
    files.forEach((filePath, index) => {
      filePath = backend_download + filePath;
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop() || `downloaded_file_${index}`;
      divElements.push(link);
    });

    // Function to asynchronously handle each link
    const processLinks = (index: number) => {
      if (index < divElements.length) {
        const link = divElements[index];

        // Append the link to the body
        document.body.appendChild(link);

        // Trigger the click event after a delay
        setTimeout(() => {
          link.click();

          // Remove the link from the body after another delay
          setTimeout(() => {
            document.body.removeChild(link);

            // Process the next link
            processLinks(index + 1);
          }, 20); // Adjust the delay as needed
        }, 20); // Adjust the delay as needed
      }
    };

    // Start processing links from the beginning
    processLinks(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        className="flex items-center justify-center border border-gray-500 mx-4 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleDownloadAll}
      >
        Download All
      </button>

      {files &&
        files.map((filePath, index) => (
          <div
            className="flex flex-row gap-6 w-full bg-slate-100 hover:bg-slate-300 pr-10 "
            key={index}
          >
            <label
              className="flex items-center justify-center pl-4 flex-grow p-4 cursor-pointer font-bold"
              onClick={handleDownload(backend_download + filePath)}
            >
              {filePath}
            </label>
          </div>
        ))}
    </div>
  );
};
