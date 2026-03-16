import { useDropzone } from "react-dropzone";

type Props = { files: File[]; onFiles: (files: File[]) => void };

export default function CarPhotoUpload({ files, onFiles }: Props) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 10,
    onDrop: (accepted) => onFiles([...files, ...accepted].slice(0, 10))
  });

  return (
    <div>
      <div {...getRootProps()} className="cursor-pointer rounded border border-dashed p-6 text-center text-sm">
        <input {...getInputProps()} />
        Drag and drop photos here, or click to select
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {files.map((f) => (
          <div key={f.name} className="truncate rounded border bg-white p-2 text-xs">{f.name}</div>
        ))}
      </div>
    </div>
  );
}
