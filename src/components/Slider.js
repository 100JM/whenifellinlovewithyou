import { useState, useEffect } from 'react';

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
    { image: we2, alt: '인생네컷', center: [37.51004901295591, 127.10884071319168] },
    { image: we3, alt: '일본 오사카 여행 USJ', center: [34.665756191649585, 135.4323077688899] },
    { image: we4, alt: '일본 오사카 여행 첫날 숙소', center: [34.67992365241128, 135.50372102642334] },
    { image: we5, alt: '베트남 나트랑 여행 CCCP coffee', center: [12.240114495011245, 109.19218770138447] },
    { image: we6, alt: '베트남 나트랑 여행 OLA cafe', center: [12.240335131989028, 109.18687037227834] },
    { image: we7, alt: '베트남 나트랑 여행 선라이즈 나트랑 비치 호텔', center: [12.250768909463744, 109.19610614159033] },
]

const Slider = () => {
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [swiperAutoplay, setSwiperAutoplay] = useState(true);

    useEffect(() => {
        if (showMap) {
            setSwiperAutoplay(false);
        } else {
            setSwiperAutoplay(true);
        }
    }, [showMap]);

    const handleMapCenter = (center) => {
        setMapCenter(center);
    }

    const handleShowMap = (isShow) => {
        setShowMap(isShow);
    };

    return (
        <>
            <div className="w-full h-full rounded-xl flex justify-center items-center text-center" style={{ boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)" }}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={1}
                    loop={true}
                    speed={400}
                    autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
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
                                        <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center); }}>
                                            <FontAwesomeIcon icon={faLocationDot} style={{ color: "#FF6347", height: "18px", width: "16px" }} />
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
                sx={{ "& .MuiDrawer-paperAnchorBottom": { maxHeight: "60%" } }}
            >
                <LeafletMaps mapCenter={mapCenter} />
            </Drawer>
        </>
    );
}

export default Slider;