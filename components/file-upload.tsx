import { FieldProps, useFormikContext } from "formik"
import { useDropzone } from "react-dropzone"

const FileUpload = ({ field }: FieldProps) => {
  const { setFieldValue } = useFormikContext()
  const onDrop = (acceptedFiles: File[]) => {
    setFieldValue(field.name, acceptedFiles[0]).catch((err: any) =>
      // TODO: Handle error
      console.log(err),
    )
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/zip": [] },
    onDrop,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and drop some file here, or click to select file</p>
    </div>
  )
}

export default FileUpload
