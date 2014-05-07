##webform 服务请求以及供应商提供模块
主模块
webform_servicerequest.js     
供应商模块
webform_serviceprovider.js
###插件模块配置
定义全局变量
```javascript 
var printModel    = "print",
viewModel     = "view",
editModel     = "edit",
initModel     = "init", 
textClass     = "Character",
inputClass     = "form-text",
buttonClass    = "form-submit", 
buttonACls     = "buttonNoZoom addservice", //添加input       
selectClass    = "form-select", 
textareaClass  = "form-textarea",
numericClass   = "Numeric",
numericMaxsize = "999999999.99",
numericMinsize = "-999999999.99",
printModel     = "print", 
viewModel      = "view";
 
 /**when print model, hide or show operation buttons, default hide**/
var isHideOperationButton = true;
 
``` 
###初始化程模块
使用JQ初始化操作
```javascript 
jQuery(document).ready(function() {   
    Form_type = ('undefined'!==Drupal.settings.webform_form_type)?Drupal.settings.webform_form_type:0;//表单类型
    Service_type= ('undefined'!==Drupal.settings.servicerequest_mode)?Drupal.settings.servicerequest_mode:'';//服务类型
    CQF_attach = ('undefined'!==typeof Drupal.settings.cqf_attachment_mapping)?Drupal.settings.cqf_attachment_mapping:'';
    CQF_attach = jQuery.parseJSON(CQF_attach);
    allowServiceProviderNum = (Drupal.settings.max_service_provider_number>0)?Drupal.settings.max_service_provider_number:4;//允许经销商数重

    //防止 webform-step 重置 service-common
    if(Form_type=='cqf'){
        ServicerequestDataStr =  jQuery("textarea.servicerequest").text();
        ServicerequestData = jQuery.parseJSON(ServicerequestDataStr);
    }
    //provider
    var generateModel = Drupal.settings.servicerequest_mode;
    var isPrintModel  = generateModel == printModel;
    var isViewModel   = generateModel == viewModel;
    var isEditModel   = generateModel == editModel;
    var isInitModel   = generateModel == initModel;
    var data_default = jQuery("textarea.serviceprovider_default").text(); 
    data_default = jQuery.parseJSON(data_default);
    //全局供应商信恍
    Provider_default = data_default;
    var providers_length = (null!== data_default)?data_default.providers.length:0;
    allowServiceProviderNum = (providers_length > allowServiceProviderNum) ? allowServiceProviderNum : providers_length;
    var providerData = jQuery("textarea.serviceprovider").text();
    var save_provider_data = jQuery.parseJSON(providerData);
    var detailData = jQuery("textarea.servicerequest").text();
    var save_detail_data = jQuery.parseJSON(detailData);
    save_detail_data = (save_detail_data!=null)?save_detail_data:'';
    if (data_default && (isInitModel||isEditModel)) {
        generateServiceProvider(data_default,save_detail_data);
    }
    if (providerData && (isInitModel||isEditModel)) {
        setSelectServiceProvider(save_provider_data);
    }
    if (isViewModel || isPrintModel) {
        //winnerProvide
        viewSelectServiceProvider(save_detail_data);
        //ProvideInfo
        if(Form_type=='crfq')viewInfoServiceProvider(save_detail_data);
        generateServiceDetail(save_detail_data);
        //attachment
        generateServiceFooterView(save_detail_data);
    }
    if (isEditModel && save_detail_data) {
        var all_providers = jQuery.parseJSON(data_default);
        //editSelectServiceProvider(all_providers, save_detail_data);
        generateServiceDetail(save_detail_data);
        generateServiceFooter(save_detail_data);
        if('function'===typeof step_clear_after)step_clear_after();//fixed edit no delete bug
    }
})
```
###生成serviceDetal表单 
总共2部分，一部分是客户填单，另一部分是供应商回答客户条目填单
```javascript 
function generateServiceDetail(data) {

    if(Form_type=='cqf'){
        data = ServicerequestData;
         jQuery("textarea.servicerequest").text(ServicerequestDataStr);
    }

    jQuery("#service_detail_display").empty();
    /**start genate service detail frameworks**/
    var template = jQuery("<div id=\"template\"><table class=\"datatable\" border=\"1\"><thead></thead><tbody></tbody><tfoot></tfoot></table></div>").hide();
    var tagMenu = jQuery("<ul>").addClass("service-tag-menu").appendTo("#service_detail_display");
    var defaultCommons = [{
        "lineName": "Discount",
        "fieldType": "1",
        "flag": "1",
        "kind":"2"
    }, {
        "lineName": "Sub-Total",
        "fieldType": "1",
        "flag": "2",
        "kind":"2"
    }, {
        "lineName": "Tax",
        "fieldType": "1",
        "flag": "3",
        "kind":"2"
    }, {
        "lineName": "Total",
        "fieldType": "1",
        "flag": "4",
        "kind":"2"
    }, {
        "lineName": "Details",
        "fieldType": "2",
        "flag": "5"
    }
    , {
        "lineName": "Crown Comments",
        "fieldType": "2",
        "flag": "5",
        "client": "1",
        "pos": "tfoot",
        "value": ""
    }, {
        "lineName": "Allowance",
        "fieldType": "2",
        "flag": "5",
        "client": "1",
        "pos": "thead",
        "value": ""
    }


    ];

    var isPrintModel = Drupal.settings.servicerequest_mode == printModel;
    var isViewModel = Drupal.settings.servicerequest_mode == viewModel;
    var insuranceTitle = "Total Insurance Premium";
    var insuranceType = "Insurance";

    var indexService = 0;
    var data_default_json = jQuery("textarea.servicerequest_default").text();
    var data_default = jQuery.parseJSON(data_default_json);

    
    jQuery.each(data.services, function(i, service) {

        if (!service.serviceLine) {
            return;
        }
        var tag = template.clone().addClass("services-detail");
        
        if(Form_type!='cqf'){
            /**start add and delete function**/
            var addButton = jQuery("<a href='#'></a>").addClass(buttonACls).text("Add Service Line");
            var deleteImg = jQuery("<a>").css({"float":"right"}).attr("href", "javascript:void(0)").addClass("delete");
            addButton.bind("click", function(e) {
                e.preventDefault();
                if (jQuery('.add-service-line-dl').size() == 0) {
                    
                    var servicesProvide = [];
                    jQuery.each(data_default.services,function(i,p){
                        if(service.serviceId==p.serviceId){
                            servicesProvide = p;
                            return;
                        }
                    });
                    
                    addServiceLine(this, servicesProvide);
                }
            })
            deleteImg.bind("click", function(e) {
                e.preventDefault();
                if (confirm("Are you sure you want to remove this service line?")) {
                    jQuery(this).parents("tr").remove();
                }
            })
        /**end add and delete function**/
        }
        
        /**start tag**/
        if (isPrintModel && !isViewModel) {
            jQuery("ul.service-tag-menu").hide();
            jQuery("<h3>").text(service.serviceName).insertBefore(tag.find("table"));
        } else {
            tagMenu.append(
                jQuery("<li>").append(
                    jQuery("<a href='javascript:void(0)'></a>").attr("data-target", "service_detail_tag_" + service.serviceId).text(service.serviceName ? service.serviceName : "")
                    .attr("mytitle", service.serviceDesc ? service.serviceDesc : "").bind("click", function(e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                        var currentTag = jQuery(this).parents("ul").find("li a[data-target].current");
                        var currentTagForm = jQuery("#" + currentTag.attr("data-target"));
                        currentTagForm.hide();
                        currentTagForm.find("tfoot .caculate").click();
                        currentTag.removeClass("current");
                        jQuery("#service_detail_tag_" + service.serviceId).show();
                        jQuery(this).addClass("current");
                    })
                    ));
        }
        /**end tag**/

        /**start thead**/
        
        if(Form_type=='cqf') var theadTr = jQuery("<tr>").append(jQuery("<td style='padding: 10px 9px;'>").html("Services&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")).addClass("even");
        else var theadTr = jQuery("<tr>").append(jQuery("<td style='padding: 10px 9px;'>").html("Services&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;").append(addButton.clone(true))).addClass("even");
           
        
        var colNumWidth = Math.round(100 / (data.providers.length + 1), 2);


        if (Form_type=='cqf' ||(Form_type=='crfq'&&Service_type=='view') ) {
            jQuery.each(data.providers, function(j, provider) {
                jQuery("<td>").text(provider.providerName).attr("data-providerId", provider.providerId).appendTo(theadTr);
            })
            var theadLastTd = jQuery("<td>").html("&nbsp;");
            tag.find("thead").append(theadTr.append(theadLastTd));
        } else {
            var theadLastTd = jQuery("<td>");
            jQuery("<td>").appendTo(theadTr);
            tag.find("thead").append(theadTr);
        }

        if ((isPrintModel || isViewModel) && isHideOperationButton) {
            theadTr.find("a.addservice").hide();
            theadLastTd.hide();
        }
        /**end thead**/

        /**start tbody**/
        if (service.serviceLine) {
            jQuery.each(service.serviceLine, function(j, serviceLine) {
                var lineflag = serviceLine.flag;
                var fieldType = textClass;
                if ("1" == serviceLine.fieldType) {
                    fieldType = numericClass;
                }
                var tbodyTr = jQuery("<tr>").attr("data-linedefault", lineflag);
                if (tbodyTr) {
                    jQuery("<td>").html(serviceLine.lineName).attr("mytitle", serviceLine.lineDesc ? serviceLine.lineDesc : "").appendTo(tbodyTr);
                    
                    if (Form_type=='cqf'||(Form_type=='crfq'&&Service_type=='view')) {
                        jQuery.each(data.providers, function(j, provider) {
                            var input = jQuery("<input type='text'>").addClass(fieldType).addClass(inputClass);
                            var label = jQuery("<label>").addClass(fieldType);
                            var ele = (isPrintModel || isViewModel) ? label : input;
                            var td = jQuery("<td>").attr("data-providerId", provider.providerId).append(ele).appendTo(tbodyTr);
                            var serviceLineValues = serviceLine.value;
                            if (serviceLineValues) {
                                var value = eval("serviceLineValues.providerId_" + provider.providerId);
                                if (value) {
                                    if (ele.hasClass(numericClass)) {
                                        var v = getNumeric(input, value);
                                        input.val(v);
                                        label.text(v);
                                    } else {
                                        input.val(value);
                                        label.text(value);
                                    }
                                }
                            }

                        })
                    }
                    if(Form_type=='cqf'){
                        var tbodyLastTd = jQuery("<td>").html(fieldTypeFormat(serviceLine.fieldType));
                    }else
                    {
                        var tbodyLastTd = jQuery("<td>").html(fieldTypeFormat(serviceLine.fieldType)).append(deleteImg.clone(true));
                    }
                    
                    tag.find("tbody").append(tbodyTr.append(tbodyLastTd));
                    if ((isPrintModel || isViewModel) && isHideOperationButton) {
                        tbodyLastTd.hide();
                    }
                }
            })
        }
        /**end tbody**/

        /**start tfoot**/

        var common = service.commons ? service.commons : defaultCommons;
        //have something rong with cqf view
       // Form_type='cqf';
        var has_D = 0;
        var has_P = 0;
        jQuery.each(common,function(i,p){
            if(p.kind=="2"){has_D = 1;return}
            if(p.display){has_P = 1;return}
        });
        if(Form_type=='cqf'&&Service_type!='view'){
            if(!has_D)
            {
                var formtypeCommon = [{
                    "lineName": "Discount",
                    "fieldType": "1",
                    "flag": "1",
                    "kind":"2"
                }, {
                    "lineName": "Sub-Total",
                    "fieldType": "1",
                    "flag": "2",
                    "kind":"2"
                }, {
                    "lineName": "Tax",
                    "fieldType": "1",
                    "flag": "3",
                    "kind":"2"
                }, {
                    "lineName": "Total",
                    "fieldType": "1",
                    "flag": "4",
                    "kind":"2"
                }];
                jQuery.each(formtypeCommon,function(i,p){
                    common.push(p);
                });
            }
            
            var sort ='';
        }
        jQuery.each(common, function(j, serviceLine) {
            var cqfNum = j;
            //客户端不展示
            if (((Form_type=='crfq') && serviceLine.client)||((Form_type=='crfq') &&(Service_type=='view')) || (Form_type=='cqf')) {
                
                var tfootTr = jQuery("<tr>").attr("data-flag", serviceLine.flag);
                if (serviceLine.client) tfootTr.addClass('client');
                var caculate = "&nbsp;";
                var totalName = serviceLine.lineName;
                var sourceEle;

                switch (parseInt(serviceLine.flag)) {
                    case 1:
                        sourceEle = jQuery("<input type='text'>").addClass("disCount").addClass(inputClass).addClass(numericClass);
                        break;
                    case 2:
                        sourceEle = jQuery("<input type='text' readonly='readonly' />").addClass("subTotal").addClass(inputClass).addClass(numericClass);
                        break;
                    case 3:
                        sourceEle = jQuery("<input type='text'>").addClass("tax").addClass(inputClass).addClass(numericClass);
                        break;
                    case 4:
                        sourceEle = jQuery("<input type='text' readonly='readonly' />").addClass("totalCost").addClass(inputClass).addClass(numericClass);
                        totalName = serviceLine.lineName;
                        if (service.serviceId == insuranceType || service.serviceName == insuranceType) {
                            totalName = insuranceTitle;
                            sourceEle.removeClass("totalCost").addClass("insuranceCost");
                        }
                        caculate = jQuery("<a href='javascript:void(0)'></a>").addClass("caculate");
                        if ((isPrintModel || isViewModel) && isHideOperationButton) {
                            caculate.hide();
                        }
                        break;
                    case 5:
                        sourceEle = jQuery("<textarea>").attr("rows", "4").attr("cols", "25").addClass("supplementInfo normal_word_break").addClass(textareaClass).css("resize", "none");
                        
                       /*[CWEY-516][Kale @2013-08-30 17:11:23][Begin]*/
                      if ( !(isPrintModel || isViewModel) && serviceLine.lineName=='Allowance'){             
                          var tid=service.serviceId;
                          var assignment_phase=Drupal.settings.assignment_phase;
                          if(assignment_phase && undefined!=Drupal.settings.service_sets_allowance[assignment_phase]){
                            var allowance=Drupal.settings.service_sets_allowance[assignment_phase][tid];
                            sourceEle.val(allowance);
                            sourceEle.text(allowance);
                          }
                        }

                        
                        if(Form_type=='cqf'){
                            if(!serviceLine.display)sourceEle.attr("disabled",true);
                        }
                        
                        break;
                    default:
                        break;
                }
                jQuery("<td>").text(totalName).append(caculate).appendTo(tfootTr);
                var label = jQuery("<label>").addClass(sourceEle.attr("class"));
                var targetEle = (isPrintModel || isViewModel) ? label : sourceEle;
                
                if (!serviceLine.client) {
                    jQuery.each(data.providers, function(j, provider) {
                        var ele = targetEle.clone();
                        var td = jQuery("<td>").attr("data-providerId", provider.providerId).append(ele).appendTo(tfootTr);
                        if (ele.hasClass("totalCost") || ele.hasClass("insuranceCost")) {
                            jQuery("<label>").html(data.exchange + "&nbsp;").addClass("exchange").prependTo(td);
                        }
                       
                        var serviceLineValues = serviceLine.value;
                        if (serviceLineValues) {
                         
                            var value = eval("serviceLineValues.providerId_" + provider.providerId);                            

                            if (value) {
                                if (ele.hasClass(numericClass)) {
                                    if (ele[0].tagName == 'LABEL') {
                                        ele.text(getNumeric(ele, value));
                                    } else {
                                        ele.val(getNumeric(ele, value));
                                    }
                                } else {
                                    if (ele[0].tagName == 'LABEL') {
                                        ele.text(value);
                                    } else {
                                        ele.val(value);
                                    }
                                }
                            }
                        }
                    })
                } else {
                    var tdLength = data.providers.length;
                    var ele = targetEle.clone();
                    var td = jQuery("<td colspan=" + tdLength + ">").append(ele).appendTo(tfootTr);
                    var value=serviceLine.value;
                    if(!value){
                      value=ele.val();
                    }
                    if (ele[0].tagName == 'LABEL') {
                        ele.text(value);
                    } else {
                        ele.val(value);
                    }
                }
                
                 if(Form_type=='crfq') {
                    if('undefined'!==typeof serviceLine.pos)tag.find(serviceLine.pos).append(tfootTr);
                    else if(Service_type=='view')tag.find("tfoot").append(tfootTr);
                }
                else {
                    var tfootLastTd = jQuery("<td>").html("&nbsp;");
                    tag.find("tfoot").append(tfootTr.append(tfootLastTd));
                }
                
                if(Form_type=='cqf')
                {
                    if('undefined'!==typeof serviceLine.pos){
                        
                        if(serviceLine.pos=='tfoot'&&cqfNum<common.length-1)sort = tfootTr;
                       
                        tag.find(serviceLine.pos).append(tfootTr);
                    }
                    if(cqfNum==common.length-1)tag.find('tfoot').append(sort);
                        
                }
                
                if ((isPrintModel || isViewModel) && isHideOperationButton) {
                    if('undefined'!==typeof tfootLastTd)tfootLastTd.hide();
                }

            }
           
        })

        /**end tfoot**/
        tag.attr("id", "service_detail_tag_" + service.serviceId).attr("data-serviceId", service.serviceId).attr("data-serviceName", service.serviceName).appendTo("#service_detail_display");
        if (indexService == 0 || isPrintModel) {
            tag.show();
            jQuery("ul.service-tag-menu li:first a").addClass("current");
        }
        tag.find("tbody tr:odd").addClass("even");
        tag.find("tbody tr:even").addClass("odd");
        if (tag.find("tbody tr:last").hasClass("odd")) {
            tag.find("tfoot tr:odd").addClass("odd");
            tag.find("tfoot tr:even").addClass("even");
        } else {
            tag.find("tfoot tr:odd").addClass("even");
            tag.find("tfoot tr:even").addClass("odd");
        }
        indexService++;
    })
    /**end genate service detail frameworks**/
    jQuery(".Numeric", "#service_detail_display").autoNumeric({
        vMax: "999999999.99"
    });
    qtip();
    totalCaculation();
    if(Form_type=='cqf'&& Service_type!='view')jQuery("textarea.servicerequest").text(ServicerequestData);
    
    jQuery("tr.client td").css({'text-align': 'left','font-weight': 'normal' });

    if(Form_type=='crfq' && Service_type=='edit')
    {
        jQuery("#webform-component-select-service,#webform-component-service-detail-fieldset").find('input,select,textarea').attr('disabled',true);
        jQuery('#edit-submitted-service-detail-fieldset-service-detail').attr('disabled',false);
        jQuery('.buttonNoZoom').remove();
        jQuery('#webform-component-service-detail-fieldset .delete').remove();
    }

    
}

```
###金额运算函数
```javascript 
function totalCaculation() {
    /**start caculate**/
    jQuery("tfoot .caculate", "#service_detail_display").bind("click", function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var tdLength = jQuery(this).parents("tr").find("td").length;
        var total = [];
        for (var i = 1; i < tdLength - 1; i++) {
            var val = 0.00;
            jQuery(this).parents("table").find("tbody tr").each(function() {
                var t = jQuery(this).find("td").eq(i).find("." + numericClass);
                if (t && t.val()) {
                    var convertInput = jQuery.fn.autoNumeric.Strip(t);
                    val += parseFloat(convertInput);
                }
            });
            var disCount;
            var tax;
            jQuery(this).parents("table").find("tfoot tr").each(function() {
                var columnField = jQuery(this).find("td").eq(i).find("input");
                if (columnField.hasClass('disCount')) {
                    disCount = columnField;
                }
                if (columnField.hasClass('subTotal')) {
                    if (disCount && disCount.val()) {
                        var convertInput = jQuery.fn.autoNumeric.Strip(disCount);
                        val -= parseFloat(convertInput);
                    }
                    columnField.val(getNumeric(columnField, val));
                }
                if (columnField.hasClass('tax')) {
                    tax = columnField;
                }
                if (columnField.hasClass('totalCost') || columnField.hasClass("insuranceCost")) {
                    if (tax && tax.val()) {
                        var convertInput = jQuery.fn.autoNumeric.Strip(tax);
                        val += parseFloat(convertInput);
                    }
                    columnField.val(getNumeric(columnField, val));
                }
            })
        }
    })
/**end caculate**/
}
```
###添加服务项操作

