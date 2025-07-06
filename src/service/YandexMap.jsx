import React, { useEffect, useRef } from "react";

const YandexMap = ({ onAddressSelect, initialCoords }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const ymapsRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const initMap = () => {
            if (!window.ymaps) {
                console.error("Yandex Maps API not loaded");
                return;
            }

            if (mapInstanceRef.current) return;

            window.ymaps.ready(() => {
                ymapsRef.current = window.ymaps;

                const defaultCoords = [41.3111, 69.2797];
                const coords = (
                    initialCoords &&
                    Array.isArray(initialCoords) &&
                    initialCoords[0] &&
                    initialCoords[1]
                ) ? initialCoords : defaultCoords;

                const map = new ymapsRef.current.Map(mapRef.current, {
                    center: coords,
                    zoom: 12,
                    controls: ["zoomControl"],
                }, {
                    suppressMapOpenBlock: true,
                });

                const marker = new ymapsRef.current.Placemark(coords, {}, {
                    draggable: true,
                    preset: "islands#icon",
                    iconColor: "#ff0000"
                });

                map.geoObjects.add(marker);
                markerRef.current = marker;
                mapInstanceRef.current = map;

                const handleCoordsChange = async (coords) => {
                    marker.geometry.setCoordinates(coords);

                    try {
                        const res = await ymapsRef.current.geocode(coords);
                        const firstGeoObject = res.geoObjects.get(0);
                        const address = firstGeoObject?.getAddressLine() || "Manzil topilmadi";

                        onAddressSelect?.({ lat: coords[0], lng: coords[1], address });
                    } catch (err) {
                        console.error("Geocode error:", err);
                    }
                };

                marker.events.add("dragend", () => {
                    const coords = marker.geometry.getCoordinates();
                    void handleCoordsChange(coords);
                });

                map.events.add("click", (e) => {
                    const coords = e.get("coords");
                    void handleCoordsChange(coords);
                });

                void handleCoordsChange(coords);
            });
        };

        initMap();
    }, [initialCoords, onAddressSelect]);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "300px", borderRadius: "12px", marginTop: "12px" }}
        />
    );
};

export default YandexMap;
