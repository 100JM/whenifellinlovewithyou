import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import MapPages from "./components/MapPage";
import Gallery from "./components/Gallery";
import AddMemory from "./components/AddMemory";
import MemoryDialog from "./components/MemoryDialog";
import Uploading from "./components/Uploading";

import { CSSTransition } from 'react-transition-group';
import Dday from "./components/Dday";
import Slider from './components/Slider';

function App() {
  const [showMapPage, setShowMapPage] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [memories, setMemories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingText, setUploadingText] = useState('');
  const [selectedMemory, setSelectedMemory] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Memories'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortDocs = docs.sort((a, b) => {
        const ad = convertDateStringToDate(a.date);
        const bd = convertDateStringToDate(b.date);

        return bd - ad;
      });

      setMemories(sortDocs);
      setFetchLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleShowMapPage = (isShow) => {
    setShowMapPage(isShow);
    setShowGallery(false);
  };
  
  const handleShowGallery = (isShow) => {
    setShowGallery(isShow);
    setShowMapPage(false);
  };

  const handleShowDialog = (isShow) => {
    setShowAdd(isShow)

    if(!isShow) {
      setSelectedMemory({});
    }
  };

  const handleShowPhoto = (isShow, photoInfo) => {
    setShowPhoto(isShow);

    if (photoInfo) {
      setSelectedPhoto(photoInfo);
    } else {
      setSelectedPhoto(null);
    }
  };

  function convertDateStringToDate(dateString) {
    const formattedDateString = dateString.replace(/(\d{4})년 (\d{2})월 (\d{2})일/, '$1-$2-$3');

    return new Date(formattedDateString);
  };

  const handleUploadingBar = (isShow) => {
    setIsUploading(isShow);
  };

  const handleUploadingText = (text) => {
    setUploadingText(text);
  };

  const getSelectedMemoryInfo = (id) => {
    const memory = memories.find((m) => {
      return m.id === id;
    });

    setSelectedMemory(memory);

    setShowAdd(true);
  }

  return (
    <>
      <MemoryDialog showPhoto={showPhoto} handleShowPhoto={handleShowPhoto} selectedPhoto={selectedPhoto} />
      <AddMemory isOpen={showAdd} handleShowDialog={handleShowDialog} handleUploadingBar={handleUploadingBar} handleUploadingText={handleUploadingText} selectedMemory={selectedMemory} />
      <CSSTransition
        in={!showMapPage && !showGallery}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <div className="w-full h-full">
          <div className="w-full py-3 px-10 dday" style={{ height: "35%" }}>
            <div className="w-full h-1/4 p-2 rounded-xl flex justify-center items-center" style={{ boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)" }}>
              <div className="h-full grid items-center">
                <div className="text-center">
                  우리가 처음 만난 날
                </div>
                <div className="text-center" style={{ color: "#898A8D" }}>
                  2023년 10월 28일 토요일 🥰
                </div>
              </div>
            </div>
            <Dday />
          </div>
          <div className="w-full py-3 px-10 pt-0" style={{ height: "65%" }}>
            <Slider handleShowMapPage={handleShowMapPage} handleShowGallery={handleShowGallery} memories={memories} handleShowDialog={handleShowDialog} fetchLoading={fetchLoading} getSelectedMemoryInfo={getSelectedMemoryInfo} selectedMemory={selectedMemory}/>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={showMapPage && !showGallery}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <MapPages handleShowMapPage={handleShowMapPage} memories={memories} />
      </CSSTransition>
      <CSSTransition
        in={showGallery && !showMapPage}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <Gallery handleShowGallery={handleShowGallery} memories={memories} handleShowPhoto={handleShowPhoto} />
      </CSSTransition>
      {isUploading && <Uploading uploadingText={uploadingText} />}
    </>
  );
}

export default App;
