// ————————————————
// 版权声明：本文为CSDN博主「DoGame?GoGoGo」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/q553401387/article/details/122435537

export default class CallNative {
    /**
     * 调用安卓或者IOS方法
     * @param funcName 需要调用的方法名
     * @param param 需要传入的数据
     * 我的操作是,在OC 代码里创建一个专门接收脚本调用的函数，然后脚本传入方法名，和参数(参数为            string类型)
     */
     public static callStaticMethods(funcName: string, param: string = "") {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("CocosHelper", "test1","shememqingk");
                // jsb.reflection.callStaticMethod("CocosHelper",
                // "test1:param:",
                // funcName,
                // param);
            }
        }
    }

    static getDeviceInfo() {
       
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                let device_info = jsb.reflection.callStaticMethod("AdMaster","showAd:title:","有志者事竟成","淡定");
                return device_info;
            }
        } 
    }

    /** 监听原生事件接口 */
    //这里的msg 可以是任意参数，如果参数类型复杂可以传入json数据哦
    public static onFunc(msg: any): void {
        //然后我们就可以在这里面 更具oc的回调在处理游戏脚本里的任意方法拉~
        console.log('msgrrrrr',msg);
    }
}

// 将监听原生事件接口绑定到全局window上
(window as any).onFunc = CallNative.onFunc;