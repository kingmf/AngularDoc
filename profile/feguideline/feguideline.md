#ODC Font-End develop guideline
##通用约定
###文件与目录命名约定
+ 一律小写, 必须是英文单词或产品名称的拼音, 多个单词用连字符(-)连接. 只能出现英文字母、数字和连字符, 严禁出现中文.
+ 出现版本号时, 需要用字母 v 做为前缀, 小版本号用点号(.)隔开, 比如 global-v8.js 或 detail-v2.2.js .
+ 该命名规范适用于 html, css, js, swf, php, xml, png, gif, jpg, ico 等前端维护的所有文件类型和相关目录.
+ js 和 css 压缩文件, 统一以 -min 结尾, 比如源码文件为 seed.js, 压缩后为 seed-min.js .

###id 和 class 命名约定  
+ id 和 class 的命名总规则为： 内容优先,表现为辅. 首先根据内容来命名, 比如 main-nav. 如果根据内容找不到合适的命名, 可以再结合表现来定, 比如 skin-blue, present-tab, col-main.
+ id 和 class 名称一律小写, 多个单词用连字符连接, 比如 recommend-presents.
+ id 和 class 名称中只能出现小写的 26 个英文字母、数字和连字符(-), 任何其它字符都严禁出现.
+ id 和 class 尽量用英文单词命名 . 
+ 在不影响语义的情况下, id 和 class 名称中可以适当采用英文单词缩写, 比如 col, nav, hd, bd, ft 等, 但切忌自造缩写.
+ id 和 class 名称中的第一个词必须是单词全拼或语义非常清晰的单词缩写, 比如 present, col.
仅在 JavaScript 代码中当作 hook 用的 id 或 class, 命名规则为 J\_UpperCamelCase(请注意, J_ 后的首字母也大写！), 其中字母 J 代表 JavaScript, 也是钩子(hook)的象形. 注意：如果在 JavaScript 和 CSS 中都需要用到, 则不用遵守本约定.
+ 在自动化测试脚本中当作 hook 用的 class, 命名规则为 T_UpperCamelCase, 其中字母 T 代表 Test.


##JavaScript 语言规范  
+ 声明变量时, 必须加上 var 关键字.
+ 尽量减少全局变量的使用.
+ 语句总是以分号结尾.
+ 不要在块内声明函数.
+ 标准特性优于非标准特性(如果类库有提供, 优先使用类库中的函数).
+ 不要封装基本类型.
+ 只在解析序列化串时使用 eval() .
+ 禁止使用 with .
+ 减少使用 continue 和 break .
+ 仅在函数内使用 this .
+ 使用 Array/Object 直接量, 避免使用 Array/Object 构造器.
+ 禁止修改内置对象的原型.


###JavaScript 编码风格
####行与缩进    
**语句行**    

