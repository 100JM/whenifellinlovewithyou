import Dday from "./components/Dday";
import Slider from './components/Slider';

function App() {
  return (
    <>
      <div className="w-full h-2/5 py-3 px-8">
        <div className="w-full h-1/4 p-2 rounded-xl flex justify-center items-center" style={{boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)"}}>
          <div className="h-full">
            <div className="text-center">
              우리가 처음 만난 날
            </div>
            <div className="text-center" style={{color: "#898A8D"}}>
              2023년 10월 28일 토요일 🥰
            </div>
          </div>
        </div>
        <Dday />
      </div>
      <div className="w-full h-3/5 py-3 px-8 pt-0">
        <Slider />
      </div>
    </>
  );
}

export default App;
