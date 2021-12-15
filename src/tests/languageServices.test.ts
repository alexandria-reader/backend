import fs from 'fs';
import dbQuery from '../model/db-query';
import languages from '../services/languages';
import { Language } from '../types';

const init = fs.readFileSync('./src/model/wordServices.test.init.sql', 'utf-8');
const reset = fs.readFileSync('./src/model/wordServices.test.reset.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(init);
});

describe('Getting languages', () => {
  test('getAll: get all 3 languages from test database', async () => {
    const allTexts = await languages.getAll();
    expect(allTexts).toHaveLength(3);
  });


  test('getById: get word with id "de"', async () => {
    const languageById = await languages.getById('de');
    expect(languageById?.name).toBe('german');
  });


  test('addNew: add a new language', async () => {
    const languageObject: Language = {
      id: 'jp',
      name: 'japanese',
      eachCharIsWord: false,
      isRightToLeft: false,
    };

    const newLanguage = await languages.addNew(languageObject);
    if (newLanguage) expect(newLanguage.name).toBe('japanese');
    expect(await languages.getAll()).toHaveLength(4);
  });

  // test('getById: get language with non-existent id "fdd" returns null', async () => {
  //   const languageById = await languages.getById('fdd');
  //   expect(languageById).toBe(null);
  // });
});


afterAll(async () => {
  await dbQuery(reset);
});
