 #Web form step 
[![Web form step](./profile/webform/webformStep.png "print")](./profile/webform/webformStep.png "")

经过对web form step的改造 目前可以实现模块化开发，继承父级模型，不需要重复编写逻辑以及更清晰的业务逻辑实现    `webform_step.js`,`webform_step_module.js` 都不能修改,入口文件已经初始化了所有行为动作

##How it work

拿webfromstep为例子 我们可以直接继承父级模型，或者当你需要自定义当前模块时可以在父级的基础上增加自己的逻辑如：
```javascript
editNext:function(){


        this._editNext();//继承父级editnext的动作模型

        if(jQuery("a[data-for='webform-component-employee-details']").hasClass("on")){
            saveDependent('webform-component-employee-details--spouse-partner');
        }

        if(jQuery("a[data-for='webform-component-summary']").hasClass("on")){
            if(!check_vdate('webform-component-summary--estimated-pack-date')) return;
            if(!check_vdate('webform-component-summary--preferred-survey-date')) return;
        }

    },
```

###install
安装方法： 为可更好地分离前端跟后端的代码，采取建立app文件夹的方式装载所有项目 webform模块的js以及其他静态文件，安装方式:    
```javascript    
    var loadMod = ['webform_step','webform_search'];
```
js 自动加载2个模块，路径分别是

>app/webform_step/webform_step.js    
>app/webform_search/webform_search.js

### Action list
webform step 里涵盖了 :    
动作 ` editCancel`,` editDraft`,` editBack`,` editNext `,`editSubmit `    
附件操作  `editSubmitAttachment`    
初始化 `init`    
动作列表：    
- mod.editDraft() save as draft 事件    
- mod.editCancel()取消事件    
- mod.editBack()返回事件        
- mod.editNext()nextStep 事件    
- mod.editSubmit()提交事件    
- mod.editSubmitAttachment() 附件事件 与submit 绑定到同一个模型    
- mod.beforeunload()刷新页面之前 默认是提示是否离开页面    
 
```javascript
    function _init_webform(mod) {

        mod.init();

        jQuery("#edit-draft").click(function () {
            mod.editDraft();
        });

        jQuery("#edit-cancel").click(function () {
            mod.editCancel();
        });

        jQuery("#edit-back").click(function () {
            mod.editBack();
        });

        jQuery("#edit-next").click(function () {
            mod.editNext();
        });

        jQuery("#edit-submit").click(function () {

            mod.editSubmitAttachment();
            mod.editSubmit();
        });

        jQuery(window).bind('beforeunload', function () {
            mod.beforeunload();
        });
    }

```


### $.script
异步加载JS模型 实现JS按需加载的效果，减少了drupal 的PHP加载消耗，更好实现代码重用性    
**使用方法**：    
单文件引入

```javascript

    $script(WF.Root+v+'/'+v+'.js');
```

多文件引入    

```javascript

    $script([
        RootPath + "common.js"
        , RootPath + "dependency.js"
        , RootPath + "plugin.js"
        , RootPath + "step.js"
        , RootPath + "webform_step_module.js"
        , RootPath + "module/" + WF.site + ".js"
        , RootPath + "form/"+WF.type+".js"
    ], function() {
        //加载结束后执行一下方法
        $.extend(webform_step_module, relo_webform_step_module);
        _init_webform(webform_step_module);
    });
    
```    

### WF global variable
为了更好地规划函数的全局变量 我们使用了按照模块加载全局变量的模式，让全局变量的使用覆盖率更好，目前webform Step 的全局函数有    
    WF.site = Drupal.settings.system_code_prefix; //表单名称    
    WF.type = js_form_type;        // form 类型    
    WF.Root =Drupal.settings.basePath+'app/'; //网站路径   
    WF.Path = Drupal.settings.basePath+'app/webform_step/';//js 路径    

##Code structure

* webform_step.js 主入口  
* webform_step_module.js 模块行为动作如 next step
* step.js 下一步上一步触发器
* plugin.js webformstep 插件
* dependency.js 程序依赖函数
* common.js 全局函数 如 `auto_to_page_top` , `discard_change_btn_click` 等
* module 文件夹包含了所有站点的webformstep 业务逻辑
* form 分为不同的form 里面主要的文件是 alidate 以及 form 的特殊属性

### module structure
module的命名规则必须遵循webformstep模块的命名 如 文件名 必须为 **relo_ey**
文件内部函数必须是：
```javascript
var relo_webform_step_module = {
    业务逻辑代码
}
```
当存在某个动作增加自定义逻辑时 可以在继承父级逻辑的情况下添加自己的逻辑如修改editNext：
```javascript
    editNext:function(){
        this._editNext();
       业务逻辑代码
    }
```
也可以完全不理会父级逻辑 添加自己的逻辑 如：
```javascript    
editNext:function(){
        this._editNext();
           业务逻辑代码
    }
```
文件结构如：
> webformstep/module/relo_ey.js    

### form structure
form 模块包含了文件以form的类型进行区分如：`if`, `srf` 等 ，废除了原先的alidate文件取而代之是将代码放到这里 更好的进行开发维护
当我们需要在 ey的if form里面添加一个validate的话 我们的文件结构应该如：
> webformstep/form/if/relo_ey_validate.js