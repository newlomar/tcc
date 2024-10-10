"use client";
import { useEffect, useState } from "react";

export default function ConnectBluetoothComponent() {
  const [device, setDevice] = useState<HIDDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure Web Bluetooth API is being used on browser and is supported by the browser
    if (typeof window !== "undefined" && navigator.hid) {
      console.log("Web HID is supported");
    } else {
      console.error("Web HID is not supported in this browser or environment");
    }
  }, []);

  const connectToDevice = async () => {
    try {
      const requestDevice = await navigator.hid.requestDevice({
        filters: [],
      });

      if (!requestDevice[0]) {
        throw new Error("No Device 1");
      }

      setDevice(requestDevice[0]);

      if (!device) {
        throw new Error("No Device 2");
      }

      setIsConnected(true);
      alert(`Device Name: ${device.productName}`);

      device.addEventListener("inputreport", handleButtonPress);
    } catch (err) {
      console.error("Error connecting to HID device: ", err);
      setError((err as Error).message);
    }
  };

  const disconnectToDevice = async () => {
    try {
      if (device && isConnected) {
        device.close();
        setDevice(null);
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Error trying to diconnect to HID device: ", err);
      setError((err as Error).message);
    }
  };

  const handleButtonPress = (event: HIDInputReportEvent) => {
    const { data } = event;

    const value = data.getUint8(0);

    if (value === 0) {
      alert("value === 0");
      return;
    }

    alert(`Botão pressionado: ${value}`);
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
        <p>Connected to: {device.productName}</p>
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
      {isConnected ? (
        <button
          style={{ background: "blue", padding: "20px" }}
          onClick={disconnectToDevice}
        >
          Disconnect from Bluetooth Device
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
