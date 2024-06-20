import Dday from "./components/Dday";
import Slider from './components/Slider';

function App() {
  return (
    <>
      <div className="w-full h-2/5 p-4">
        <div className="w-full h-1/4 p-3 rounded-xl flex justify-center items-center" style={{boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)"}}>
          <div>
            <div className="w-full flex justify-center">
              <span>우리가 처음 만난 날</span>
            </div>
            <div className="w-full flex justify-center" style={{color: "#898A8D"}}>
              <span>2023년 10월 28일 토요일 🥰</span>
            </div>
          </div>
        </div>
        <Dday />
      </div>
      <div className="w-full h-3/5 p-4 pt-0">
        <Slider />
      </div>
    </>
  );
}

export default App;
