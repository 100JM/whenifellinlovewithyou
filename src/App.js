import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import MapPages from "./components/MapPage";
import AddMemory from "./components/AddMemory";
import Uploading from "./components/Uploading";

import { CSSTransition } from 'react-transition-group';
import Dday from "./components/Dday";
import Slider from './components/Slider';

function App() {
  const [showMapPage, setShowMapPage] = useState(false);
  const [memories, setMemories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Memories'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortDocs = docs.sort((a,b) => {
        const ad = convertDateStringToDate(a.date);
        const bd = convertDateStringToDate(b.date);

        return bd - ad;
      })
      
      setMemories(sortDocs);
      setFetchLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleShowMapPage = (isShow) => {
    setShowMapPage(isShow);
  };

  const handleShowDialog = (isShow) => {
    setShowAdd(isShow)
  };

  function convertDateStringToDate(dateString) {
    const formattedDateString = dateString.replace(/(\d{4})년 (\d{2})월 (\d{2})일/, '$1-$2-$3');

    return new Date(formattedDateString);
  };

  const handleUploadingBar = (isShow) => {
    setIsUploading(isShow);
  }

  return (
    <>
      <AddMemory isOpen={showAdd} handleShowDialog={handleShowDialog} handleUploadingBar={handleUploadingBar}/>
      <CSSTransition
        in={!showMapPage}
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
            <Slider handleShowMapPage={handleShowMapPage} memories={memories} handleShowDialog={handleShowDialog} fetchLoading={fetchLoading} />
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={showMapPage}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <MapPages handleShowMapPage={handleShowMapPage} memories={memories} />
      </CSSTransition>
      {isUploading && <Uploading />}
    </>
  );
}

export default App;
