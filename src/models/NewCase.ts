interface NewCase {
  client: number;
  title: string;
  description: string;
  lawBranch: number;
  lawMatter: number;
  hasJudicialFile: boolean;
  code?: string,
  court?: string,
  officer?: string,
  judge?: string,
}

export default NewCase;