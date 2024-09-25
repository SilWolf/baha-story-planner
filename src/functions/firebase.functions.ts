import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore/lite";
import {
  getBlob,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import firebaseConfig from "@/env/firebase-credentials";
import { UserSchemaV1 } from "@/schemas/User";

const _app = initializeApp(firebaseConfig);
const _storage = getStorage(_app);
const _firestore = getFirestore(_app);
const _auth = getAuth(_app);
_auth.useDeviceLanguage();

export const bStorageUpload = (path: string, data: Blob | File) => {
  const ref = storageRef(_storage, path);
  return uploadBytes(ref, data);
};

export const bStorageDownload = (path: string): Promise<Blob> => {
  const ref = storageRef(_storage, path);
  return getBlob(ref);
};

export const bStorageGetDownloadUrl = (path: string) => {
  const ref = storageRef(_storage, path);
  return getDownloadURL(ref);
};

export const bUpsertUserByIdentification = async (
  identification: string,
  user: UserSchemaV1
) => {
  const fetchedUser = await getDoc(
    doc(_firestore, "users", identification)
  ).then((snapshot) => snapshot.data() as UserSchemaV1);

  if (fetchedUser) {
    return fetchedUser;
  }

  return setDoc(doc(_firestore, "users", identification), user).then(
    () => user
  );
};

export const bAuthSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");

  return signInWithPopup(_auth, provider).then(async (result) => ({
    email: result.user.email as string,
  }));
};
