// import * as admin from 'firebase-admin';
// import { ServiceAccount } from 'firebase-admin';

// console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY: ", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// // if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) return

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string) as ServiceAccount;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export const firebaseAdmin = admin;


// import * as admin from 'firebase-admin';
// import { ServiceAccount } from 'firebase-admin';

// let firebaseAdmin: admin.app.App;

// console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY: ", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// export function initializeFirebase() {
//   if (firebaseAdmin) return firebaseAdmin;
//   console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY: ", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

//   const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string) as ServiceAccount;

//   firebaseAdmin = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });

//   return firebaseAdmin;
// }

// export { firebaseAdmin };

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { ServiceAccount } from 'firebase-admin';


let firebaseApp;

export function initializeFirebase() {
  if (getApps().length) {
    firebaseApp = getApps()[0]; // reuse existing app
    return firebaseApp;
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string) as ServiceAccount;

  firebaseApp = initializeApp({
    credential: cert(serviceAccount),
  });

  return firebaseApp;
}

export const firebaseMessaging = getMessaging;



// import { ServiceAccount } from 'firebase-admin';
// import * as fs from 'fs';
// import * as path from 'path';

// function tryParseJson(input?: string): any | undefined {
//   if (!input) return undefined;
//   try {
//     return JSON.parse(input);
//   } catch {
//     return undefined;
//   }
// }

// function decodeBase64(input?: string): string | undefined {
//   if (!input) return undefined;
//   try {
//     return Buffer.from(input, 'base64').toString('utf8');
//   } catch {
//     return undefined;
//   }
// }

// function loadServiceAccountFromEnv(): ServiceAccount | undefined {
//   // 1) Raw JSON in FIREBASE_SERVICE_ACCOUNT_KEY
//   const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string | undefined;
//   console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY: ", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  
//   const parsedDirect = tryParseJson(rawJson);
//   if (parsedDirect) return parsedDirect as ServiceAccount;
  
//   // 2) Base64-encoded JSON in FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
//   const b64 = decodeBase64(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 as string | undefined);
//   console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY: ", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
//   const parsedB64 = tryParseJson(b64);
//   if (parsedB64) return parsedB64 as ServiceAccount;

//   // // 3) Path to JSON via GOOGLE_APPLICATION_CREDENTIALS (standard ADC path)
//   // const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS as string | undefined;
//   // if (credsPath) {
//   //   const absolute = path.isAbsolute(credsPath) ? credsPath : path.resolve(process.cwd(), credsPath);
//   //   if (fs.existsSync(absolute)) {
//   //     const fileContent = fs.readFileSync(absolute, 'utf8');
//   //     const parsedFile = tryParseJson(fileContent);
//   //     if (parsedFile) return parsedFile as ServiceAccount;
//   //   }
//   // }

//   // // 4) Individual vars (useful for CI or Windows shells)
//   // const projectId = process.env.FIREBASE_PROJECT_ID;
//   // const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
//   // const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
//   // if (projectId && clientEmail && privateKeyRaw) {
//   //   const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
//   //   return { projectId, clientEmail, privateKey } as unknown as ServiceAccount;
//   // }

//   return undefined;
// }

// function initializeFirebase() {
//   try {

//     if (admin.apps.length) return admin.app();

//     const sa = loadServiceAccountFromEnv();
//     if (sa) {
//       return admin.initializeApp({
//         credential: admin.credential.cert(sa),
//       });
//     }


//   } catch (err) {
//     throw new Error("Firebase credentials not configured.");
//   }
// }

// initializeFirebase();

// export const firebaseAdmin = admin;