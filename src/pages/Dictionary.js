import React, { useState, useEffect } from 'react';
import Tabs from '../components/tabs/Tabs';
import TabContent from '../components/tabs/tabContent/TabContent';
import { getAllUserWords } from '../controllers/words/userWords';
import { getWordsById } from '../controllers/words/words';
import { getCookie } from '../utils/cookie';
import Button from '../components/button/Button';

const isEmptyArr = (arr) => {
  if (Array.isArray(arr) && !arr.length) {
    return true;
  }
  return false;
};

const Dictionary = () => {
  const [dictionaryWords, setDictionaryWords] = useState(null);
  const [dictionaryInfoWords, setDictionaryInfoWords] = useState(null);
  const [tabContent, setTabContent] = useState({ normal: [], hard: [], deleted: [] });
  const [isUpdated, setUpdate] = useState(false);
  useEffect(() => {
    const auth = JSON.parse(getCookie('auth'));
    const getDictionaryWords = async (token, id) => {
      const response = await getAllUserWords(token, id);
      if (response.notification.status) {
        setDictionaryWords(response.data);
      } else {
        console.log('something wrongs');
      }
    };
    getDictionaryWords(auth.token, auth.userId);
  }, []);

  useEffect(() => {
    const getElementsDictionaryFromId = async () => {
      const list = [];
      dictionaryWords.forEach((w) => {
        list.push(getWordsById(w.wordId));
      });
      Promise.all(list).then((resps) => {
        setDictionaryInfoWords(resps);
      });
    };
    if (dictionaryWords !== null) {
      getElementsDictionaryFromId();
    }
  }, [dictionaryWords]);

  useEffect(() => {
    if (dictionaryInfoWords !== null) {
      const tabContentLocal = {
        normal: [],
        hard: [],
        deleted: [],
      };
      dictionaryWords.forEach((d) => {
        const word = dictionaryInfoWords.filter((w) => w.data.id === d.wordId);
        if (word !== null) {
          const { isDeleted } = d.optional;
          if (isDeleted !== undefined && isDeleted) {
            tabContentLocal.deleted.push(word);
          } else if (d.difficulty === 'normal') {
            tabContentLocal.normal.push(word);
          } else {
            tabContentLocal.hard.push(word);
          }
        }
      });
      setTabContent(tabContentLocal);
    }
  }, [dictionaryInfoWords, dictionaryWords]);

  const buildTab = (cTab) => {
    const tab = [];
    tabContent[cTab].forEach((w) => {
			const cWord = w[0].data;
      tab.push({ id: cWord.id, origin: cWord.word, transcript: cWord.transcription, translation: cWord.wordTranslate });
    });
    return tab;
  };

  const isUpdateButtonActive = (status) => {
    setUpdate(status);
  };

  const getNewWorList = (words) => {
    console.log(words);
  };

  const saveChange = () => {

  };

  return (
    <div>
      <Tabs>
        <div label="All">
          {
isEmptyArr(tabContent.normal)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('normal')}
      getWordList={getNewWorList}
    />
  )
}

        </div>
        <div label="Hard">
          {
isEmptyArr(tabContent.hard)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('hard')}
      getWordList={getNewWorList}
    />
  )
}
        </div>
        <div label="Deleted">
          {
isEmptyArr(tabContent.deleted)
  ? null
  : (
    <TabContent
      getStatus={isUpdateButtonActive}
      wordList={buildTab('deleted')}
      getWordList={getNewWorList}
    />
  )
}
        </div>
      </Tabs>
      {
!isUpdated ? null : (
  <Button
    id="dictionary-save"
    label="update"
    clickHandler={saveChange}
  />
)
}

    </div>
  );
};

export default Dictionary;