```javascript 
function addServiceLine(addElement, service) {
    var tdLenght = jQuery(addElement).parents("tr").find("td").length;
    var tr = jQuery("<tr>").addClass("add-line-config").append(jQuery("<td>").attr("colspan", tdLenght));
    var selectLine = jQuery("<select style=\"width:120px\">").addClass("select-line-name").addClass(selectClass);
    selectLine.append("<option value='other'>other</option>");
    if (service.serviceLine) {
        jQuery.each(service.serviceLine, function(j, line) {
            if (parseInt(line.flag) == 0) {
                selectLine.append(jQuery("<option>").text(line.lineName).attr("data-lineDesc", line.lineDesc ? line.lineDesc : "").attr("data-fieldType", line.fieldType));
            }
        })
    }
    if (service.unusedServiceLine) {
        jQuery.each(service.unusedServiceLine, function(j, line) {
            selectLine.append(jQuery("<option>").text(line.lineName).attr("data-lineDesc", line.lineDesc ? line.lineDesc : "").attr("data-fieldType", line.fieldType));
        })
    }
    var selectLineType = jQuery("<select>").addClass("select-line-type").addClass(selectClass).append("<option value='0'>text</option>")
    .append("<option value='1'>numeric</option>").addClass("add-line-field");

    var inputLineDesc = jQuery("<input type='text'>").addClass(textClass).addClass(inputClass).addClass("add-line-field");
    var buttonLineOK = jQuery("<input type='button' class='ie7Add' value='Add' />").addClass(buttonClass);
    var buttonLineCancel = jQuery("<input type='button' class='ie7Cancel' value='Cancel' />").addClass(buttonClass);
    var dl = jQuery("<table>").addClass("add-service-line-dl");
    var dt = jQuery("<tr>").appendTo(dl);
    var dd = jQuery("<td>");
    dt.append(dd.clone().append("<br>").append(selectLine));
    dt.append(dd.clone().text("Service Line Name: ").append("<br>").append(inputLineDesc.clone()));
    dt.append(dd.clone().text("Service Line Type: ").append("<br>").append(selectLineType));
    dt.append(dd.clone().text("Desc: ").append("<br>").append(inputLineDesc.clone()));
    dt.append(dd.clone().text("Operation: ").append("<br>").append(buttonLineOK).append(buttonLineCancel));
    dl.appendTo(tr.children("td"));
    tr.appendTo(jQuery(addElement).parents("table").children("tbody"));
    selectLine.bind("change", function() {
        if (jQuery(this).val() == 'other') {
            dl.find(".add-line-field").attr("disabled", false);
            dl.find("input.add-line-field").val("");
        } else {
            var source = jQuery(this).find("option:selected");
            dl.find(".add-line-field").attr("disabled", true);
            dl.find("select.add-line-field option[value='" + source.attr("data-fieldType") + "']").attr("selected", true);
            dl.find("input.add-line-field").eq(0).val(source.text());
            dl.find("input.add-line-field").eq(1).val(source.attr("data-lineDesc"));
        }
    })

    buttonLineOK.bind("click", function() {
        addLineButtonClick(this);
    })

    buttonLineCancel.bind("click", function() {
        jQuery(this).parents("tr").remove();
    })
}
```
###添加服务项绑定
```javascript 
function addLineButtonClick(buttonElement) {
    var lineTr = jQuery(buttonElement).parents("table.datatable").find("thead tr:first").clone().attr("data-linedefault", 1);
    var tdLength = lineTr.find("td").length;
    var sourceTable = jQuery(buttonElement).parents("table.add-service-line-dl");
    if (!sourceTable.find("input.add-line-field:eq(0)").val()) {
        alert("Service Line Name is required!");
        return false;
    }
    /*      lineTr.find("td:first").empty().text(sourceTable.find("input.add-line-field:eq(0)").val())
        .attr("title", sourceTable.find("input.add-line-field:eq(1)").val());*/

    var tType =
    lineTr.find("td:first").empty()
    .html(sourceTable.find("input.add-line-field:eq(0)").val())
    .attr("mytitle", sourceTable.find("input.add-line-field:eq(1)").val());

    var ele = jQuery("<input>").addClass(inputClass);
    if ("1" == sourceTable.find("select.select-line-type").find("option:selected").val()) {
        ele.addClass(numericClass)
    } else {
        ele.addClass(textClass);
    }
    for (var x = 1; x < tdLength - 1; x++) {
        var tagetEle = ele.clone();
        if (tagetEle.hasClass(numericClass)) {
            tagetEle.autoNumeric({
                vMax: numericMaxsize
            });
        }
        lineTr.find("td").eq(x).empty().append(tagetEle);
    }
    var deleteImg = jQuery("<a style=float:right href=\"javascript:void(0)\"></a>").addClass("delete");
    deleteImg.bind("click", function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        if (confirm("Are you sure you want to remove this service line?")) {
            jQuery(this).parents("tr").remove();
        }
    })
    lineTr.find("td:last").empty().html(fieldTypeFormat(sourceTable.find("select.select-line-type").find("option:selected").val())).append(deleteImg);
    lineTr.insertAfter(jQuery(buttonElement).parents("tr.add-line-config"));
    jQuery(buttonElement).parents("tr.add-line-config").remove();
    lineTr.parents("table").find("tbody tr:odd").addClass("even").removeClass("odd");
    lineTr.parents("table").find("tbody tr:even").addClass("odd").removeClass("even");
    if (lineTr.hasClass("odd")) {
        lineTr.parents("table").find("tfoot tr:odd").addClass("odd").removeClass("even");
        lineTr.parents("table").find("tfoot tr:even").addClass("even").removeClass("odd");
    } else {
        lineTr.parents("table").find("tfoot tr:odd").addClass("even").removeClass("odd");
        lineTr.parents("table").find("tfoot tr:even").addClass("odd").removeClass("even");
    }
    qtip(lineTr.find("td[mytitle]"));
}
```
###表单字段类型格式化
```javascript  
function fieldTypeFormat(flag) {
    var rs = '';
    switch (flag) {
        case '0':
            rs = 'Text';
            break;
        case '1':
            rs = 'Numeric';
            break;
    }
    if(Form_type=='cqf') return '';
    else return '<span class="fieldTypeFormat" data-value="' + flag + '">[' + rs + ']</span>';
}

```
###表单小数字段类型格式化
```javascript 
function changeTwoDecimal_f(x) {
    if (x == NaN) {
        return 0.00;
    }
    var f_x = parseFloat(x);
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}
```

