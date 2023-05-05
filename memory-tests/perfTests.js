const perfTest = (page) => {
  page.timings = function () {
    const p = new Promise((resolve, reject) => {
      (async () => {
        try {
          const performanceTiming = JSON.parse(
            await page.evaluate(() => {
              return JSON.stringify(window.performance.timing);
            }),
          );
          resolve(performanceTiming);
        } catch (e) {
          reject(e);
        }
      })();
    });
    return p.then((performanceTiming) => {
      return performanceTiming;
    });
  };

  page.runtimeMetrics = function () {
    const p = new Promise((resolve, reject) => {
      (async () => {
        try {
          const metrics = await page.metrics();
          resolve(metrics);
        } catch (e) {
          reject(e);
        }
      })();
    });
    return p.then((metrics) => {
      return metrics;
    });
  };

  page.profileHeap = function () {
    const p = new Promise((resolve, reject) => {
      (async () => {
        try {
          const prototypeHandle = await this.evaluateHandle(() => Object.prototype);
          const objectsHandle = await this.queryObjects(prototypeHandle);
          const numberOfObjects = await this.evaluate(
            (instances) => instances.length,
            objectsHandle,
          );

          await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);

          resolve(numberOfObjects);
        } catch (e) {
          reject(e);
        }
      })();
    });
    return p.then((numberOfObjects) => {
      return numberOfObjects;
    });
  };
  return page;
};

export default perfTest;
