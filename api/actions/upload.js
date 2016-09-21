export default function upload(req) {
  return { files: req.files.map(file => ({ ...file, buffer: undefined })) };
}
