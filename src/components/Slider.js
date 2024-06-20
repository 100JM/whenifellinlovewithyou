import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import we2 from '../assets/we-2.jpeg';
import we3 from '../assets/we-3.jpeg';
import we4 from '../assets/we-4.jpeg';
import we5 from '../assets/we-5.jpg';
import we6 from '../assets/we-6.jpg';
import we7 from '../assets/we-7.jpg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
    {image : we2, alt: '네컷사진'},
    {image : we3, alt: '일본 오사카 여행 USJ'},
    {image : we4, alt: '일본 오사카 여행 첫날 숙소'},
    {image : we5, alt: '베트남 나트랑 여행 CCCP coffee'},
    {image : we6, alt: '베트남 나트랑 여행 OLA cafe'},
    {image : we7, alt: '베트남 나트랑 여행 선라이즈 나트랑 비치 호텔'},
]

const Slider = () => {
    return (
        <div className="w-full h-full rounded-xl flex justify-center items-center text-center" style={{ boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)" }}>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                loop={true}
                speed={400}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={true}
                className='w-full h-full rounded-xl'
            >
                {images.map((i) => {
                    return (
                        <SwiperSlide key={i.alt}>
                            <div className="w-full h-full flex justify-center items-center">
                                {/* <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl p-1" style={{backgroundColor: "#FFB6C1"}} /> */}
                                <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl" />
                                <div className="absolute right-1 bottom-1">
                                    <button title="위치보기">
                                        <FontAwesomeIcon icon={faLocationDot} style={{color: "#FF6347", height: "18px", width: "16px"}}/>
                                    </button>
                                </div>
                            </div>                            
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    );
}

export default Slider;