#web form print
web form print 主要功能为实现打印样式的生成，tab分离打印，以及按钮等表单元素隐藏等功能
## install
编辑drupal文件    
>D:\relo20_sites\testtingsite\main\sites\all\modules\webform\includes\webform.submissions.inc    

约826行 寻找代码
```javascript
	drupal_add_js(drupal_get_path('module', 'webformview') . '/js/webform_validate_extra.js');
    //添加引用代码 webform_print
    drupal_add_js(drupal_get_path('module', 'webformview') . '/js/webform_print.js');
```

增加webform_print.js 文件到文件夹
>D:\relo20_sites\testtingsite\main\sites\all\modules\webformview\js\

即可实现打印功能 功能视图如下

[![Web form step](http://bamboo-pc154.bamboonetworks.com/webform/doc/print.jpg "print")](http://bamboo-pc154.bamboonetworks.com/webform/doc/print.jpg "")