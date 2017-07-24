# jq-validator

### 概述
一个超轻量级，便于扩展的表单验证插件

### 效果

### 使用

1.引入``jq``,``bootstrap``基础库

```html
<script src="http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js"></script>
<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
```

2.引入插件

```html
<script src="./validator-1.0.1.js"></script>
```

3.定义规则

```html
<!-- data-jv 为规则  data-jv-msg 为提示信息 -->
<!-- 具体规则请参照 validator.js 内部规则字典 -->
<form id="register">
    <div class="form-group">
        <label for="userName">账号：</label>
        <input type="text" class="form-control" id="userName" placeholder="请输入账号" name="userName"
        data-jv-required="true" data-jv-required-msg="账号不能为空"              
        data-jv-nosymbol="true" data-jv-nosymbol-msg="账号只能用数字字母下划线组成"
        data-jv-min-length="9" data-jv-min-length-msg="账号长度不得小于9位"
        data-jv-max-length="15" data-jv-max-length-msg="账号长度不得打于15位"
        >
    </div>
</form>
```

4.调用插件

```javascript
    $('#register-form').jxzValidator({
        plugName:'jv',                          // 自定义属性名  默认为:'jv'
        validEvent: 'blur',                     // 激活验证方式  默认为'input'
        isAllRules:false,                       // 是否显示全部验证结果，默认是false即显示单条
        success: function ( res ) {             // 表单验证成功
            /* res.resultArr {Array} 判断结果，例如[true,false,false,true]
            *  res.$this {Object} 指向为当前form表单
            * */
            var sendStr = res.$this.serialize();
            $.ajax( {
                method: 'POST',
                url: '/formSubmit',
                data: sendStr,
                success: function () {
                    alert( '注册成功，正在刷新页面');
                    window.location.reload();
                }
            } );
        },
        error: function (res) {                 // 表单验证失败
            /* res同 success */
            console.log('验证失败')
        }
    });
```

### 自定义

1.留了一个api接口用来扩展正则规则``$[fn].extendRules``,例如：
```javascript
    // 放在正式验证表单之前
    // 用call继承，this指向当前 $ 表单规则控件,return必须返回一个boolean类型
    $('#register-form').extendRules({
        "idcard":function(){
            return new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).text(this.val);
        }
    });
```

2.修改validator.js 中的 ``__RULES__``对象
```javascript
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
      }},
      "idcard":function(){
          return new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).text(this.val);
      }
```

### 联系方式

如果你有好的意见或建议，欢迎加我的微信jin616347058，表示很乐意交流技术~~

![QR code](http://otfhhagqp.bkt.clouddn.com/my/wx_qrcode.jpg)
