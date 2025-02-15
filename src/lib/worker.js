import createChunk from "./createChunk";

onmessage = async e => {
  const {
    file,
    CHUNK_SIZE,
    startChunkIndex: start,
    endChunkIndex: end
  } = e.data;

  const promise = [];
  for (let i = start; i <= end; i++) {
    promise.push(createChunk(file, i, CHUNK_SIZE));
  }
  const chunks = await Promise.all(promise);
  postMessage(chunks);
};
