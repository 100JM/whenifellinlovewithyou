import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import calendarIcon from '../assets/calendar-32x32.png';

const CustomButtonControl = ({ handleShowMapPage }) => {
    const map = useMap();

    useEffect(() => {
        const customControl = L.control({ position: 'bottomleft' });

        customControl.onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            const button = L.DomUtil.create('a', 'custom-button', div);

            const img = L.DomUtil.create('img', 'custom-button-icon', button);
            img.src = calendarIcon;
            img.alt = 'D-day';

            button.href = '#';

            L.DomEvent.on(button, 'click', function (e) {
                L.DomEvent.stopPropagation(e);
                L.DomEvent.preventDefault(e);
                handleShowMapPage(false);
            });

            return div;
        };

        customControl.addTo(map);

        return () => {
            map.removeControl(customControl);
        };
    }, [map, handleShowMapPage]);

    return null;
};

export default CustomButtonControl;