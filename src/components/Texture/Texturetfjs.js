import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

const img_size = 64;
const channel_n = 12
const hidden_n = 96
const lr = 2e-3
const fire_rate = 0.55
const rollout_len_min = 64
const rollout_len_max = 96

// const train_steps = 2000

// const batch_size = 4
// const pool_size = 1024
// const fixed_seed = 123 
// const lr_decay = 2000

// const gradnorm = true
// const q = 2.0
// const bias = true
// const learned_filters = 0
// const laplacian = true
// const gradient = true
// const identity = true

const seed_fn = (n) => {
    return tf.zeros([n, img_size, img_size, channel_n])
}

const loss_fn = (y_pred, y_true) => {
    return tf.mean(tf.square(to_rgb(y_pred).sub(y_true)));
}

const to_rgb = (x) => {
    return tf.slice(x, [0, 0, 0, 0], [-1, -1,-1, 3]);
}

class PerceptionLayer extends tf.layers.Layer {
    constructor(angle= 0.0) {
        super({});
        this.angle = angle;
    }

    computeOutputShape(inputShape) {
        const outputShape = [...inputShape]
        outputShape[3] = 4 * channel_n;
        console.log(outputShape)
        return outputShape;
    }

    call(input, kwargs) {
        return tf.tidy(() => {
            const identity = tf.outerProduct([0, 1, 0], [0, 1, 0]);
            const dx = tf.outerProduct([1, 2, 1], [-1, 0, 1]).div(tf.scalar(8.0))
            const dy = tf.transpose(dx);
            let laplacian = tf.outerProduct([1, 2, 1], [1, 2, 1]).div(tf.scalar(8.0))
            laplacian = laplacian.sub(tf.outerProduct([0, 2, 0], [0, 1, 0]))
            const [c, s] = [tf.cos(this.angle), tf.sin(this.angle)]
            let kernel = tf.stack([identity, c.mul(dx).sub(s.mul(dy)), s.mul(dx).add(c.mul(dy)), laplacian], -1)
            // Add filters for every channel and hidden channel
            kernel = kernel.expandDims(2);
            kernel = tf.tile(kernel, [1, 1, channel_n, 1])

            input = input[0]
            let output = []
            tf.unstack(input).forEach(x => {
                const y = tf.depthwiseConv2d(x, kernel, 1, 'same');
                output.push(y)
            })
            return tf.stack(output);
        })
    }

    getClassName() { return 'Perception' }
}

class MaskingLayer extends tf.layers.Layer {
    constructor(fire_rate) {
        super({});
        this.fire_rate = fire_rate;
    }

    call(input, kwargs) {
        return tf.tidy(() => {
            input = input[0]
            const shape = input.shape
            const update_mask = tf.multinomial([1-this.fire_rate, this.fire_rate], shape[0]*shape[1]*shape[2])
                            .reshape([shape[0], shape[1], shape[2], 1]);
            
            return tf.mul(input, update_mask);
        })
    }

    getClassName() { return 'Masking' }
}

class ImageOutputLayer extends tf.layers.Layer {
    constructor() {
        super({});
    }

    call(input, kwargs) {
        console.log(input[0])
        return to_rgb(input[0]);
    }

    computeOutputShape(inputShape) {
        const outputShape = [...inputShape]
        outputShape[3] = 3;
        console.log(outputShape)
        return outputShape;
    }

    getClassName() { return 'ImageOutput' }
}

class SamplePool {
    constructor(_parent=null, _parent_idx=null, pool_slots) {
        this._parent = _parent;
        this._parent_idx = _parent_idx;
        this._slot_names = pool_slots.keys()
        this._size = null

        for (const [k, v] of Object.entries(pool_slots)) {
            if (this._size === null) {
                this._size = v.shape[0]
            }
            if (this._size !== v.shape[0]) throw 'assertion failed'
            this[k] = v;
        }
    }

    // sample(n) {
    //     let idx = _und.sample([...Array(self._size).keys()], n)
    //     let batch = {}
    //     for (k in this._slot_names) {
    //         batch[k] = this[k][idx];
    //     }
    //     batch = SamplePool(this, idx, batch)
    //     return batch
    // }
}

