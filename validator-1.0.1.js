/**
 * Created by Administrator on 2017/2/25/025.
 */

/**
 * [description]
 * @param  {[type]} root    [description]
 * @param  {[type]} factory [description]
 * @param  {[type]} plug    [description]
 * @return {[type]}         [description]
 */

(function (root,factory,plug) {
    factory(root.jQuery,plug);
})(window,function ($,plug) {

    // 默认参数
    var __DEFAULTS__ = {
        plugName:'jv',
        validEvent:"input",
        isAllRules:false,
        success:function () {},
        error:function () {}
    };

    // 验证规则
    var __RULES__ = {
        "required": function () { // 是否为空
            return this.val() != "";
        },
        "nosymbol": function () { // 是否为字母数字下划线组成
            return new RegExp( /^\w+$/ ).test( this.val() );
        },
        "nocharacter":function () { // 只能输入中文和英文
            return new RegExp(/^[\u4e00-\u9fa5a-z]+$/gi).test(this.val());
        },
        "integerare":function () {  //是否为非负正整数
            return new RegExp(/^[0-9]*[1-9][0-9]*$/).test(this.val());
        },
        "name": function () {
            var a = {
                chineseName: new RegExp( /^[\u4e00-\u9fa5 ]{2,20}$/ ).test( this.val() ),
                englishName: new RegExp( /^[a-zA-Z\/ ]{2,20}$/ ).test( this.val() )
            };
            return ( ( a.chineseName || a.englishName ) && true ) || false;
        },
        "chinese-name": function () {
            return new RegExp( /^[\u4e00-\u9fa5 ]{2,20}$/ ).test( this.val() );
        },
        "english-name": function () {
            return new RegExp( /^[a-zA-Z\/ ]{2,20}$/ ).test( this.val() );
        },
        "email": function () { // 是否为邮箱
            return new RegExp( /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/ ).test( this.val() );
        },
        "phone": function () { // 是否为电话
            return new RegExp( /^1[34578]\d{9}$/ ).test( this.val() );
        },
        "mobile": function () { // 是否为手机
            return new RegExp( /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test( this.val() );
        },
        "min-length": function (data) { // 最小长度
            return this.val().length >= data;
        },
        "max-length": function ( data ) { // 最大长度
            return this.val().length <= data;
        },
        "check-val":function(data){     // 对比值
            return $(data).val() === this.val();
        },
        "regex": function ( data ) { // 自定义规则
            return new RegExp( data ).test( this.val() );
        }
    };

    $.fn[plug] = function (options) {

        if (!this.is('form'))return this;                                       // 判断节点是否为form节点
        var _this = this;                                                       // 本jq 节点,局部变量
        this.$filed = this.find('input,select,textarea').not('');               // 寻找节点
        $.extend(this,__DEFAULTS__,options);                                    // 扩展默认选项
        this.$filed.on(this.validEvent,function (event,paramArr) {
            var valid = true;
            var $filed = $(this);
            var $group = $filed.parent('.form-group');

            // 如果不引入bootstarp或替换报错效果请删除或替换下两行
            $filed.siblings('p').remove();
            $group.removeClass('has-success has-error');

            // 遍历规则
            $.each(__RULES__,function (k, func) {
                if ($filed.data(__DEFAULTS__.plugName+'-'+k)){
                    var validRules = $filed.data(__DEFAULTS__.plugName+'-'+k);
                    var validMsg = $filed.data(__DEFAULTS__.plugName+'-'+k+'-msg');
                    var result = func.call($filed,validRules);
                    // 结果为false 的时候
                    if (!result){
                        valid = false;
                        // 如果不引入bootstarp或替换报错效果请删除或替换该行
                        $filed.after('<p class="text-danger">'+((validMsg)?validMsg:"不符合验证规则")+'</p>');

                        if (!_this.isAllRules)return false;
                    }
                }
            });

            // 如果不引入bootstarp或替换报错效果请删除或替换该行
            $group.addClass('has-'+ ((valid) ?'success':'error'));

            if (paramArr && Object.prototype.toString.call(paramArr) === '[object Array]'){
                paramArr.push(valid);
            }else if(paramArr && typeof paramArr === 'boolean'){
                paramArr = valid;
            }
        });

        // 提交验证
        this.off().on('submit',function (e) {
            e.preventDefault();
            var resultArr = [],_result = true;
            _this.$filed.trigger(_this.validEvent,[resultArr]);
            $.each(resultArr,function (i, v) {
                if (!v)_result = false;
            });
            (_result)? _this.success({$this: $( _this ),resultArr: resultArr}):_this.error({$this: $( _this ),resultArr: resultArr});
        });
    };

    // 扩展函数
    $.fn[plug].extendRules = function (newRules) {
        $.extend(__RULES__,newRules);
    }
},"jxzValidator");
