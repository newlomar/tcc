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
      const device = await navigator.hid.requestDevice({
        filters: [],
      });

      alert();

      setDevice(device[0]);
      console.log(`Device Name: ${device.name}`);

      const server = await device.gatt?.connect();

      if (!server) {
        throw new Error("GATT server not found");
      }

      console.log("Connected to GATT server");
      setIsConnected(true);

      const services = await server.getPrimaryServices();
      services.forEach((service) => {
        alert(service.uuid);
      });

      const service = await server.getPrimaryService(
        "00001812-0000-1000-8000-00805f9b34fb"
      );

      if (!service) {
        throw new Error("Error getting service");
      }

      alert(JSON.stringify(service));

      const characteristic = await service.getCharacteristic(
        "00002a4d-0000-1000-8000-00805f9b34fb"
      );

      const batteryLevelBinary = await characteristic.readValue();

      const batteryLevelHumanReadable = batteryLevelBinary.getInt8(0);

      alert(batteryLevelHumanReadable);

      await characteristic.startNotifications();
      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleButtonPress
      );
    } catch (err) {
      console.error("Error connecting to Bluetooth device: ", err);
      setError((err as Error).message);
    }
  };

  const disconnectToDevice = async () => {
    try {
      if (device && isConnected) {
        device.gatt?.disconnect();
        setDevice(null);
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Error trying to diconnect to Bluetooth device: ", err);
      setError((err as Error).message);
    }
  };

  const handleButtonPress = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;

    alert(`Botão pressionado: ${value}`);

    if (value?.getUint8(0)) {
      alert("Click de botão foi ouvido!");
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
