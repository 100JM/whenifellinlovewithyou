import Dday from "./components/Dday";
import Slider from './components/Slider';
import mapIcon from './assets/favicon-32x32.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAsia } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <>
      <div className="w-full h-2/5 py-3 px-10">
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
      <div className="w-full h-3/5 py-3 px-10 pt-0">
        <Slider />
        <div className="relative bottom-9 left-2 z-50">
          {/* <button className="flex justify-center items-center bg-green-500 rounded-full">
          <FontAwesomeIcon icon={faEarthAsia} style={{ color: "#418fde", height: "24px", width: "24px" }} />
        </button> */}
          <button>
            <img src={mapIcon} />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
