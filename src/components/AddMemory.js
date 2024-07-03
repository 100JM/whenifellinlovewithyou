import { useRef, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { addDocumentWithImage } from '../firestore';
import { getCroppedImg, resizeImage } from '../getCroppedImg';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import ChangeView from './ChangeView';
import KaKaoMap from './KaKaoMap';

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

import dayjs, { Dayjs } from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import 'dayjs/locale/ko';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const koLocale = dayjs.locale('ko');

const theme = createTheme({
    typography: {
        fontFamily: 'Jua', // 원하는 폰트로 설정
    },
});

function MapEvents({ onClick }) {
    useMapEvents({
        click: (e) => {
            onClick(e);
        },
    });
    return null;
};

const AddMemory = ({ isOpen, handleShowDialog, handleUploadingBar }) => {
    const today = new Date().toISOString();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [showAddrSearchForm, setShowAddrSearchForm] = useState(false);
    const [searchPosition, setSearchPosition] = useState({
        center: [37.545385, 126.985589],
        zoom: 10
    });
    const [searchAddrList, setSearchAddrList] = useState([]);
    const [selectedAddr, setSelectedAddr] = useState();
    const [isClick, setIsClick] = useState('');
    const [showMapConfirm, setShowMapConfirm] = useState(false);
    const [mapKind, setMapKind] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(null);

    const memoriesRef = useRef({});
    const fileInputRef = useRef();
    const passwordInputRef = useRef();
    const addrSearchBtnRef = useRef();
    const addrSearchInputRef = useRef();
    const cropperRef = useRef(null);

    const closeDialog = () => {
        handleShowDialog(false);
        setUploadedFile(null);
        setImageSrc(null);
        setUploadedFileName('');

        setSearchAddrList([]);
        setIsClick('');
        setSelectedAddr();

        setSearchPosition((prev) => {
            return {
                ...prev,
                center: [37.545385, 126.985589],
                zoom: 10
            }
        });
    };

    const handleFile = () => {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    };

    const handleUploadedFile = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFileName(e.target.files[0].name);
            const resizedImg = await resizeImage(e.target.files[0], 1200, 1200, 0.7);
            const imageUrl = URL.createObjectURL(resizedImg);
            setImageSrc(imageUrl);
            handleCropDialog(true);

        }
    };

    const handleAspectRatioChange = (aspect) => {
        if(cropperRef.current && cropperRef.current.cropper) {
            cropperRef.current.cropper.setAspectRatio(aspect);
            setAspectRatio((!aspect ? null : aspect));
        }    
    };
    
    const onCompleteCropImg = async () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            cropperRef.current.cropper.getCroppedCanvas().toBlob(async (blob) => {
                if (!blob) return;
            
                const croppedImageFile = new File([blob], uploadedFileName, { type: blob.type });
                setUploadedFile(croppedImageFile);
            }, 'image/jpeg');
        }

        setShowCrop(false);
    };

    const handleMapComfirm = (isShow) => {
        setShowMapConfirm(isShow);
    };

    const handleCropDialog = (isShow) => {
        setAspectRatio(null);
        setShowCrop(isShow);
    };

    const handleMapkind = (value) => {
        setMapKind(value);
        handleMapComfirm(false);
        handleAddrSearchForm(true);
    };

    const handleAddrClick = (key, lat, lon) => {
        setIsClick(key);
        setSearchPosition((prev) => {
            return {
                ...prev,
                center: [lat, lon],
                zoom: (mapKind === '해외' ? 16 : 4)
            }
        });
    };

    const handleSelectAddr = (id) => {
        if (!id) {
            alert('주소를 선택해주세요.');
            return;
        }

        const selected = searchAddrList.find((a) => {
            if (mapKind === '해외') {
                return a.place_id === id;
            } else {
                return a.id === id;
            }
        });

        setSelectedAddr(selected);
        handleAddrSearchForm(false);
    };

    const hadnleResetAddr = () => {
        setSelectedAddr();
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter' || e.key === 13) {
            addrSearchBtnRef.current.click();
        }
    };

    const handleAddrSearchForm = (isShow) => {
        setSearchAddrList([]);
        setShowAddrSearchForm(isShow);
        setIsClick('');

        setSearchPosition((prev) => {
            return {
                ...prev,
                center: [37.545385, 126.985589],
                zoom: 10
            }
        });
    };

    const handleSearch = () => {
        if (mapKind === '해외') {
            nominatimSearch();
        } else {
            kakaoSearch();
        }
    }

    async function getAddressFromCoordinates(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data; // 또는 data.address 객체를 사용하여 더 상세한 주소 정보를 얻을 수 있습니다.
        } catch (error) {
            console.error("주소 검색 중 오류 발생:", error);
            return null;
        }
    };

    const handleLeafletMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        setIsClick();
        setSearchPosition((prev) => {
            return {
                ...prev,
                center: [lat, lng],
                zoom: (mapKind === '해외' ? 16 : 4)
            }
        });

        const foundAddress = await getAddressFromCoordinates(lat, lng);

        if (foundAddress) {
            setIsClick(foundAddress.place_id);
            setSearchAddrList([foundAddress]);
        } else {
            alert('위치 정보를 가져오지 못했어요🥲');
        }
    };

    const nominatimSearch = async () => {
        setIsLoading(true);
        setSearchAddrList([]);

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: addrSearchInputRef.current.value,
                    format: 'json',
                    addressdetails: 1,
                    limit: 10
                }
            });

            if (response.data.length === 0) {
                alert('검색 결과가 없습니다🥲');
                return;
            }

            setSearchAddrList(response.data);
        } catch (error) {
            console.error('Error fetching data from Nominatim:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const kakaoSearch = async () => {
        setIsLoading(true);
        setSearchAddrList([]);

        try {
            const keywordResponse = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
                params: {
                    query: addrSearchInputRef.current.value,
                },
                headers: {
                    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
                },
            });

            if (keywordResponse.data.documents.length === 0) {
                alert('검색 결과가 없습니다🥲');
                return;
            }

            const keywordResult = keywordResponse.data.documents;

            setSearchAddrList(keywordResult);
        } catch (error) {
            console.error('Error fetching data from Kakao API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitMemory = async () => {
        const uploadPassword = process.env.REACT_APP_PASSWORD;

        if (!uploadedFile) {
            alert('사진을 등록해주세요.');
            return;
        }

        if (!passwordInputRef || passwordInputRef.current.value !== uploadPassword) {
            alert('패스워드를 확인해주세요.');
            return;
        }

        const data = {
            date: memoriesRef.current.date.value,
            alt: memoriesRef.current.alt.value.replace(/\n/g, '<br />'),
            center: selectedAddr ? (selectedAddr.lat ? [Number(selectedAddr.lat), Number(selectedAddr.lon)] : [Number(selectedAddr.y), Number(selectedAddr.x)]) : []
        }

        handleUploadingBar(true);

        try {
            await addDocumentWithImage(data, uploadedFile);
            alert('새로운 추억이 등록되었습니다🤍');
        } catch (error) {
            console.error("Error adding document:", error);
            alert('오류 발생🥲 남자친구에게 문의하세요');
        } finally {
            handleUploadingBar(false);
            closeDialog();
        }
    };
    
    return (
        <Dialog
            open={isOpen}
            onClose={closeDialog}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogContent style={{ maxHeight: "875px", padding: "16px 20px" }}>
                <div className="w-full h-full">
                    <div>
                        <span>🗓️날짜</span>
                    </div>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale} locale={koLocale}>
                            <MobileDatePicker
                                format="YYYY년 MM월 DD일"
                                dayOfWeekFormatter={(day) => ['일', '월', '화', '수', '목', '금', '토'][day]}
                                defaultValue={dayjs(today)}
                                inputRef={(el) => { memoriesRef.current['date'] = el }}
                                // onChange={(newValue) => setMemoriesValue('date', dayjs(newValue).format('YYYY-MM-DD'))}
                                className="w-full"
                                sx={{
                                    "& .MuiInputBase-input": { fontFamily: "Jua" },
                                    "& .MuiOutlinedInput-root": { height: "42px" }
                                }}
                            />
                        </LocalizationProvider>
                    </ThemeProvider>
                    <div className="mt-2">
                        <div>
                            <span>📷사진</span>
                        </div>
                    </div>
                    <div className="w-full h-11 flex border rounded items-center">
                        <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={(e) => handleUploadedFile(e)} />
                        <div className="w-16 h-full text-center border-r flex items-center justify-center">
                            <button className="w-full h-full" onClick={handleFile}>💾</button>
                        </div>
                        <div className="h-full flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap px-1" style={{ width: "calc(100% - 4rem)" }}>
                            <span>{uploadedFile ? uploadedFile.name : '업로드된 사진이 없습니다.'}</span>
                        </div>
                    </div>
                    {
                        uploadedFile &&
                        <div>
                            <img className="mt-2 max-w-full h-auto" src={URL.createObjectURL(uploadedFile)} alt="" />
                        </div>
                    }
                    <div className="mt-2">
                        <div>
                            <span>📝코멘트</span>
                        </div>
                    </div>
                    <div className="w-full h-16">
                        <textarea className="w-full h-full px-1 comment" ref={(el) => { memoriesRef.current['alt'] = el }} />
                    </div>
                    <div className="mt-2">
                        <span>🗺️위치</span>
                    </div>
                    <div className="border rounded w-full h-11 flex items-center">
                        <button className="w-16 h-full flex justify-center items-center border-r" onClick={hadnleResetAddr}>
                            <FontAwesomeIcon icon={faArrowRotateLeft} />
                        </button>
                        <button className="h-full px-2 text-slate-500 flex justify-end items-center" style={{ width: "calc(100% - 4rem)" }} onClick={() => { handleMapComfirm(true) }}>
                            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                                {(selectedAddr) ? ((selectedAddr.place_name) ? `🚩${selectedAddr.place_name}` : `🚩${(selectedAddr.name ? selectedAddr.name : selectedAddr.display_name)}`) : '검색🔍'}
                            </span>
                        </button>
                        <Drawer
                            open={showAddrSearchForm}
                            onClose={() => { handleAddrSearchForm(false) }}
                            anchor={"bottom"}
                            style={{ zIndex: "9999" }}
                            sx={{ "& .MuiDrawer-paperAnchorBottom": { minHeight: "256px", overflowY: "hidden" } }}
                        >
                            <div className="p-2 w-full h-full">
                                <div className="w-full h-8 flex items-center border rounded">
                                    <input type="text" placeholder="주소 입력" className="h-full px-1 outline-none border-r" style={{ width: "90%" }} ref={addrSearchInputRef} onKeyUp={(e) => handleEnter(e)} />
                                    <button className="h-full text-center" style={{ width: "10%" }} onClick={handleSearch} ref={addrSearchBtnRef}>🔍</button>
                                </div>
                                <div className="w-full">
                                    <div style={{ height: '200px', width: '100%', marginTop: "8px" }}>
                                        {mapKind === '해외' &&
                                            <MapContainer center={searchPosition.center} zoom={searchPosition.zoom} style={{ height: '100%', width: '100%', borderRadius: "4px" }} attributionControl={false} >
                                                <ChangeView searchPosition={searchPosition} />
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    lang="ko"
                                                />
                                                <Marker position={searchPosition.center}></Marker>
                                                <MapEvents onClick={handleLeafletMapClick} />
                                            </MapContainer>
                                        }
                                        {mapKind === '국내' &&
                                            <KaKaoMap searchPosition={searchPosition} />
                                        }
                                    </div>
                                    <div className="float-end">
                                        <button className="px-4 mt-2 border rounded" onClick={() => handleSelectAddr(isClick)}>저장</button>
                                    </div>
                                </div>
                                {isLoading && <div className="w-full pt-2 overflow-y-auto text-center">검색중...</div>}
                                {searchAddrList.length > 0 &&
                                    <div className="w-full pt-2 overflow-y-auto" style={{ maxHeight: "200px" }}>
                                        {searchAddrList.map((i) => {
                                            return (
                                                mapKind === '해외' ?
                                                    <div
                                                        key={i.place_id}
                                                        className={`w-full border-b cursor-pointer hover:bg-gray-100 ${(i.place_id === isClick) ? ' bg-gray-100' : ''}`}
                                                        onClick={() => handleAddrClick(i.place_id, i.lat, i.lon)}
                                                    >
                                                        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{(i.name ? i.name : '-')}</div>
                                                        <div className="text-slate-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">{i.display_name.substring(i.display_name.indexOf(',') + 1).trim()}</div>
                                                    </div>
                                                    :
                                                    <div
                                                        key={i.id}
                                                        className={`w-full border-b cursor-pointer hover:bg-gray-100 ${(i.id === isClick) ? ' bg-gray-100' : ''}`}
                                                        onClick={() => handleAddrClick(i.id, i.y, i.x)}
                                                    >
                                                        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{i.place_name}</div>
                                                        <div className="text-slate-500 w-full overflow-hidden text-ellipsis whitespace-nowrap">{i.address_name}</div>
                                                    </div>
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                        </Drawer>
                    </div>
                    <div className="mt-2">
                        <div>
                            <span>🔒패스워드</span>
                        </div>
                    </div>
                    <div className="w-full h-11 flex items-center">
                        <input type="password" className="w-full h-full border rounded px-1" placeholder="****" ref={passwordInputRef} />
                    </div>
                    <div className="mt-2">
                        <div className="w-full h-11 flex justify-end items-center">
                            <button type="button" className="border px-3 py-0.5 rounded bg-gray-300 border-gray-300 mr-2" onClick={closeDialog}>취소</button>
                            <button type="button" className="border px-3 py-0.5 rounded" style={{ backgroundColor: "#FFB6C1", borderColor: "#FFB6C1" }} onClick={handleSubmitMemory}>저장</button>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <Dialog
                open={showMapConfirm}
                onClose={() => handleMapComfirm(false)}
                maxWidth="xs"
                fullWidth={true}
            >
                <DialogContent style={{ padding: "10px" }}>
                    <div className="w-full h-full">
                        <div className="w-full h-11 flex justify-around items-center border rounded">
                            <button className="w-1/2 h-full border-r" onClick={() => handleMapkind('국내')}>🚌국내</button>
                            <button className="w-1/2 h-full" onClick={() => handleMapkind('해외')}>🛫해외</button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={showCrop}
                // onClose={() => handleCropDialog(false)}
                maxWidth="xs"
                fullWidth={true}
            >
                <DialogContent style={{ padding: "10px", height: "auto" }}>
                    {imageSrc && (
                        <div className="w-full h-full">
                            <div className="crop-container">
                                <Cropper
                                    ref={cropperRef}
                                    src={imageSrc}
                                    aspectRatio={aspectRatio}
                                    style={{ height: '100%', width: '100%' }}
                                    guides={false}
                                    viewMode={1} // 크롭 영역이 이미지를 벗어나지 않게
                                    background={false}
                                    data={{ width: '100%' }}
                                />
                            </div>
                            <div className="controls">
                                <div className="w-full h-11 flex justify-around items-center mt-2">
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === null ? 'bg-gray-100' : ''}`} value={null} onClick={(e) => handleAspectRatioChange(e.target.value)}>자유롭게</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 1 ? 'bg-gray-100' : ''}`} value={1/1} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>1:1</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 0.75 ? 'bg-gray-100' : ''}`} value={3/4} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>3:4</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 1.3333333333333333 ? 'bg-gray-100' : ''}`} value={4/3} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>4:3</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 0.7024 ? 'bg-gray-100' : ''}`} value={0.7024} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>자동맞춤</button>
                                </div>
                                <div className="w-full h-11 flex justify-end items-center mt-2">
                                    <button type="button" className="border px-3 py-0.5 rounded bg-gray-300 border-gray-300 mr-2" onClick={() => handleCropDialog(false)}>취소</button>
                                    <button type="button" className="border px-3 py-0.5 rounded" style={{ backgroundColor: "#FFB6C1", borderColor: "#FFB6C1" }} onClick={onCompleteCropImg}>적용</button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};

export default AddMemory;