import { useMap } from 'react-leaflet';

function ChangeView({ searchPosition }) {
    const map = useMap();
    map.setView(searchPosition.center);
    map.setZoom(searchPosition.zoom);
    return null;
}

export default ChangeView;