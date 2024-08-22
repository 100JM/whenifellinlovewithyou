import { useState, useEffect } from "react";

const Dday = () => {
    const today = `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일`

    const [elapsedTime, setElapsedTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const startDate = new Date('2023-10-28T00:00:00');

        const intervalId = setInterval(() => {
            const currentDate = new Date();
            const diffInMilliseconds = currentDate - startDate;
            const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

            const days = Math.floor(diffInSeconds / (3600 * 24));
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
            const seconds = diffInSeconds

            setElapsedTime({
                days,
                hours,
                minutes,
                seconds
            });
        }, 1000);

        return () => clearInterval(intervalId);

    }, []);

    return (
        <div className="w-full h-3/4 p-2 mt-3 rounded-xl text-center flex justify-center items-center" style={{ boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)", height: "calc(75% - 0.75rem)" }}>
            <div className="w-full h-full grid justify-center items-center">
                <div className="w-full mb-1">
                    {`오늘 날짜 ${today} 기준으로`}
                </div>
                <div className="w-full mb-1" style={{color: "#898A8D"}}>
                    만난지 <span style={{color: "#FFB6C1"}}>{elapsedTime.days}</span>일
                </div>
                <div className="w-full mb-1" style={{color: "#898A8D"}}>
                    만난지 <span style={{color: "#FFB6C1"}}>{elapsedTime.hours}</span>시간
                </div>
                <div className="w-full mb-1" style={{color: "#898A8D"}}>
                    만난지 <span style={{color: "#FFB6C1"}}>{elapsedTime.minutes}</span>분
                </div>
                <div className="w-full" style={{color: "#898A8D"}}>
                    만난지 <span style={{color: "#FFB6C1"}}>{elapsedTime.seconds}</span>초
                </div>
            </div>
        </div>
    );
}

export default Dday;