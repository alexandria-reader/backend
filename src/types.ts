export type ConnectionOptions = {
  connectionString: string | undefined,
  ssl: boolean | Object
};

export interface User {
  username: string,
  passwordHash: string,
  email: string,
}


export type Text = {
  id?: number,
  userId: number,
  languageId: string,
  title: string,
  author?: string | null,
  body: string,
  sourceURL?: string | null,
  sourceType?: string | null,
  uploadTime: Date,
  isPublic?: boolean,
};

export type TextDB = {
  id: number,
  user_id: number,
  language_id: string,
  title: string,
  author: string | null,
  body: string,
  // ts_config: string,
  // tsvector_simple: string,
  // tsvector_language: string,
  source_url: string | null,
  source_type: string | null,
  upload_time: string,
  is_public: boolean,
};

export const convertTextTypes = function(dbItem: TextDB): Text {
  return {
    id: dbItem.id,
    userId: dbItem.user_id,
    languageId: dbItem.language_id,
    title: dbItem.title,
    author: dbItem.author,
    body: dbItem.body,
    sourceURL: dbItem.source_url,
    sourceType: dbItem.source_type,
    uploadTime: new Date(dbItem.upload_time),
    isPublic: dbItem.is_public,
  };
};


export type Word = {
  id?: number,
  languageId: number,
  word: string,
};

export type WordDB = {
  id: number,
  language_id: number,
  word: string,
  // ts_config: string,
  // tsquery_simple: string,
  // tsquery_language: string,
};

export const convertWordTypes = function(dbItem: WordDB): Word {
  return {
    id: dbItem.id,
    languageId: dbItem.language_id,
    word: dbItem.word,
  };
};


export type Language = {
  id: string,
  name: string,
  googleTranslateURL?: string | null,
  eachCharIsWord: boolean,
  isRightToLeft: boolean,
};

export type LanguageDB = {
  id: string,
  name: string,
  google_translate_url: string | null,
  each_char_is_word: boolean,
  is_right_to_left: boolean
};

export const convertLanguageTypes = function(dbItem: LanguageDB): Language {
  return {
    id: dbItem.id,
    name: dbItem.name,
    googleTranslateURL: dbItem.google_translate_url,
    eachCharIsWord: dbItem.each_char_is_word,
    isRightToLeft: dbItem.is_right_to_left,
  };
};


export type KnownLanguage = Language & { isNative: boolean };

export type KnownLanguageDB = LanguageDB & { is_native: boolean };

export const convertKnownLanguageTypes = function(dbItem: KnownLanguageDB): KnownLanguage {
  return {
    id: dbItem.id,
    name: dbItem.name,
    googleTranslateURL: dbItem.google_translate_url,
    eachCharIsWord: dbItem.each_char_is_word,
    isRightToLeft: dbItem.is_right_to_left,
    isNative: dbItem.is_native,
  };
};


export type Webdictionary = {
  id?: number,
  languagePairId: number,
  sourceLanguageId?: string,
  targetLanguageId?: string,
  name: string,
  url: string
};

export type WebdictionaryDB = {
  id?: number,
  language_pair_id: number,
  source_language_id: string,
  target_language_id: string,
  name: string,
  url: string
};

export const convertWebdictionaryTypes = function(dbItem: WebdictionaryDB): Webdictionary {
  return {
    id: dbItem.id,
    languagePairId: dbItem.language_pair_id,
    sourceLanguageId: dbItem.source_language_id,
    targetLanguageId: dbItem.target_language_id,
    name: dbItem.name,
    url: dbItem.url,
  };
};
