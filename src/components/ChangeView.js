import { useMap } from 'react-leaflet';

function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    // map.setZoom(16);
    return null;
}

export default ChangeView;