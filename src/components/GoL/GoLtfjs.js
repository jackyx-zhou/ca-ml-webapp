import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import GoL from './GoL';

class PeriodicPaddingLayer extends tf.layers.Layer {
    constructor() {
        super({});
    }

    computeOutputShape(inputShape) {
        const outputShape = [...inputShape]
        outputShape[1] += 2;
        outputShape[2] += 2;
        return outputShape;
    }

    call(input, kwargs) {
        input = input[0]

        const imageSide = input.shape[1];
        const upper_pad = input.slice([0, imageSide-1, 0], [-1, 1, -1]);
        const lower_pad = input.slice([0, 0, 0], [-1, 1, -1]);
        const partial_image = tf.concat([upper_pad, input, lower_pad], 1);
        const left_pad = partial_image.slice([0, 0, imageSide-1], [-1, -1, 1]);
        const right_pad = partial_image.slice([0, 0, 0], [-1, -1, 1]);
        const padded_image = tf.concat([left_pad, partial_image, right_pad], 2);
        return padded_image; 
    }

    getClassName() { return 'PeriodicPadding'}
}

export default function GoLtfjs(convLayerFilters, denseLayerUnits) {
    const EXAMPLE_SIZE = 100;
    const IMAGE_SIZE = 28;

    this.trainXs = new Array(EXAMPLE_SIZE);
    this.trainYs = new Array(EXAMPLE_SIZE);
    for (let i = 0; i < EXAMPLE_SIZE; i++) {
        let example = new GoL(IMAGE_SIZE);
        example.randomInitialise();
        this.trainXs[i] = example.grid;
        example.computeNext();
        this.trainYs[i] = example.grid;
    }
    this.trainXs = tf.tensor(this.trainXs).reshape([EXAMPLE_SIZE, IMAGE_SIZE, IMAGE_SIZE, 1]);
    this.trainYs = tf.tensor(this.trainYs).reshape([EXAMPLE_SIZE, IMAGE_SIZE * IMAGE_SIZE, 1]);

    this.model = getModel();
    this.isTraining = false;

    this.train = () => {
        const metrics = ['loss', 'acc'];
        const container = {
            name: 'Model Training', tab: 'Game of Life'
        };
        const fitCallbacks = {
            ...tfvis.show.fitCallbacks(container, metrics,),
            onBatchEnd: (epoch, logs) => {
                if (logs['loss'] < 0.01) this.model.stopTraining = true;
            }
        };

        return this.model.fit(this.trainXs, this.trainYs, {
            epochs: 100,
            callbacks: fitCallbacks
        });
    }

    this.doPrediction= (image) => {
        return tf.tidy(() => {
            image = tf.tensor2d(image).reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1])
            let pred = this.model.predict(image);
            pred = pred.reshape([IMAGE_SIZE, IMAGE_SIZE])
            return pred;
        })
    }

    function getModel() {
        tf.disposeVariables();
        const model = tf.sequential();
    
        model.add(tf.layers.inputLayer({ inputShape: [IMAGE_SIZE, IMAGE_SIZE, 1] }));
        model.add(new PeriodicPaddingLayer());
        model.add(tf.layers.conv2d({
            filters: convLayerFilters,
            kernelSize: 3,
            padding: 'valid',
            activation: 'relu',
        }));
    
        model.add(tf.layers.reshape({
            targetShape: [-1, convLayerFilters]
        }))
        if (denseLayerUnits > 0) {
            model.add(tf.layers.dense({
                units: denseLayerUnits,
                activation: 'relu'
            }))
        }
        model.add(tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
        }))
    
        // Choose an optimizer, loss function and accuracy metric,
        // then compile and return the model
        const optimizer = tf.train.adam(1e-2);
        model.compile({
            optimizer: optimizer,
            loss: 'binaryCrossentropy',
            metrics: ['accuracy'],
        });
    
        return model;
    }

}