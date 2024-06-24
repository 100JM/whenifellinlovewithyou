import { useCallback } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

const MapMarker = ({ position, icon, alt }) => {
    const map = useMap();

    const handleMarkerClick = useCallback(() => {
        map.setView(position, 19);
    }, [map, position]);

    return (
        <Marker
            position={position}
            icon={icon}
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