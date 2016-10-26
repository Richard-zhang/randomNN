var forwardMultiplyGate = function(x, y) {
    return x * y;
};

var Unit = function(value, grad) {
    this.value = value;
    this.grad = grad;
}

var multiplyGate = function() { };
multiplyGate.prototype = {
    forward: function(u0, u1) {
        this.u0 = u0;
        this.u1 = u1;
        this.utop = new Unit(u0.value * u1.value, 0.0);
        return this.utop;
    },
    backward: function() {
        this.u0.grad += this.u1.value * this.utop.grad;
        this.u1.grad += this.u0.value * this.utop.grad;
    }
}

var addGate = function() { };
addGate.prototype = {
    forward: function(u0, u1) {
        this.u0 = u0;
        this.u1 = u1;
        this.utop = new Unit(u0.value + u1.value, 0.0);
        return this.utop;
    },
    backward: function() {
        this.u0.grad += 1 * this.utop.grad;
        this.u1.grad += 1 * this.utop.grad;
    }
}

var sigmoidGate = function() {
    this.sig = function(x) {return 1/(1+Math.exp(-x));}
};

sigmoidGate.prototype = {
    forward: function(u0) {
        this.u0 = u0;
        this.utop = new Unit(this.sig(this.u0.value), 0.0);
        return this.utop;
    },
    backward: function() {
        var s = this.sig(this.u0.value);
        this.u0.grad += ( s * (1 - s)) * this.utop.grad;
    }
}

var x = a * b;
var da = b * dx;
var db = a * dx;

var Circuit = function () {
    this.mulg0 = new multiplyGate();
    this.mulg1 = new multiplyGate();
    this.addg0 = new addGate();
    this.addg1 = new addGate();
};

Circuit.prototype = {
    forward: function(x,y,a,b,c) {
        this.ax = this.mulg0.forward(a, x);
        this.by = this.mulg0.forward(b, y);
        this.axpby = this.addg0.forward(this.ax, this.by);
        this.axpbypc = this.addg1.forward(this.axpby, c);
        return this.axpbypc;
    },
    backward: function(gradient_top) {
        this.axpbypc.grad = gradient_top;
        this.addg1.backward();
        this.addg0.backward();
        this.mulg1.backward();
        this.mulg0.backward();
    }
}

var SVM = function() {
    this.a = new Unit(1.0, 0.0);
    this.b = new Unit(-2.0, 0.0);
    this.c = new Unit(-1.0, 0.0);

    this.circuit = new Circuit();
};

SVM.prototype = {
    forward: function(x, y) {
        this.unit_out = this.circuit.forward(x,y, this.a, this.b, this.c);
        return this.unit_out;
    },

    backward: function(label) {
        this.a.grad = 0.0;
        this.b.grad = 0.0;
        this.c.grad = 0.0;

        var pull = 0.0;
        if (label === 1 && this.unit_out.value < 1) {
            pull = 1;
        }

        if (label === -1 && this.unit_out.value > -1) {
            pull = -1;
        }

        this.circuit.backward(pull);

        this.a.grad += -this.a.value;
        this.b.grad += -this.b.value;
    },

    learnFrom: function(x, y, label) {
        this.forward(x, y);
        this.backward(label);
        this.parameterUpdate();
    },

    parameterUpdate: function() {
        var step_size = 0.01;
        this.a.value += step_size * this.a.grad;
        this.b.value += step_size * this.b.grad;
        this.c.value += step_size * this.c.grad;
    }

};

var data = []; var labels = [];
data.push([1.2, 0.7]); labels.push(1);
data.push([-0.3, -0.5]); labels.push(-1);
data.push([3.0, 0.1]); labels.push(1);
data.push([-0.1, -1.0]); labels.push(-1);
data.push([-1.0, 1.1]); labels.push(-1);
data.push([2.1, -3]); labels.push(1);
var sum = new SVM();

var evalTrainingAccuracy = function() {
    var num_correct = 0;
    for(var i = 0; i < data.length; i++) {
        var x = new Unit(data[i][0], 0.0);
        var y = new Unit(data[i][1], 0.0);
        var true_label = labels[i];

        var predicted_label = svm.forward(x,y).value > 0 ? 1 : -1;
        if(predicted_label === true_label) {
            num_correct++;
        }
    }

    return num_correct / data.length;
};
