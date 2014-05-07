#Interact Rmsportal

##兼容性问题
###form获取的兼容性问题
左栏菜单不显示修改文件名字:
>FWWEB/fw/common/RMI_LeftMenu.jsp    

错误信息:
```javascript
document.forms(0).action = document.forms(0).action+"?startmenutag=0.1";
document.forms(0).submit();
```
> document.forms(0) 写成 document.forms[0] 项目主要修改这项即可兼容其他浏览器


解决方案：
```javascript
var accessControlForm = document.forms['accessControlForm'];
accessControlForm.action = accessControlForm.action +"?startmenutag=0.1";
accessControlForm.submit();
```

或者
```javascript
var accessControlForm = document.forms[0];
accessControlForm.action = accessControlForm.action +"?startmenutag=0.1";
accessControlForm.submit();
```

####workflow 
文件地址:  
> http://crown-app.bamboonetworks.com/FWWEB/fw/js/workflow/workflow.js

125行修改如下:
```javascript
// Filter Doc Type
function filterDoctype(formName)
{
	document.forms[formName].action = document.forms[formName].action + "?doctypeSelected=true";
	document.forms[formName].submit();
}
```

###取值问题
以十进制整型转化
var startIndexId = parseInt(document.getElementById(groupCountId).value,10);
引入JQ后改成：
var startIndexId = $('#'+groupCountId).val();




###系统内置变量兼容性问题
`field.parentNode` 在chrome上出现无法获取问题，解决方式`field.parent()`

##jQuery兼容性应用
在 SearchWorkflowItems.jsp    文件引入JQUERY 开始替换旧版本的IE DOM操作    
目前遇到问题是 旧版IE 的 documen.getelimentById 的用法可以识别 id,name等问题    
鉴于对新浏览器的支持，定义了2个函数分别是：    

###DOM操作兼容性问题考虑

 在 input 获取name 值的对象时使用
```javascript
/**
 * input name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function $IN(name){
	return $('input[name="'+name+'"]');
}
```

 在 form 获取name 值的对象时应用
```javascript
/**
 * form name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function $FO(name){
return $('form[name="'+name+'"]');

}
```

`document.getElementById(btnId).disabled = true;` 在CHROME上不支持应该使用`$('#'+btnId).attr('disabled',true);`代替

###JQUERY的DOM的修改方法
目前如果使用jq操作dom的时候遇到问题就是  
documen.getElimentById（objWfSearchBO.doctype）    
如果直接修改的话：  
> $("#objWfSearchBO.doctype");    

会出现解析为   
> id=objWfSearchBO 以及 class=doctype 的对象  
 
最终的解决方案是   
```javascript
 $("#objWfSearchBO\\.doctype"); 
```

###JQUERY的动作操作    
detachEvent 在IE上可以跑通但是chrome不行所以修改方案为:     
validations.js 1257：
```javascript    

			field.detachEvent('onmouseover',dicObject.lookup(fieldIdentifier));
			field.detachEvent('onmouseout',hideToolTip); 
			
        修改为

      field.mouseover(function(){
        dicObject.lookup(fieldIdentifier)
      }).mouseout(function(){
        hideToolTip()
      })

```


##深层级的赋值问题
IE的`field.className||'';` 这段代码本身没错误，    
但是CHROME如果field没有定义，就会出现报错，正确使用应该是 `field&&field.className||''`