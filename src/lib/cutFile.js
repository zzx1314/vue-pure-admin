import { CHUNK_SIZE } from "@/constants";

const THREAD_COUNT = navigator.hardwareConcurrency || 4;

/**
 * @description 开启多线程分片计算
 * @param file File
 * @returns Promise<ChunkFileType[]>
 */
export default async function cutFile(file) {
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
  const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
  const result = [];
  let finishCount = 0;

  return new Promise(resolve => {
    for (let i = 0; i < THREAD_COUNT; i++) {
      const start = i * threadChunkCount;
      let end = (i + 1) * threadChunkCount;
      if (end > chunkCount) end = chunkCount;
      console.log("创建一个线程并分配任务", import.meta.url);
      // 创建一个线程并分配任务
      const worker = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module"
      });
      console.log(worker);
      worker.postMessage({
        file,
        CHUNK_SIZE,
        startChunkIndex: start,
        endChunkIndex: end
      });

      worker.onmessage = e => {
        // 按顺序依次放入数组，防止多线程并发时造成结果乱序
        for (let i = start; i < end; i++) {
          result[i] = e.data[i - start];
        }
        worker.terminate();
        finishCount++;
        if (finishCount === THREAD_COUNT) {
          resolve(result);
        }
      };
    }
  });
}
