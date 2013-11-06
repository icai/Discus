define('tmpl', ['require','jquery','init','common'], function(req,$,FUNLR){


        FUNLR.namespace('content.tmpl', function(a) {
            var c = a['face']['format'],
                comm_em = ['em_comment_titter', 'em_comment_laught', 'em_comment_agree', 'em_comment_love'],
                b = {
                main:function(j){
                    var deltmpl,imgtmpl,transmittmpl,
                    tramsitemtpl,tramslisttmpl = "",
                    tpl,formatTpl,funtypetpl,retransmtmpl,emotionlist,istrans,
                    funtype = j.funType,popphoto,pphototips,commentbox,zoom,commentlist;

                    imgtmpl = "";   // 图片模板
                    pphototips = funtype == 3 ? '<span class="upload_album_tips">创建新故事 <i>{{context}}</i> 分享了<em>'+ (j.pList ? j.pList.length : 0 )+'</em> 张照片</span>'
                                :(funtype == 6 ? (j.pList ? '<span class="upload_album_tips">创建新故事 <i>{{orginalText}}</i> 分享了<em>'+ (j.pList ? j.pList.length : 0 )+'</em> 张照片</span>':"此故事已被删除！"):"");

                    popphoto =  funtype == 3 || funtype == 6 ? 'pop_photo' : "";

                    zoom = funtype != 3 && funtype != 6 ? 'zout': '';

                    if (j.pList) {
                        switch (j.pList.length) {
                            case 1:
                                imgtmpl = '<div class="cnt_images '+popphoto + ' cnt_one_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                                + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('450x340', j.pList[0].imgPath) + '" alt="1"></a>'
                                            + '</div>';
                                break;
                            case 2:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_two_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('220x170', j.pList[0].imgPath) + '" alt="1"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('220x170', j.pList[1].imgPath) + '" alt="2"></a>'
                                + '</div>';
                                break;
                            case 3:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_third_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                    + '<div class="big_img">'
                                        + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('450x340', j.pList[0].imgPath) + '" alt="1"></a>'
                                    + '</div>'
                                    + '<div class="two_column clearfix">'
                                        + '<a href="javascript:;" title=""  data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+' thr_sec"><img src="' + imgURL('220x170', j.pList[1].imgPath) + '" alt="2"></a>'
                                        + '<a href="javascript:;" title=""  data-id="' + j.pList[2].id + '" data-bigImgSrc="' + j.pList[2].imgPath + '" class="'+zoom+' thr_thr"><img src="' + imgURL('220x170', j.pList[2].imgPath) + '" alt="3"></a>'
                                    + '</div>'
                                + '</div>';
                                break;
                            case 4:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_four_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('220x170', j.pList[0].imgPath) + '" alt="1"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('220x170', j.pList[1].imgPath) + '" alt="2"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[2].id + '" data-bigImgSrc="' + j.pList[2].imgPath + '" class="'+zoom+'"><img src="' + imgURL('220x170', j.pList[2].imgPath) + '" alt="3"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[3].id + '" data-bigImgSrc="' + j.pList[3].imgPath + '" class="'+zoom+'"><img src="' + imgURL('220x170', j.pList[3].imgPath) + '" alt="4"></a>'
                                + '</div>';
                                break;
                            default:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_five_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                            +'<div class="three_rows clearfix">'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('150x120', j.pList[0].imgPath) + '" alt="1"></a>'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('150x120', j.pList[1].imgPath) + '" alt="2"></a>'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[2].id + '" data-bigImgSrc="' + j.pList[2].imgPath + '" class="'+zoom+'"><img src="' + imgURL('150x120', j.pList[2].imgPath) + '" alt="3"></a>'
                                            +'</div>'
                                            +'<div class="big_img">'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[3].id + '" data-bigImgSrc="' + j.pList[3].imgPath + '" class="'+zoom+'"><img src="' + imgURL('290x250', j.pList[3].imgPath) + '" alt="4"></a>'
                                            +'</div>'
                                            +'<div class="mid_img">'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[4].id + '" data-bigImgSrc="' + j.pList[4].imgPath + '" class="'+zoom+'"><img src="' + imgURL('290x250', j.pList[4].imgPath) + '" alt="5"></a>'
                                            +'</div>'
                                        + '</div>';
                            }

                    }

                   var cpiclist = function(){
                        var k = ""
                        for (var i = 0; i < j.pList.length; i++) {
                            if(j.pList.length == 1){
                                return "";
                            }
                            if(i <= 5){
                                k += '<li><a href="javascript:;" title=""><img src="'+ dirImgUrl(j.pList[i].imgPath) +'" alt="" ></a></li>'
                            }
                        };
                        return k;
                    };


                    funpicshow  = (funtype != 3 && j.pList) ? '<div class="cnt_show_pic clearfix" style="display:none;">'
                                                    +'<div class="f_pic_small_list">'
                                                        +'<ul>'
                                                        +cpiclist()
                                                        +'</ul>'
                                                    +'</div>'
                                                +'</div>' : "";

                    funtypetpl = (funtype == 1 || funtype == 5 || funtype == 4) ? imgtmpl+funpicshow+'<span class="content_text">{{context}}</span>'
                               : (funtype == 2?'<span class="transmit_reason">{{context}}</span>'
                                                +'<div class="transmit_cnt_outer">'
                                                    +'<div class="transmit_cnt_author"><img src="{{orginalHeadFace}}" height="32" width="32" alt="{{orginalName}}" hurl="{{orginalHeadUrl}}" class="ucard" cuid="{{orginaluid}}"></div>'
                                                    +imgtmpl + funpicshow
                                                    +'<span class="transmit_cnt">{{orginalText}}</span>'
                                                +'</div>'
                               : (funtype == 3 ? pphototips + imgtmpl 
                               : (funtype == 6 ? '<span class="transmit_reason">{{context}}</span>'
                                                +'<div class="transmit_cnt_outer">'
                                                    +'<div class="transmit_cnt_author"><img src="{{orginalHeadFace}}" height="32" width="32" alt="{{orginalName}}" hurl="{{orginalHeadUrl}}" class="ucard" cuid="{{orginaluid}}"></div>'
                                                    + pphototips + imgtmpl
                                                +'</div>' 
                               : "" )));


                     deltmpl = j.uid == userconfig.uid ?'<a class="cnt_del"  style="display:none;" href="javascript:;">删除</a>':"";


                    if(!!j.commentList.length){
                         for (var i = j.commentList.length-1; i > -1; i--) {
                            var k = j.commentList[i],
                                commenthtml,previewImg,previewst,commentdel;


                            
                                commentdel = k.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" style="display:none;" href="javascript:;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">删除</a>' :"";

                                previewImg = k.funImg == "" ? "" : '<dd class="ablum_cm"><div class="outer"><div class="inner"><img src="'+ imgURL('45x45', k.funImg)+'"/></div></div></dd>';
                                previewst = previewImg == "" ? "" : 'class="ablum_img"'
                                retransmtmpl = k.cmtNum ? '<a href="javascript:;" title="回复展开/收起" class="comment_revert_down" rel="comment_revert_up"><em>{{cmtNum}}</em>条回复<i></i></a></dd>'
                                            +'<dd class="comment_revert_list">' :"";
                                tramsitemtpl='<dl class="f_comment_item">'
                                                +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                                +'<dd '+ previewst + '><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                                +'<dd>'
                                                    +commentdel
                                                    +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                                    +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">回复</a>'
                                                    +retransmtmpl
                                                +'</dd>'
                                                +previewImg
                                                                           
                                            +'</dl>';
                                            
                                commenthtml = tramsitemtpl.format({
                                    'cmtNum': k.cmtNum,
                                    'context': c(k.context),
                                    'fid': k.fid,
                                    'headFace': a.fn.getHeadFace(k.headFace,32),
                                    'id': k['id'],
                                    'isChild': k.isChild,
                                    'nickName': k.nickName,
                                    'pid': k.pid,
                                    'pushDate': k.pushDate,
                                    'smtId': k.smtId,
                                    'state': k.state,
                                    'timenum': a.fn.DateFormat(k.timenum),
                                    'uid': k.uid,
                                    'userName': k.userName
                                })
                                tramslisttmpl += commenthtml;   
                        };
                    }


                     transmittmpl = !!j.commentList.length ?'<div class="f_comment_more">'
                                                    +'<a href="javascript:;" title="评论展开" id="lmore_{{id}}" class="comment_arrow_down " rel="comment_arrow_up"><span class="">{{funcmtNum}}条评论</span>'
                                                    +(j.funcmtNum > 2 ? '<i></i>' :'')
                                                    +'</a>'
                                                +'</div>'
                                                +'<div class="f_commet_item_wrapper">'
                                                +tramslisttmpl
                                                +'</div>':"";


                    emotionlist = !!j.vList && !!j.vList.length ?(function(){
                        var list = j.vList,len = list.length,emtpl='<div class="f_emotion_comment_inner clearfix">';
                        for(var i = 0;i < len;i++){

                            emtpl+= '<a href="javascript:;" alt="☺"><img src="'+a.fn.getHeadFace(list[i].headFace,32)+'" alt="'+list[i].realName+'">'
                                        +'<em class="'+comm_em[list[i].expressId]+'"></em>'
                                    +'</a>';
                        }
                        emtpl += '</div>';
                        return emtpl;

                    })() : '';


                    commentbox = funtype != 3 ?'<div class="f_comment_revert_box">'
                                    +'<textarea name=""  id="txt_{{uid}}_{{id}}" class="revert_box_off" rel="我也说一句">我也说一句</textarea>'
                                    +'<div class="revert_box_ctrl clearfix">'
                                        +'<em class="emo" onclick="FUNLR.face.show(this, \'txt_{{uid}}_{{id}}\');"></em>'
                                        +'<a href="javascript:;" title="" id="cmbtn_{{uid}}_{{id}}" class="comment_btn comment_btn_disable"><span><em>评论</em></span></a>'
                                    +'</div>'
                                +'</div>' : "";

                    emotioncomment = funtype != 3 ? '<a class="cnt_emotion"   id="cmem_{{uid}}_{{id}}" href="javascript:;"><span>{{vListlen}}</span></a>' : "";
                    istrans = !j.isTrans ? '<a class="cnt_transmit"  id="cmtm_{{uid}}_{{id}}" href="javascript:;"><span>{{counter}}</span></a>':"" ;





                    commentlist = (function(){

                        if(!j.commentList.length && funtype == 3 ){
                            return ""
                        }
                        var tmcv = '<div class="f_comment_outer">'
                                        +emotionlist
                                        +'<div class="f_comment_inner">'
                                            +transmittmpl
                                            +commentbox
                                        +'</div>'
                                    +'</div>';
                            return tmcv;
                    })();       



                    tpl ='<article class="fun_item_outer" id="article_{{uid}}_{{id}}" artuid="{{uid}}" funid="{{id}}" funtype="{{funType}}">'
                        +deltmpl
                        +'<div class="f_cnt_inner">'
                            +'<div class="f_info_wrpper">'
                                +'<div class="f_avater_outer">'
                                    +'<a href="{{userName}}" title=""><img src="{{headFace}}" height="64" width="64" alt="" class="ucard" cuid="{{uid}}" ></a>'
                                +'</div>'
                                +'<a href="{{userName}}" title=""><span class="cnt_author ucard" cuid="{{uid}}" >{{nickName}}</span></a>'
                                +'<span class="cnt_time">{{timenum}}</span>'
                            +'</div>'
                            +'<div class="f_content_wrapper">'
                                +funtypetpl
                            +'</div>'

                            +'<div class="f_trans_wrapper">'
                                + emotioncomment
                                + istrans
                            +'</div>'

                        +'</div>'
                        +commentlist
                    +'</article>';

                    formatTpl = tpl.format({
                        'context': c(j.context),
                        'counter': j.counter,
                        'funCent': j.counter,
                        'funType': j.funType,
                        'funcmtNum': j.funcmtNum,
                        'headFace': a.fn.getHeadFace(j.headFace,64),
                        'id': j['id'],
                        'imgPath': j.imgPath,
                        'imgPrev': j.imgPrev,
                        'isTrans': j.isTrans,
                        'lid': j.lid,
                        'nickName': j.nickName,
                        'prId': j.prId,
                        'prviewContext': j.prviewContext,
                        'pushDate': j.pushDate,
                        'state': j.state,
                        'taId': j.taId,
                        'timenum': funtype == 3 ? a.string.timeFormatString(Number(j.pushDate)*1000,"{Y: }年{M: }月{d: }日") : a.fn.DateFormat(j.timenum),
                        'trantext': j.trantext,
                        'uid': j.uid,
                        'userName':j.userName,
                        'vListlen': j.vList.length,
                        'orginalHeadFace':j.tranUser !==  null? a.fn.getHeadFace(j.tranUser.headFace,32): '',
                        'orginalHeadUrl': j.tranUser !== null ? j.tranUser.headFace :'',
                        'orginalPage':j.tranUser !== null ? j.tranUser.userName :'',
                        'orginalName':j.tranUser !== null ? j.tranUser.realName :'',
                        'orginalText':j.primitive != "" ? c(j.primitive) : "此分享已被删除！",
                        'orginaluid':j.tranUser !== null ? j.tranUser.uid:''
                    })

                    return formatTpl;
                }
            };
            return b;
        })



        FUNLR.namespace('comtent.transmit.tmpl',function(a){

            return function(img,type,transmitcnt){
                var imgtpl,cnttinput,tpl;

                imgtpl = img == ''||undefined ? '' :'<div class="preview_img">'
                                                        +'<div class="pimg_inner"><img src="{{img}}" alt=""></div>'
                                                    +'</div>',
                cnttinput = transmitcnt,         
                tpl ='<section class="pop_transmit_layer" id="pop_transmit_layer_{{fid}}" style=" position: absolute; top: 416px; left: 564.5px; ">'
                              +'<div class="pop_transmit_head"><a href="javascript:;" title="关闭" class="inner_close_btn">关闭</a><h3 class="pop_title">转发分享</h3></div>'
                              +'<div class="pop_transmit_main">'
                                +'<div class="transmit_original_cnt clearfix">'
                                    +'<div class="avatar">'
                                        +'<img src="{{avatar}}" alt="">'
                                    +'</div>'
                                    +imgtpl
                                    +'<div class="cntent">'
                                        + '<a href="#"><span class="original_author">{{username}}</span></a>:'
                                        +'<span class="transmit_cnt">{{context}}</span>'
                                    +'</div>'
                                +'</div>'
                                +'<div class="transmit_reason_box">'
                                        +'<textarea name="transmit_input" class="transmit_input" id="transmit_{{uid}}_{{fid}}" range="0|0">'+cnttinput+'</textarea>'
                                        +'<div id="" class="transmit_box_ctrl clearfix">'
                                            +'<em class="emo" onclick="FUNLR.face.show(this, \'transmit_{{uid}}_{{fid}}\');"></em>'
                                            +'<a href="javascript:;" class="transmit_submit_btn"><span>转发</span></a>'
                                        +'</div>'
                              +'</div>'
                           +'</div>'
                        +'</section>';
                return tpl;
            }
        })

        FUNLR.namespace('content.atme.tmpl',function(a){
            return function(j){
                var tmpl  = '<li rel="{{userName}}|{{id}}|{{nickName}}"><a href="javascript:;"><em><img src="{{headFace}}" alt=""></em>{{nickName}}</a></li>';
                var ftmpl ="",retmpl;
                for(var i = 0; i < j.length; i++){
                    var k = j[i];
                    ftmpl += tmpl.format({
                            'headFace': getHeadFace(k.rheadFace,32),
                            'id': k.rid,
                            'nickName': k.rnickName,
                            'userName': k.userName
                    })
                }
                retmpl = '<div id="layer_atme_pop" class="layer_menu_list">'
                    +'<ul>'
                         +'<li class="suggest_title">选择你想@的好友或轻敲空格完成</li>'
                         + ftmpl
                    +'</ul>'
                +'</div>';  
                return retmpl;              
            }
        })

/*
378x285
183x128
245x210
100x100
 */




       FUNLR.namespace('timeline.tmpl.plist',function(a){ // 相册模块



            return function(funtype,pList){


                var popphoto,zoom,imgtmpl = "",funpicshow = "";
                    popphoto =  funtype == 3 || funtype == 6 ? 'pop_photo' : "";
                    zoom = funtype != 3 && funtype != 6 ? 'zout': '';

                    if (pList) {
                        switch (pList.length) {
                            case 1:
                                imgtmpl = '<div class="cnt_images '+popphoto + ' cnt_one_pic clearfix" data-fid="' + pList[0].funId + '">'
                                                + '<a href="javascript:;" title="" data-id="' + pList[0].id + '" data-bigImgSrc="' + pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('378x285', pList[0].imgPath) + '" alt="1"></a>'
                                            + '</div>';
                                break;
                            case 2:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_two_pic clearfix" data-fid="' + pList[0].funId + '">'
                                    + '<a href="javascript:;" title="" data-id="' + pList[0].id + '" data-bigImgSrc="' + pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', pList[0].imgPath) + '" alt="1"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + pList[1].id + '" data-bigImgSrc="' + pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', pList[1].imgPath) + '" alt="2"></a>'
                                + '</div>';
                                break;
                            case 3:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_third_pic clearfix" data-fid="' + pList[0].funId + '">'
                                    + '<div class="big_img">'
                                        + '<a href="javascript:;" title="" data-id="' + pList[0].id + '" data-bigImgSrc="' + pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('378x285', pList[0].imgPath) + '" alt="1"></a>'
                                    + '</div>'
                                    + '<div class="two_column clearfix">'
                                        + '<a href="javascript:;" title="" data-id="' + pList[1].id + '" data-bigImgSrc="' + pList[1].imgPath + '" class="'+zoom+' thr_sec"><img src="' + imgURL('183x128', pList[1].imgPath) + '" alt="2"></a>'
                                        + '<a href="javascript:;" title="" data-id="' + pList[2].id + '" data-bigImgSrc="' + pList[2].imgPath + '" class="'+zoom+' thr_thr"><img src="' + imgURL('183x128', pList[2].imgPath) + '" alt="3"></a>'
                                    + '</div>'
                                + '</div>';
                                break;
                            case 4:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_four_pic clearfix" data-fid="' + pList[0].funId + '">'
                                    + '<a href="javascript:;" title="" data-id="' + pList[0].id + '" data-bigImgSrc="' + pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', pList[0].imgPath) + '" alt="1"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + pList[1].id + '" data-bigImgSrc="' + pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', pList[1].imgPath) + '" alt="2"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + pList[2].id + '" data-bigImgSrc="' + pList[2].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', pList[2].imgPath) + '" alt="3"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + pList[3].id + '" data-bigImgSrc="' + pList[3].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', pList[3].imgPath) + '" alt="4"></a>'
                                + '</div>';
                                break;
                            default:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_five_pic clearfix" data-fid="' + pList[0].funId + '">'
                                            +'<div class="three_rows clearfix">'
                                                +'<a href="javascript:;" title="" data-id="' + pList[0].id + '" data-bigImgSrc="' + pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('121x100', pList[0].imgPath) + '" alt="1"></a>'
                                                +'<a href="javascript:;" title="" data-id="' + pList[1].id + '" data-bigImgSrc="' + pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('121x100', pList[1].imgPath) + '" alt="2"></a>'
                                                +'<a href="javascript:;" title="" data-id="' + pList[2].id + '" data-bigImgSrc="' + pList[2].imgPath + '" class="'+zoom+'"><img src="' + imgURL('121x100', pList[2].imgPath) + '" alt="3"></a>'
                                            +'</div>'
                                            +'<div class="big_img">'
                                                +'<a href="javascript:;" title="" data-id="' + pList[3].id + '" data-bigImgSrc="' + pList[3].imgPath + '" class="'+zoom+'"><img src="' + imgURL('245x210', pList[3].imgPath) + '" alt="4"></a>'
                                            +'</div>'
                                            +'<div class="mid_img">'
                                                +'<a href="javascript:;" title="" data-id="' + pList[4].id + '" data-bigImgSrc="' + pList[4].imgPath + '" class="'+zoom+'"><img src="' + imgURL('245x210', pList[4].imgPath) + '" alt="5"></a>'
                                            +'</div>'
                                        + '</div>';
                            }

                    }
                   var cpiclist = funtype != 3 && pList ? (function(){
                        var k = ""
                        for (var i = 0,len = pList.length; i < len; i++) {
                            if(len == 1){
                                return "";
                            }
                            if(i <= 5){
                                k += '<li><a href="javascript:;" title=""><img src="'+ dirImgUrl(pList[i].imgPath) +'" alt="" ></a></li>'
                            }
                        };
                        return k;
                    })() : "";
                    var funpicshow = (function(){
                        var tmkl = ""; 
                        if(funtype != 3 && pList){
                            tmkl = '<div class="cnt_show_pic clearfix" style="display:none;">'
                                        +'<div class="f_pic_small_list">'
                                            +'<ul>'
                                            +cpiclist
                                            +'</ul>'
                                        +'</div>'
                                    +'</div>';
                        }
                        return tmkl;
                    })();
                    return  imgtmpl+funpicshow;

            }

       })




        FUNLR.namespace('timeline.cmtList',function(a){
            var c = a['face']['format'];

            return function(cmtList){
                var tramslisttmpl = "";
                if(!!cmtList){
                     for (var i = cmtList.length-1; i > -1; i--) {
                        var k = cmtList[i],
                            commenthtml,commentdel;
                            retransmtmpl = k.cmtNum ? '<a href="javascript:;" title="回复展开/收起" class="comment_revert_down" rel="comment_revert_up"><em>{{cmtNum}}</em>条回复<i></i></a></dd>'
                                        +'<dd class="comment_revert_list">' :"";

                            previewImg = k.funImg == "" ? "" : '<dd class="ablum_cm"><div class="outer"><div class="inner"><img src="'+ imgURL('45x45', k.funImg)+'"/></div></div></dd>';
                            previewst = previewImg == "" ? "" : 'class="ablum_img"'


                            commentdel = k.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">删除</a>' :"";            

                            tramsitemtpl='<dl class="f_comment_item">'
                                            +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                            +'<dd '+ previewst + '><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                            +'<dd>'
                                                +commentdel
                                                +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                                +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">回复</a>'
                                                +retransmtmpl
                                            +'</dd>'
                                            +  previewImg         
                                        +'</dl>';
                            commenthtml = tramsitemtpl.format({
                                'cmtNum': k.cmtNum,
                                'context': c(k.context),
                                'fid': k.fid,
                                'headFace': a.fn.getHeadFace(k.headFace,32),
                                'id': k['id'],
                                'isChild': k.isChild,
                                'nickName': k.nickName,
                                'pid': k.pid,
                                'pushDate': k.pushDate,
                                'smtId': k.smtId,
                                'state': k.state,
                                'timenum': a.fn.DateFormat(k.timenum),
                                'uid': k.uid,
                                'userName': k.userName
                            })
                            tramslisttmpl += commenthtml;   
                    };
                }
                return tramslisttmpl;
            }
        })

        FUNLR.namespace('timeline.cmtListmscmt',function(a){

            var c = a['face']['format'];
            return function(cmtList){
                var tramslisttmpl = "";

                if(!!cmtList){



                    if(cmtList.length == 1){
                        var k = cmtList[0];
                        var retransmtmpl = cmtList[0].cmtNum ? '<a href="javascript:;" title="回复展开/收起" class="comment_revert_down" rel="comment_revert_up"><em>{{cmtNum}}</em>条回复<i></i></a></dd>'
                                    +'<dd class="comment_revert_list">' :"";
                        var previewImg = cmtList[0].funImg == "" ? "" : '<dd class="ablum_cm"><div class="outer"><div class="inner"><img src="'+ imgURL('45x45', cmtList[0].funImg)+'"/></div></div></dd>';
                        var previewst = previewImg == "" ? "" : 'class="ablum_img"';
                        var commentdel = cmtList[0].uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">删除</a>' :""; 
                        var tramsitemtpl='<dl class="f_comment_item"  >'
                                        +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                        +'<dd '+ previewst + '><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                        +'<dd>'
                                            + commentdel
                                            +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                            +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">回复</a>'
                                        +'</dd>'
                                        +  previewImg                                
                                    +'</dl>';
                        var commenthtml = tramsitemtpl.format({
                            'cmtNum': k.cmtNum,
                            'context': c(k.context),
                            'fid': k.fid,
                            'headFace': a.fn.getHeadFace(k.headFace,32),
                            'id': k['id'],
                            'isChild': k.isChild,
                            'nickName': k.nickName,
                            'pid': k.pid,
                            'pushDate': k.pushDate,
                            'smtId': k.smtId,
                            'state': k.state,
                            'timenum': a.fn.DateFormat(k.timenum),
                            'uid': k.uid,
                            'userName': k.userName
                        })
                        tramslisttmpl += commenthtml;   
                    }else{
                         for (var i = cmtList.length-1; i > -1; i--) {
                            var k = cmtList[i],
                                commenthtml,commentdel;
                                retransmtmpl = k.cmtNum ? '<a href="javascript:;" title="回复展开/收起" class="comment_revert_down" rel="comment_revert_up"><em>{{cmtNum}}</em>条回复<i></i></a></dd>'
                                            +'<dd class="comment_revert_list">' :"";


                                previewImg = k.funImg == "" ? "" : '<dd class="ablum_cm"><div class="outer"><div class="inner"><img src="'+ imgURL('45x45', k.funImg)+'"/></div></div></dd>';
                                previewst = previewImg == "" ? "" : 'class="ablum_img"'

                                if(i == cmtList.length-1){ 
                                    commentdel = k.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">删除</a>' :""; 
                                    tramsitemtpl='<dl class="f_comment_item" style="display:none;" >'
                                                    +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                                    +'<dd '+ previewst + '><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                                    +'<dd>'
                                                        + commentdel
                                                        +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                                        +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">回复</a>'
                                                    +'</dd>'
                                                    +  previewImg                                
                                                +'</dl>';
                                }else if(i == 0){

                                    commentdel = k.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.delchild(this,\'{{id}}\')">删除</a>' :"";
                                    tramsitemtpl='<dl class="f_comment_item"  >'
                                                    +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                                    +'<dd '+ previewst + '><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                                    +'<dd>'
                                                        + commentdel
                                                        +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                                        +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{smtId}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{smtId}}_{{id}}\')" >回复</a>'
                                                    +'</dd>'
                                                    +  previewImg                      
                                                +'</dl>';
                                }else{

                                    commentdel = k.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.delchild(this,\'{{id}}\')">删除</a>' :"";            
                                    tramsitemtpl='<dl class="f_comment_item" style="display:none;">'
                                                    +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                                    +'<dd '+ previewst + '><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                                    +'<dd>'
                                                        + commentdel
                                                        +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                                        +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{smtId}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{smtId}}_{{id}}\')" >回复</a>'
                                                    +'</dd>'
                                                    +  previewImg                      
                                                +'</dl>';
                                }

                                commenthtml = tramsitemtpl.format({
                                    'cmtNum': k.cmtNum,
                                    'context': c(k.context),
                                    'fid': k.fid,
                                    'headFace': a.fn.getHeadFace(k.headFace,32),
                                    'id': k['id'],
                                    'isChild': k.isChild,
                                    'nickName': k.nickName,
                                    'pid': k.pid,
                                    'pushDate': k.pushDate,
                                    'smtId': k.smtId,
                                    'state': k.state,
                                    'timenum': a.fn.DateFormat(k.timenum),
                                    'uid': k.uid,
                                    'userName': k.userName
                                })
                                tramslisttmpl += commenthtml;   
                        }
                    };
                }
                return tramslisttmpl;
            }
        })


        FUNLR.namespace('content.timeline.tmpl',function(a){
            var c = a['face']['format'];

            return function(j,type){

                var cnt_info,infob,cmbtnplate,funtypetpl,retransmtmpl,tramsitemtpl,transmittmpl,revert_box,SMALL_VIEW,hidefix,commonVhide,tmpl,formatTpl;
                var funtype = j.funType,
                    pList = j.pList;

                    var cmbtnplate = (function(){

                        var ismin = type == "atme" || type == "home" ? "ismin" : "";

                        var emotioncomment = funtype != 3 ? '<a class="cnt_emotion '+ ismin +' " id="cmem_{{uid}}_{{id}}" href="javascript:;"><span>{{vListlen}}</span></a>' : "";
                        var istrans = !j.isTrans ? '<a class="cnt_transmit"  id="cmtm_{{uid}}_{{id}}" href="javascript:;"><span>{{counter}}</span></a>':"" ;
                       if(emotioncomment == "" && istrans == ""){
                            return "";
                       }

                       var expre_item_txt = '';
                       var expre_page_txt = '';
                       if (j.vList != '') {
                           //表情图像html
                           function getSexpreHtml(src, type) {
                               var bp;
                               switch (parseInt(type)) {
                                   case 0:
                                       bp = '-39px 0';
                                       break;
                                   case 1:
                                       bp = '-39px -26px';
                                       break;
                                   case 2:
                                       bp = '-39px -53px';
                                       break;
                                   case 3:
                                       bp = '-39px -81px';
                                       break;
                               }

                               return '<img src="' + src + '" /><i style="background-position:' + bp + '"></i>';
                           }
                           var vListArr = [];

                           for (var a in j.vList) {
                               if (isNaN(a)) break;
                               vListArr.push(j.vList[a])
                           }
                           
                           expre_item_txt += '</ul>';
                           (function () {
                               var isMOD = vListArr.length % 10;

                               var expreUlnum = Math.floor(vListArr.length / 10) + (isMOD ? 1 : 0);
                               for (var i = 0; i < expreUlnum; i++) {
                                   expre_item_txt += '<ul class="expre_item">';
                                   if (i === expreUlnum - 1) {
                                       for (var j = 0, _len = isMOD; j < _len; j++) {
                                           expre_item_txt += '<li data-id="' + _len + '">' + getSexpreHtml(getHeadFace(vListArr[i * 10 + j].headFace, '32'), vListArr[i * 10 + j].expressId) + '</li>';
                                       }
                                       for (var j = 0, _len = 10 - isMOD; j < _len; j++) {
                                           expre_item_txt += '<li data-id="' + j + '"></li>';
                                       }
                                   } else {
                                       for (var j = 0, _len = 10; j < _len; j++) {
                                           expre_item_txt += '<li></li>'
                                       }
                                   }

                                   expre_item_txt += '</ul>'
                                   if (i === 0) expre_page_txt += '<a class="expre_page_btn expre_curr_sel_btn">';
                                   else expre_page_txt += '<a class="expre_page_btn"></a>';
                               }
                           })();
                       } else {
                           expre_item_txt = '<ul class="expre_item"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li> </ul>';
                       }

                       var emtionx = funtype != 3 && (type == 'home' || type == "atme") ? '' +
                           '<div class="expre_comm_pop" style="display:none;">' +
                           '<span class="expre_arrow"></span>' +
                           '<ul class="expre_sel"><li class="first_expre"></li><li class="two_expre"></li><li class="three_expre"></li><li class="last_expre"></li></ul>' +
                           '<div class="expre_show"><div class="expre_con">' +

                           //'<ul class="expre_item">' +
                           // '<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>' +
                           //' </ul>' +
                           expre_item_txt + '</div></div>' +
                           '<div class="expre_page">' + expre_page_txt + '</div></div>' +
                           '' : '';

                       return  '<div class="f_trans_wrapper">'
                                    + emtionx
                                    + emotioncomment
                                    + istrans
                                +'</div>';
                    })();

                    var tramslisttmpl = type == "comment" ? a.timeline.cmtListmscmt(j.cmtList) 
                                                : a.timeline.cmtList(j.cmtList) ; // 评论列表
                    var TRANSMITTMPL = (function(){ // 评论模板
                        var tmzx = '';
                        var arrowd =  ''; 
                        if(!!j.cmtList.length && type != 'comment'){// 普通类型
                            tmzx = '<div class="f_comment_more">'
                                        +'<a href="javascript:;" title="评论展开" id="lmore_{{id}}" class="comment_arrow_down '+arrowd+'" rel="comment_arrow_up"><span class="">{{funcmtNum}}条评论</span>'
                                        +(j.funcmtNum > 2 ? '<i></i>' :'')
                                        +'</a>'
                                    +'</div>'
                                    +'<div class="f_commet_item_wrapper">'
                                    +tramslisttmpl
                                    +'</div>';
                        }else if(!!j.cmtList.length && type == 'comment'){
                            tmzx = '<div class="f_comment_more">'
                                        +'<a href="javascript:;" title="评论展开" id="lmore_{{id}}" class="comment_arrow_down iscomment'+arrowd+'" rel="comment_arrow_up"><span class="">{{funcmtNum}}条评论</span>'
                                        +(j.funcmtNum > 1 ? '<i></i>' :'')
                                        +'</a>'
                                    +'</div>'
                                    +'<div class="f_commet_item_wrapper">'
                                    +tramslisttmpl
                                    +'</div>';
                        }
                        return tmzx;
                    })();



                    var REVERT_BOX = (function(){ // 评论BOX
                        var g = "";
                        if(type != 'comment' && funtype != 3){ //消息中心评论 && 故事类型  不要
                             g = '<div class="f_comment_revert_box">'
                                    +'<textarea name=""  id="txt_{{uid}}_{{id}}" class="revert_box_off" rel="我也说一句">我也说一句</textarea>'
                                    +'<div class="revert_box_ctrl clearfix">'
                                        +'<em class="emo" onclick="FUNLR.face.show(this, \'txt_{{uid}}_{{id}}\');"></em>'
                                        +'<a href="javascript:;" title="" id="cmbtn_{{uid}}_{{id}}" class="comment_btn comment_btn_disable"><span><em>评论</em></span></a>'
                                    +'</div>'
                                +'</div>';

                        }
                        return g;
                    })();

                    var SMALL_VIEW = (function(){ // 小图预览 （评论模块）
                       var imgPrev =  !!j.pList ? '<div class="content_image"><div class="imgouter"><div class="imginner"><img src="'+imgURL('50x50', j.pList[0].imgPath)+'" alt=""></div></div></div>' :"";
                       var ccview = type == 'comment' ? '<div class="small_view">'
                                    +'<a href="javascript:;" title="" class="avatar"><img src="{{headFace32}}" height="32" width="32" alt="{{nickName}}" title="{{nickName}}"></a>'
                                    +imgPrev
                                    +'<div class="content_text_mid">{{contextshort}}</div>'
                                +'</div>':"";
                        return ccview;
                    })();


                        var imgtmpl = a.timeline.tmpl.plist(funtype,pList); // 图片 模板
                        //pphototips = funtype == 3 ? '<span class="upload_album_tips">创建新故事 <i>{{context}}</i> 分享了<em>'+ (j.pList ? j.pList.length : 0 )+'</em> 张照片</span>': "";

                        pphototips = funtype == 3 ? '<span class="upload_album_tips">创建新故事 <i>{{context}}</i> 分享了<em>'+ (j.pList ? j.pList.length : 0 )+'</em> 张照片</span>'
                                :(funtype == 6 ? (j.pList ? '<span class="upload_album_tips">创建新故事 <i>{{orginalText}}</i> 分享了<em>'+ (j.pList ? j.pList.length : 0 )+'</em> 张照片</span>':"此故事已被删除！"):"");


                        funtypetpl = (funtype == 1 || funtype == 5 ||  funtype == 4) ? imgtmpl+'<span class="content_text">{{context}}</span>'
                                   : (funtype == 2?'<span class="transmit_reason">{{context}}</span>'
                                                    +'<div class="transmit_cnt_outer">'
                                                        +'<div class="transmit_cnt_author"><img src="{{orginalHeadFace}}" height="32" width="32" alt="{{orginalName}}" hurl="{{orginalHeadUrl}}"></div>'
                                                        +imgtmpl
                                                        +'<span class="transmit_cnt">{{orginalText}}</span>'
                                                    +'</div>'
                                   : (funtype == 3 ? pphototips + imgtmpl 
                                   : (funtype == 6 ? '<span class="transmit_reason">{{context}}</span>'
                                                +'<div class="transmit_cnt_outer">'
                                                    +'<div class="transmit_cnt_author"><img src="{{orginalHeadFace}}" height="32" width="32" alt="{{orginalName}}" hurl="{{orginalHeadUrl}}" class="ucard" cuid="{{orginaluid}}"></div>'
                                                    + pphototips + imgtmpl
                                                +'</div>' 
                                    : "" )));


                    var COMMON_VIEW = (function(){ // 正常模板

                        avatarfix = '<img src="{{headFace}}" height="64" width="64" alt="" style="display:none;">'
                        cnt_info = type == "atme"? '<p class="timeline_info f_info_wrpper">'
                                    + (type == "comment"? "" : avatarfix)
                                    +'<span class="timeline_cnt_name cnt_author ">{{nickName}}</span><span class="timeline_cnt_time">{{timenum}}</span></p>'
                                    :'<p class="f_info_wrpper">'
                                        + avatarfix
                                        +'<a href="javascript:;" title="" class="avatar" ><img src="{{headFace32}}" height="32" width="32" alt=""></a>'
                                        +'<span class="cnt_author">{{nickName}}</span>'
                                        +'<span class="cnt_time">{{timenum}}</span>';
                                    +'</p>';

                        commonVhide = type == "comment" ? 'style="display: none;"' :"";

                       return '<div class="common_view" '+commonVhide+' funtype="{{funType}}" >'
                                +   cnt_info
                                +'<div class="f_content_wrapper">'
                                    +funtypetpl
                                +'</div>'
                                + cmbtnplate                              
                            +'</div>';
                    })();

                    var TIMELINECOMMET = (function(){
                        if(TRANSMITTMPL == "" && funtype == 3){
                            return "";
                        }
                         return '<div class="timeline_comment f_comment_inner">'
                                    + TRANSMITTMPL
                                    + REVERT_BOX
                                +'</div>';
                    })();




                /*------------ 模板 ------------*/ 

                    tmpl ='<div class="timeline_inner  f_cnt_inner typ_atme_content">'
                            +'<div class="timeline_content clearfix">'
                                + SMALL_VIEW
                                + COMMON_VIEW
                            +'</div>'
                        +'</div>'
                        + TIMELINECOMMET;




                    formatTpl = tmpl.format({
                        'context': c(j.context),
                        'contextshort': c(j.context),
                        'counter': j.counter,
                        'funCent': j.counter,
                        'funType': j.funType,
                        'funcmtNum': j.funcmtNum,
                        'headFace': a.fn.getHeadFace(j.headFace,64),
                        'headFace32':a.fn.getHeadFace(j.headFace,32),
                        'id': j['id'],
                        'imgPath': j.imgPath,
                        'imgPrev': j.imgPrev,
                        'isTrans': j.isTrans,
                        'lid': j.lid,
                        'nickName': j.nickName,
                        'prId': j.prId,
                        'prviewContext': j.prviewContext,
                        'pushDate': j.pushDate,
                        'state': j.state,
                        'taId': j.taId,
                        'timenum': funtype == 3 ? a.string.timeFormatString(Number(j.pushDate)*1000,"{Y: }年{M: }月{d: }日") : a.fn.DateFormat(j.timenum), 
                        'trantext': j.trantext,
                        'uid': j.uid,
                        'userName':j.userName,
                        'vListlen': j.vList.length,
                        'orginalHeadFace':j.tranUser !==  null? a.fn.getHeadFace(j.tranUser.headFace,32): '',
                        'orginalHeadUrl': j.tranUser !== null ? j.tranUser.headFace :'',
                        'orginalPage':j.tranUser !== null ? j.tranUser.userName :'',
                        'orginalName':j.tranUser !== null ? j.tranUser.realName :'',
                        'orginalText':j.primitive != "" ? c(j.primitive) : "此分享已被删除！"
                    })
                    return formatTpl;
            }
       })



/**
 *  上面已有相同的命名空间
 *
 * 
 */

       FUNLR.namespace('content.timeline.tmpl',function(a){
            var c = a['face']['format'];

            return function(j,type){



                var imgtmpl,imgPrev,cnt_info,infob,cmbtnplate,funtypetpl,retransmtmpl,tramsitemtpl,transmittmpl,revert_box,SMALL_VIEW,hidefix,commonVhide,tmpl,formatTpl,funtype = j.funType;

                    imgtmpl = "";   // 图片模板

                    pphototips = funtype == 3 ? '<span class="upload_album_tips">创建新故事 <i>{{context}}</i> 分享了<em>'+ (j.pList ? j.pList.length : 0 )+'</em> 张照片</span>': "";

                    popphoto =  funtype == 3 || funtype == 6 ? 'pop_photo' : "";

                    zoom = funtype != 3 && funtype != 6 ? 'zout': "";


                    if (j.pList) {
                        switch (j.pList.length) {
                            case 1:
                                imgtmpl = '<div class="cnt_images '+popphoto + ' cnt_one_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                                + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('378x285', j.pList[0].imgPath) + '" alt="1"></a>'
                                            + '</div>';
                                break;
                            case 2:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_two_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', j.pList[0].imgPath) + '" alt="1"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', j.pList[1].imgPath) + '" alt="2"></a>'
                                + '</div>';
                                break;
                            case 3:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_third_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                    + '<div class="big_img">'
                                        + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('378x285', j.pList[0].imgPath) + '" alt="1"></a>'
                                    + '</div>'
                                    + '<div class="two_column clearfix">'
                                        + '<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+' thr_sec"><img src="' + imgURL('183x128', j.pList[1].imgPath) + '" alt="2"></a>'
                                        + '<a href="javascript:;" title="" data-id="' + j.pList[2].id + '" data-bigImgSrc="' + j.pList[2].imgPath + '" class="'+zoom+' thr_thr"><img src="' + imgURL('183x128', j.pList[2].imgPath) + '" alt="3"></a>'
                                    + '</div>'
                                + '</div>';
                                break;
                            case 4:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_four_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', j.pList[0].imgPath) + '" alt="1"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', j.pList[1].imgPath) + '" alt="2"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[2].id + '" data-bigImgSrc="' + j.pList[2].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', j.pList[2].imgPath) + '" alt="3"></a>'
                                    + '<a href="javascript:;" title="" data-id="' + j.pList[3].id + '" data-bigImgSrc="' + j.pList[3].imgPath + '" class="'+zoom+'"><img src="' + imgURL('183x128', j.pList[3].imgPath) + '" alt="4"></a>'
                                + '</div>';
                                break;
                            default:
                                imgtmpl = '<div class="cnt_images '+popphoto +' cnt_five_pic clearfix" data-fid="' + j.pList[0].funId + '">'
                                            +'<div class="three_rows clearfix">'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[0].id + '" data-bigImgSrc="' + j.pList[0].imgPath + '" class="'+zoom+'"><img src="' + imgURL('121x100', j.pList[0].imgPath) + '" alt="1"></a>'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[1].id + '" data-bigImgSrc="' + j.pList[1].imgPath + '" class="'+zoom+'"><img src="' + imgURL('121x100', j.pList[1].imgPath) + '" alt="2"></a>'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[2].id + '" data-bigImgSrc="' + j.pList[2].imgPath + '" class="'+zoom+'"><img src="' + imgURL('121x100', j.pList[2].imgPath) + '" alt="3"></a>'
                                            +'</div>'
                                            +'<div class="big_img">'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[3].id + '" data-bigImgSrc="' + j.pList[3].imgPath + '" class="'+zoom+'"><img src="' + imgURL('245x210', j.pList[3].imgPath) + '" alt="4"></a>'
                                            +'</div>'
                                            +'<div class="mid_img">'
                                                +'<a href="javascript:;" title="" data-id="' + j.pList[4].id + '" data-bigImgSrc="' + j.pList[4].imgPath + '" class="'+zoom+'"><img src="' + imgURL('245x210', j.pList[4].imgPath) + '" alt="5"></a>'
                                            +'</div>'
                                        + '</div>';
                            }
                    }

                   var cpiclist = function(){
                        var k = ""
                        for (var i = 0; i < j.pList.length; i++) {
                            if(j.pList.length == 1){
                                return "";
                            }
                            if(i <= 5){
                                k += '<li><a href="javascript:;" title=""><img src="'+ dirImgUrl(j.pList[i].imgPath) +'" alt="" ></a></li>'
                            }
                        };
                        return k;
                    };
                    funpicshow  = (funtype != 3 && j.pList) ? '<div class="cnt_show_pic clearfix" style="display:none;">'
                                                    +'<div class="f_pic_small_list">'
                                                        +'<ul>'
                                                        +cpiclist()
                                                        +'</ul>'
                                                    +'</div>'
                                                +'</div>' : "";

                    funtypetpl = (funtype == 1 || funtype == 5) ? imgtmpl+funpicshow+'<span class="content_text">{{context}}</span>'
                               : (funtype == 2?'<span class="transmit_reason">{{context}}</span>'
                                                +'<div class="transmit_cnt_outer">'
                                                    +'<div class="transmit_cnt_author"><img src="{{orginalHeadFace}}" height="32" width="32" alt="{{orginalName}}" hurl="{{orginalHeadUrl}}"></div>'
                                                    +imgtmpl+funpicshow
                                                    +'<span class="transmit_cnt"><a href="/{{orginalPage}}" target="_self">{{orginalName}}:</a>{{orginalText}}</span>'
                                                +'</div>'
                               : (funtype == 3 ? pphototips + imgtmpl : ""));

                    hidefix = 'style="display: none;"'
                    //imgtmpl =  "";
                    commonVhide = type == "comment" ? hidefix :"";
                    avatarfix = '<img src="{{headFace}}" height="64" width="64" alt="" style="display:none;">'
                    cnt_info = type == "atme"? '<p class="timeline_info f_info_wrpper">'
                                + (type == "comment"? "" : avatarfix)
                                +'<span class="timeline_cnt_name cnt_author ">{{nickName}}</span><span class="timeline_cnt_time">{{timenum}}</span></p>'
                                :'<p class="f_info_wrpper">'
                                    + avatarfix
                                    +'<a href="javascript:;" title="" class="avatar" ><img src="{{headFace32}}" height="32" width="32" alt=""></a>'
                                    +'<span class="cnt_author">{{nickName}}</span>'
                                    +'<span class="cnt_time">{{timenum}}</span>';
                                +'</p>';

                    cmbtnplate = type != 'comment' ? '<div class="f_trans_wrapper">'
                                                        +'<a class="cnt_emotion"   id="cmem_{{uid}}_{{id}}" href="javascript:;"><span>{{vListlen}}</span></a>'
                                                        +'<a class="cnt_transmit"  id="cmtm_{{uid}}_{{id}}" href="javascript:;"><span>{{counter}}</span></a>'
                                                    +'</div>' :"";

                    // funtypetpl = funtype == 1 ? '<span class="content_text">{{context}}</span>'
                    //            : (funtype == 2?'<span class="transmit_reason">{{context}}</span>'
                    //                             +'<div class="transmit_cnt_outer">'
                    //                                 +'<div class="transmit_cnt_author"><img src="{{orginalHeadFace}}" height="32" width="32" alt="{{orginalName}}" hurl="{{orginalHeadUrl}}"></div>'
                    //                                 +imgtmpl
                    //                                 +'<span class="transmit_cnt"><a href="/{{orginalPage}}" target="_self">{{orginalName}}:</a>{{orginalText}}</span>'
                    //                             +'</div>'
                    //            : (funtype == 3?"":""));



                /*--------评论--------*/
                    if(!!j.cmtList){
                        var tramslisttmpl = "";
                         for (var i = j.cmtList.length-1; i > -1; i--) {
                            var k = j.cmtList[i],
                                commenthtml,commentdel;
                                retransmtmpl = k.cmtNum ? '<a href="javascript:;" title="回复展开/收起" class="comment_revert_down" rel="comment_revert_up"><em>{{cmtNum}}</em>条回复<i></i></a></dd>'
                                            +'<dd class="comment_revert_list">' :"";

                                commentdel = k.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">删除</a>' :"";            

                                tramsitemtpl='<dl class="f_comment_item">'
                                                +'<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>'
                                                +'<dd><span class="comment_name"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>：</span><span class="comment_cnt">{{context}}</span></dd>'
                                                +'<dd>'
                                                    +commentdel
                                                    +'<a href="javascript:;" class="comment_time">{{timenum}}</a>'
                                                    +'<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">回复</a>'
                                                    +retransmtmpl
                                                +'</dd>'                                
                                            +'</dl>';
                                commenthtml = tramsitemtpl.format({
                                    'cmtNum': k.cmtNum,
                                    'context': c(k.context),
                                    'fid': k.fid,
                                    'headFace': a.fn.getHeadFace(k.headFace,32),
                                    'id': k['id'],
                                    'isChild': k.isChild,
                                    'nickName': k.nickName,
                                    'pid': k.pid,
                                    'pushDate': k.pushDate,
                                    'smtId': k.smtId,
                                    'state': k.state,
                                    'timenum': a.fn.DateFormat(k.timenum),
                                    'uid': k.uid,
                                    'userName': k.userName
                                })
                                tramslisttmpl += commenthtml;   
                        };
                    }

                    var arrowd =  ''; // type == 'comment' ? (j.uid != userconfig.uid ? 'comment_arrow_up' :''): 
                     // transmittmpl = !!j.cmtList.length ?'<div class="f_comment_more">'
                     //                                +'<a href="javascript:;" title="评论展开" id="lmore_{{id}}" class="comment_arrow_down '+arrowd+'" rel="comment_arrow_up"><span class="">{{funcmtNum}}条评论</span>'
                     //                                +(j.funcmtNum > 2 ? '<i></i>' :'')
                     //                                +'</a>'
                     //                            +'</div>'
                     //                            +'<div class="f_commet_item_wrapper">'
                     //                            +tramslisttmpl
                     //                            +'</div>':"";


                                             

                    transmittmpl = (function(){
                        var tmzx = '';
                        if(!!j.cmtList.length && type != 'comment'){
                              tmzx = '<div class="f_comment_more">'
                                                +'<a href="javascript:;" title="评论展开" id="lmore_{{id}}" class="comment_arrow_down '+arrowd+'" rel="comment_arrow_up"><span class="">{{funcmtNum}}条评论</span>'
                                                +(j.funcmtNum > 2 ? '<i></i>' :'')
                                                +'</a>'
                                            +'</div>'
                                            +'<div class="f_commet_item_wrapper">'
                                            +tramslisttmpl
                                            +'</div>';
                        }else{
                              tmzx = '<div class="f_comment_more">'
                                                +'<a href="javascript:;" title="评论展开" id="lmore_{{id}}" class="comment_arrow_down '+arrowd+'" rel="comment_arrow_up"><span class="">{{funcmtNum}}条评论</span>'
                                                +(j.funcmtNum > 1 ? '<i></i>' :'')
                                                +'</a>'
                                            +'</div>'
                                            +'<div class="f_commet_item_wrapper">'
                                            +tramslisttmpl
                                            +'</div>';
                        }
                        return tmzx;
                    })()                            

                                                                
                /*--------评论BOX--------*/

                    revert_box = type != 'comment' ?'<div class="f_comment_revert_box">'
                                    +'<textarea name=""  id="txt_{{uid}}_{{id}}" class="revert_box_off" rel="我也说一句">我也说一句</textarea>'
                                    +'<div class="revert_box_ctrl clearfix">'
                                        +'<em class="emo" onclick="FUNLR.face.show(this, \'txt_{{uid}}_{{id}}\');"></em>'
                                        +'<a href="javascript:;" title="" id="cmbtn_{{uid}}_{{id}}" class="comment_btn comment_btn_disable"><span><em>评论</em></span></a>'
                                    +'</div>'
                                +'</div>':'';



                   imgPrev =  !!j.pList ? '<div class="content_image"><div class="imginner"><img src="'+imgURL('50x50', j.pList[0].imgPath)+'" alt=""></div></div>' :"";

                   SMALL_VIEW = type == 'comment' ? '<div class="small_view">'
                                +'<a href="javascript:;" title="" class="avatar"><img src="{{headFace32}}" height="32" width="32" alt="{{nickName}}" title="{{nickName}}"></a>'
                                +imgPrev
                                +'<div class="content_text_mid">{{contextshort}}</div>'
                            +'</div>':"";


                /*------------ 模板 ------------*/ 
                    tmpl ='<div class="timeline_inner  f_cnt_inner typ_atme_content">'
                        +'<div class="timeline_content clearfix">'
                            + SMALL_VIEW
                            +'<div class="common_view" '+commonVhide+' >'
                                +cnt_info
                                +'<div class="f_content_wrapper">'
                                    +funtypetpl
                                +'</div>'
                                + cmbtnplate                              
                            +'</div>'

                        +'</div>'
                    +'</div>'
                    +'<div class="timeline_comment f_comment_inner">'
                        +transmittmpl
                        +revert_box
                    +'</div>';

                    formatTpl = tmpl.format({
                        'context': c(j.context),
                        'contextshort': c(j.context), //+($(j.context).text().length < 50 ? '<br><br><br>':""),
                        'counter': j.counter,
                        'funCent': j.counter,
                        'funType': j.funType,
                        'funcmtNum': j.funcmtNum,
                        'headFace': a.fn.getHeadFace(j.headFace,64),
                        'headFace32':a.fn.getHeadFace(j.headFace,32),
                        'id': j['id'],
                        'imgPath': j.imgPath,
                        'imgPrev': j.imgPrev,
                        'isTrans': j.isTrans,
                        'lid': j.lid,
                        'nickName': j.nickName,
                        'prId': j.prId,
                        'prviewContext': j.prviewContext,
                        'pushDate': j.pushDate,
                        'state': j.state,
                        'taId': j.taId,
                        'timenum': a.fn.DateFormat(j.timenum),
                        'trantext': j.trantext,
                        'uid': j.uid,
                        'userName':j.userName,
                        'vListlen': j.vList.length,
                        'orginalHeadFace':j.tranUser !==  null? a.fn.getHeadFace(j.tranUser.headFace,32): '',
                        'orginalHeadUrl': j.tranUser !== null ? j.tranUser.headFace :'',
                        'orginalPage':j.tranUser !== null ? j.tranUser.userName :'',
                        'orginalName':j.tranUser !== null ? j.tranUser.realName :'',
                        'orginalText':c(j.primitive)
                    })
                    return formatTpl;
            }
       })


    return FUNLR;
 
});















