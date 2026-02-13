import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import type { Vehicle } from '../types/vehicle'


delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

function MapBounds({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap()

  useEffect(() => {
    if (!vehicles?.length) return

    const points = vehicles
      .filter(v => v.latitude != null && v.longitude != null)
      .map(v => [Number(v.latitude), Number(v.longitude)] as [number, number])

    if (!points.length) return

    map.fitBounds(points, { padding: [40, 40] })
  }, [vehicles, map])

  return null
}

export default function VehiclesMap({ vehicles }: { vehicles: Vehicle[] }) {
  const defaultCenter: [number, number] = [55.75, 37.62] 

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapBounds vehicles={vehicles} />

      {vehicles
        .filter(v => v.latitude != null && v.longitude != null)
        .map(vehicle => (
          <Marker
            key={vehicle.id}
            position={[Number(vehicle.latitude), Number(vehicle.longitude)]}
          >
            <Popup>
              <strong>{vehicle.name}</strong> {vehicle.model}
              <br />
              Год: {vehicle.year}
              <br />
              Цена: ${Number(vehicle.price).toLocaleString('ru-RU')}
              <br />
              Цвет: {vehicle.color}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}