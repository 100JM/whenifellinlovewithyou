import { Map, MapMarker, ZoomControl, useKakaoLoader } from 'react-kakao-maps-sdk'

const KaKaoMap = ({searchPosition}) => {
    const { loading, error } = useKakaoLoader({
        appkey: process.env.REACT_APP_KAKAO_MAP_API_KEY,
        libraries: ['services'],
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;    

    return (
        <Map
            center={{ lat: searchPosition.center[0], lng: searchPosition.center[1] }}
            style={{ height: "100%", width: "100%" }}
            level={searchPosition.zoom}
        >
            <MapMarker position={{ lat: searchPosition.center[0], lng: searchPosition.center[1] }} />
            <ZoomControl position={'TOPLEFT'} />
        </Map>
    );
};

export default KaKaoMap;