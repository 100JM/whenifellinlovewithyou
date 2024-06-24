import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LeafletMaps = ({ mapCenter, mapPopup }) => {
    const formatAltText = (text) => {
        return text.split('<br />').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    const popupText = formatAltText(mapPopup);

    return (
        <div className="p-3 rounded" style={{ height: '300px', width: '100%' }}>
            <MapContainer center={mapCenter} zoom={17} style={{ height: '100%', width: '100%' }} attributionControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    lang="ko"
                />
                <Marker
                    position={mapCenter}
                    eventHandlers={{
                        add: (e) => {
                            e.target.openPopup();
                        }
                    }}
                >
                    <Popup>
                        <div className="text-center font-sans">
                            {popupText}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LeafletMaps;