


'use client'

// РАБОТАЕТ, загрузил британский флаг из своего компьютера

// for image upload
// готовая их с сайта заготовка код ЦЕЛИКОМ ИЗ https://docs.uploadthing.com/getting-started/appdir
// см. Set Up A FileRouter > Creating your first FileRoute

import { useCallback, Dispatch, SetStateAction } from 'react'

// import type { FileWithPath } from '@uploadthing/react'    original не работает
import { FileWithPath } from 'react-dropzone';  //new работает

//import { useDropzone } from '@uploadthing/react/hooks'     original не работает
import { useDropzone } from '@uploadthing/react'  //new работает

import { generateClientDropzoneAccept } from 'uploadthing/client'

import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
    onFieldChange(convertFileToUrl(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    //  accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,    original не работает
    accept: generateClientDropzoneAccept(['image/*']),  //new работает, помог Ai
  })

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
      <input {...getInputProps()} className="cursor-pointer" />

       {/* РАБОТАЕТ, загрузил британский флаг из своего компьютера */}
      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <img src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}
