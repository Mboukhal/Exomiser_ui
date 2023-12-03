export type TformOptions = {
  id: number;
  file: File;
  firstName: string;
  lastName: string;
  adn: string;
  genomeAssembly: string;
  analysisMode: string;
  hpo: string;
  probandSampleName: string;
  modeOfInheritance: string;
  [key: string]: string | number | { name: string } | undefined;
};
