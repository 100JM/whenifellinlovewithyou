import { useState, useEffect, useRef, useCallback } from 'react';
import useShowComponentStore from '../store/show';
import useMemories from '../store/memory';

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
import filmIcon from '../assets/film-32x32.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = () => {
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapPopup, setMapPopup] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [playingIndex, setPlayingIndex] = useState(null);

    const { setMapPage, setGalleryPage, setAddDialog } = useShowComponentStore();
    const { ourMemories, isLoading, error, selectedOurMemory, setSelectedOurMemory } = useMemories();

    const swiperRef = useRef(null);
    const videoRefs = useRef([]);

    useEffect(() => {
        if (showMap || isZoomed || (playingIndex !== null) || selectedOurMemory.id) {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.stop();
            }
        } else {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.start();
            }
        }

        return () => {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.stop();
            }
        };

    }, [showMap, isZoomed, playingIndex, selectedOurMemory.id]);

    const getMemoryInfo = (id) => {
        const memory = ourMemories.find((m) => {
            return m.id === id;
        });

        setSelectedOurMemory(memory);
        setAddDialog(true);
    };

    const showMapPage = () => {
        setMapPage(true);
        setGalleryPage(false);
    };

    const showGalleryPage = () => {
        setMapPage(false);
        setGalleryPage(true);
    }

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

    const handleSwiperInit = useCallback((swiper) => {
        swiperRef.current = swiper;
    }, []);

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
                    loop={ourMemories.length > 1}
                    speed={400}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{
                        dynamicBullets: true,
                        clickable: true,
                    }}
                    className='w-full h-full rounded-xl'
                    onInit={handleSwiperInit}
                    onSlideChange={handleSlideChange}
                >
                    {error && !isLoading &&
                        <SwiperSlide>
                            <div className="w-full h-full flex justify-center items-center slideDiv">
                                데이터를 불러오는데 에러가 발생했습니다🚫
                            </div>
                        </SwiperSlide>
                    }
                    {isLoading &&
                        <SwiperSlide>
                            <div className="w-full h-full flex justify-center items-center slideDiv">
                                데이터를 불러오는 중...💻
                            </div>
                        </SwiperSlide>
                    }
                    {ourMemories.length === 0 && !isLoading && !error &&
                        <SwiperSlide>
                            <div className="w-full h-full flex justify-center items-center slideDiv">
                                등록된 추억이 없어요🥲
                            </div>
                        </SwiperSlide>
                    }
                    {ourMemories.length > 0 && !isLoading &&
                        ourMemories.map((i, index) => {
                            if (!i.video) {
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
                                            <div className="absolute right-2 top-1 locationBtn">
                                                <button title="수정" onClick={() => getMemoryInfo(i.id)}>
                                                    <FontAwesomeIcon icon={faEllipsis} className="text-xl" style={{ color: "#FFB6C1" }} />
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
                                                poster={i.image}
                                            ></video>
                                            <div className="absolute left-2 top-0 locationBtn">
                                                <button title="위치보기" onClick={() => { handleShowMap(true); handleMapCenter(i.center, i.alt, i.date); }}>
                                                    <img src={mapIcon} alt='위치' />
                                                </button>
                                            </div>
                                            <div className="absolute right-2 top-1 locationBtn">
                                                <button title="수정" onClick={() => getMemoryInfo(i.id)}>
                                                    <FontAwesomeIcon icon={faEllipsis} className="text-xl" style={{ color: "#FFB6C1" }} />
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
                        icon={<SpeedDialIcon className="flex items-center justify-center" />}
                        className="absolute bottom-1 -right-1"
                        sx={{
                            "& button": { width: "36px", height: "36px" },
                        }}
                        direction="up"
                        FabProps={{ style: { backgroundColor: "#FFB6C1" } }}
                    >
                        <SpeedDialAction key="earth" icon={<img src={earthIcon} alt='추억들' />} tooltipTitle="추억들" onClick={() => showMapPage()} />
                        <SpeedDialAction key="gallery" icon={<img src={filmIcon} alt='갤러리' />} tooltipTitle="갤러리" onClick={() => showGalleryPage()} />
                        <SpeedDialAction key="addMemory" icon={<img src={plusIcon} alt='추가' />} tooltipTitle="추가" onClick={() => setAddDialog(true)} />
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
                    <div className="p-3 rounded flex flex-col justify-center items-center text-center" style={{ height: '300px', width: '100%' }}>
                        {mapPopup && mapPopup.split('<br />').map((line, index) => {
                            return (
                                <div className="w-full" key={line}>
                                    {line}
                                    <br />
                                </div>
                            );
                        })}
                        위치 정보가 없습니다🥲
                    </div>
                }
            </Drawer>
        </>
    );
}

export default Slider;