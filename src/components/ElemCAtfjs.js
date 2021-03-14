import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

export function getModel(hiddenLayerUnits) {
    const model = tf.sequential();
    const INPUT_SIZE = 3;

    model.add(tf.layers.inputLayer({ inputShape: [INPUT_SIZE] }));
    if (hiddenLayerUnits > 0) {
        model.add(tf.layers.dense({
            units: hiddenLayerUnits,
            activation: 'relu'
        }));
    }

    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
    }))
    
    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
}

let trainXs = [...Array(8).keys()].reverse().map(x => {
    return x.toString(2).padStart(3, '0');
})

trainXs = trainXs.map(x => {
    return x.split("").map(Number);
})

trainXs = tf.stack(trainXs);

export async function train(model, caRuleNum) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model Training', tab: 'Model', styles: { height: '1000px' }
    };
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

    const trainYs = caRuleNum.toString(2).padStart(8, '0').split("").map(Number);

    return model.fit(trainXs, trainYs, {
        epochs: 100,
        callbacks: fitCallbacks
    });
}

export function doPrediction(model, data, testDataSize = 500) {
    let preds = model.predict(trainXs).dataSync();
    return preds.map(x => Number(x > 0.5));
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
