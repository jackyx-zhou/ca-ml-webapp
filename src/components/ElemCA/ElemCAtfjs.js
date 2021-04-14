import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

let trainXs, trainYs;

trainXs = [...Array(8).keys()].reverse().map(x => {
    return x.toString(2).padStart(3, '0');
})

trainXs = trainXs.map(x => {
    return x.split("").map(Number);
})

trainXs = tf.stack(trainXs);

export function getModel(hiddenLayerUnits) {
    tf.disposeVariables();
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
    const optimizer = tf.train.sgd(0.2);
    model.compile({
        optimizer: optimizer,
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
}

export async function train(model, caRuleNum) {
    if (trainYs) trainYs.dispose();
    
    const metrics = ['loss', 'acc'];
    const container = {
        name: 'Model Training', tab: '1D CA'
    };
    const fitCallbacks = {...tfvis.show.fitCallbacks(container, metrics,), 
        onBatchEnd: (epoch, logs) => {
            if (logs['loss'] < 0.05) model.stopTraining = true;
        }};

    trainYs = caRuleNum.toString(2).padStart(8, '0').split("").map(Number);
    trainYs = tf.stack(trainYs);

    return model.fit(trainXs, trainYs, {
        epochs: 500,
        callbacks: fitCallbacks
    });
}

export function doPrediction(model) {
    return tf.tidy(() => {
        let preds = model.predict(trainXs).dataSync();
        return preds.map(x => Number(x > 0.5));
    })
}