export default function Texturetfjs(target_image) {
    // this.pool = new SamplePool(null, null, {x: seed_fn(pool_size)})
    this.model = getModel();
    this.loss_log = [];
    this.isTraining = false;
    this.epochs = -1

    let trainYs = tf.tile(target_image.expandDims(0), [2, 1, 1, 1]);
    this.trainStep = () => tf.tidy(() => {
        let trainXs = seed_fn(2);
        const metrics = ['loss'];
        const container = {
            name: 'Model Training', tab: 'Texture Synth'
        };

        const fitCallbacks = {
            ...tfvis.show.fitCallbacks(container, metrics,),
        };

        let iter_n = tf.randomUniform([], rollout_len_min, rollout_len_max, 'int32');
        iter_n = iter_n.dataSync()[0];
        const optimizer = tf.train.adam(lr);

        let g = optimizer.computeGradients(() => {
            for (let i = 0; i < iter_n; i++) {
                trainXs = this.model.predict(trainXs);
            }
            let loss = tf.metrics.meanSquaredError(trainYs, to_rgb(trainXs)).sum();
            this.loss_log.push(loss.dataSync());
            loss.print()
            return loss;
        });
        optimizer.applyGradients(g.grads);
    });

    this.visualiseResult = (canvas) => {
        tf.tidy(() => {
            let testXs = seed_fn(1);
            for (let i = 0 ; i < rollout_len_max; i++) {
                testXs = this.model.predict(testXs)
            }
            tf.browser.toPixels(tf.squeeze(to_rgb(testXs).clipByValue(0, 1)), canvas.current);
        })
    }

    this.train = (canvas, setEpochNum, setLoss) => {
        let worker = setInterval(() => {
            if (this.epochs % 10 === 0) {
                setEpochNum(this.epochs);
                setLoss(this.loss_log[this.epochs]);
            }
            if (this.epochs % 50 === 0) this.visualiseResult(canvas);
            console.log("Epoch: " + this.epochs);
            this.trainStep();
            this.epochs++;
        }, 0)
        return worker;
    }

    function getModel() {
        // const init_fn = tf.initializers.glorotNormal();
        let layer1 = tf.layers.conv2d({
            filters: hidden_n,
            kernelSize: 1,
            padding: 'valid',
            activation: 'relu',
            useBias: true,
        });

        let layer2 = tf.layers.conv2d({
            filters: channel_n,
            kernelSize: 1,
            padding: 'valid',
            activation: null,
            kernelInitializer: 'zeros',
        });

        const perceive = new PerceptionLayer(0.0);
        
        // function perceiveLayer(x, angle=0.0) {
        //     return tf.tidy((x) => {
        //         const angle = 0.0;
        //         const identity = tf.outerProduct([0, 1, 0], [0, 1, 0]);
        //         const dx = tf.outerProduct([1, 2, 1], [-1, 0, 1]).div(tf.scalar(8.0))
        //         const dy = tf.transpose(dx);
        //         // let laplacian = tf.outerProduct([1, 2, 1], [1, 2, 1]).div(tf.scalar(8.0))
        //         // laplacian = laplacian.buffer().set()
        //         const [c, s] = [tf.cos(angle), tf.sin(angle)]
        //         let kernel = tf.stack([identity, c.mul(dx).sub(s.mul(dy)), s.mul(dx).add(c.mul(dy))], -1)
        //         // Add filters for every channel and hidden channel
        //         kernel = kernel.expandDims(2);
        //         kernel = tf.tile(kernel, [1, 1, channel_n, 1])
        //         y = tf.depthwiseConv2d(x, kernel, 1, 'same');
        //         return y;
        //     })
        // }

        // const model = tf.sequential();
        // model.add(tf.layers.inputLayer({ inputShape: [img_size, img_size, channel_n] }));
        // model.add(new PerceptionLayer(0.0));
        // model.add(layer1);
        // model.add(layer2);
        // model.add(new ImageOutputLayer())
        
        // const build = () => {
        //     const x = tf.input({ shape: [img_size, img_size, channel_n] })
        //     const y = perceive.apply(x);
        //     let dx = layer1.apply(y);
        //     dx = layer2.apply(dx);
        //     // const update_mask = tf.multinomial([1-fire_rate, fire_rate], img_size*img_size)
        //     //                     .reshape([1, img_size, img_size, 1]);
        //     // const update = tf.layers.multiply().apply([dx, update_mask]);
        //     const update = new MaskingLayer(fire_rate).apply(dx);
        //     const sum = tf.layers.add().apply([x, update]);
        //     this.params = tf.model({inputs: x, outputs: sum}).getWeights();
        //     console.log(this.params)
        // }
        
        // build();

        const x = tf.input({ shape: [img_size, img_size, channel_n] })
        const y = perceive.apply(x);
        let dx = layer1.apply(y);
        dx = layer2.apply(dx);
        // const update_mask = tf.multinomial([1-fire_rate, fire_rate], img_size*img_size)
        //                     .reshape([1, img_size, img_size, 1]);
        // const update = tf.layers.multiply().apply([dx, update_mask]);
        const update = new MaskingLayer(fire_rate).apply(dx);
        const sum = tf.layers.add().apply([x, update]);
        
        const model = tf.model({inputs: x, outputs: sum});
        return model;

        // model.compile({
        //     optimizer: optimizer,
        //     loss: 'meanSquaredError',
        // });
    }

}