###格式化Num 的货币格式
```javascript 
/**format number, eg. 11111111 to 11,111,110.00**/
function getNumeric(obj, orgi) {
    return jQuery.fn.autoNumeric.Format(obj, "" + orgi, {
        vMax: numericMaxsize,
        vMin: numericMinsize
    });
}
```
###实例化 qtip组件
```javascript 
function qtip(ele) {
    if (ele) {
        (ele.attr("mytitle") != "") &&  jQuery(ele).qtip({
            content:ele.attr('mytitle'),
            style: {
                name: 'light',
                title: {
                    'font-size': 12
                }
            },
            position: {
                corner: {
                    target: 'topMiddle',
                    tooltip: 'topLeft'
                }
            }
        })
    } else {
        var newEle = jQuery("td[mytitle]", "#service_detail_display");
		jQuery("td[mytitle]", "#service_detail_display").each(function() {
          if(jQuery(this).attr('mytitle')!=""){
              jQuery(this).qtip({
                content:jQuery(this).attr('mytitle'),
                style: {
                    name: 'light',
                    title: {
                        'font-size': 12
                    }
                },
                position: {
                    corner: {
                        target: 'topMiddle',
                        tooltip: 'topLeft'
                    }
                }
            })
          }
       });
    }
}
```
###保存数据格式 绑定next操作后的事件
```javascript 
function saveOrNext() {
    var isPrintModel = Drupal.settings.servicerequest_mode == printModel;
    var isViewModel = Drupal.settings.servicerequest_mode == viewModel;
    if (isPrintModel || isViewModel) {
        return;
    }
    var returnData = {};
    /**start get service detail to json format**/

    /**start caculation every service**/
    jQuery(".caculate", "#service_detail_display").each(function() {
        jQuery(this).click();
    })
    /**end cachlation every service**/

    var summerTotalCost = [];
    var insuranceTotalCost = [];
    //var form = $("form").serializeArray();
    var data1 = {};
   // data1["exchange"] = jQuery("#edit-submitted-summary-proposal-currency option:selected").text();
   data1["exchange"] = jQuery("#edit-submitted-summary-quote-currency option:selected").text();
    /**start providers, thead**/
    if(jQuery("textarea.serviceprovider").text())
    {
        var providers = jQuery.parseJSON(jQuery("textarea.serviceprovider").text()).providers;
    }
    else if(jQuery("textarea.servicerequest").text())
    {
        var providers = jQuery.parseJSON(jQuery("textarea.servicerequest").text()).providers;
    }
        
    data1["providers"] = providers;

    /**end providers, thead**/
    var services = [];
    jQuery(".services-detail", "#service_detail_display").each(function(i) {
        /**start services, tbody**/
        var service = {};
        service["serviceName"] = jQuery(this).attr("data-serviceName");
        service["serviceId"] = jQuery(this).attr("data-serviceId");
        service["serviceDesc"] = jQuery("ul").find("a[data-target='service_detail_tag_" + jQuery(this).attr("data-serviceId") + "']").attr("mytitle");
        var serviceLines = [];
        jQuery(this).find("tbody tr").each(function(j) {
            var serviceLine = {};
            var line = jQuery(this).find("td:first");
            var lineflag = jQuery(this).attr("data-linedefault");
            if (lineflag == '1') {
                serviceLine["lineName"] = line.find("input").val() ? line.find("input").val() : line.text();
            } else {
                serviceLine["lineName"] = line.text();
            }
            serviceLine["lineDesc"] = line.attr("mytitle");
            serviceLine["flag"] = lineflag;
            var values = {};


            jQuery(this).find("td:gt(0):not(:last)").each(function(k) {
                var valEle = jQuery(this).find("input");
                var providerId = "providerId_" + jQuery(this).attr("data-providerId");
                if (valEle.hasClass(numericClass)) {
                    if (valEle.val() == '') {
                        values[providerId] = 0.00;
                    } else {
                        values[providerId] = jQuery.fn.autoNumeric.Strip(valEle);
                    }
                    serviceLine["fieldType"] = 1;
                } else {
                    values[providerId] = valEle.val();
                    serviceLine["fieldType"] = 0;
                }


            })
            //Ken add 7-10 client 模式下增加类型字殍
            if ('undefined' === typeof serviceLine["fieldType"]) {
                jQuery(this).find("td:gt(0)").each(function(k) {
                    var valEle = jQuery(this).find(".fieldTypeFormat");
                    var fieldType_val = valEle.attr("data-value");
                    serviceLine["fieldType"] = fieldType_val;
                })
            }
            //                  
            serviceLine["value"] = values;
            serviceLines[j] = serviceLine;
        })
        service["serviceLine"] = serviceLines;
        /**end services, tbody**/

        /**start commons, tfoot**/
        var commonTotals = [];
        var everyTotal = {};
        jQuery(this).find("tfoot tr").each(function(j) {
            var common = {};
            var line = jQuery(this).find("td:first");
            common["lineName"] = line.text();
            var values = {};
            if (!jQuery(this).hasClass('client')) {
                jQuery(this).find("td:gt(0):not(:last)").each(function(k) {
                    var providerId = "providerId_" + jQuery(this).attr("data-providerId");
                    var valEle = jQuery(this).find("input, textarea");
                    if (valEle.tagName == 'TEXTAREA' || valEle.attr("type") == 'textarea') {
                        values[providerId] = valEle.val();
                    } else {
                        if (valEle.val == '') {
                            values[providerId] = 0.00;
                        } else {
                            values[providerId] = jQuery.fn.autoNumeric.Strip(valEle);
                        }
                        if (valEle.hasClass("insuranceCost")) {
                            insuranceTotalCost[providerId] = values[providerId];
                        } else if (valEle.hasClass("totalCost")) {
                            everyTotal[providerId] = values[providerId];
                        }
                    }
                })
                common["fieldType"] = 1;
                if (j + 1 == 5) {
                    common["fieldType"] = 2;
                }
                common["flag"] = j + 1;
                common["value"] = values;
                common["kind"] = 2;
                //commonTotals[j] = common;
                commonTotals.push(common);
            }
        })

        /**end commons, tfoot**/

        /**begin commons, allownce crown comments**/

        if (Service_type == 'init'||Service_type =='edit') {               


            var v1 =  jQuery(this).find("tfoot tr td textarea").eq(0).val();
            var v2 =  jQuery(this).find("thead tr td textarea").eq(0).val();
            
            var a1 = {};
                a1["value"] = v1;
                a1["lineName"] = "Crown Comments";
                a1["fieldType"] = "2";
                a1["flag"] = "5";
                a1["pos"] = "tfoot";
                a1["client"] = "1";
            
            var a2 = {};
                a2["value"] = v2;
                a2["lineName"] = "Allowance";
                a2["fieldType"] = "2";
                a2["flag"] = "5";
                a2["pos"] = "thead";
                a2["client"] = "1";
                 
                commonTotals.push(a1);
                commonTotals.push(a2);
                

        }

        /**end commons, allownce crown comments**/

        service["commons"] = commonTotals;
        services[i] = service;
        summerTotalCost[i] = everyTotal;
    })
    data1["services"] = services;

    /**start caculat total-cost**/
    jQuery(data1.providers).each(function(jdex, provider) {
        var providerTotal = 0.00;
        jQuery(summerTotalCost).each(function(index, everyTotal) {
            var v = eval("everyTotal.providerId_" + provider.providerId);
            if (v && v != '') {
                providerTotal += parseFloat(v);
            }
        })
        provider["providerTotalCost"] = providerTotal;
        var insuranceTotal = eval("insuranceTotalCost.providerId_" + provider.providerId);
        if (!insuranceTotal || insuranceTotal == '') {
            insuranceTotal = 0.00;
        }
        provider["insuranceTotalCost"] = parseFloat(insuranceTotal);
    })
    /**end caculat total-cost**/
    returnData = data1;
    /**end get service detail to json format**/
    return returnData;
}

```