+ 尽可能不要让每行超过 120 个字符;            
+ 语句必须以分号作为结束符, 不要忽略分号;    
+ 空格    
+ 数值操作符(如, +/-/*/% 等)两边留空;    
+ 赋值操作符/等价判断符两边留一空格;    
f+ or 循环条件中, 分号后留一空格;    
+ 变量声明语句, 数组值, 对象值及函数参数值中的逗号后留一空格;    
+ 空行不要有空格;    
+ 行尾不要有空格;    
+ 逗号和冒号后一定要跟空格;    
+ 点号前后不要出现空格;    
+ 空对象和数组不需要填入空格;    
+ 函数名末尾和左括号之间不要出现空格;    
**空行**
+ 逻辑上独立的代码块使用空行分隔;
+ 文件末尾留 1~2 个空行;
+ 不要吝啬空行. 尽量使用空行将逻辑相关的代码块分割开, 以提高程序的可读性.
**缩进**
+ 以 4 个空格为一缩进层次;
+ **变量声明**:    
- 多个变量声明时, 适当换行表示;    
- 参照 var 关键字, 缩进一层次;    
+ **函数参数**:
- 函数参数写在同一行上;    
- 传递匿名函数时, 函数体应从调用该函数的左边开始缩进;    
+ **数组和对象初始化时**:    
- 如果初始值不是很长, 尽量保持写在单行上;    
- 初始值占用多行时, 缩进一层次;    
- 对象中, 比较长的变量/数值, 不要以冒号对齐;    
+ **二元/三元操作符**:    
- 操作符始终跟随前行;
- 实在需要缩进时, 按照上述缩进风格;
+ **表达式中的缩进同变量声明时**;

####括号
原则: 不要滥用括号, 必要时一定要使用.

+ if/else/while/for 条件表达式必须有小括号;    
+ 语句块必须有大括号;    
+ 一元操作符(如 delete, typeof, void)或在某些关键词(如 return, throw, case, new) 之后, 不要使用括号;    

####变量    
+ 变量如有较广的作用域, 使用全局变量; 如果是在类中, 可以设计成为一个类的成员;    
+ 函数体中, 多个局部变量集中在一起声明, 避免分散;    
+ 适当延迟变量的初始化;   

####字符串
+ JS 代码中, 单行字符串使用单引号;    
+ JS 代码中, 多行字符串使用 + 拼接形式, 不要使用 \ 拼接;    
+ HTML 中 Element 属性, 使用双引号;        

####命名规范    
+ 原则： * 尽量避免潜在冲突; * 精简短小, 见名知意;    
+ 普通变量统一使用驼峰形式;
+ 常量使用全部大写, 多个单词以下划线分隔;
+ 枚举量, 同常量;
+ 私有变量, 属性和方法, 名字以下划线开头;
+ 保护变量, 属性和方法, 名字同普通变量名;    
+ 方法和函数的可选参数, 名字以 opt_ 开头, 使用 @param 标记说明;    

+ **方法和函数的参数个数不固定时**:    
- 可添加参数 var_args 为参数个数;        
- 取代使用 arguments;        
- 使用 @param 标记说明;        
+ **Getter/Setter 命名**:    
- 以 getFoo/setFoo(value) 形式;    
- 布尔类型使用 isFoo()/hasFoo()/canDo()/shouldDO() 也可;    
+ **命名空间**:        
- 为全局代码使用命名空间, 如 sloth.*;    
- 外部代码和内部代码使用不同的命名空间;    
- 重命名那些名字很长的变量, 不要在全局范围内创建别名, 而仅在函数块作用域中使用;    
- 文件名应全部使用小写字符, 且不包含除 - 和 _ 外的标点符号;    
- 临时的重复变量建议以 i, j, k, ..., 命名;    

##开发原型思考
Web2.0高交互时代，开发一个组件，空间，模型，首先我们需要思考的就是代码的布局，重用性，以及代码的维护性。
例如一个CRUD组件，我们需要实现这套功能我们需要做的事情就是:
```javascript
Function create(){}
Function request(){}
Function update(){}
Function delete(){}
```
我们应该怎么来组织这个结构才能体现代码的高可用，高维护的特性呢。

###函数定义 类定义
一共有2张crud form，一个是A表，1个是B表，在没通过仔细考虑的话我们的设计方法如：
```javascript
Function A_create(){}
Function A_request(){}
Function A_update(){}
Function A_delete(){}
Function B_create(){}
Function B_request(){}
Function B_update(){}
Function B_delete(){}
```
经过分析我们知道4CRUD方法可以通用 所以我们定义方式改变为
```javascript
Var CRUD = function(){
　　This.create = function {}
　　This.request=function (){}
　　This.update=function (){}
　　This.delete=function (){}
};
```
然后通过 
```javascript
A = new CRUD();
B = new CRUD();
```
这样代码量可以减少一倍，维护成本减少一倍
###变量定义
目前我们使用到的变量在javascript里面体现只有2种，全局变量以及局部变量，在使用变量的时候我们要考虑的是控件的需求来定义，如我们项目种贯穿整个项目的变量有
ROLE,LEVEL,ACTION,MODULE,CONTROLLER 等，那么我们需要定义一个全局变量。
```javascript
　　Var 
　　ROLE,
　　LEVEL,
　　ACTION,
　　MODULE,
　　CONTROLLER ;
```

然而在项目中往往会出现重名的状况，这样就会造成变量之间互相感染。

解决方案：
```javascript
　　Global = {
　　ROLE,
　　LEVEL,
　　ACTION,
　　MODULE,
　　CONTROLLER 
　　}
```

这样的话既可以解决感染问题，又体现出变量的真正意义。

##jQuery的运用
在目前项目中我们广泛应用到的框架就是jquery，特点就是高兼容性，高拓展性，维护成本低等特点，但是jquery不是真正意义上的js框架，只是一个js的执行库，对于jquery的使用我们定下几个规范。
###jQuery对象定义
在操作dom的时候我们往往使用 
```javascript
　　$(‘#obj’).click()
　　$(‘#obj’).change()
　　$(‘#obj’).focus()
```
但是重复的DOM操作会使得jquery重复遍历DOM树，导致程序变得过慢，所以我们要定义jquery对象时，我们应该
```javascript
　　Var $obj = $(‘#obj’);
　　$obj.click()
　　$obj.change()
　　$obj.focus()
```
其中 $ 符号代表了这个是jquery对象的意思；
对于动态变量名的定义我们可以采取 cache机制来实现如

```javascript
Var cache = [];
Var Attend = function(name){
　　Return cache[name]&&cache[name]||$(‘#’+name);
}; 
```
###链式写法
按照上例写法
```javascript
Var $obj = $(‘#obj’);
$obj.click()
$obj.change()
$obj.focus()
```
我们可以优化成
```javascript
Var $obj = $(‘#obj’);
$obj.click().change().focus(); 
```


##模块化开发
目前javascript的开发模式是 CMD开发模型，AMD开发模型，杰出的框架代表有阿里巴巴的SEAJS以及国外最流行的requirejs，这2套框架最强大的地方是实现真正的前后端分离，按需加载，模块化开发的特点，普通的按需加载使用库推荐 $.script 

###前后端分离范例
以$script为例，前端页面定义需要加载的模块 
```javascript
Var loadMod = [‘a’,’b’,’c’];
```
我们只需要加载一个js文件loadmod.js，以及$script库
通过判断来加载

```javascript
var loadScript = loadMod||new Array(),
if(loadScript.length>0){
    For(var i=0;i<loadScript.length;i++)
        $script(loadScript[i]+'.js');
    })
}
```
###按需加载范例
$script 的使用方法

```javascript
    $script([
        RootPath + "a.js"
        , RootPath + "b.js"
        , RootPath + "c.js"
    ], function() {
        //加载结束后执行一下方法
        
　　});
```
　　这种写法可以减少页面的js文件加载，以及根据页面的业务不同加载不同的js文件
　　
　　
###模块化开发范例
应用seajs的模块化开发范例：
```javascript
Var 
$ = require(‘jquery’),
M= require(‘MODULE’),
plugin= require(‘plugin);

M = new M();
```
##现代框架推荐以及使用场景
目前最为流行的前端框架可以分成： 
   
+ MVC框架的backbone，    
+ MVVM框架的knoutjs，angularjs，    
+ MVP框架的RIOTjs，    
+ 自动化框架grunt。    
###mvc框架
Backbone 前端js框架是始祖，基于JQ，根据项目不同模块化开发
适用场景，高交互的单页面程序

###MVVM框架
数据与视图绑定的框架，适用于非大数据的CRUD操作，

+ 特点是效率高，    
+ 代码量少，    
+ 维护成本低    

的特点，如 dashboard
###自动化框架
Grunt 是目前最流行的前端自动化框架，基于NODEJS，包含了很多模块的拓展，最常用的模块有 CSSMIN,JSMIN,HTMLMIN,JSLINT,Jarma等，它的作用在我们开发中可以使用到的是：

+ Js语法检查    
+ Js代码合并    
+ Js代码压缩    
+ LESS,SASS,SCSS遍历    
+ Css代码压缩    
+ HTML代码压缩    
+ 自动化单元测试    
+ 自动化端对端测试    
+ 开发环境产品环境区分    

在我们日常开发环境中搭建一个grunt，在发布的时候一键生成所需的js，css，html，跑单元测试，业务逻辑测试等操作，而不需要重新的人工来操作这些繁琐的事情




##CSS 编码规范
**css 校验**  
除了 css hack 和浏览器私有属性， 推荐使用 w3c css validator 校验其余的代码.

###代码规范
**一般性命名**  
使用小写字母，复合词以 - 分隔; 例如 nav.css , login-nav.css , login-page

id 和类的命名
为 id 和样式类使用有意义或通用的名字，避免由于 css 命名更改引起的不必要的文档或模板改变；例如
```css
/* 不推荐： 无意义 */
#yee-1901 {}

/* 不推荐： 表现层的命名 */
.button-green {}

/* 推荐: 具体 */
#gallery {}
#login {}
.video {}

/* 推荐: 通用 */
.effect {}
.alt {}

```

id 和 class 的命名长度应该适中，不要太简略也不要太详细；例如
```css
/* 不推荐 */
#navigation {}
.atr {}

/* 推荐 */
#nav {}
.author {}

```

####元素选择器
为了 性能原因 ， 请避免元素选择器和类选择器以及 id 选择器混用;例如
```css
/* 不推荐 */
ul#example {}
div.error {}

/* 推荐 */
#example {}
.error {}
```
####简写属性名字
为了提高可读性，尽可能的使用简写属性。例如
```css
/* 不推荐 */
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;

/* 推荐 */
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```
**0 和单位**  
对属性值为 0 的情况省略单位；例如
```css
margin: 0;
padding: 0;
```
**0 前缀情况**  
省略属性值中的 0 前缀;例如  
```css
font-size: .8em;
```
**16 进制的颜色值表示**  
尽可能使用 3 个字符的 16 进制颜色值；例如
```css
/* 不推荐 */
color: #eebbcc;

/* 推荐 */
color: #ebc;
```

**前缀**  
为了防止冲突，对于应用特定的样式附加应用前缀；例如  
```css
.login-help {} /* login page */
#detail-note {} /* detail page */
```
**hacks**  
避免 css hack ， 考虑使用特定浏览器前缀表示；例如
```css
.ks-ie6 p {
    margin: 1em 0;
}
```
####格式规范
**属性声明顺序**  
按照字母顺序声明属性，排序时忽略私有的浏览器前缀，对于特定的浏览器，私有的浏览器前缀应该参与排序;例如
```css
background: fuchsia;
border: 1px solid;
-moz-border-radius: 4px;
-webkit-border-radius: 4px;
border-radius: 4px;
color: black;
text-align: center;
text-indent: 2em;
```
**块缩进**
块的内容应该被缩进；例如  
```css
@media screen, projection {

  html {
    background: #fff;
    color: #444;
  }

}
```
**分号**  
使用分号结束单个属性的定义；例如
```css
/* 不推荐 */
.test {
  display: block;
  height: 100px
}

/* 推荐 */
.test {
  display: block;
  height: 100px;
}
```
**空行**  
多个选择以及声明间以行分隔；例如  
```css
/* 不推荐 */
a:focus, a:active {
  position: relative; top: 1px;
}

/* 推荐 */
h1,
h2,
h3 {
  font-weight: normal;
  line-height: 1.2;
}
```
多个 css 规则间以空行分隔；例如  
```css
html {
  background: #fff;
}

body {
  margin: auto;
  width: 50%;
}
``` 
**引号**
尽可能的不用引号，迫不得已时使用单引号.
```css
/* 不推荐 */
@import url("//www.google.com/css/maia.css");

html {
  font-family: "open sans", arial, sans-serif;
}

/* 推荐 */
@import url(//www.google.com/css/maia.css);

html {
  font-family: 'open sans', arial, sans-serif;
}
``` 
**注释**  
成组的 css 规则间用块状注释和空行分离;例如
```css
/* Header */

#login-header {}

#login-header-below {}

/* Footer */

#login-footer {}

#login-footer-below {}

/* Gallery */

.login-gallery {}

.login-gallery-other {}
``` 

##HTML 编码规范
###基本规范
**语义**  
使用符合语义的标签书写 HTML 文档, 选择恰当的元素表达所需的含义;
```html
<!-- 不推荐 -->
<div onclick="goToRecommendations();">All recommendations</div>      
<!-- 推荐 -->
<a href="recommendations/">All recommendations</a>
```
**大小写**  
元素的标签和属性名必须小写, 属性值必须加双引号; 例如
```html
<!-- 不推荐 -->
<A HREF='/'>Home</A>  
<!-- 推荐 -->
<a href="/">Home</a>
```
**缩进**
+ 使用四个空格来表示缩进，不要使用 tab 键;
+ 在块状元素，列表，表格元素后面使用新行，并且对它的子元素进行缩进.

**例如**
```html
<ul>
    <li>
        1
    </li>
</ul>
```
**空格**  
去除比不必要的空格; 例如
```html
<!-- 不推荐 -->
<p>test                  </p>

<!-- 推荐 -->
<p>test</p>
```

**嵌套**  
元素嵌套遵循 (X)HTML Strict 嵌套规则, 推荐使用Firefox插件 HTML Validator 进行检查;  
正确区分自闭合元素和非自闭合元素. 非法闭合包括
```html
：<br>..</br>、<script />、<iframe />
```
, 非法闭合会导致页面嵌套错误问题;
```html
<!-- 不推荐 -->
<title>Test</title>
<article>This is only a test.

<!-- 推荐 -->
<!DOCTYPE html>
<meta charset="utf-8">
<title>Test</title>
<article>This is only a test.</article>
```

**引号**  
使用双引号来标识 html 的属性; 例如  
```html

<!-- 不推荐 -->
<a class='maia-button maia-button-secondary'>Sign in</a>    

<!-- 推荐 -->
<a class="maia-button maia-button-secondary">Sign in</a>
```

**自定义属性**  
通过给元素设置自定义属性来存放与 JavaScript 交互的数据, 属性名格式为 data-xx (例如：data-lazyload-url)
**DOCTYPE**  
页面文档类型统一使用HTML5 DOCTYPE. 代码如下：  
```html
<!doctype html>
```

**编码**  
声明方法遵循HTML5的规范.推荐使用 utf-8 编码.
```html
<meta charset="utf-8" />
```

**注释**  
建议对超过10行的页面模块进行注释, 以降低开发人员的嵌套成本和后期的维护成本. 例如：
```html
<div id="sample">
    ...
</div> <!-- #sample END -->

<div class="sample">
    ...
</div> <!-- .sample END -->
```

**协议**
如果链接和当前页面一致则忽略链接的协议部分，例如
```html

<!-- 不推荐 -->
<script src="http://www.taobao.com/fp.js"></script>

<!-- 推荐 -->
<script src="//www.taobao.com/fp.js"></script>

/* 不推荐 */
.example {
  background: url(http://www.taobao.com/fp.css);
}

/* 推荐 */
.example {
  background: url(//www.taobao.com/fp.css);
}
```

###TODO
+ 使用 TODO 来标记待做事情，便于后期搜索.
+ 在 TODO 后添加 (姓名或邮件) 来表示分类.

例如
```html
<!-- TODO(yiminghe): remove duplicate tag -->
<p><span>2</span></p>
```
###焦点分离

+ 将表现，行为和结构分离：不要在 html 和模板中加入除了结构以外的东西.
+ 在文档中引入尽可能少的样式和脚本

```html
<!-- 不推荐 -->
<!DOCTYPE html>
<title>HTML sucks</title>
<link rel="stylesheet" href="base.css" media="screen">
<link rel="stylesheet" href="grid.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
<h1 style="font-size: 1em;">HTML sucks</h1>
<p>I’ve read about this on a few sites but now I’m sure:
  <u>HTML is stupid!!1</u>
<center>I can’t believe there’s no way to control the styling of
  my website without doing everything all over again!</center>    
  
<!-- 推荐 -->
<!DOCTYPE html>
<title>My first CSS-only redesign</title>
<link rel="stylesheet" href="default.css">
<h1>My first CSS-only redesign</h1>
<p>I’ve read about this on a few sites but today I’m actually
  doing it: separating concerns and avoiding anything in the HTML of
  my website that is presentational.
<p>It’s awesome!
  ```
###元素
**结构性元素**    

- p 表示段落. 只能包含内联元素, 不能包含块级元素;  
- div 本身无特殊含义, 可用于布局. 几乎可以包含任何元素;  
- br 表示换行符;  
- hr 表示水平分割线;  
- h1-h6 表示标题. 其中 h1 用于表示当前页面最重要的内容的标题;  
- blockquote 表示引用, 可以包含多个段落. 请勿纯粹为了缩进而使用 blockquote, 大部分 浏览器默认将 blockquote 渲染为带有左右缩进;  
- pre 表示一段格式化好的文本;  

**头部元素**  

+ title 每个页面必须有且仅有一个 title 元素;  
+ base 可用场景：首页、频道等大部分链接都为新窗口打开的页面;  
+ link link 用于引入 css 资源时, 可省去 media(默认为all) 和 type(默认为text/css) 属性;  
+ style type 默认为 text/css, 可以省去;  
+ script type 属性可以省去; 不赞成使用lang属性; 不要使用古老的<!– //–>这种hack脚本, 它用于阻止第一代浏览器(Netscape 1和Mosaic)将脚本显示成文字;     

```html
<!-- 不推荐 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css"
  type="text/css">

<!-- 不推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"
  type="text/javascript"></script>  
  
<!-- 推荐 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css">

<!-- 推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>

```

noscript 在用户代理不支持 JavaScript 的情况下提供说明;

**文本元素**  
+ a a 存在 href 属性时表示链接, 无 href 属性但有 name 属性表示锚点;
+ em,strong em 表示句意强调, 加与不加会引起语义变化, 可用于表示不同的心情或语调; 
+ strong 表示重要性强调, 可用于局部或全局, strong强调的是重要性, 不会改变句意;
+ abbr 表示缩写;
+ sub,sup 主要用于数学和化学公式, sup还可用于脚注;
+ span 本身无特殊含义;
+ ins,del 分别表示从文档中增加(插入)和删除

**媒体元素**  
+ img 请勿将img元素作为定位布局的工具, 不要用他显示空白图片; 给img元素增加alt属性;例如  

```html
<!-- 不推荐 -->
<img src="spreadsheet.png">
<!-- 推荐 -->
<img src="spreadsheet.png" alt="Spreadsheet screenshot.">
```

+ object 可以用来插入Flash;

**列表元素**  
+ dl 表示关联列表, dd是对dt的解释; dt和dd的对应关系比较随意： 一个dt对应多个dd、多个dt对应一个dd、多个dt对应多个dd, 都合法; 可用于名词/单词解释、日程列表、站点目录;
+ ul 表示无序列表;
+ ol 表示有序列表, 可用于排行榜等;
+ li 表示列表项, 必须是ul/ol的子元素;

**表单元素**  
+ 推荐使用 button 代替 input, 但必须声明 type;
+ 推荐使用 fieldset, legend 组织表单
+ 表单元素的 name 不能设定为 action, enctype, method, novalidate, target, submit 会导致表单提交混乱

###文档模板  

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Sample page</title>
        <link rel="stylesheet" href="css_example_url" />
    </head>
    <body>
        <div id="page">
            <div id="header">
                页头
            </div>
            <div id="content">
                主体
            </div>
            <div id="footer">
                页尾
            </div>
        </div>
        <script src="js_example_url"></script>
        <script>
        // 你的代码
        </script>
    </body>
</html>

```
