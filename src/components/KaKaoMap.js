import { Map, MapMarker } from 'react-kakao-maps-sdk'

const KaKaoMap = ({searchPosition}) => {
    return (
        <Map
            center={{ lat: searchPosition.center[0], lng: searchPosition.center[1] }}
            style={{ height: '100%' }}
            level={searchPosition.zoom}
        >
            <MapMarker position={{ lat: searchPosition.center[0], lng: searchPosition.center[1] }} />
        </Map>
    );
};

export default KaKaoMap;