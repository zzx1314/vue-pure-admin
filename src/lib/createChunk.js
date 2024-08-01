import SparkMD5 from "spark-md5";

/**
 * @description 文件切片，多线程中使用
 * @param file
 * @param index
 * @param CHUNK_SIZE
 * @returns
 */
export default function createChunk(file, index, CHUNK_SIZE) {
  return new Promise(resolve => {
    const start = index * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const blob = file.slice(start, end);

    fileReader.onload = function (e) {
      if (!e.target?.result) return;

      spark.append(e.target.result);
      resolve({
        start,
        end,
        index,
        blob,
        hash: spark.end()
      });
    };

    fileReader.readAsArrayBuffer(blob);
  });
}
