import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Keyboard } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Location } from '../types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StepLocationProps {
    onSelect: (location: Location) => void;
    currentLocation?: Location;
}

export function StepLocation({ onSelect, currentLocation }: StepLocationProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerInstance = useRef<L.Marker | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isManual, setIsManual] = useState(currentLocation?.isManual || false);
    const [manualAddress, setManualAddress] = useState(currentLocation?.address || '');

    // Initial position
    const defaultCenter = { lat: -23.5505, lng: -46.6333 };
    const initialPos = (currentLocation?.lat && currentLocation?.lng) ? { lat: currentLocation.lat, lng: currentLocation.lng } : defaultCenter;

    // Initialize Map
    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return; // Prevent double init
        if (isManual) return; // Don't init map if in manual mode

        const map = L.map(mapRef.current).setView([initialPos.lat, initialPos.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapInstance.current = map;

        // Function to bind drag event
        const bindDrag = (marker: L.Marker) => {
            marker.on('dragend', (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                onSelect({ lat: position.lat, lng: position.lng, isManual: false });
                setIsManual(false);
            });
            return marker;
        };

        // If we already have a location (and it's not manual), show marker
        if (currentLocation && currentLocation.lat && currentLocation.lng) {
            const marker = L.marker([currentLocation.lat, currentLocation.lng], { draggable: true }).addTo(map);
            bindDrag(marker);
            markerInstance.current = marker;
        }

        // Map Click Handler
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            updateLocation({ lat, lng });
        });

        // Cleanup
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [isManual]);

    const updateLocation = (loc: { lat: number, lng: number }) => {
        if (!mapInstance.current) return;

        // Update Marker
        if (markerInstance.current) {
            markerInstance.current.setLatLng([loc.lat, loc.lng]);
        } else {
            const marker = L.marker([loc.lat, loc.lng], { draggable: true }).addTo(mapInstance.current);
            marker.on('dragend', (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                onSelect({ lat: position.lat, lng: position.lng, isManual: false });
            });
            markerInstance.current = marker;
        }

        // Pan to location
        mapInstance.current.setView([loc.lat, loc.lng], 16);

        // Notify parent
        onSelect({ ...loc, isManual: false });
        setIsManual(false);
    };

    const handleGetLocation = () => {
        setLoading(true);
        setError(null);
        setIsManual(false);

        if (!navigator.geolocation) {
            setError('Geolocalização não é suportada.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                updateLocation(newPos);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError('Erro ao obter localização. Permita o acesso ao GPS.');
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleManualAddressChange = (address: string) => {
        setManualAddress(address);
        onSelect({ address, isManual: true });
    };

    // Auto-fetch location on mount if no location set
    useEffect(() => {
        if (!currentLocation && !markerInstance.current && !isManual) {
            handleGetLocation();
        }
    }, []);

    return (
        <div className="space-y-6 pb-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary font-heading">Sua Localização</h2>
                <p className="text-muted-foreground">Onde devemos entregar seu açaí?</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="relative h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-md">
                        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

                        {!currentLocation?.lat && !loading && !markerInstance.current && (
                            <div className="absolute top-4 left-0 right-0 z-[400] flex justify-center pointer-events-none">
                                <p className="bg-white/90 p-2 rounded-lg text-xs text-gray-600 shadow-md pointer-events-auto">
                                    Toque no mapa ou use o botão abaixo
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleGetLocation}
                        className="w-full gap-2 text-white font-bold h-12 rounded-xl shadow-lg shadow-purple-200"
                        disabled={loading}
                    >
                        {loading ? (
                            "Buscando..."
                        ) : (
                            <>
                                <Navigation size={20} />
                                Usar Minha Localização Atual
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <p className="text-xs text-center text-gray-400">
                Você pode arrastar o pino para ajustar sua localização exata.
            </p>
        </div>
    );
}
