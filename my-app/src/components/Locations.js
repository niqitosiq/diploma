import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from './marker.svg';

function Locations({ users, onMarkerClick }) {
  const customIcon = L.icon({
    // тут можно тестить мемоизацию
    iconUrl: icon,
    iconSize: [30, 30],
  });

  return (
    <div className="locations">
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {users.map((user) => (
          <Marker
            icon={customIcon}
            position={[user.coordinates.lat, user.coordinates.lng]}
            key={user.id}
            eventHandlers={{
              click: (e) => {
                onMarkerClick(user);
              },
            }}
          >
            <Popup>
              {user.name}: {user.address.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Locations;
