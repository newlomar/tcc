/* eslint-disable no-bitwise */
import { useMemo, useState, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { VolumeManager } from "react-native-volume-manager";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

const DATA_SERVICE_UUID = "00001812-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_UUID = "00002a4d-0000-1000-8000-00805f9b34fb";

// const DATA_SERVICE_UUID = "0000180f-0000-1000-8000-00805f9b34fb";
// const CHARACTERISTIC_UUID = "00002a19-0000-1000-8000-00805f9b34fb";

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [counter, setCounter] = useState<number>(0);
  const [message, setMessage] = useState("default message");

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.warn(JSON.stringify(error));
      alert(error.reason);
      return;
    } else if (!characteristic?.value) {
      console.warn("No Data was received");
      return;
    }
    console.warn("click");
    const clickCode = base64.decode(characteristic.value);
    console.warn(clickCode);
    setCounter(counter + 1);
    setMessage(`${clickCode} - counter: ${counter}`);
  };

  const startStreamingData = async (characteristic: Characteristic) => {
    if (characteristic) {
      characteristic.monitor(onDataUpdate);
    } else {
      console.warn("No Device Connected");
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);

      setConnectedDevice(deviceConnection);

      if (!connectedDevice) {
        return;
      }

      console.warn(connectedDevice);

      await connectedDevice.discoverAllServicesAndCharacteristics();
      await connectedDevice.services();
      bleManager.stopDeviceScan();

      const services = await connectedDevice.services();
      const hidService = services.find((service) => {
        return service.uuid === "00001812-0000-1000-8000-00805f9b34fb";
      });

      if (!hidService) {
        console.warn(
          `No service with UUID "00001812-0000-1000-8000-00805f9b34fb" was found`
        );
        return;
      }

      const characteristics = await hidService.characteristics();
      const hidCharacteristic = characteristics.find((characteristic) => {
        return characteristic.uuid === "00002a4d-0000-1000-8000-00805f9b34fb";
      });

      if (!hidCharacteristic) {
        console.warn("No characteristic with this uuid!");
        return;
      }
      console.warn(hidCharacteristic);
      startStreamingData(hidCharacteristic);
    } catch (e) {
      console.warn("FAILED TO CONNECT", e);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn(error);
      }
      if (
        device &&
        (device.localName === "AB Shutter3" || device.name === "AB Shutter3")
      ) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const ABShutterListener = () => {
    useEffect(() => {
      // Listen for volume button presses
      const subscription = VolumeManager.addVolumeListener(({ volume }) => {
        if (volume) {
          console.log("AB Shutter Button Pressed!");
          // You can trigger a photo capture or any other action here
        }
      });

      return () => {
        // Clean up the listener when the component is unmounted
        subscription.remove();
      };
    }, []);

    return null; // No UI for this listener component
  };

  return {
    connectToDevice,
    allDevices,
    connectedDevice,
    message,
    requestPermissions,
    scanForPeripherals,
    startStreamingData,
  };
}

export default useBLE;
