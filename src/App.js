import { useState } from "react";

import MapPages from "./components/MapPage";

import { CSSTransition } from 'react-transition-group';
import Dday from "./components/Dday";
import Slider from './components/Slider';

function App() {
  const [showMapPage, setShowMapPage] = useState(false);

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
          <div className="w-full h-2/5 py-3 px-11">
            <div className="w-full h-1/4 p-2 rounded-xl flex justify-center items-center" style={{ boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)" }}>
              <div className="h-full">
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
          <div className="w-full h-3/5 py-3 px-11 pt-0">
            <Slider handleShowMapPage={handleShowMapPage}/>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={showMapPage}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <MapPages handleShowMapPage={handleShowMapPage}/>
      </CSSTransition>
    </>
  );
}

export default App;
