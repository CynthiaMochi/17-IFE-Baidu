// 订阅-发布模式
function Events() {
    this.events = {}
}
Events.prototype.on = function(subs, cb) {
    if (this.events[subs]) {
        this.events[subs].push(cb)
    } else {
        this.events[subs] = []
        this.events[subs].push(cb)

    }
}
Events.prototype.trigger = function(subs) {
    var args = [].slice.call(arguments, 1),
        self = this;
        console.log(subs)
    this.events[subs] && this.events[subs].forEach(function(sub) {
        sub.apply(self, args)
    })
}

Events.prototype.off = function(subs) {
    for(var key in subs) {
        if (this.events.hasOwnProperty(subs) && key === subs ) {
            delete this.events[key]
        }
    }
}
// 递归
function Observer(obj) {
    this.data = this.makeProxy(obj);
    this.events = new Events()
}

Observer.prototype.$watch = function (attr, cb) {
    this.events.on(attr, cb)
}

Observer.prototype.makeProxy = function(data) {
    var value,
        self = this;
    for(var key in data) {
        if (data.hasOwnProperty(key)) {
            value = data[key]
            if (typeof value === 'object') {
                data[key] = self.makeProxy(value)
            }
        }
    }
    return  new Proxy(data, {
        get: function(trapTarget, key, receiver) {
            console.log("你访问了"+ key)
            return Reflect.get(trapTarget, key,receiver)
        },
        set: function(trapTarget, key, newVal,receiver) {
            console.log("你设置了"+ key, "新的值为" + newVal)
            self.events.trigger(key, value, newVal)
            return Reflect.set(trapTarget, key, newVal, receiver)
        }
    })}


var app = new Observer({
    name: 'liujianhuan',
    age: 25,
    company: 'Qihoo 360',
    address: 'Chaoyang, Beijing'
})

app.$watch('age', function(oldVal, newVal){
    console.log('我的年龄变了，原来是: '+ oldVal +'岁，现在是：'+newVal+'岁了')
})

app.data.age = "dd"

function makeProxy (data) {
    var value;
    for(var key in data) {
        if (data.hasOwnProperty(key)) {
            value = data[key]
            if (typeof value === 'object') {
                data[key] = makeProxy(value)
            }
        }
    }
    return  new Proxy(data, {
        get: function(trapTarget, key, receiver) {
            console.log("你访问了"+ key)
            this._
            return Reflect.get(trapTarget, key,receiver)
        },
        set: function(trapTarget, key, newVal,receiver) {
            console.log("你设置了"+ key, "新的值为" + newVal)
            return Reflect.set(trapTarget, key, newVal, receiver)
        }
    })
}



var obj = {
 a: 1,
 b: 2,
 c: {
     d: 3,
     e: 4
 }
}

var deObj = new Observer(obj)
