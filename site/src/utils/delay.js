const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export async function delayPromise(promise) {
  const [result] = await Promise.all([promise, sleep(2)]);
  return result;
}
