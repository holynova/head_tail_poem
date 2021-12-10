export interface HeadTailItem {
  line: string;
  poemId: string;
}

export interface PoemDictItemModel {
  content: string;
  title: string;
  author: string;
  book: string;
  dynasty: string;
}

export interface PoemDictModel {
  [key: string]: PoemDictItemModel;
}
export interface HeadTailDict {
  [key: string]: HeadTailItem[];
}

export interface ResultRowModel extends HeadTailItem {
  alter: HeadTailItem[];
  count: number;
  index: number;
}

export interface RowDataModel {
  position: number | string;
  char: string;
  results: HeadTailItem[];
}
