import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import useShowComponentStore from "./store/show";

import MapPages from "./components/MapPage";
import Gallery from "./components/Gallery";
import AddMemory from "./components/AddMemory";
import MemoryDialog from "./components/MemoryDialog";
import Uploading from "./components/Uploading";
import Dday from "./components/Dday";
import Slider from './components/Slider';

// import { CSSTransition } from 'react-transition-group';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [memories, setMemories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingText, setUploadingText] = useState('');
  const [selectedMemory, setSelectedMemory] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isFadeIn, setIsFadeIn] = useState(true);

  const {mapPage, galleryPage} = useShowComponentStore();

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
    
    if (isFadeIn) setIsFadeIn(false);

    return () => unsubscribe();
  }, []);

  const handleShowDialog = (isShow) => {
    setShowAdd(isShow)

    if (!isShow) {
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
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const fadeTransitionSettings = {
    duration: 0.8,  // 애니메이션 지속 시간 (초 단위)
    ease: "easeInOut"  // 부드러운 전환을 위한 easing
  };

  const subVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  };

  const mainVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  };

  const transitionSettings = {
    type: "spring",
    damping: 15,     // 감쇠 효과로 애니메이션이 얼마나 빨리 정착할지 조절 (높을수록 천천히 멈춤)
    stiffness: 60,  // 스프링의 강도, 낮을수록 느리게 반응하고 부드러움
    duration: 0.5    // 애니메이션 지속 시간
  };

  return (
    <>
      <MemoryDialog showPhoto={showPhoto} handleShowPhoto={handleShowPhoto} selectedPhoto={selectedPhoto} />
      <AddMemory isOpen={showAdd} handleShowDialog={handleShowDialog} handleUploadingBar={handleUploadingBar} handleUploadingText={handleUploadingText} selectedMemory={selectedMemory} />
      <AnimatePresence>
        {!mapPage && !galleryPage && (
          <motion.div
            key="default-page"
            variants={(isFadeIn ? fadeVariants : mainVariants)}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={(isFadeIn ? fadeTransitionSettings : transitionSettings)}
            className="w-full h-full absolute"
          >
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
              <Slider memories={memories} handleShowDialog={handleShowDialog} fetchLoading={fetchLoading} getSelectedMemoryInfo={getSelectedMemoryInfo} selectedMemory={selectedMemory} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mapPage && !galleryPage && (
          <motion.div
            key="map-page"
            variants={subVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
            className="w-full h-full absolute"
          >
            <MapPages memories={memories} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {galleryPage && !mapPage && (
          <motion.div
            key="gallery-page"
            variants={subVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
            className="w-full h-full absolute overflow-y-auto"
          >
            <Gallery memories={memories} handleShowPhoto={handleShowPhoto} />
          </motion.div>
        )}
      </AnimatePresence>
      {isUploading && <Uploading uploadingText={uploadingText} />}
    </>
  );
}

export default App;