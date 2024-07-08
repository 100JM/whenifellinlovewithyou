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

const Slider = ({ handleShowMapPage, memories, handleShowDialog, fetchLoading }) => {
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapPopup, setMapPopup] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [playingIndex, setPlayingIndex] = useState(null);

    const swiperRef = useRef(null);
    const videoRefs = useRef([]);

    const handleZoomed = useCallback((zoomed) => {
        setIsZoomed(zoomed);
    }, []);

    const handleMapCenter = (center, text, date) => {
        setMapCenter(center);
        setMapPopup(`🗓️${date}<br />${text}`);
    }

    const handleShowMap = (isShow) => {
        setShowMap(isShow);
    };

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
        setIsZoomed(false);

        if (playingIndex !== null && videoRefs.current[playingIndex]) {
            videoRefs.current[playingIndex].pause();
        }
        setPlayingIndex(null);
    };

    useEffect(() => {
        if (showMap || isZoomed || (playingIndex !== null )) {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.stop();
            }
        } else {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.start();
            }
        }
    }, [showMap, isZoomed, playingIndex]);

    const handleSwiperInit = (swiper) => {
        swiperRef.current = swiper;
    };

    const handlePlay = (index) => {
        setPlayingIndex(index);
        videoRefs.current.forEach((video, i) => {
            if (i !== index && video) {
                video.pause();
            }
        });
    };

    const handlePause = () => {
        setPlayingIndex(null);
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
                    {fetchLoading &&
                        <SwiperSlide>
                            <div className="w-full h-full flex justify-center items-center slideDiv">
                                데이터를 불러오는 중...💻
                            </div>
                        </SwiperSlide>
                    }
                    {memories.length === 0 && !fetchLoading &&
                        <SwiperSlide>
                            <div className="w-full h-full flex justify-center items-center slideDiv">
                                등록된 추억이 없어요🥲
                            </div>
                        </SwiperSlide>
                    }
                    {memories.length > 0 && !fetchLoading &&
                        memories.map((i, index) => {
                            if (i.image) {
                                return (
                                    <SwiperSlide key={i.id}>
                                        <div className="w-full h-full flex justify-center items-center slideDiv">
                                            <ControlledZoom isZoomed={activeIndex === index ? isZoomed : false} onZoomChange={handleZoomed}>
                                                <img src={i.image} alt={i.alt} className="w-full h-full rounded-xl" />
                                            </ControlledZoom>
                                            <div className="absolute left-2 bottom-0 locationBtn">
                                                <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center, i.alt, i.date); }}>
                                                    <img src={mapIcon} alt='위치' />
                                                </button>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            } else {
                                return (
                                    <SwiperSlide key={i.id}>
                                        <div className="w-full h-full flex justify-center items-center slideDiv">
                                            <video
                                                ref={(el) => (videoRefs.current[index] = el)} 
                                                src={i.video} 
                                                type="video/mp4" 
                                                className="w-full h-full object-cover"
                                                controls
                                                onPlay={() => handlePlay(index)}
                                                onPause={handlePause}
                                            ></video>
                                            <div className="absolute left-2 top-0 locationBtn">
                                                <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center, i.alt, i.date); }}>
                                                    <img src={mapIcon} alt='위치' />
                                                </button>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            }
                        })
                    }
                    <SpeedDial
                        ariaLabel="SpeedDial"
                        icon={<SpeedDialIcon />}
                        className="absolute bottom-1 -right-1"
                        sx={{
                            "& button": { width: "36px", height: "36px" },
                        }}
                        direction="up"
                        FabProps={{ style: { backgroundColor: "#FFB6C1" } }}
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
                {mapCenter && mapCenter.length > 0 ?
                    <LeafletMaps mapCenter={mapCenter} mapPopup={mapPopup} />
                    :
                    <div className="p-3 rounded flex justify-center items-center" style={{ height: '300px', width: '100%' }}>
                        위치 정보가 없습니다🥲
                    </div>
                }
            </Drawer>
        </>
    );
}

export default Slider;