import { useRef, useState } from 'react';
import axios from 'axios';

import ChangeView from './ChangeView';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

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

const AddMemory = ({ isOpen, handleShowDialog }) => {
    const today = new Date().toISOString();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddrSearchForm, setShowAddrSearchForm] = useState(false);
    const [searchPosition, setSearchPosition] = useState([37.545385, 126.985589]);
    const [searchAddrList, setSearchAddrList] = useState([]);
    const [selectedAddr, setSelectedAddr] = useState();
    const [isClick, setIsClick] = useState('');

    const memoriesRef = useRef({});
    const fileInputRef = useRef();
    const addrSearchBtnRef = useRef();

    const closeDialog = () => {
        handleShowDialog(false);
        setUploadedFile(null);
    };

    const setMemoriesValue = (name, value) => {
        memoriesRef.current[name] = value;

        console.log(memoriesRef.current);
    };

    const handleFile = () => {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    };

    const handleUploadedFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFile(e.target.files);
        }
    };

    const handleAddrClick = (key, lat, lon) => {
        setIsClick(key);
        setSearchPosition([lat, lon]);
    };

    const handleSelectAddr = (id) => {
        console.log(id);
        if(!id) {
            alert('주소를 선택해주세요.');
            return;
        }

        const selected = searchAddrList.find((a) => {
            return a.place_id === id;
        })

        setSelectedAddr(selected);
    };

    const handleEnter = (e) => {
        if(e.key === 'Enter' || e.key === 13) {
            addrSearchBtnRef.current.click();
        }
    };

    const handleAddrSearchForm = (isShow) => {
        setSearchAddrList([]);
        setShowAddrSearchForm(isShow);
        setIsClick('');
        //줌설정
        if(!selectedAddr) {
            setSearchPosition([37.545385, 126.985589]);
        }
    };

    const handleSearchQuery = (e) => {
        setSearchQuery(e);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: searchQuery,
                    format: 'json',
                    addressdetails: 1,
                    limit: 10
                }
            });
            // const results = response.data.map((place) => [place.lat, place.lon]);
            if(response.data.length === 0) {
                alert('검색 결과가 없습니다🥲');
            }

            setSearchAddrList(response.data);
        } catch (error) {
            console.error('Error fetching data from Nominatim:', error);
        }
    };
    console.log(selectedAddr);
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
                                onChange={(newValue) => setMemoriesValue('date', dayjs(newValue).format('YYYY-MM-DD'))}
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
                            <span>{uploadedFile && uploadedFile.length > 0 ? uploadedFile[0].name : '업로드된 사진이 없습니다.'}</span>
                        </div>
                    </div>
                    {
                        uploadedFile && uploadedFile.length > 0 &&
                        <div>
                            <img className="mt-2 max-w-full h-auto" src={URL.createObjectURL(uploadedFile[0])} alt="" />
                        </div>
                    }
                    <div className="mt-2">
                        <div>
                            <span>📝코멘트</span>
                        </div>
                    </div>
                    <textarea className="w-full px-1 min-h-16 comment" />
                    <div className="border-b w-full h-11 flex items-center">
                        <button className="w-full h-full flex justify-between items-center" onClick={() => { handleAddrSearchForm(true) }}>
                            <span>🗺️위치</span>
                            <FontAwesomeIcon className="text-gray-400" icon={faAngleRight} />
                        </button>
                        <Drawer
                            open={showAddrSearchForm}
                            onClose={() => { handleAddrSearchForm(false) }}
                            anchor={"bottom"}
                            style={{ zIndex: "9999" }}
                            sx={{ "& .MuiDrawer-paperAnchorBottom": { minHeight: "256px", overflowY: "hidden"} }}
                        >
                            <div className="p-2 w-full h-full">
                                <div className="w-full h-8 flex items-center border rounded">
                                    <input type="text" placeholder="주소 입력" className="h-full px-1 outline-none border-r" style={{ width: "90%" }} onChange={(e) => handleSearchQuery(e.target.value)} onKeyUp={(e) => handleEnter(e)} />
                                    <button className="h-full text-center" style={{ width: "10%" }} onClick={handleSearch} ref={addrSearchBtnRef}>🔍</button>
                                </div>
                                <div className="w-full">
                                    <div style={{ height: '200px', width: '100%', marginTop: "8px" }}>
                                        <MapContainer center={searchPosition} zoom={10} style={{ height: '100%', width: '100%', borderRadius: "4px" }} attributionControl={false}>
                                            <ChangeView center={searchPosition} />
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                lang="ko"
                                            />
                                        </MapContainer>
                                    </div>
                                    <div className="float-end">
                                        <button className="px-4 mt-2 border rounded" onClick={() => handleSelectAddr(isClick)}>저장</button>
                                    </div>
                                </div>
                                {searchAddrList.length > 0 &&
                                    <div className="w-full pt-2 overflow-y-auto" style={{maxHeight: "200px"}}>
                                        {searchAddrList.map((i) => {
                                            return (
                                                <div 
                                                    key={i.place_id}
                                                    className={`w-full overflow-hidden text-ellipsis whitespace-nowrap border-b cursor-pointer hover:bg-gray-100 ${(i.place_id === isClick) ? ' bg-gray-100' : ''}`}
                                                    onClick={() => handleAddrClick(i.place_id, i.lat, i.lon)}
                                                >
                                                    {i.name}
                                                    <br />
                                                    {i.display_name.substring(i.display_name.indexOf(',') + 1).trim()}
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
                            <span>🤫패스워드</span>
                        </div>
                    </div>
                    <div className="w-full h-11 flex items-center">
                        <input type="password" className="w-full h-full border rounded px-1" placeholder="****" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemory;