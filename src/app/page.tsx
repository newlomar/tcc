"use client";
import { useEffect, useState } from "react";

export default function BluetoothComponent() {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure Web Bluetooth API only runs in the browser
    if (typeof window !== "undefined" && navigator.bluetooth) {
      console.log("Web Bluetooth is supported");
    } else {
      console.error(
        "Web Bluetooth is not supported in this browser or environment."
      );
    }
  }, []);

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      setDevice(device);
      console.log(`Device Name: ${device.name}`);

      const server = await device.gatt?.connect();
      if (server) {
        console.log("Connected to GATT server");
        setIsConnected(true);
      }
    } catch (err) {
      console.error("Error connecting to Bluetooth device:", err);
      setError((err as Error).message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <h1>Bluetooth Device Connection</h1>
      {device ? (
        <p>Connected to: {device.name}</p>
      ) : (
        <p>No Bluetooth device connected.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isConnected ? (
        <p>Device is connected</p>
      ) : (
        <button
          style={{ background: "red", padding: "20px" }}
          onClick={connectToDevice}
        >
          Connect to Bluetooth Device
        </button>
      )}
    </div>
  );
}
