if (typeof global === 'undefined') {
    window.global = window;
}

import React, { useEffect } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';

const WebSocketOrderStatus = ({ orderId, onStatusChange }) => {
    useEffect(() => {
        window.global = window;
        let socket;
        try {
            socket = new SockJS('https://monouzbbackend.onrender.com/ws');
        } catch (err) {
            console.error(err);
            return;
        }

        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("🟢 Connected to WebSocket");
                client.subscribe(`/topic/order-status/${orderId}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("📦 Status updated:", data);
                    if (onStatusChange) {
                        onStatusChange(data); // call parent callback
                    }
                });
            },
            debug: (str) => console.log('[STOMP]', str),
            onStompError: (frame) => {
                console.error("🔴 STOMP Error", frame);
            },
        });

        client.activate();

        return () => {
            void client.deactivate();
        };
    }, [orderId]);

    return null;
};

export default WebSocketOrderStatus;
