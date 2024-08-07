import { useCallback } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

import L from 'leaflet';

// Leaflet 기본 마커 아이콘 설정
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
});

const MapMarker = ({ position, icon, alt }) => {
    const map = useMap();

    const handleMarkerClick = useCallback(() => {
        map.setView(position, 19);
    }, [map, position]);

    return (
        <Marker
            position={position}
            icon={icon || defaultIcon}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            <Popup>
                <div className="text-center font-sans">
                    {alt.split('<br />').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </div>
            </Popup>
        </Marker>
    );
};

export default MapMarker;