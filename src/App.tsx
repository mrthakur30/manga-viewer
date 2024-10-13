import { useEffect, useState } from 'react';
import { API_URL } from './api';

function App() {
  const [booksData, setBooksData] = useState<any[]>([]);
  const [chaptersData, setChaptersData] = useState<any>([]);
  const [currBookIndex, setCurrBookIndex] = useState(0);
  const [currChapterIndex, setCurrChapterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchBooksData();
  }, []);

  const fetchBooksData = () => {
    fetch(`${API_URL}/books/`)
      .then(response => response.json())
      .then(data => {
        setBooksData(data);
        if (data.length > 0) {
          setCurrBookIndex(0);
          fetchChapterData(data[0].chapter_ids[0]);
        }
      })
      .catch(error => console.error('Error fetching books data:', error));
  };

  const fetchChapterData = (chapterId: string) => {
    fetch(`${API_URL}/chapters/${chapterId}/`)
      .then(response => response.json())
      .then(data => {
        setChaptersData(data);
        setCurrentPage(0);
      })
      .catch(error => console.error('Error fetching chapter data:', error));
  };

  const next = () => {
    if (currentPage < chaptersData.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (currChapterIndex < booksData[currBookIndex].chapter_ids.length - 1) {
      setCurrChapterIndex(currChapterIndex + 1);
      fetchChapterData(booksData[currBookIndex].chapter_ids[currChapterIndex + 1]);
    }
  };

  const prev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (currChapterIndex > 0) {
      setCurrChapterIndex(currChapterIndex - 1);
      fetchChapterData(booksData[currBookIndex].chapter_ids[currChapterIndex - 1]);
    }
  };

  if (booksData.length === 0) return null;

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#6082B6',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          gap: '10px',
          backgroundColor:'white'
        }}
      >
        <div>
          {booksData.map((book, index) => (
            <button
              key={book.id}
              onClick={() => {
                setCurrBookIndex(index);
                setCurrChapterIndex(0);
                fetchChapterData(book.chapter_ids[0]);
              }}
              style={{
                backgroundColor: currBookIndex === index ? '#999' : '',
              }}
            >
              {book.title}
            </button>
          ))}
        </div>

        {booksData[currBookIndex]?.chapter_ids && (
          <div>
            {booksData[currBookIndex].chapter_ids.map((chapter: string, index: number) => (
              <button
                key={chapter}
                onClick={() => {
                  setCurrChapterIndex(index);
                  fetchChapterData(chapter);
                }}
                style={{
                  backgroundColor: currChapterIndex === index ? '#999' : '',
                }}
              >
                {chapter}
              </button>
            ))}
          </div>
        )}


        <div>
          {chaptersData?.pages && (
            <div
              style={{
                position: 'relative',
              }}
            >
              {chaptersData.pages[currentPage] && (
                <div key={chaptersData.pages[currentPage].id} style={{ position: 'relative' }}>
                  <img
                    src={chaptersData.pages[currentPage].image.file}
                    alt="Chapter Page"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '50%',
                      left: 0,
                      top: 0,
                      zIndex: 1,
                      cursor: 'pointer',
                    }}
                    onClick={prev}
                  ></div>

                  <div
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '50%',
                      right: 0,
                      top: 0,
                      zIndex: 1,
                      cursor: 'pointer',
                    }}
                    onClick={next}
                  ></div>

                  <div
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    Page {currentPage + 1} of {chaptersData.pages.length}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default App;
