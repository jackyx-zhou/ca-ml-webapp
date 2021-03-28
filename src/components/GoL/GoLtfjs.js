import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import GoL from './GoL';

export default function GoLtfjs() {
    const exampleSize = 100;
    const imageSize = 28;

    this.trainXs = new Array(exampleSize);
    this.trainYs = new Array(exampleSize);
    for (let i = 0; i < exampleSize; i++) {
        let example = new GoL(imageSize);
        this.trainXs[i] = tf.tensor2d(example.grid);
        example.computeNext();
        this.trainYs[i] = tf.tensor2d(example.grid);
    }

    this.model = getModel();
    this.isTraining = false;

    // export async function train(model, caRuleNum) {
    //     if (trainYs) trainYs.dispose();

    //     const metrics = ['loss', 'acc'];
    //     const container = {
    //         name: 'Model Training', tab: '1D CA'
    //     };
    //     const fitCallbacks = {
    //         ...tfvis.show.fitCallbacks(container, metrics,),
    //         onEpochEnd: (epoch, logs) => {
    //             if (logs['acc'] > 0.9) model.stopTraining = true;
    //         }
    //     };

    //     trainYs = caRuleNum.toString(2).padStart(8, '0').split("").map(Number);
    //     trainYs = tf.stack(trainYs);

    //     return model.fit(trainXs, trainYs, {
    //         epochs: 500,
    //         callbacks: fitCallbacks
    //     });
    // }

    // function doPrediction(model, data, testDataSize = 500) {
    //     return tf.tidy(() => {
    //         let preds = model.predict(trainXs).dataSync();
    //         return preds.map(x => Number(x > 0.5));
    //     })
    // }
}


function getModel() {
    tf.disposeVariables();
    const model = tf.sequential();
    // const INPUT_SIZE = 3;

    // model.add(tf.layers.inputLayer({ inputShape: [INPUT_SIZE] }));
    // if (hiddenLayerUnits > 0) {
    //     model.add(tf.layers.dense({
    //         units: hiddenLayerUnits,
    //         activation: 'relu'
    //     }));
    // }

    // model.add(tf.layers.dense({
    //     units: 1,
    //     activation: 'sigmoid'
    // }))

    // // Choose an optimizer, loss function and accuracy metric,
    // // then compile and return the model
    // const optimizer = tf.train.sgd(0.2);
    // model.compile({
    //     optimizer: optimizer,
    //     loss: 'binaryCrossentropy',
    //     metrics: ['accuracy'],
    // });

    return model;
}

// async function showAccuracy(model, data) {
//     const [preds, labels] = doPrediction(model, data);
//     const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
//     const container = { name: 'Accuracy', tab: 'Evaluation' };
//     tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

//     labels.dispose();
// }

// async function showConfusion(model, data) {
//     const [preds, labels] = doPrediction(model, data);
//     const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
//     const container = { name: 'Confusion Matrix', tab: 'Evaluation' };
//     tfvis.render.confusionMatrix(container, { values: confusionMatrix, tickLabels: classNames });

//     labels.dispose();
// }
