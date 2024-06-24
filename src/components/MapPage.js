import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import CustomButtonControl from './CustomButtonControl';
import MapMarker from './MapMarker';
import { memories } from './Slider';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPages = ({ handleShowMapPage }) => {
    return (
        <div className="p-3" style={{ height: '100%', width: '100%' }}>
            <MapContainer center={[37.378129052605125, 123.60549110411648]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    language="ko"
                />
                {memories.map((m) => {
                    const customIcon = new L.Icon({
                        iconUrl: m.image,
                        iconSize: [50, 82],
                        iconAnchor: [24, 82],
                        popupAnchor: [2, -68],
                    });
                    
                    return (
                        <MapMarker
                            key={m.alt}
                            position={m.center}
                            icon={customIcon}
                            alt={m.alt}
                        />
                    );
                })}
                <CustomButtonControl handleShowMapPage={handleShowMapPage} />
            </MapContainer>
        </div>
    );
};

export default MapPages;