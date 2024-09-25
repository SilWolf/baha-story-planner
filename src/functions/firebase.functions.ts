import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  startAfter,
} from "firebase/firestore/lite";
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

export const bDatabaseUpsertUserByIdentification = async (
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

export const bDatabaseGetItemsFromCollection = async <T extends DocumentData>(
  path: string[],
  pageSize: number,
  lastSeen?: DocumentSnapshot
) => {
  const tempPath = [...path];
  const pathFirst = tempPath.shift();
  const documentSnapshots = await getDocs(
    query(
      collection(_firestore, pathFirst as string, ...tempPath),
      startAfter(lastSeen),
      limit(pageSize)
    )
  );

  return {
    items: documentSnapshots.docs.map((doc) => doc.data()) as T[],
    pagination: {
      first: documentSnapshots.docs[0],
      last: documentSnapshots.docs[documentSnapshots.docs.length - 1],
    },
  };
};

export const bAuthSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");

  return signInWithPopup(_auth, provider).then(async (result) => ({
    email: result.user.email as string,
  }));
};
