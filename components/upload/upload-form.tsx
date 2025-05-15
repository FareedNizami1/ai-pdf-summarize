'use client'
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "@/components/upload/upload-form-input";
import { z } from "zod";
import { toast } from "sonner"
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const scehema = z.object({
    file: z.instanceof(File, {message: "Invalid file"})
    .refine(
        (file) => file.size <= 20 * 1024 *1024, 
        "File size should be less than 20MB"
    )
    .refine(
        (file) => file.type.startsWith('application/pdf'), 
        "File type should be PDF"
    )
})

export default function UploadForm() {

    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const { startUpload, routeConfig } = useUploadThing(
        'pdfUploader',
        {
          onClientUploadComplete: () => {
            console.log('uploaded successfully!');
          },
          onUploadError: (err) => {
            console.log('error occurred while uploading', err);
            toast("Error occurred while uploading", {
                description: err.message,
            })
          },
          onUploadBegin: ({ file }) => {
            console.log('upload has begun for', file);
          },
        }
      );
      

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            const formData = new FormData(e.currentTarget)
            const file = formData.get("file") as File

            const validatedFields = scehema.safeParse({ file })
            if (!validatedFields.success) {
                toast("❌ Something went wrong", {
                    description:  validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file" ,
                })
                setIsLoading(false)
                return
            }

            toast( <span className="text-green-600 font-bold">🗎 Uploading PDF...</span>, {
                description: (
                    <span className="text-black">
                    We are uploading your file!
                    </span>
                )
            })

        
            const resp = await startUpload([ file ])
            if(!resp) {
                toast("❌ Something went wrong", {
                    description:  "Please use a different file.",

                })
                setIsLoading(false)
                return
            }

            toast( <span className="text-green-600 font-bold">🗎 Processing PDF</span>, {
                description: (
                    <span className="text-black">
                    Hang tight! Our AI is reading through your document. ✨ 
                    </span>
                ),
            })
            
            const result = await generatePdfSummary(resp)
            
            const {data = null, message = null} = result || {}

            if (data) {
                let storeResult : any;
                toast( <span className="text-green-600 font-bold">🗎 Saving PDF...</span>, {
                    description: (
                        <span className="text-black">
                        Hang tight! We are saving your summary! ✨ 
                        </span>
                    ),   
                })
                
                if(data.summary) {
                    storeResult = await storePdfSummaryAction({
                        summary: data.summary,
                        fileUrl: resp[0].url,
                        title: data.title,
                        fileName: file.name,
                    })
                    // save the summary to the database
                    toast( <span className="text-green-600 font-bold">😎 Summary Generated!</span>, {
                        description: (
                            <span className="text-black">
                            Your PDF has been successfully summarized and saved! ✨ 
                            </span>
                        ),   
                    })

                    formRef.current?.reset()
                    //Todo: redirect to the [id] summary page
                    router.push(`/summaries/${storeResult.data.id}`)
                }
            }
        } catch (error) {
            setIsLoading(false)
            console.error("Error occurred", error)
            formRef.current?.reset()
        } finally {
            setIsLoading(false)
        }

        //validating the fields
        //scehma with zod
        //upload the file to uploadthing
        //parse the pdf using lang chain
        //summarize the pdf using AI
        //save the summary to the database
        //redirect to the {id} summary page

    }
    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl">
            <UploadFormInput isLoading={isLoading} onSubmit={handleSubmit} ref={formRef} />
        </div>
    )
}