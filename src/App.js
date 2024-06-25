import { useState, useEffect } from "react";

import MapPages from "./components/MapPage";

import { CSSTransition } from 'react-transition-group';
import Dday from "./components/Dday";
import Slider from './components/Slider';

import we2 from './assets/we-2.jpeg';
import we3 from './assets/we-3.jpeg';
import we4 from './assets/we-4.jpeg';
import we5 from './assets/we-5.jpg';
import we6 from './assets/we-6.jpg';
import we7 from './assets/we-7.jpg';
import we8 from './assets/we-8.jpg';

const images = [
  { image: we2, alt: '🗓️2024년 3월 5일<br />송리단길 PHOTOGRAY', center: [37.507923, 127.107414] },
  { image: we3, alt: '🗓️2024년 1월 29일<br />일본 오사카 USJ', center: [34.665756191649585, 135.4323077688899] },
  { image: we4, alt: '🗓️2024년 1월 27일<br />일본 여행 첫날<br />GRANBELL HOTEL OSAKA', center: [34.67992365241128, 135.50372102642334] },
  { image: we5, alt: '🗓️2024년 6월 15일<br />베트남 나트랑 CCCP coffee', center: [12.240114495011245, 109.19218770138447] },
  { image: we6, alt: '🗓️2024년 6월 16일<br />베트남 나트랑 OLA cafe', center: [12.240335131989028, 109.18687037227834] },
  { image: we7, alt: '🗓️2024년 6월 17일<br />베트남 나트랑<br />SUNRISE NHA TRANG BEACH HOTEL', center: [12.250768909463744, 109.19610614159033] },
  { image: we8, alt: '🗓️2024년 3월 10일<br />남양주시 burique cafe', center: [37.658540, 127.373405] },
];

function App() {
  const [showMapPage, setShowMapPage] = useState(false);
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    setMemories(images);
  }, []);

  const handleShowMapPage = (isShow) => {
    setShowMapPage(isShow);
  }

  return (
    <>
      <CSSTransition
        in={!showMapPage}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <div className="w-full h-full">
          <div className="w-full py-3 px-10 dday" style={{height: "35%"}}>
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
          <div className="w-full py-3 px-10 pt-0" style={{height: "65%"}}>
            <Slider handleShowMapPage={handleShowMapPage} memories={memories}/>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={showMapPage}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <MapPages handleShowMapPage={handleShowMapPage} memories={memories}/>
      </CSSTransition>
    </>
  );
}

export default App;