###保存到service line文本框

```javascript 
function saveServiceDetailDataToTextarea() {
    var isPrintModel = Drupal.settings.servicerequest_mode == printModel;
    var isViewModel = Drupal.settings.servicerequest_mode == viewModel;
    if (isPrintModel || isViewModel) {
        return;
    }
    var servicerequest = jQuery("textarea.servicerequest");
    if (!servicerequest || servicerequest.length == 0) {
        return;
    }
    var detailSourceData = saveOrNext();

    jQuery("textarea.servicerequest").text(jQuery.toJSON(detailSourceData));
    return detailSourceData;
}
```
###保存供应商到文本框

```javascript 
function saveServiceProviderDataToTextarea() {
    var isPrintModel = Drupal.settings.servicerequest_mode == printModel;
    var isViewModel = Drupal.settings.servicerequest_mode == viewModel;
    if (isPrintModel || isViewModel) {
        return;
    }
    var serviceprovider = jQuery("textarea.serviceprovider");
    if (!serviceprovider || serviceprovider.length == 0)
        return;
    var providers = [];
    jQuery(".add-provider-config", "#service_provider_display").each(function(i, p) {
        if (jQuery(this).find("option:selected").val() != "") {
            var provider = {};
            provider["providerId"] = jQuery(this).find("option:selected").val() + "_" + i;
            provider["providerName"] = jQuery(this).find("option:selected").text();
            provider["winnerFlag"] = jQuery(this).parents("tr").find(":checkbox").is(":checked") ? 1 : "";
            providers[providers.length] = provider;
        }
    })
    var saveserviceprovider = {};
    saveserviceprovider["providers"] = providers;
    jQuery("textarea.serviceprovider").text(jQuery.toJSON(saveserviceprovider));
    return providers;
}
```
###根据json生成供应商展示UI

