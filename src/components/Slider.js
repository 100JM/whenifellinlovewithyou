import { useState, useEffect, useRef } from 'react';

import GoogleMaps from './GoogleMaps';
import LeafletMaps from './LeafletMaps';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Drawer from '@mui/material/Drawer';

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
    { image: we2, alt: '🗓️2024년 3월 5일<br />송리단길 PHOTOGRAY', center: [37.507923, 127.107414] },
    { image: we3, alt: '🗓️2024년 1월 29일<br />일본 오사카 USJ', center: [34.665756191649585, 135.4323077688899] },
    { image: we4, alt: '🗓️2024년 1월 27일<br />일본 여행 첫날<br />GRANBELL HOTEL OSAKA', center: [34.67992365241128, 135.50372102642334] },
    { image: we5, alt: '🗓️2024년 6월 15일<br />베트남 나트랑 CCCP coffee', center: [12.240114495011245, 109.19218770138447] },
    { image: we6, alt: '🗓️2024년 6월 16일<br />베트남 나트랑 OLA cafe', center: [12.240335131989028, 109.18687037227834] },
    { image: we7, alt: '🗓️2024년 6월 17일<br />베트남 나트랑<br />SUNRISE NHA TRANG BEACH HOTEL', center: [12.250768909463744, 109.19610614159033] },
]

const Slider = () => {
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapPopup, setMapPopup] = useState('');
    const swiperRef = useRef(null);
    
    const handleMapCenter = (center, text) => {
        setMapCenter(center);
        setMapPopup(text);
    }

    const handleShowMap = (isShow) => {
        setShowMap(isShow);
    };

    useEffect(() => {
        if (showMap) {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.stop();
            }
        } else {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.start();
            }
        }
    }, [showMap]);

    const handleSwiperInit = (swiper) => {
        swiperRef.current = swiper;
    };

    return (
        <>
            <div className="w-full h-full rounded-xl flex justify-center items-center text-center" style={{ boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)" }}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={1}
                    loop={true}
                    speed={400}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    navigation={true}
                    className='w-full h-full rounded-xl'
                    onInit={handleSwiperInit}
                >
                    {images.map((i) => {
                        return (
                            <SwiperSlide key={i.alt}>
                                <div className="w-full h-full flex justify-center items-center">
                                    {/* <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl p-1" style={{backgroundColor: "#FFB6C1"}} /> */}
                                    <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl" />
                                    <div className="absolute right-1 bottom-1">
                                        <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center, i.alt); }}>
                                            <FontAwesomeIcon icon={faLocationDot} style={{ color: "#FF6347", height: "24px", width: "20px" }} />
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
            <Drawer
                open={showMap}
                onClose={() => handleShowMap(false)}
                anchor={"bottom"}
                style={{ zIndex: "9999" }}
                sx={{ "& .MuiDrawer-paperAnchorBottom": { maxHeight: "300px" } }}
            >
                <LeafletMaps mapCenter={mapCenter} mapPopup={mapPopup} />
            </Drawer>
        </>
    );
}

export default Slider;