const generateDeferredPromise = () => {
  return (() => {
    let resolve;
    let reject;

    let promise = new Promise((res,rej) => {
      resolve = res;
      reject = rej;
    });
    return {promise, resolve, reject}
  })()
}

const runWithoutResolved = generateDeferredPromise();

const myFunc = async () => {
  console.log('hey!');
  await runWithoutResolved.promise;
  console.log('how are you??!?!?!??');
}

myFunc()

runWithoutResolved.resolve

// node deferredPromise.js