```javascript 
function generateServiceDetailJson() {
    var isPrintModel = Drupal.settings.servicerequest_mode == printModel;
    var isViewModel = Drupal.settings.servicerequest_mode == viewModel;
    if (isPrintModel || isViewModel) {
        return;
    }
    var data = jQuery("textarea.servicerequest").text();
    var data1 = {};
    if (data) {
        data1 = jQuery.parseJSON(data);
    }
    data1["exchange"] = jQuery("#edit-submitted-summary-proposal-currency option:selected").text();
    data1["providers"] = saveServiceProviderDataToTextarea();

    var services_default_data = jQuery("textarea.servicerequest_default").text();
    if (services_default_data) {
        var all_services = jQuery.parseJSON(services_default_data);
        jQuery.each(all_services.services, function(i, s) {
            jQuery("textarea.servicerequest_default").data("serviceId_" + s.serviceId, s);
        })
    }
    if (data1.services) {
        jQuery.each(data1.services, function(i, s) {
            jQuery("textarea.servicerequest_default").data("serviceId_" + s.serviceId, s);
        })
    }
    if(Form_type!='cqf'){
        var services = [];
        jQuery(".form-checkbox:checked", ".form-checkboxes").each(function(i, s) {
            services[i] = jQuery("textarea.servicerequest_default").data("serviceId_" + jQuery(this).val());
        })
        data1["services"] = services;
           
    }

    //var client = (Form_type=='cqf')?0:1;
    //[CWRL-1483][edit by Kenard on 2014/2/24][start]
    //generateServiceDetail(data1);
    if(Form_type!='cqf'){
        generateServiceDetail(data1);
    }else{
        jQuery("textarea.servicerequest").text(data1);
    }
    //[CWRL-1483][edit by Kenard on 2014/2/24][end]
}
```
###检测验证服务类型
```javascript 
function checkServiceType(obj) {
    if(obj==1)
    {
        if (jQuery(":checkbox:checked", ".form-checkboxes").length < 1) {
            alert("Please select at least one service type.");
            return false;
        }
    }else
    {
        var data = jQuery("textarea.servicerequest").text();
        if (data) {
            var data1 = jQuery.parseJSON(data);
            if (data1.services) {
                var oldService = [];
                var oldServiceId = [];
                var nowService = [];
                var isconfirm = 0;
                
                jQuery.each(jQuery(".sticky-enabled .form-checkbox"), function(a,b){
                    if(jQuery(b).is(":checked")){
                        nowService[a] = b;
                    }
                });
                
                jQuery.each(data1.services, function(i, s) {
                    if (!jQuery("[value='" + s.serviceId + "']:checkbox", ".form-checkboxes").is(":checked")) {
                        oldService[oldService.length] = s.serviceName;
                        oldServiceId[oldServiceId.length] = s.serviceId;
                    }
                    
                });
                
                if(undefined != Drupal.settings.servicetmp){
                
                jQuery.each(Drupal.settings.servicetmp, function(a,b){
                    var isDelete = 1;
                    jQuery.each(nowService, function(c,d){
                        if(jQuery(b).val() == jQuery(d).val()){
                            isDelete = 0;
                        }
                    });
                    if(isDelete == 1){
                        isDelete = 0;
                        jQuery.each(oldServiceId, function(e,f){
                            if(f == jQuery(b).val()){
                                isDelete = 1;
                            }
                        });
                    }
                    
                    if(isDelete == 1){
                        isconfirm = 1;
                    }
                });
                
                }else{
                    isconfirm = 1;
                }
                
                
                
                if (oldService.length > 0 && isconfirm == 1) {
                    
                    if(confirm("uncheck " + oldService + " will be removed from this service proposal. Any service lines and associated entries will be discarded from this service proposal. Are you sure you want to proceed?")){
                        
                        Drupal.settings.servicetmp = nowService;
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }
    }
    Drupal.settings.servicetmp = nowService;
    return true;
}
```
###生成脚步统计部分UI
```javascript 
function generateServiceFooter() {


    if(Form_type=='cqf'){
        var data = ServicerequestData;
    }
    else
    {
        var data1 = jQuery("textarea.serviceprovider").text();
        var data = jQuery.parseJSON(data1);
    }
    /**start genate service detail frameworks**/
    var tag = jQuery("table", "#webform-component-comments .fieldset-wrapper");
    if (tag && tag.length > 0) {
        return;
    }
    
    if(Service_type=='view'){
        tag = jQuery("<table border=\"1\"><thead></thead><tbody></tbody><tfoot></tfoot></table>").addClass("services-comment-footer");
        /**start thead**/
        var theadFirstTd = jQuery("<td>");
        var theadTr = jQuery("<tr>").append(theadFirstTd);

        var tbodyFirstTd = jQuery("<td>").text("Attachment");
        var tbodyTr = jQuery("<tr>").append(tbodyFirstTd);
        var providerCount = data.providers.length;
        var fileCount = jQuery("#webform-component-comments .fieldset-wrapper").children("div[id^='edit-submitted-comments-file']").length;
        var fileDiv = jQuery("#webform-component-comments .fieldset-wrapper");
        if (providerCount == 0) {
            jQuery("<td>").html("&nbsp;").appendTo(theadTr);
            var fileTd = jQuery("<td>").appendTo(tbodyTr);
            var fileCopyDiv = fileDiv.find("div[id^='edit-submitted-comments-file']");
            if (!fileCopyDiv.parent("div").hasClass("fieldset-wrapper")) {
                fileTd.append(fileCopyDiv.parent("div"));
            } else {
                fileTd.append(fileCopyDiv);
            }
        } else {
            var everyProviderCount = fileCount / providerCount;
            jQuery.each(data.providers, function(j, provider) {
                jQuery("<td>").text(provider.providerName).attr("data-providerId", provider.providerId).appendTo(theadTr);
                var fileTd = jQuery("<td>").appendTo(tbodyTr);
                for (k = 0; k < everyProviderCount; k++) {
                    var fileCopyDiv = fileDiv.find("div[id^='edit-submitted-comments-file']:first");
                    if (!fileCopyDiv.parent("div").hasClass("fieldset-wrapper")) {
                        fileTd.append(fileCopyDiv.parent("div"));
                    } else {
                        fileTd.append(fileCopyDiv);
                    }
                }
            })
        }
        tag.find("thead").append(theadTr);
        tag.find("tbody").append(tbodyTr);
        /**end thead**/
        tag.prependTo("#webform-component-comments .fieldset-wrapper");
    /**end genate service detail frameworks**/
    }
}
```
###表单脚步统计UI视图
```javascript 
function generateServiceFooterView(data) {
    /**start genate service detail frameworks**/
    var tag = jQuery("<table border=\"1\"><thead></thead><tbody></tbody><tfoot></tfoot></table>").addClass("services-comment-footer");
    /**start thead**/
    var theadFirstTd = jQuery("<td>");
    var theadTr = jQuery("<tr>").append(theadFirstTd);
    if(Form_type=='crfq'&&Service_type=='view')
    {
        var AttachmentNum = 0;
        var providerId = [];
        var providerAtach = new Array();
        
         var  commentTr =  jQuery("<tr>").append(jQuery("<td>").text("Comment"));  
        
        jQuery.each(data.providers, function(j, provider) {
            jQuery("<td>").text(provider.providerName).attr("data-providerId", provider.providerId).appendTo(theadTr);
            providerId = provider.providerId.split('_');
            providerId = providerId[0];

            var value = ('undefined'!==typeof CQF_attach&&CQF_attach!=null&&'undefined'!==typeof CQF_attach["_"+providerId]&&CQF_attach["_"+providerId]!=null)?CQF_attach["_"+providerId]['list']:null;
            
            if(null!=value)
            {
                AttachmentNum = (value.length>AttachmentNum)?value.length:AttachmentNum;
                providerAtach[j] = value;
            }

           if(CQF_attach != null && 'undefined'!==CQF_attach["_"+providerId] && CQF_attach["_"+providerId]!=null){
           var commentTxt = ('undefined'!==CQF_attach["_"+providerId]['comment'])?CQF_attach["_"+providerId]['comment']:'-';
            if(commentTxt!=null){
              jQuery("<td>").text(commentTxt).appendTo(commentTr);
            }else{
              jQuery("<td>").text(' - ').appendTo(commentTr);
            }
          }

        })

        for(var i=0;i<AttachmentNum;i++){
            var attach_num = i+1;
            var tbodyFirstTd = jQuery("<td>").text("Attachment "+attach_num);
            var tbodyTr = jQuery("<tr>").append(tbodyFirstTd); 
            jQuery.each(data.providers, function(j, provider) {
                
                if('undefined'!==typeof providerAtach[j][i])
                //if(j==0 && i==0)
                {
                    jQuery("<td>").html('<a href='+providerAtach[j][i].attachment_url+' target=_blank>'+providerAtach[j][i].attachment_name+'</a>').attr("attachment-providerId", j).appendTo(tbodyTr);  
                }
                else
                {
                    jQuery("<td>").text('-').attr("attachment-providerId", j).appendTo(tbodyTr);  
                }
            });
            tag.find("tbody").append(tbodyTr);
        }

            tag.find("tbody").append(commentTr);

        
        
        tag.find("thead").append(theadTr);

    }
    else
    {
        var tbodyFirstTd = jQuery("<td>").text("Attachment");
        var tbodyTr = jQuery("<tr>").append(tbodyFirstTd);
        
        var providerCount = data.providers.length;
        var fileCount = jQuery("#webform-component-comments .fieldset-wrapper").children("div[id^='webform-component-comments--file']").length;
        var fileDiv = jQuery("#webform-component-comments .fieldset-wrapper");
        if (providerCount == 0) {
            jQuery("<td>").html("&nbsp;").appendTo(theadTr);
            var fileTd = jQuery("<td>").appendTo(tbodyTr);
            fileTd.append(fileDiv.children("div[id^='webform-component-comments--file']"));
        } else {
            var everyProviderCount = fileCount / providerCount;
            jQuery.each(data.providers, function(j, provider) {
                jQuery("<td>").text(provider.providerName).attr("data-providerId", provider.providerId).appendTo(theadTr);
                var fileTd = jQuery("<td>").appendTo(tbodyTr);
                for (k = 0; k < everyProviderCount; k++) {
                    fileTd.append(fileDiv.children("div[id^='webform-component-comments--file']:first"));
                }
            })
        }
        tag.find("thead").append(theadTr);
        tag.find("tbody").append(tbodyTr);
    }
    /**end thead**/
    tag.prependTo("#webform-component-comments .fieldset-wrapper");
/**end genate service detail frameworks**/
}
```
###评论特殊操作
```javascript 

function restoreCommentFile() {
    var fileSourceTr = jQuery("#webform-component-comments .fieldset-wrapper table tbody tr");
    fileSourceTr.find("td").each(function(i) {
        jQuery(this).children("div").appendTo(jQuery("#webform-component-comments .fieldset-wrapper"));
    })
    jQuery("#webform-component-comments .fieldset-wrapper table").remove();
}
```
###验证表单的serviceline是否同通过
```javascript 
function checkServiceDetailServiceLine() {
    var noServiceLineName = [];
    var noServiceLineId = [];
    var lineIndex = 0;
    jQuery(".services-detail", "#service_detail_display").each(function() {
        //if (jQuery(this).find("tbody").find("tr").length == 0) {
        if(jQuery(this).find("tbody").find("tr:not('tr.add-line-config,.add-line-config tr')").length==0){
            noServiceLineName[lineIndex] = jQuery(this).attr("data-servicename");
            noServiceLineId[lineIndex++] = jQuery(this).attr("id");
        }
    })
    if (noServiceLineName.length > 0) {
        jQuery(".service-tag-menu", "#service_detail_display").find("a[data-target='" + noServiceLineId[0] + "']").click();
        alert(noServiceLineName + " has no service line(s). Please input at least one service line for each selected service type, or remove unused service type from this service proposal.");
        return false;
    }
    return true;
}
```
###生成供应商预览
```javascript 
//provider 
function viewSelectServiceProvider(save_detail_data) {
    var provider_count_field = jQuery("<div>").addClass("form-item webform-component webform-component-display");
    jQuery("<label>").text("Number Of Service Provider").appendTo(provider_count_field);
   // provider_count_field.append(allowServiceProviderNum).insertBefore(jQuery("#service_provider_display"));
   
   provider_count_field.append(save_detail_data.providers.length).insertBefore(jQuery("#service_provider_display"));

var Insurance_name = '';
var is_Insurance_name = false;
    jQuery.each(save_detail_data.services, function(i, p){
        if(p.serviceName=='Insurance'){
            Insurance_name = '<td><label>Total Insurance Premium</label></td>';
            is_Insurance_name = true;
            return;
        }
           // var provider_field = jQuery("<div>").addClass("form-item webform-component webform-component-display");
            //jQuery("<label>").attr("for", "edit-submitted-provider-name").text("Service Provider "+(i+1)).appendTo(provider_field);         
           // provider_field.append(p.providerName).appendTo(jQuery("#service_provider_display"));
        })
    
    
    var provider_service = jQuery("<table border=\"1\"><thead><tr><td><label>Winner of Proposal</label></td><td><label>Service Provider</label></td><td><label>Total</label></td>"+Insurance_name+"<tr></thead><tbody></tbody></table>");

    if (save_detail_data != null && 'undefined' !== typeof save_detail_data && save_detail_data.providers.length > 0) {
        jQuery.each(save_detail_data.providers, function(i, provider) {
            tdClass = (i + 1) % 2 == 0 ? 'even' : 'odd';
            var provider_service_tr = jQuery("<tr class='" + tdClass + "'>").appendTo(provider_service.find("tbody"));
            jQuery("<td>").append(jQuery("<input type='checkbox'>").attr("name", "winnerFlag-" + provider.providerId).attr("disabled", true).attr("checked", 1 == provider.winnerFlag)).appendTo(provider_service_tr);
            jQuery("<td>").append("" + provider.providerName).appendTo(provider_service_tr);
            var total = jQuery("<td>").appendTo(provider_service_tr).addClass(numericClass);
            var totalpriceVal = ' - ';
            if(provider.providerTotalCost)
                    totalpriceVal= getNumeric(insurance, "" + provider.providerTotalCost)
            //alert(totalpriceVal);
            if(totalpriceVal != ' - '){
                //alert(totalpriceVal);
                totalpriceVal = Drupal.settings.totalCurrency+' '+totalpriceVal;
            }
            total.text(totalpriceVal);

            if(is_Insurance_name){
                var insurance = jQuery("<td>").appendTo(provider_service_tr).addClass(numericClass);
                var priceVal = ' - ';
                if(provider.insuranceTotalCost)priceVal= getNumeric(insurance, "" + provider.insuranceTotalCost);
                if(priceVal != ' - '){
                    priceVal = Drupal.settings.totalCurrency+' '+priceVal;
                }
                insurance.text(priceVal);
                    }
        })
    }

    provider_service.appendTo(jQuery("#service_provider_display").addClass("clearfix"));
}
```
###开始生成供应商预览
```javascript 
function viewInfoServiceProvider(save_detail_data)
{
    var provider_count_field = jQuery("<div id=viewInfoServiceProvider>").addClass('clearfix');
    provider_count_field.insertBefore(jQuery("#service_provider_display"));
    create_table_provide(1,save_detail_data);
}

```

