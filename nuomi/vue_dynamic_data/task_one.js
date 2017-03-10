// 实现一个Observer，访问对象时输出对应

// 传入一个对象
function Observer(obj) {
    this.data = obj;
    this.walk(this.data);
}

// 需要遍历对象上的所有属性
// 如果属性还是对象就要展开
// 如果不是就配置
Observer.prototype.walk = function (obj) {
    for (var key in obj) {
        var value = obj[key]
        if (Object.hasOwnProperty(key)) {
            if (typeof value === "object") {
                new Observer(value)
            }
            this.convert(key, value)
        }
    }
}

Object.prototype.convert = function (key, value) {
    Object.defineProperty(this.data, key, {
        configurable: true,
        enumrable: true,
        get: function() {
            console.log("你访问了"+ key)
            return value;
        },
        set: function(newVal) {
            console.log("你设置了"+ key, "新的值为" + newVal)
            if (value === newVal) return
            value = newVal;
        }
    })
}

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

// 要实现的结果如下：
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science

// 消息订阅
function Dep() {
    this.subs = []
}
Dep.target = null

// 存储订阅者
Dep.prototype.addSub = function(sub) {
    this.subs.push(sub)
}

// 触发订阅，订阅者采取行动（update)
// 每次set的时候触发
Dep.prototype.notify = function() {
    this.subs.forEach(function(sub) {
        sub.update()
    })
}

function defineReactive(obj, key, val) {
    var dep = new Dep()
    Object.defineProperty(obj, key, {
        configurable: true,
        enumrable: true,
        get: function() {
            // 需要判断调用者是谁
            // 是否是watcher查看
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return val
        },
        set: function(newVal) {
            if (val === newVal) return
            dep.notify() // 触发
        }
    })
}

// 怎么注册
v.$watch("a", function() {
    console.log("hh, watch成功")
})

// expOrFn是要观察的属性?
// vue实例，要观察的实例，触发的回调
function Watcher(vm, expOrFn, cb) {
    this.cb = cb;
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.value = this.get(); // 调用Watch构造函数的时候，会get--->查看值----->要在对应属性里判断是不是watcher在查看
} 
Watcher.prototype.update = function() {
    this.run()
}


Watcher.prototype.run = function() {
    var value = this.get();

    // 触发的时候看观察的属性的值是否发生了变化
    if (value !== this.value) {
        this.value = value
        this.cb.call(this.vm)
    }
}

Watcher.prototype.get = function() {
    Dep.target = this; // 全局变量

    var value = this.vm._data[this.expOrFn]; // 访问vm实例data的对应属性的get
    Dep.target = null
    return value;
}