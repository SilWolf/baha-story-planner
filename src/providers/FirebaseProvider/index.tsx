import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getBlob,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
  UploadResult as StorageUploadResult,
} from "firebase/storage";
import React, { PropsWithChildren, useContext, useMemo } from "react";

type TFirebaseContentValue = {
  storage: {
    upload: (path: string, data: Blob | File) => Promise<StorageUploadResult>;
    download: (path: string) => Promise<Blob>;
    getDownloadUrl: (path: string) => Promise<string>;
  };
};

const FirebaseContext = React.createContext<TFirebaseContentValue>({
  storage: {
    upload: () => {
      throw new Error("Not Implemented");
    },
    download: () => {
      throw new Error("Not Implemented");
    },
    getDownloadUrl: () => {
      throw new Error("Not Implemented");
    },
  },
});

export const FirebaseProvider = ({
  config,
  children,
}: PropsWithChildren<{ config: FirebaseOptions }>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _app = useMemo(() => initializeApp(config), [config?.apiKey]);
  const _storage = useMemo(() => getStorage(_app), [_app]);

  const value: TFirebaseContentValue = useMemo(
    () => ({
      storage: {
        upload: (path: string, data: Blob | File) => {
          const ref = storageRef(_storage, path);
          return uploadBytes(ref, data);
        },
        download: (path: string): Promise<Blob> => {
          const ref = storageRef(_storage, path);
          return getBlob(ref);
        },
        getDownloadUrl: (path: string) => {
          const ref = storageRef(_storage, path);
          return getDownloadURL(ref);
        },
      },
    }),
    [_storage]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
