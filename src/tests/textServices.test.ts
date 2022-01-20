import fs from 'fs';
import dbQuery from '../model/db-query';
import texts from '../services/texts';
import { Text } from '../types';

const reset = fs.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs.readFileSync('./src/model/seed.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});


describe('Getting texts', () => {
  test('getAll: get all 3 words from test database', async () => {
    const allTexts = await texts.getAll();
    expect(allTexts).toHaveLength(2);
  });


  test('getById: get word with id 2', async () => {
    const textById = await texts.getById(2);
    expect(textById?.title).toBe('Dans la « bibliothèque » de l’artiste zimbabwéen Kudzanai Chiurai');
  });


  // test('getById: get text with non-existent id 999 returns null', () => {
  //   async function getNonExisting() {
  //     await texts.getById(999);
  //   }

  //   expect(getNonExisting).toThrow();
  // });


  test('addNew: add a new text for user 2', async () => {
    const textData: Text = {
      userId: 2,
      languageId: 'de',
      title: 'Die Kuchengabel',
      author: 'Marc',
      body: 'Ich kann Käsekuchen nicht ohne Kuchengabel essen.',
    };

    const newText = await texts.addNew(textData);
    if (newText) expect(newText.title).toBe('Die Kuchengabel');
    expect(await texts.getAll()).toHaveLength(3);
  });


  test('getByUser: gets all texts for user 2', async () => {
    const userTexts = await texts.getByUserAndLanguage(2, 'de');
    expect(userTexts).toHaveLength(1);
  });


  test('remove: removing an existing text', async () => {
    const existingText = await texts.getById(3);

    if (existingText?.id) {
      const removedText = await texts.remove(existingText.id);
      expect(removedText?.title).toBe('Die Kuchengabel');
      expect(await texts.getAll()).toHaveLength(2);
    }
  });
});


afterAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});
