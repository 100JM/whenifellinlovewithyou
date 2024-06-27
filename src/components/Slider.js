import { useState, useEffect, useRef, useCallback } from 'react';

import LeafletMaps from './LeafletMaps';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Drawer from '@mui/material/Drawer';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css';
import mapIcon from '../assets/favicon-32x32.png'
import earthIcon from '../assets/earth-32x32.png';
import plusIcon from '../assets/plus-32x32.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = ({ handleShowMapPage, memories, handleShowDialog }) => {
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
        setActiveIndex(swiper.realIndex);
        setIsZoomed(false);
    };

    const checkPassword = () => {

    }

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
                    slidesPerGroup={1}
                    loop={memories.length > 1}
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
                                    <ControlledZoom isZoomed={activeIndex === index ? isZoomed : false} onZoomChange={handleZoomed}>
                                        <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl" />
                                    </ControlledZoom>
                                    <div className="absolute left-2 bottom-0 locationBtn">
                                        <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center, i.alt); }}>
                                            <img src={mapIcon} alt='위치' />
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                    <SpeedDial
                        ariaLabel="SpeedDial"
                        icon={<SpeedDialIcon />}
                        className="absolute bottom-1 -right-1"
                        sx={{
                            "& button" : {width: "36px", height: "36px"},
                        }}
                        direction="up"
                        FabProps={{style: {backgroundColor: "#FFB6C1"}}}
                    >
                        <SpeedDialAction key="earth" icon={<img src={earthIcon} alt='추억들' />} tooltipTitle="추억들" onClick={() => handleShowMapPage(true)} />
                        <SpeedDialAction key="addMemory" icon={<img src={plusIcon} alt='추가' />} tooltipTitle="추가" onClick={() => handleShowDialog(true)} />
                    </SpeedDial>
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