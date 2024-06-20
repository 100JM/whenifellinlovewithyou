import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const GoogleMaps = () => {
    const googleMapApikey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const defaultCenter = {
        lat: 37.7749,
        lng: -122.4194,
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleMapApikey,
        libraries,
    });

    if (!isLoaded) return <div className="text-center">Loading...</div>;
    
    return (
        <GoogleMap mapContainerStyle={{ height: "250px" }} zoom={10} center={defaultCenter}>
            {/* <MarkerF position={mapCenter} /> */}
        </GoogleMap>
    );
}

export default GoogleMaps;