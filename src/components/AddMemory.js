import { useRef } from 'react';

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
    const memoriesRef = useRef({});

    const setMemoriesValue = (name, value) => {
        memoriesRef.current[name] = value;

        console.log(memoriesRef.current);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={() => handleShowDialog(false)}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogContent style={{minHeight: "400px", maxHeight: "875px"}}>
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
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                        <MapContainer center={[37.545385, 126.985589]} zoom={10} style={{ height: '100%', width: '100%', borderRadius: "4px" }} attributionControl={false}>
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemory;