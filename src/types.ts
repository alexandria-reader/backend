export type ConnectionOptions = {
  connectionString: string | undefined,
  ssl: boolean | Object
};

export interface User {
  username: string,
  passwordHash: string,
  email: string
}


export type Text = {
  id?: number,
  userId: number,
  languageId: number,
  title: string,
  author?: string | null,
  text: string,
  tsParsedText?: string,
  sourceURL?: string | null,
  sourceType?: string | null,
  uploadTime: Date,
  isPublic?: boolean
};

export type TextDB = {
  id: number,
  user_id: number,
  language_id: number,
  title: string,
  author: string | null,
  text: string,
  ts_parsed_text: string,
  source_url: string | null,
  source_type: string | null,
  upload_time: string,
  is_public: boolean
};

export const convertTextTypes = function(dbItem: TextDB): Text {
  return {
    id: dbItem.id,
    userId: dbItem.user_id,
    languageId: dbItem.language_id,
    title: dbItem.title,
    author: dbItem.author,
    text: dbItem.text,
    tsParsedText: dbItem.ts_parsed_text,
    sourceURL: dbItem.source_url,
    sourceType: dbItem.source_type,
    uploadTime: new Date(dbItem.upload_time),
    isPublic: dbItem.is_public,
  };
};


export type Word = {
  id: number,
  languageId: number,
  word: string,
  tsParsedWord: string,
  isCompound: boolean
};

export type WordDB = {
  id: number,
  language_id: number,
  word: string,
  ts_parsed_word: string,
  is_compound: boolean
};

export const convertWordTypes = function(dbItem: WordDB): Word {
  return {
    id: dbItem.id,
    languageId: dbItem.language_id,
    word: dbItem.word,
    tsParsedWord: dbItem.ts_parsed_word,
    isCompound: dbItem.is_compound,
  };
};
