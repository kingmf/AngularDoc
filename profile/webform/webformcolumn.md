#web form column
web form column 实现功能为table 里的td内容大小可拖动    
##install 安装
打开目录:
>D:\relo20_sites\ey\sites\all\modules\webform_search\webform_search.module    

大约376行找到
```php
function webform_search_search_submissions() {
//添加引用  
//必须是新版的JQ（1.8）才支持  
    //resize column by ken
    drupal_add_js(drupal_get_path('module', 'webform_search') . '/js/jquery.js');
    drupal_add_js(drupal_get_path('module', 'webform_search') . '/js/reziable/jquery.resizableColumns.js');
    drupal_add_css(drupal_get_path('module', 'webform_search') . '/js/reziable/jquery.resizableColumns.css');
```

打开文件    
>D:\relo20_sites\ey\sites\all\modules\webform_search\js\webform_search.js    

最后一行添加    
```javascript
//resize column by Ken
jQuery(function(){
    if('function'===typeof jQuery("table.sticky-enabled").resizableColumns)
    jQuery("table.sticky-enabled").resizableColumns();
});
```

>注意:一定要 1.8或者更高版的JQ才支持本驱动
