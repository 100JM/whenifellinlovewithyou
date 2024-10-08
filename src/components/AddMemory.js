import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { addDocumentWithImage, addDocumentWithVideo, updateDocument } from '../firestore';
import { resizeImage } from '../getCroppedImg';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import useShowComponentStore from '../store/show';
import useMemories from '../store/memory';

import ChangeView from './ChangeView';
import KaKaoMap from './KaKaoMap';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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

const AddMemory = () => {
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
    const [thumbnail, setThumbnail] = useState(null);
    const [replacedAlt, setReplacedAlt] = useState('');
    const [locationName, setLocationName] = useState('');
    const [isRemoveLocation, setIsRemoveLocation] = useState(false);

    const memoriesRef = useRef({});
    const fileInputRef = useRef();
    const passwordInputRef = useRef();
    const addrSearchBtnRef = useRef();
    const addrSearchInputRef = useRef();
    const cropperRef = useRef(null);

    const {addDialog, setAddDialog, setUploadingState} = useShowComponentStore();
    const {selectedOurMemory, setSelectedOurMemory} = useMemories();

    dayjs.extend(customParseFormat);

    useEffect(() => {
        if(selectedOurMemory.id) {
            setReplacedAlt(selectedOurMemory.alt.replace(/<br \/>/g, '\n'));
            setLocationName(selectedOurMemory.locationName);
        }
    }, [selectedOurMemory.id]);

    const closeDialog = () => {
        // handleShowDialog(false);
        setAddDialog(false);
        setSelectedOurMemory({});
        setUploadedFile(null);
        setImageSrc(null);
        setThumbnail(null);
        setUploadedFileName('');
        setReplacedAlt('');
        setLocationName('');
        setIsRemoveLocation(false);

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

            if ((e.target.files[0].type).indexOf('video') !== 0) {
                const resizedImg = await resizeImage(e.target.files[0], 1200, 1200, 0.7);
                const imageUrl = URL.createObjectURL(resizedImg);
                setImageSrc(imageUrl);
                handleCropDialog(true);
            } else {
                if(e.target.files[0].size > 10000000) {
                    alert('동영상 파일의 용량이 10MB 초과입니다.🥲');
                    return;
                }else {
                    try {
                        const createdThumnail = await createThumbnail(e.target.files[0]);
                        
                        setThumbnail(createdThumnail);
                        setUploadedFile(e.target.files[0]);
                    } catch (error) {
                        alert('썸네일 생성 중 오류 발생: ', error.message);
                    }
                }
            }
        }
    };
    
    const handleAspectRatioChange = (aspect) => {
        if (cropperRef.current && cropperRef.current.cropper) {
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

    const getVideoDuration = (file) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
    
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            }
    
            video.onerror = function() {
                reject("비디오 메타데이터를 불러오는 데 실패했습니다.");
            }
    
            video.src = URL.createObjectURL(file);
        });
    }

    const createThumbnail = async (file) => {
        const ffmpeg = new FFmpeg({ log: true });
        let thumbnailFile;
        try {
            setUploadingState({isUploading: true, uploadingText: '동영상 읽는 중...'});

            const duration = await getVideoDuration(file);
            const thumbnailTime = Math.ceil(duration / 2);

            // FFmpeg 로드
            console.log('FFmpeg 로드 시작');
            await ffmpeg.load();
            console.log('FFmpeg 로드 완료');
            
            // 입력 파일을 메모리에 쓰기
            console.log('파일 쓰기 시작');
            await ffmpeg.writeFile('input.mp4', await fetchFile(file));
            console.log('파일 쓰기 완료');

            setUploadingState({uploadingText: '썸네일 생성 중...'});

            // 비디오 파일에서 1초 지점의 프레임을 추출하여 썸네일 생성
            console.log('썸네일 생성 시작');
            await ffmpeg.exec(['-i', 'input.mp4', '-ss', `00:00:0${thumbnailTime}`, '-frames:v', '1', 'output.jpeg']);
            console.log('썸네일 생성 완료');

            setUploadingState({uploadingText: '작업 마무리 중...'});

            // 생성된 썸네일 파일 읽기
            console.log('결과 파일 읽기 시작');
            const data = await ffmpeg.readFile('output.jpeg');
            console.log('결과 파일 읽기 완료');
            console.log('data: ', data);
            const uint8Array = new Uint8Array(data);
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });
            console.log('blob: ', blob);

            // 썸네일 파일 생성
            thumbnailFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + "_thumbnail.jpeg", { type: 'image/jpeg' });
            console.log('썸네일 파일 생성 완료');
            
            await ffmpeg.deleteFile('input.mp4'); // 입력 파일 제거
            await ffmpeg.deleteFile('output.jpeg'); // 썸네일 파일 제거
            console.log('파일 제거 완료');

            return thumbnailFile;
        } catch (error) {
            console.error('FFmpeg 실행 중 오류 발생:', error);
            throw error;
        } finally {
            setUploadingState({isUploading: false, uploadingText: ''});
            try {
                ffmpeg.terminate();
                console.log('종료');
            } catch (error) {
                console.error('종료 중 오류 발생:', error);
            }
        }
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
        setLocationName((selected.place_name) ? selected.place_name : (selected.name ? selected.name : selected.display_name));
        handleAddrSearchForm(false);
        setIsRemoveLocation(false);
    };

    const hadnleResetAddr = () => {
        setSelectedAddr();
        setIsRemoveLocation(false);
        
        if(selectedOurMemory.id) {
            setLocationName(selectedOurMemory.locationName);
        }else {
            setLocationName('');
        }
    };

    const handleRemoveLocation = () => {
        setIsRemoveLocation(true);
        setLocationName('');
    };

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
        if (addrSearchInputRef.current) {
            addrSearchInputRef.current.blur();
        }

        if (mapKind === '해외') {
            nominatimSearch();
        } else {
            kakaoSearch();
        }
    };

    async function getAddressFromCoordinates(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
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
            center: selectedAddr ? (selectedAddr.lat ? [Number(selectedAddr.lat), Number(selectedAddr.lon)] : [Number(selectedAddr.y), Number(selectedAddr.x)]) : [],
            locationName: locationName
        }

        setUploadingState({isUploading: true, uploadingText: '업로드 중...'});

        try {
            if(uploadedFile.type.indexOf('video') !== 0) {
                await addDocumentWithImage(data, uploadedFile);
            }else {
                await addDocumentWithVideo(data, uploadedFile, thumbnail);
            }

            alert('새로운 추억이 등록되었습니다🤍');
        } catch (error) {
            console.error("Error adding document:", error);
            alert('오류 발생🥲 남자친구에게 문의하세요');
        } finally {
            setUploadingState({isUploading: false, uploadingText: ''});
            closeDialog();
        }
    };

    const handleUpdateMemory = async () => {
        const uploadPassword = process.env.REACT_APP_PASSWORD;

        if (!passwordInputRef || passwordInputRef.current.value !== uploadPassword) {
            alert('패스워드를 확인해주세요.');
            return;
        }

        const data = {
            date: memoriesRef.current.date.value,
            alt: memoriesRef.current.alt.value.replace(/\n/g, '<br />'),
            center: isRemoveLocation ? [] : selectedOurMemory.id && !selectedAddr ? selectedOurMemory.center : (selectedAddr ? (selectedAddr.lat ? [Number(selectedAddr.lat), Number(selectedAddr.lon)] : [Number(selectedAddr.y), Number(selectedAddr.x)]) : []),
            locationName: locationName
        };

        setUploadingState({isUploading: true, uploadingText: '업데이트 중...'});

        try {
            if(uploadedFile) {
                if(uploadedFile.type.indexOf('video') !== 0) {
                    await updateDocument(selectedOurMemory.id, data, uploadedFile);
                }else {
                    await updateDocument(selectedOurMemory.id, data, thumbnail, uploadedFile);
                }
            }else {
                await updateDocument(selectedOurMemory.id, data);
            }

            alert('추억이 수정되었습니다🤍');
        } catch (error) {
            console.error("Error adding document:", error);
            alert('오류 발생🥲 남자친구에게 문의하세요');
        } finally {
            setUploadingState({isUploading: false, uploadingText: ''});
            closeDialog();
        }
    };

    return (
        <Dialog
            open={addDialog}
            // onClose={closeDialog}
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
                                defaultValue={selectedOurMemory.id ? dayjs(selectedOurMemory.date, 'YYYY년 MM월 DD일') : dayjs(today)}
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
                            <span>📷사진/동영상</span>
                        </div>
                    </div>
                    <div className="w-full h-11 flex border rounded items-center">
                        <input type="file" className="hidden" accept="image/*,video/*" ref={fileInputRef} onChange={(e) => handleUploadedFile(e)} />
                        <div className="w-16 h-full text-center border-r flex items-center justify-center">
                            <button className="w-full h-full" onClick={handleFile}>💾</button>
                        </div>
                        <div className="h-full flex items-center justify-center px-1" style={{ width: "calc(100% - 4rem)" }}>
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {uploadedFile ? uploadedFile.name : (selectedOurMemory.id ? <button className="text-blue-400">등록된 사진/동영상</button> : '업로드된 파일이 없습니다.')}
                            </span>
                        </div>
                    </div>
                    {
                        uploadedFile &&
                        <div>
                            <img className="mt-2 max-w-full h-auto" src={URL.createObjectURL(uploadedFile)} alt="" />
                        </div>
                    }
                    {
                        !uploadedFile && selectedOurMemory.id &&
                        <div>
                            <img className="mt-2 max-w-full h-auto" src={(selectedOurMemory.video ? selectedOurMemory.video : selectedOurMemory.image)} alt="" />
                        </div>
                    }
                    <div className="mt-2">
                        <div>
                            <span>📝코멘트</span>
                        </div>
                    </div>
                    <div className="w-full h-16">
                        <textarea className="w-full h-full px-1 comment" ref={(el) => { memoriesRef.current['alt'] = el }} defaultValue={selectedOurMemory.id ? replacedAlt : ''}/>
                    </div>
                    <div className="mt-2">
                        <span>🗺️위치</span>
                        {selectedOurMemory.id &&
                            <button className="h-full float-right border rounded text-sm px-1 text-gray-500 flex justify-center items-center" onClick={handleRemoveLocation}>
                                <span>위치 삭제🗑️</span>
                            </button>
                        }
                    </div>
                    <div className="border rounded w-full h-11 flex items-center">
                        <button className="w-16 h-full flex justify-center items-center border-r" onClick={hadnleResetAddr}>
                            <FontAwesomeIcon icon={faArrowRotateLeft} />
                        </button>
                        <button className="h-full px-2 text-slate-500 flex justify-end items-center" style={{ width: "calc(100% - 4rem)" }} onClick={() => { handleMapComfirm(true) }}>
                            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                                {(locationName) ? `🚩${locationName}` : '검색🔍'}
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
                            {!selectedOurMemory.id && <button type="button" className="border px-3 py-0.5 rounded" style={{ backgroundColor: "#FFB6C1", borderColor: "#FFB6C1" }} onClick={handleSubmitMemory}>저장</button>}
                            {selectedOurMemory.id && <button type="button" className="border px-3 py-0.5 rounded" style={{ backgroundColor: "#FFB6C1", borderColor: "#FFB6C1" }} onClick={handleUpdateMemory}>수정</button>}
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
                                    style={{ maxHeight: "430px", width: "100%" }}
                                    guides={true}
                                    viewMode={1}
                                    background={false}
                                    data={{ width: '100%' }}
                                    cropBoxMovable={true}
                                    cropBoxResizable={true}
                                />
                            </div>
                            <div className="controls">
                                <div className="w-full h-11 flex justify-around items-center mt-2">
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === null ? 'bg-gray-100' : ''}`} value={null} onClick={(e) => handleAspectRatioChange(e.target.value)}>자유롭게</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 1 ? 'bg-gray-100' : ''}`} value={1 / 1} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>1:1</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 0.75 ? 'bg-gray-100' : ''}`} value={3 / 4} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>3:4</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 1.3333333333333333 ? 'bg-gray-100' : ''}`} value={4 / 3} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>4:3</button>
                                    <button className={`px-1 w-1/5 h-full text-sm ${aspectRatio === 0.65 ? 'bg-gray-100' : ''}`} value={0.65} onClick={(e) => handleAspectRatioChange(Number(e.target.value))}>자동맞춤</button>
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