###service 供应商函数清单 

生成供应商表单 ServiceProvide.js
```javascript

function generateServiceProvider(data_default,save_detail_data) {
    


    var provider_count_field = jQuery("<div>").addClass("form-item webform-component webform-component-textfield");
    var providerDiv = jQuery("<div>").addClass("providerDiv form-item webform-component webform-component-textfield");

    jQuery("<label>").attr("for", "edit-submitted-provider-count-name").text("Number Of Service Provider: ").append("<span title=\"This field is required.\" class=\"form-required\">*</span>").appendTo(provider_count_field);
    var provider_count_select = jQuery("<select>").addClass("form-select required").attr("name", "edit-submitted-provider-count-name").appendTo(provider_count_field);
    provider_count_field.appendTo(jQuery("#service_provider_display"));
    jQuery("<option>").val('').text('- Select -').appendTo(provider_count_select);
    var save_num = (save_detail_data!='')?save_detail_data.providers.length:0;
    for (var i = 1; i <= allowServiceProviderNum; i++) {
        jQuery("<option>").val(i).text(i).appendTo(provider_count_select);
        if(save_num==i){
            provider_count_select.val(save_num);
        }
    }

    providerDiv.appendTo(jQuery("#service_provider_display"));
    create_provide(save_num, data_default,save_detail_data);
    provider_count_select.change(function() {
        if(Drupal.settings.servicerequest_mode == 'edit'){
            if(jQuery(this).val() < jQuery('.selectProviderDiv').size()){
                alert(Drupal.t('No. of the existing service providers is greater than the one you selected. Please select it again or remove the service provider from the list first.'));
                jQuery(this).val(jQuery('.selectProviderDiv').size());
            }else{
                create_provide(jQuery(this).val(), data_default);
            }
        }else{
            create_provide(jQuery(this).val(), data_default);
        }
    })
}
```
###创建供应商

