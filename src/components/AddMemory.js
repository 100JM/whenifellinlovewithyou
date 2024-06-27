import { useRef, useState } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import dayjs, { Dayjs } from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const koLocale = dayjs.locale('ko');

const AddMemory = ({ isOpen, handleShowDialog }) => {
    const today = new Date().toISOString();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchPosition, setSearchPosition] = useState([37.545385, 126.985589]);

    const memoriesRef = useRef({});
    const fileInputRef = useRef();

    const closeDialog = () => {
        handleShowDialog(false);
        setUploadedFile(null);
    }

    const setMemoriesValue = (name, value) => {
        memoriesRef.current[name] = value;

        console.log(memoriesRef.current);
    };

    const handleFile = () => {
        fileInputRef.current.click();
    }

    const handleUploadedFile = (e) => {
        setUploadedFile(e);
    }

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
            const results = response.data.map((place) => [place.lat, place.lon]);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data from Nominatim:', error);
        }
    };
    
    return (
        <Dialog
            open={isOpen}
            onClose={closeDialog}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogContent style={{ maxHeight: "875px" }}>
                <div className="w-full h-full">
                    <div>
                        <span>날짜🗓️</span>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale}>
                        <MobileDatePicker
                            format="YYYY-MM-DD"
                            defaultValue={dayjs(today)}
                            inputRef={(el) => { memoriesRef.current['date'] = el }}
                            onChange={(newValue) => setMemoriesValue('date', dayjs(newValue).format('YYYY-MM-DD'))}
                            className="w-full"
                        />
                    </LocalizationProvider>
                    <div className="mt-2">
                        <span>위치🗺️</span>
                        <span className="float-end">
                            <button onClick={handleSearch}>검색🔍</button>
                        </span>
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                        <MapContainer center={searchPosition} zoom={10} style={{ height: '100%', width: '100%', borderRadius: "4px" }} attributionControl={false}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                lang="ko"
                            />
                        </MapContainer>
                    </div>
                    <div className="mt-2">
                        <div>
                            <span>코멘트📝</span>
                        </div>
                        <textarea placeholder="" className="w-full px-1 min-h-20 comment" />
                    </div>
                    <div className="mt-2">
                        <div>
                            <span>사진📷</span>
                        </div>
                        <div className="w-full flex border rounded">
                            <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={(e) => handleUploadedFile(e.target.files)}/>
                            <div className="w-16 text-center border-r">
                                <button onClick={handleFile}>💾</button>
                            </div>
                            <div className="text-center overflow-hidden text-ellipsis whitespace-nowrap px-1" style={{width: "calc(100% - 4rem)"}}>
                                <span>{uploadedFile ? uploadedFile[0].name : '업로드된 사진이 없습니다.'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemory;