import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import useShowComponentStore from '../store/show';

import L from 'leaflet';
import calendarIcon from '../assets/calendar-32x32.png';

const CustomButtonControl = () => {
    const map = useMap();
    const currentMaker = useRef(null);
    const {mapPage, setMapPage, setGalleryPage} = useShowComponentStore();

    const hideMapPage = () => {
        setGalleryPage(false);
        setMapPage(false);
    };

    useEffect(() => {
        const customControl = L.control({ position: 'bottomleft' });
        const myLocation = L.control({ position : 'bottomright' });

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
                hideMapPage();
            });

            return div;
        };

        myLocation.onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            const button = L.DomUtil.create('a', 'custom-button', div);

            button.innerHTML = `
                <svg style="width: 100%; height: 100%; color: #3788d8;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair" viewBox="0 0 16 16">
                    <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                </svg>
            `;
            button.style.padding = '5px';
            button.href = '#';

            L.DomEvent.on(button, 'click', function (e) {
                L.DomEvent.stopPropagation(e);
                L.DomEvent.preventDefault(e);
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 15);
                    
                    if (currentMaker.current) {
                        map.removeLayer(currentMaker.current);
                    }

                    const myLocationMarker = L.marker([latitude, longitude]).addTo(map);
                    currentMaker.current = myLocationMarker;
                },
                () => {
                    alert("위치를 가져올 수 없습니다.");
                });
            });

            return div;
        };

        customControl.addTo(map);
        myLocation.addTo(map);

        return () => {
            map.removeControl(customControl);
            map.removeControl(myLocation);
        };
    }, [map, mapPage]);

    return null;
};

export default CustomButtonControl;