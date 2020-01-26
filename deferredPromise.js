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

const kaki = generateDeferredPromise();

const myFunc = async () => {
  console.log('hey!');
  await kaki.promise;
  console.log('how are you??!?!?!??');
}

myFunc()

kaki.resolve

// node deferredPromise.js