```javascript
function create_provide(selectProvider, data_default,save_detail_data) {
    jQuery('.providerDiv').html('');
    save_detail_data = ('undefined'!==save_detail_data)?save_detail_data:0;
    //provider Num
    for (var i = 0; i < selectProvider; i++) {
        var provider_field = jQuery("<div>").addClass("form-item webform-component webform-component-textfield selectProviderDiv");
        jQuery("<label>").attr("for", "edit-submitted-provider-name").text("Service Provider ").append("<span title=\"This field is required.\" class=\"form-required\">*</span>").appendTo(provider_field);
        var provider_select = jQuery("<select>").addClass("form-select required").addClass("add-provider-config").attr("name", "edit-submitted-provider-name-" + i).appendTo(provider_field);
        jQuery("<option>").val("").text("Service Provider Select...").appendTo(provider_select);
        
        var deleteImg = jQuery("<a>").css({'margin-left':'10px'}).attr("href", "javascript:void(0)").addClass("del-icon create_provide_fun_delete delete").appendTo(provider_field);
        var op = '';
        
        jQuery.each(data_default.providers, function(j, p) {
            op =  jQuery("<option>").val(p.providerId).text(p.providerName).appendTo(provider_select);        
            if('undefined'!==typeof save_detail_data && 'undefined'!==typeof save_detail_data.providers && 'undefined'!==typeof save_detail_data.providers[i]){
                var m = save_detail_data.providers[i].providerId;
                m  = m.split('_');
                m = m[0];
                if(m==p.providerId){
                    op.attr("selected", true);
                }
            }        
        })        
        //for qantas
        if(i == 0 && Drupal.settings.servicerequest_mode == 'edit'){
            if('undefined'===typeof save_detail_data ){
				jQuery(provider_select).val(Drupal.settings.spinfo_array[0]['value']);
			}
        }
        provider_field.appendTo(jQuery(".providerDiv"));
    }

    var create_table_provide_content = create_table_provide(0);
    if (create_table_provide_content) create_table_provide_content.appendTo(jQuery(".providerDiv"));
    jQuery('.create_provide_fun_delete').click(function(e) {
        e.preventDefault();
        var selected_sp_name = jQuery(this).parents("div.selectProviderDiv").find('select option:selected').text();
        if(jQuery(this).parents("div.selectProviderDiv").find('select').val()!='' && Drupal.settings.servicerequest_mode == 'edit'){
        if (confirm("If "+selected_sp_name+" is removed from this Service Proposal, all data entered by this service provider will also be discarded. Are you sure you want to proceed?")) {
            jQuery(this).parents("div.selectProviderDiv").remove();
            create_table_provide(1); 
            var size = jQuery("select[name=edit-submitted-provider-count-name]").val() - 1;
            if (!size) size = "";
            jQuery("select[name=edit-submitted-provider-count-name]").val(size);
        }
        }else{
            jQuery(this).parents("div.selectProviderDiv").remove();
            create_table_provide(1); 
            var size = jQuery("select[name=edit-submitted-provider-count-name]").val() - 1;
            if (!size) size = "";
            jQuery("select[name=edit-submitted-provider-count-name]").val(size);
        }
    });
    
    if(Drupal.settings.servicerequest_mode == 'edit'){
        var spinfo_array = new Array();
        jQuery.each(jQuery('.add-provider-config'),function(k,v){
            //Drupal.settings.spinfo_array[k] = v;
            spinfo_array[k] =  new Array();
            spinfo_array[k]['value'] = jQuery(v).val();
            spinfo_array[k]['name'] = jQuery(v).find("option:selected").text();
        });
        Drupal.settings.spinfo_array = spinfo_array;
    }
    jQuery('.add-provider-config').change(function() {
        if(Drupal.settings.servicerequest_mode == 'edit'){
            var tmp_id = jQuery(this).attr('name').replace('edit-submitted-provider-name-','');
            var selected_sp_name = Drupal.settings.spinfo_array[tmp_id]['name'];
            var selected_sp_value = Drupal.settings.spinfo_array[tmp_id]['value'];
            
            if(selected_sp_value != ''){
                var issame = 0;
                var nowsp = jQuery(this);
                jQuery.each(jQuery('.add-provider-config'), function(k, v){ 
                    if((jQuery(v).attr('name') != jQuery(nowsp).attr('name')) && (jQuery(v).val() == jQuery(nowsp).val())){
                        issame = 1;
                    }
                });
                
                if(issame == 1){
                    alert('Service Provider can only be selected once in the same Service Proposal.');
                    jQuery(this).val(selected_sp_value);
                }else{
                    if(confirm("If "+selected_sp_name+" is removed from this Service Proposal, all data entered by this service provider will also be discarded. Are you sure you want to proceed?")){
                        Drupal.settings.spinfo_array[tmp_id]['name'] = jQuery(this).find("option:selected").text();
                        Drupal.settings.spinfo_array[tmp_id]['value'] = jQuery(this).val();
                        create_table_provide(1); 
                    }else{
                        jQuery(this).val(selected_sp_value);
                    }
                }
                
                
            }else{
                var issame = 0;
                var nowsp = jQuery(this);
                jQuery.each(jQuery('.add-provider-config'), function(k, v){ 
                    if((jQuery(v).attr('name') != jQuery(nowsp).attr('name')) && (jQuery(v).val() == jQuery(nowsp).val())){
                        issame = 1;
                    }
                });
                
                if(issame == 1){
                    alert('Service Provider can only be selected once in the same Service Proposal.');
                    jQuery(this).val(selected_sp_value);
                }
                Drupal.settings.spinfo_array[tmp_id]['name'] = jQuery(this).find("option:selected").text();
                Drupal.settings.spinfo_array[tmp_id]['value'] = jQuery(this).val();
                create_table_provide(1); 
            }
        }else{
            var issame = 0;
            var nowsp = jQuery(this);
            jQuery.each(jQuery('.add-provider-config'), function(k, v){ 
                if((jQuery(v).attr('name') != jQuery(nowsp).attr('name')) && (jQuery(v).val() == jQuery(nowsp).val())){
                    issame = 1;
                }
            });
            if(issame == 1){
                alert('Service Provider can only be selected once in the same Service Proposal.');
                jQuery(nowsp).val('');
            }else{
                create_table_provide(1);  
            }
            
        }
        
    });

    


    if (selectProvider == 0) jQuery('#create_table_provide').remove();
}

```
###创建供应商table
```javascript
function create_table_provide(insert,save_detail_data) {
    if (!insert) var resContent = jQuery('<div id="create_table_provide" class="form-item webform-component webform-component-textfield"></div>');
    var table = jQuery("<table border=\"1\" style=\"width:100%\"><tbody></tbody></table>");
    
    if(Service_type!='view')var provideList =[Drupal.t("Service Provider Name:"), Drupal.t("Contact:"), Drupal.t("Email:")];
    else var provideList =[Drupal.t("Service Provider Name:"), Drupal.t("Contact:"), Drupal.t("Email:"), Drupal.t("Last Date to Accept:"),Drupal.t("Planned Survey Date:"),Drupal.t("Last Date to Submit Quote:"), Drupal.t("Quote Status:"),  Drupal.t("Comment for Decline:"),Drupal.t("Quote Link:"),Drupal.t("Decline:")];

    

    var tableLabel_td = '';
    var tableLabel_tr = '';
    var providerList = [];
    
    //view
    var serviceprovider= jQuery('.serviceprovider').val();
    serviceprovider = jQuery.parseJSON(serviceprovider);
    var showDecline = new Array();
    
    if(Service_type!='view')
    {
        var provideValue = [];
        jQuery.each(Provider_default.providers,function(i,p) {
            provideValue[p.providerId] = p;
        });
        jQuery('.add-provider-config').each(function(i) {
            var k = jQuery(this).val();
            k = parseInt(k);
            providerList[i] = new Array();
            if('undefined'!==typeof provideValue[k]){
                providerList[i][0] = provideValue[k].providerName;
                providerList[i][1] = provideValue[k].providerContact;
                providerList[i][2] = provideValue[k].providerEmail;
            }
        
        });
    }
    else
    {
        jQuery.each(Drupal.settings.invalid_quote_info,function(k,v){
            var decline_sp = v.providerName+" declined on "+v.updatedDate+". Comment: "+v.quoteComments;
            showDecline.push(decline_sp);
        });
        serviceprovider = ('undefined'!==typeof serviceprovider && null!==serviceprovider)?serviceprovider:save_detail_data.providers;
        if('undefined'!==typeof serviceprovider && null!==serviceprovider){
            jQuery.each(serviceprovider, function(i, provider) {
                providerList[i] = new Array();
                providerList[i][0] = cstr(provider.providerName,'-');
                providerList[i][1] = cstr(provider.providerContact,'-');
                providerList[i][2] = cstr(provider.providerEmail,'-');
                
                providerList[i][3] = cstr(provider.quoteLastDateToAccept,'-');
                providerList[i][4] = cstr(provider.quoteSurveyDay,'-');
                providerList[i][5] = cstr(provider.quoteLastDateSubmitQuote,'-');
                
                providerList[i][6] = cstr(provider.quoteStatus,'-');
                providerList[i][7] = cstr(provider.quoteComments,'-');
                providerList[i][8] = ('undefined'!==typeof provider.quoteUrl&&provider.quoteUrl!='')?'<a href="'+provider.quoteUrl+'" target="_blank">View</a>':'-';
                providerList[i][9] = ('undefined'!==typeof provider.quoteStatus&&provider.quoteStatus==Drupal.t("Declined"))?provider.providerName+" declined on "+provider.updatedDate+". Comment: "+provider.quoteComments:"";
               // if(providerList[i][9]!='')showDecline.push(providerList[i][9]);
            });
        }
    }
    
    jQuery.each(provideList, function(i, p) {
        tableLabel_td = '';
        tableLabel_td += "<td>" + p + "</td>";
        for (var j in providerList) {
            if('undefined'!==typeof providerList[j][i]){
                tableLabel_td += "<td>" + providerList[j][i] + "</td>";
            }
        }
        var tdClass = (i + 1) % 2 == 0 ? 'even' : 'odd';
        if(i!=9&&i!=7)tableLabel_tr += "<tr class="+tdClass+">" + tableLabel_td + "</tr>";
    });
    table.find("tbody").append(tableLabel_tr);
    
    if(showDecline.length>0)
        {
            var divDecline = jQuery('<div id=showDecline>').addClass('clearfix').insertAfter(jQuery("#viewInfoServiceProvider"));
            var divDecline_table = jQuery("<table border=\"1\" style=\"width:100%\"><tbody></tbody></table>");
            
            for(var i in showDecline)
                {
                    var tdClass = (i + 1) % 2 == 0 ? 'even' : 'odd';
                    var html = '<tr class='+tdClass+'><td>'+Drupal.t("Decline:")+'</td><td>'+showDecline[i]+'</td></tr>';
                    divDecline_table.find("tbody").append(html);
                    divDecline_table.appendTo(divDecline);
                }
        
        }

    if(Service_type!='view')
    {
        if (!insert) {
            table.appendTo(resContent);
            return resContent;
        } else {
            jQuery('#create_table_provide').html(table);
        }
    }
    else
    {
        jQuery('#viewInfoServiceProvider').html(table);
    }
}
```
###判断字符类型
```javascript
function cstr(o,p)
{
    return('undefined'!==typeof o&&null!== o)?o:(('undefined'!==typeof p)?p:'');
}
```
###绑定选择供应商
```javascript
function setSelectServiceProvider(save_data) {
    
    if('undefined'!==typeof serviceprovider && null!==save_data.providers){
        jQuery.each(save_data.providers, function(i, p) {
            var pId = p.providerId.split("_");
            if (p && pId.length > 0) {
                jQuery(jQuery("select.add-provider-config", "#service_provider_display")[i]).find("option[value='" + pId[0] + "']").attr("selected", true);
            }
        })
    }
    create_table_provide(1);
}
```
###编辑选择的供应商
```javascript
function editSelectServiceProvider(all_providers, save_data) {
    var provider_count_field = jQuery("<div>").addClass("form-item webform-component webform-component-textfield");
    jQuery("<label>").attr("for", "edit-submitted-provider-count-name").text("Number Of Service Provider").append("<span title=\"This field is required.\" class=\"form-required\">*</span>").appendTo(provider_count_field);
    var provider_count_select = jQuery("<select>").addClass("form-select required").attr("name", "edit-submitted-provider-count-name").appendTo(provider_count_field);
    provider_count_field.insertBefore(jQuery("#service_provider_display"));
    provider_count_select.bind("change", function() {
        var targetCount = jQuery(this).val();
        var currentCount = jQuery("tbody", "#service_provider_display").find("tr").length;
        while (parseInt(targetCount) > currentCount) {
            var addProvider = jQuery("tbody", "#service_provider_display").find("tr:first").clone(true);
            addProvider.find("select option:first").attr("selected", true);
            addProvider.find("input").val("");
            addProvider.appendTo(jQuery("tbody", "#service_provider_display")); 
            currentCount++;
        }
    })
    var provider_service = jQuery("<table border=\"1\"><thead><tr><td>Winner of Proposal</td><td>Service Provider<span title=\"This field is required.\" class=\"form-required\">*</span></td><td>Total</td><td>Total Insurance Premium</td><td>&nbsp;</td><tr></thead><tbody></tbody></table>")
    jQuery("<option>").val(allowServiceProviderNum).text(allowServiceProviderNum).appendTo(provider_count_select);
    jQuery.each(save_data.providers, function(i, provider) {
        //CWRL-845
        //jQuery("<option>").val(i+3).text(i+3).appendTo(provider_count_select);
        tdClass = (i + 1) % 2 == 0 ? 'even' : 'odd';
        var provider_service_tr = jQuery("<tr class='" + tdClass + "'>").appendTo(provider_service.find("tbody"));
        jQuery("<td>").append(jQuery("<input type='checkbox'>").attr("name", "winnerFlag-" + provider.providerId).attr("disabled", true).attr("checked", 1 == provider.winnerFlag)).appendTo(provider_service_tr);
        var select_div = jQuery("<div>").addClass("form-item webform-component webform-component-select tddiv").appendTo(jQuery("<td>").appendTo(provider_service_tr));

        var provider_select = jQuery("<select>").addClass("form-select required").addClass("add-provider-config").attr("name", "edit-submitted-provider-name-" + provider.providerId).appendTo(select_div);
        //jQuery("<span title=\"This field is required.\" class=\"form-required\">*</span>").insertBefore(provider_select);
        jQuery("<option>").val("").text("Service Provider Select...").appendTo(provider_select);
        jQuery.each(all_providers.providers, function(j, p) {
            var provider_option = jQuery("<option>").val(p.providerId).text(p.providerName).appendTo(provider_select);
            if (p.providerId + "_" + i == provider.providerId) {
                provider_option.attr("selected", true);                    
            }
        })
        var total = jQuery("<input type='text' readonly>").addClass(inputClass).addClass(numericClass).attr("name", "edit-submitted-provider-total-" + provider.providerId).val(provider.providerTotalCost)
        .appendTo(jQuery("<td>").appendTo(provider_service_tr));
        total.val(getNumeric(total, total.val()));
        var insurance = jQuery("<input type='text' readonly>").addClass(inputClass).addClass(numericClass).attr("name", "edit-submitted-provider-insurance-" + provider.providerId)
        .val(provider.insuranceTotalCost).appendTo(jQuery("<td>").appendTo(provider_service_tr));
        insurance.val(getNumeric(insurance, insurance.val()));
        var deleteImg = jQuery("<a href=\"javascript:void(0)\">X</a>").addClass("delete").appendTo(jQuery("<td>").appendTo(provider_service_tr));
        deleteImg.bind("click", function() {
            var serviceProvider = jQuery(this).parents("tr").find("td:first select option:selected").text();
            if (confirm("If {" + serviceProvider + "} is removed from this proposal, all data entered for this service provider will also be discarded. Are you sure you want to proceed?")) {
                jQuery(this).parents("tr").remove();
            }
        })
        provider_service.find("thead tr").find("td:last").hide();
        provider_service.find("tbody tr").find("td:last").hide();
        provider_service.appendTo(jQuery("#service_provider_display").addClass("clearfix"));
    })
}
```
###货币运算
```javascript
function reCaculationTotal() {
    var generateModel = Drupal.settings.servicerequest_mode;
    var printModel = "print";
    var viewModel = "view";
    var editModel = "edit";
    var isPrintModel = generateModel == printModel;
    var isViewModel = generateModel == viewModel;
    var isEditModel = generateModel == editModel;
    if (isEditModel) {
        var data2 = jQuery("textarea.servicerequest").text();
        var save_data = jQuery.parseJSON(data2);
        jQuery.each(save_data.providers, function(i, provider) {
            var total = jQuery("input[name='edit-submitted-provider-total-" + provider.providerId + "']", "#service_provider_display");
            total.val(getNumeric(total, provider.providerTotalCost));
            var insurance = jQuery("input[name='edit-submitted-provider-insurance-" + provider.providerId + "']", "#service_provider_display");
            insurance.val(getNumeric(insurance, provider.insuranceTotalCost));
        })

    }
}

```

###下一步hook	

```javascript	
function step_clear_after()
{
	var data_default = jQuery("textarea.serviceprovider_default").text();
		data_default = jQuery.parseJSON(data_default);
	var save_detail_data = jQuery("textarea.servicerequest").text();
	var show = 0;
	if(save_detail_data!='')show=1;
	save_detail_data = jQuery.parseJSON(save_detail_data);
    

    
     if(jQuery('.form-select')){
         var s = jQuery(":input[name='edit-submitted-provider-count-name']").val(); 
         s = ('undefined'!==typeof s && s!='')?parseInt(s):0;
         create_provide(s,data_default,save_detail_data);
     }
     if(jQuery('#create_table_provide')&&!show)jQuery('#create_table_provide').html('');
   
    
}
```