


// for image upload
// готовая их с сайта заготовка код ЦЕЛИКОМ ИЗ https://docs.uploadthing.com/getting-started/appdir
// см. Set Up A FileRouter > Creating your first FileRoute

//#1   original
// import {
//     generateUploadButton,
//     generateUploadDropzone,
// } from "@uploadthing/react";

// //import type { OurFileRouter } from "~/app/api/uploadthing/core";    original не работает
// import type { OurFileRouter } from "@/app/api/uploadthing/core";    //new работает
// export const UploadButton = generateUploadButton<OurFileRouter>();
// export const UploadDropzone = generateUploadDropzone<OurFileRouter>();



//#2
//import { generateReactHelpers } from "@uploadthing/react/hook";    original  не работает
import { generateReactHelpers } from "@uploadthing/react/"  //new  работает
import type { OurFileRouter } from "@/app/api/uploadthing/core";
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
