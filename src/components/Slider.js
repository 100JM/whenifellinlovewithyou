import { useState, useEffect, useRef, useCallback } from 'react';

import LeafletMaps from './LeafletMaps';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Drawer from '@mui/material/Drawer';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import mapIcon from '../assets/favicon-32x32.png'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = ({ handleShowMapPage, memories }) => {
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapPopup, setMapPopup] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    const handleZoomed = useCallback((zoomed) => {
        setIsZoomed(zoomed);
    }, []);

    const handleMapCenter = (center, text) => {
        setMapCenter(center);
        setMapPopup(text);
    }

    const handleShowMap = (isShow) => {
        setShowMap(isShow);
    };

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
        setIsZoomed(false);
    };

    useEffect(() => {
        if (showMap || isZoomed) {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.stop();
            }
        } else {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.start();
            }
        }
    }, [showMap, isZoomed]);

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
                    onSlideChange={handleSlideChange}
                >
                    {memories.map((i, index) => {
                        return (
                            <SwiperSlide key={i.alt}>
                                <div className="w-full h-full flex justify-center items-center slideDiv">
                                    <ControlledZoom isZoomed={activeIndex === index ? isZoomed : false}  onZoomChange={handleZoomed}>
                                        <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl" />
                                    </ControlledZoom>
                                    <div className="absolute right-1 bottom-1 locationBtn">
                                        <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center, i.alt); }}>
                                            <FontAwesomeIcon icon={faLocationDot} style={{ color: "#FF6347", height: "24px", width: "20px" }} />
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                    <div className="absolute bottom-0 left-2 z-10">
                        <button onClick={() => handleShowMapPage(true)}>
                            <img src={mapIcon} alt='추억들'/>
                        </button>
                    </div>
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