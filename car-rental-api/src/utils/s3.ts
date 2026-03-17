export const uploadFileToS3 = async (key: string, _buffer: Buffer) => {
  return { url: `https://example.com/mock-upload/${encodeURIComponent(key)}` };
};
