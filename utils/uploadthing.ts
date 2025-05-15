import { OurFileRouter } from "@/app/api/uploadthing/core";

import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>()


// import {
//     generateUploadButton,
//     generateUploadDropzone,
//   } from "@uploadthing/react";
  
 
//   export const UploadButton = generateUploadButton<OurFileRouter>();
//   export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  