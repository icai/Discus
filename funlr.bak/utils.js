define('utils', ['require', 'jquery', 'init'], function(req, $, FUNLR) {


	req(['common', 'tmpl'], function() {

		FUNLR.namespace("content.publish.at", function(a) {

			var cloneEl = a.common.unit.cloneEl,
				atmetmpl = a.content.atme.tmpl,
				textareaPos = a.extra.textareaUtils,
				b = {},
				d;
			b.layer = $("#layer_atme_pop");
			b.hacktextarea = function(obj) {
				var clEL = cloneEl(obj, "div", "font|wordWrap|overflow|outline|height|width|lineHeight|margin|padding|border"),
					publishPos = obj.offset();
				clEL.addClass("textareaDiv").css({
					zIndex: -1,
					position: "absolute",
					visibility: "hidden",
					left: publishPos.left,
					top: publishPos.top
				}).appendTo("body")
			};
			b.buildlist = function(j) {
				return atmetmpl(j)
			};
			b.removelist = function() {
				$("#layer_atme_pop").remove()
			};
			b.getlist = function(key) {
				$("body").find(".layer_menu_list") && b.removelist();
				jQuery.post(a.API.Index.fun.atme, {
					searchKey: key
				}, function(r) {
					if(r) {
						var c = b.buildlist(r);
						var opos = $("body").find(".textareaDiv").find("span").offset();
						$(c).css({
							left: opos.left,
							top: opos.top + 20,
							position: "absolute",
							zIndex: 10010
						}).appendTo("body")
					}
				}, "json")
			};

			b.keyboard = function(target,val) {

		        var self = this;
	            var todo = function(k){
	                var cli = $('#layer_atme_pop').find('li'), inx = $('#layer_atme_pop').find('li.cur').index(), clen = cli.length;
	                if(inx == -1){ // 不存在的时候
	                    if(k == 1){//上
	                        cli.eq(clen-1).addClass('cur');
	                    }else if(k == -1){ //下
	                        cli.eq(1).addClass('cur');
	                    }
	                }else{ // 存在
	                    cli.removeClass('cur');
	                    if(k == 1){ //up
	                        if(inx == 1){ //上
	                            cli.eq(clen-1).addClass('cur');
	                        }else{
	                            cli.eq(inx -1).addClass('cur');
	                        }
	                    } else if (k == -1) { //down
	                        if(inx == clen-1){ 
	                            cli.eq(1).addClass('cur');
	                        }else{
	                            cli.eq(inx + 1).addClass('cur'); //y
	                        }
	                    }else{
	                        cli.eq(inx).click();
	                    }   
	                }
	            };

		        target.unbind("keydown.ctrl").bind("keydown.ctrl", "up", function(evt) {
		            todo(1);
		            return false
		        }).bind("keydown.ctrl", "down", function(evt) {
		            todo(-1);
		            return false
		        }).bind("keydown.ctrl", "return", function(evt) {
		            if(val == "") return;
		            if(target.length) {
		                todo(0);
		                return false
		            } else return true
		        })
    		};
			b.checkat = function(target,e, val) {
				var that = target;
				b.keyboard(target,val);
				$("#atme_target_id").val(that.attr("id"));
				if(!$("body").find(".textareaDiv").length) b.hacktextarea(that);
				var atpos = val.lastIndexOf("@"),
					valhtml, name;
				if(atpos != -1) {
					valhtml = val.replace(/([\w\u4e00-\u9fa5]*)(\@)([a-zA-Z0-9\u4e00-\u9fa5_]{0,20})$/g, function(a, $1, $2, $3) {
						name = $3;
						return $1 + "<span>" + $2 + "</span>" + $3
					});
					$("body").find(".textareaDiv").empty().append(valhtml)
				}
				if(name) b.getlist(name);
				else $("body").find(".layer_menu_list") && b.removelist()
			};


			b.init = function() {
				$(document).on("click", "#layer_atme_pop li", function() {
					var that = $(this),
						atname = that.text(),
						target = $("#" + $("#atme_target_id").val());
					if(that.hasClass("suggest_title")) return;
					var getval = that.attr("rel"),
						name = getval.split("|")[1];
					var cache = $("#atme_target_id").attr("rel");
					if(cache.indexOf(name) == -1) if(cache) $("#atme_target_id").attr("rel", cache + "," + getval);
					else $("#atme_target_id").attr("rel", getval);
					var len = target.val().lastIndexOf("@");
					target.val(target.val().slice(0, len + 1) + atname + "  ");
					$(".layer_menu_list").fadeOut(400).remove();
					target.focus();
					textareaPos.setCursor(target[0])
				})
			};
			return b
		});



		FUNLR.namespace("Group.limitbuild", function(a) {
			var center = a.common.Window.center;
			var buildtmpl = function(json, limtg, gg) {
					var tmpl = "";
					if(typeof json == "object") {
						if(limtg == -1) tmpl += '<li class="lgrpD" rel="-1">\u6240\u6709\u597d\u53cb<span></span></li>';
						else tmpl += '<li rel="-1">\u6240\u6709\u597d\u53cb</li>';
						if(limtg == 0) tmpl += '<li class="lgrpD" rel="0">\u4ec5\u81ea\u5df1\u53ef\u89c1<span></span></li>';
						else tmpl += '<li rel="0">\u4ec5\u81ea\u5df1\u53ef\u89c1</li>';
						for(var i = 0; i < json.length; i++) {
							var item = json[i];
							if(gg == item["id"]) tmpl += '<li class="lgrpD" rel="' + item["id"] + '">' + item["name"] + "<span></span></li>";
							else tmpl += '<li rel="' + item["id"] + '">' + item["name"] + "</li>"
						}
						if(limtg == -2) tmpl += '<li class="lgrpD no_border_b" rel="-2">\u81ea\u5b9a\u4e49<span></span></li>';
						else tmpl += '<li class="no_border_b" rel="-2">\u81ea\u5b9a\u4e49</li>'
					}
					return tmpl
				};

			function build(o, c, k) {
				var pos = o.offset(),
					artId;
				if(o.find(".limit_in_group").length > 0) $.post(a.API.Index.grouplist, {}, function(r) {
					var tpl = buildtmpl(r, c, k);
					$(".limit_group_list").append(tpl).show();
					if($(".limit_group_list").parents(".upload_bottom").length) {
						var h = $(".limit_group_list").height();
						$(".limit_group_list").css({
							top: -h
						})
					}
				}, "json")
			}

			function init() {
				$(document).on({
					hover: function() {
						var that = $(this);
						that.addClass("hover").siblings().removeClass("hover")
					},
					click: function() {
						var that = $(this),
							siblings = that.siblings(),
							ctext = that.text(),
							crel = that.attr("rel");
						siblings.removeClass("lgrpD").find("span").remove();
						that.addClass("lgrpD").html(ctext + "<span></span>").delay(400);
						(crel == 0 || crel == -1) && $(".limit_in_group").text(ctext).attr("rel", crel).attr("cgroup", "");
						crel > 2 && $(".limit_in_group").text(ctext).attr("rel", 1).attr("cgroup", crel);
						crel == -2 && center($(".costom_limit")).show();
						that.parent("ul").hide().empty()
					}
				}, ".limit_group_list li");
				$(".peo_view_limit .lmtBtn").click(function() {
					var that = $(this),
						curGroup = that.find(".limit_in_group").attr("rel"),
						gg = that.find(".limit_in_group").attr("cgroup");
					that.parent().addClass("peo_view_limit_on");
					$(".limit_group_list").empty();
					build(that, curGroup, gg)
				});
				a.fn.docfire(".limit_group_list", function() {
					$(".limit_group_list").hide().empty()
				})
			}
			return {
				init: init
			}
		});
		FUNLR.namespace("Data.friends", function(a) {
			return function() {
				var j;
				$.ajax({
					url: a.API.Index.allfriends,
					type: "POST",
					dataType: "json",
					async: false,
					success: function(r) {
						if(typeof r == "object" && r.length > 0) j = r;
						else j = []
					}
				});
				return j
			}
		});
		FUNLR.namespace("Data.groups", function(a) {
			return function() {
				var j;
				$.ajax({
					url: a.API.Index.grouplist,
					type: "POST",
					dataType: "json",
					async: false,
					success: function(r) {
						if(typeof r == "object" && r.length > 0) j = r;
						else j = []
					}
				});
				return j
			}
		});
		FUNLR.namespace("Group.costom", function(a) {
			var filter = a.fn.nocasefilter,
				df, dg, ff, fg;

			function disableinput(obj) {
				if(obj.hasClass("selable_input")) $(".unselable_input").addClass("disabled").find("input").attr("disabled", true);
				else $(".selable_input").addClass("disabled").find("input").attr("disabled", true)
			}

			function enableinput() {
				$(".costom_input").removeClass("disabled").find("input").attr("disabled", false)
			}

			function buildSearch(fns, grps) {
				var tpl, addedp = [],
					addedg = [];
				var tplf = '<li class="" rel="{{id}}|{{nickName}}|{{type}}"><span><img src="{{headFace}}" alt="{{nickName}}"></span><i>{{nickName}}</i></li>',
					tplg = '<li class="" rel="{{id}}|{{name}}|{{type}}"><em></em><i>{{name}} \uff08{{friendNum}}\uff09</i></li>';
				var ful = $('<ul class="costom_fan_list" />'),
					gul = $('<ul class="costom_group_list"/>');
				$(".selp_item").each(function(i, el) {
					addedp.push($(el).attr("rel").split("|")[0])
				});
				$(".selg_item").each(function(i, el) {
					addedg.push($(el).attr("rel").split("|")[0])
				});
				fns = a.fn.unfilters(fns, "uid", addedp);
				grps = a.fn.unfilters(grps, "id", addedg);
				var flen = fns.length,
					glen = grps.length;
				for(var i = 0; i < flen; i++) $(tplf.format({
					"id": fns[i]["uid"],
					"nickName": fns[i]["nickName"],
					"headFace": a.fn.getHeadFace(fns[i]["headFace"], 32),
					"type": 0
				})).appendTo(ful);
				for(var i = 0; i < glen; i++) $(tplg.format({
					"id": grps[i]["id"],
					"name": grps[i]["name"],
					"friendNum": grps[i]["friendNum"],
					"type": 1
				})).appendTo(gul);
				$(".costom_search_list").empty();
				flen > 0 && ful.appendTo(".costom_search_list");
				glen > 0 && gul.appendTo(".costom_search_list");
				!flen && !glen && $(".costom_search_list").append("<p>\u6ca1\u6709\u627e\u5230\u76f8\u5e94\u7684\u597d\u53cb\u6216\u5206\u7ec4</p>")
			}

			function buildCostom(obj) {
				var data = obj.attr("rel").split("|");
				var tplp = '<li class="sel_item selp_item" rel="{{uid}}|{{type}}"><p>{{name}}</p><span>\u00d7</span></li>',
					tplg = '<li class="sel_item selg_item" rel="{{uid}}|{{type}}"><p>{{name}}</p><span>\u00d7</span></li>';
				var input = $(".costom_input").not(".disabled").find(".input_hold_li");
				if(data[2] == 0) tpl = tplp;
				else tpl = tplg;
				input.before(tpl.format({
					"uid": data[0],
					"name": data[1],
					"type": data[2]
				}))
			}

			function init() {
				$(".input_hold").bind("focus", function() {
					var that = $(this),
						costom_in = that.parents(".costom_input"),
						cpos = costom_in.offset();
					$(".costom_search_list").empty().css({
						left: cpos.left,
						top: cpos.top + costom_in.innerHeight(),
						position: "absolute"
					}).show().append("<p>\u8f93\u5165\u5173\u952e\u5b57\u5bf9\u597d\u53cb\u6216\u5206\u7ec4\u8fdb\u884c\u8fc7\u6ee4</p>");
					if(df != undefined && dg != undefined) return;
					df = a.Data.friends();
					dg = a.Data.groups()
				}).bind("keydown keyup", function() {
					var that = $(this),
						tval = $.trim(that.val()),
						pul = that.parents(".seled"),
						costom_in = that.parents(".costom_input");
					if(tval == "" && pul.children("li").length == 1) enableinput();
					else disableinput(costom_in);
					if(tval != "") {
						if(df == null && dg == null) {
							$(".costom_search_list").empty().append("<p>\u8fd8\u6ca1\u6709\u597d\u53cb\u548c\u5206\u7ec4\u256e(\u256f_\u2570)\u256d</p>");
							return
						}
						ff = filter(df, "nickName", tval);
						fg = filter(dg, "name", tval);
						buildSearch(ff, fg)
					} else $(".costom_search_list").empty().append("<p>\u8f93\u5165\u5173\u952e\u5b57\u5bf9\u597d\u53cb\u6216\u5206\u7ec4\u8fdb\u884c\u8fc7\u6ee4</p>")
				});
				$(".costom_limit").on("click", ".costom_btn", function() {
					if($(".costom_btn").hasClass("common30w_btn")) return;
					var selable = $(".selable_input"),
						ftype, fpeo = [],
						fgroup = [];
					if(selable.hasClass("disabled")) {
						ftype = "2";
						$(".unselable_input").find(".sel_item").each(function(i, el) {
							if($(el).hasClass("selp_item")) fpeo.push($(el).attr("rel").split("|")[0]);
							else fgroup.push($(el).attr("rel").split("|")[0])
						})
					} else {
						ftype = "-2";
						selable.find(".sel_item").each(function(i, el) {
							if($(el).hasClass("selp_item")) fpeo.push($(el).attr("rel").split("|")[0]);
							else fgroup.push($(el).attr("rel").split("|")[0])
						})
					}
					$(".limit_in_group").attr({
						"cUser": fpeo.join(","),
						"cGroup": fgroup.join(","),
						"rel": ftype
					}).text("\u81ea\u5b9a\u4e49");
					$(".costom_limit").hide();
					$(".sel_item").remove();
					enableinput()
				}).on("click", ".inner_close_btn", function() {
					$(".costom_limit").hide()
				});
				$(".costom_input").on({
					click: function() {
						var that = $(this),
							tli = that.parent(),
							less = tli.siblings().filter(".sel_item").length;
						tli.remove();
						if(!less) {
							enableinput();
							$(".costom_btn").addClass("common30w_btn")
						}
					}
				}, ".sel_item span");
				$(document).on({
					mouseenter: function() {
						var that = $(this);
						that.addClass("hover")
					},
					mouseleave: function() {
						var that = $(this);
						that.removeClass("hover")
					},
					click: function() {
						var that = $(this);
						buildCostom(that);
						$(".costom_btn").hasClass("common30w_btn") && $(".costom_btn").removeClass("common30w_btn");
						$(".costom_search_list").empty().hide();
						$(".input_hold").val("")
					}
				}, ".costom_search_list li");
				a.fn.docfire([".costom_search_list", ".input_hold_li"], function() {
					$(".costom_search_list").empty().hide()
				})
			}
			return {
				init: init
			}
		});

		FUNLR.namespace("comment.textarea.effect", function(a) {
			return function(param) {
				var defopts = {
					boxfocus: function() {},
					boxblur: function() {}
				};
				var opts = $.extend(defopts, param, {});
				$(document).on("focus", ".revert_box_off", function() {
					var that = $(this),
						cmtBtn = that.parent().find(".comment_btn");
					that.addClass("on");
					if(that.val() == "\u6211\u4e5f\u8bf4\u4e00\u53e5") that.val("");
					else if($.trim(that.val()).length) cmtBtn.removeClass("comment_btn_disable");
					that.next().show();
					opts.boxfocus.call(null, that)
				}).on("keydown keyup", ".revert_box_off", function() {
					var that = $(this),
						cmtBtn = that.parent().find(".comment_btn");
					if($.trim(that.val()).length) cmtBtn.removeClass("comment_btn_disable");
					else cmtBtn.addClass("comment_btn_disable");
					opts.boxblur.call(null, that)
				}).on("focus", ".transmit_input", function() {
					var that = $(this);
					if(that.val() == "\u8f6c\u53d1\u5206\u4eab") that.val("")
				}).on("blur", ".transmit_input", function() {
					var that = $(this);
					if(that.val() == "") that.val("\u8f6c\u53d1\u5206\u4eab")
				});
				a.fn.docfire([".f_comment_revert_box", ".redown_touch"], function() {
					var that = $("body").find(".revert_box_off.on");
					if(that.val() == "") {
						that.removeClass("on").val("\u6211\u4e5f\u8bf4\u4e00\u53e5");
						that.next().hide();
						opts.boxblur.call(null, that)
					}
				})
			}
		});
		FUNLR.namespace("content.fun.deletef", function(a) {
			var ArticleAnimate = function(obj) {
					if($.type(obj) == "object") this.obj = obj;
					else if($.type(this.obj) == "string") this.obj = $(obj)
				};
			ArticleAnimate.prototype.show = function() {
				var that = this.obj;
				that.hide().prependTo(".fun_wrpper").fadeIn("slow")
			};
			ArticleAnimate.prototype.hide = function() {
				var that = this.obj,
					thatClone = that.clone(),
					pos = that.offset(),
					height = that.outerHeight(),
					width = that.outerWidth();
				that.css({
					opacity: "0.5"
				}).fadeOut("slow").delay(100, function() {
					that.remove()
				})
			};

			function init() {
				$(document).on({
					mouseenter: function() {
						$(this).find(".cnt_del").show()
					},
					mouseleave: function() {
						$(this).find(".cnt_del").hide()
					}
				}, ".fun_item_outer");
				$(".fun_wrpper").on("click", ".cnt_del", function() {
					var that = $(this),
						opos = that.offset(),
						artouter = that.parents("article"),
						artId = artouter.attr("funid");


					a.UI.pop.ANW({
						left: opos.left,
						top: opos.top,
						zIndex: 10001,
						tips: "确认要删除这条分享吗？",
					    sure:function() {
							$.post(a.API.Index.fun.del, {
								id: artId
							}, function(r) {
								if(r == 0)(new ArticleAnimate(artouter)).hide();
								else uiPoptips("\u670d\u52a1\u5668\u9519\u8bef\uff01", that, "exm", -10, -70)
							}, "text")
					    }
					})



				})
			}
			return {
				init: init
			}
		});
		FUNLR.namespace('content.publish.datashare', function(a) { // iframe 
			return function(json) {
				var tmpl = a.content.tmpl.main(json);
				$(tmpl).prependTo('.fun_wrpper');
			}
		});
		FUNLR.namespace("content.publish.textarea", function(a) {
			var tat = a.content.publish.at;
			var Queue = ["publish_album", "cnt_publish_outer", "cnt_publish_inner", "textarea_publish", "emotion_outer", "pub_btn_outer"];
			var b = {},
				c = a["face"]["format"];
			b.focusAnimate = function() {
				$("." + Queue[0]).css({
					zIndex: "-1"
				}).hide();
				$("." + Queue[3]).animate({
					width: "522px"
				}, 150, function() {
					$("." + Queue[3]).animate({
						height: "110px"
					}, 100, function() {
						$("." + Queue[1]).addClass("on");
						$("." + Queue[2]).addClass("on");
						$("." + Queue[3]).addClass("on");
						$("." + Queue[4]).addClass("on").css({
							height: "0px"
						}).animate({
							height: "28px"
						}, 0, function() {
							$("." + Queue[5]).addClass("on").css({
								height: "0px"
							}).animate({
								height: "65px"
							}, 100, function() {})
						})
					})
				})
			};
			b.blurtrigger = function(obj) {
				var that = obj;
				if(that.val() != "" || that.attr("outflog") == "enter" || b.layerOpen() || b.animateflog) return;
				that.stop();
				b.blurAnimate()
			};
			b.focustrigger = function(obj) {
				var that = obj;
				if(that.val() != "" || that.hasClass("on") || b.layerOpen() || b.animateflog) return;
				that.stop();
				b.focusAnimate()
			};
			b.blurAnimate = function() {
				$("." + Queue[5]).animate({
					height: "0px"
				}, 100, function() {
					$("." + Queue[5]).removeClass("on");
					$("." + Queue[4]).animate({
						height: "0px"
					}, 35, function() {
						$("." + Queue[4]).removeClass("on");
						$("." + Queue[3]).animate({
							height: "30px"
						}, 100, function() {
							$("." + Queue[3]).animate({
								width: "430px"
							}, 150, function() {
								$("." + Queue[3]).removeClass("on");
								$("." + Queue[1]).removeClass("on");
								$("." + Queue[2]).removeClass("on");
								$("." + Queue[0]).css({
									zIndex: "auto"
								}).fadeIn("fast")
							})
						})
					})
				})
			};
			b.layerOpen = function() {
				if($(".sel_time_forcntlayer").is(":visible")) return 1;
				if($("#face_box").is(":visible")) return 1;
				if($(".costom_limit").is(":visible")) return 1;
				if($(".limit_group_list").is(":visible")) return 1;
				if($(".uploadwrapper").is(":visible")) return 1;
				if($(".upload_preview").is(":visible")) return 1;
				return 0
			};
			b.getatStr = function(str) {
				var atStr = $("#atme_target_id").attr("rel"),
					atArr = atStr.split(","),
					filterAtArr = [],
					filterAtStr;
				var atpeos = str.match(/(\@)([a-zA-Z0-9\u4e00-\u9fa5_]{0,20})/g),
					peos = [];
				if(atpeos) {
					for(var i = 0; i < atpeos.length; i++) peos.push(atpeos[i].slice(1));
					peos = peos.uniq();
					for(var i = 0; i < peos.length; i++) for(var j = 0; j < atArr.length; j++) if(atArr[j].indexOf(peos[i]) != -1) filterAtArr.push(atArr[j]);
					filterAtStr = filterAtArr.join(",");
					return filterAtStr
				}
				return ""
			};
			b.publish = function(str, callback) {
				var cnt = $.trim(str),
					cb = callback;
				var content = cnt,
					userArray = $(".limit_in_group").attr("cuser") || "",
					groupArray = $(".limit_in_group").attr("cgroup") || "",
					authType = $(".limit_in_group").attr("rel"),
					taId = $(".set_cnt_time").find("b").attr("taid"),
					funType = photoList == "" ? 1 : 5;
				$.post(a.API.Index.publish, {
					funType: funType,
					content: content,
					authType: authType,
					userArray: userArray,
					groupArray: groupArray,
					taId: taId,
					atStr: b.getatStr(str),
					photoList: photoList,
					funImgType: funImgType
				}, function(r) {
					if(!/\d+$/.test(Number(r))) {
						var json = eval("(" + r + ")");
						cb();
						tmpl = FUNLR.content.tmpl.main(json);
						$(tmpl).prependTo(".fun_wrpper")
					} else;
					$("#atme_target_id").attr("rel", "")
				})
			};

			function init() {

				var selflazytime = null;
				var href = top.location.href;
				$(".cnt_publish_outer").bind({
					mouseenter: function() {
						$(".textarea_publish").attr("outflog", "enter")
					},
					mouseleave: function() {
						$(".textarea_publish").attr("outflog", "leave")
					}
				});
				$(".textarea_publish").focus(function() {
					var that = $(this);
					that.parents(".content_outer").length && b.focustrigger(that)
				}).blur(function() {
					var that = $(this);
					that.parents(".content_outer").length && b.blurtrigger(that)
				}).bind("keyup", function(e) {
					var that = $(this),
						valhtml, name;
	            	var str = that.val();
	            	var kcode = e.keyCode;

		            if(selflazytime) clearTimeout(selflazytime);
		            if(kcode == 38 || kcode == 40 || kcode == 13) return;
		            selflazytime = setTimeout(function() {
		                //checkshow(str)
		                tat.checkat(that,e,str);
		            }, 50)

	            	//tat.checkat(that,e,str);
					if($.trim(str).length > 0) $(".cnt_publish").addClass("onpublish");
					else $(".cnt_publish").removeClass("onpublish");

					
				});
				$(document).mouseup(function(e) {
					var etarget = $(e.target);
					!etarget.parents(".cnt_publish_outer").length && b.blurtrigger($(".textarea_publish"))
				});
				a.fn.docfire([".sel_time_forcntlayer", ".uploadwrapper"]);
				$(".cnt_publish").on("click", function() {
					var that = $(this),
						cntval;
					cntval = $.trim($(".textarea_publish").val());
					if(that.hasClass("onpublish") && cntval != "") b.publish(cntval, function() {
						$(".textarea_publish").css({
							background: "#EBEBE4"
						}).val("");
						that.removeClass("onpublish");
						$(".no_content").remove();
						$(".upload_preview").hide().find("img").remove();
						$(".send_succpic").fadeIn("fast").delay(1E3).fadeOut("fast", function() {
							$(".textarea_publish").delay(100).css({
								background: "white"
							});
							$(".textarea_publish").delay(100, function() {
								var that = $(this);
								that.attr("outflog", "leave");
								that.parents(".content_outer").length && b.blurtrigger(that)
							});
							photoList = funImgType = ""
						})
					});
					else a.common.animate.shineColor($(".textarea_publish"))
				})
			}
			return {
				init: init
			}
		});

/**
 * scroll to top
 * 
 * start
 *
 */

		(function() {
			$(".expre_page_btn").live("click", function() {
				var expre_comm_pop = $(this).parent().parent();
				var expre_page_btns = expre_comm_pop.find(".expre_page_btn");
				if(expre_page_btns.length === 1) return;
				var con = expre_comm_pop.find(".expre_show .expre_con");
				con.animate({
					"margin-left": -135 * $(this).index()
				}, 400)
			});
			$(".ismin").live("click", function() {
				var expre_comm_pop = $(this).parent().children(".expre_comm_pop");
				expre_comm_pop.show()
			});

			function getAddPosition(downPopDom, lastUlLis, lastUl) {
				if(lastUlLis.last().children().length) {
					var newUl = $('<ul class="expre_item"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>');
					lastUl.after(newUl);
					lastUl = downPopDom.find(".expre_show .expre_con .expre_item").last();
					lastUlLis = lastUl.children();
					return newUl.children().first()
				} else for(var i = 0, len = lastUlLis.length; i < len; i++) if(!lastUlLis.eq(i).children().length) return lastUlLis.eq(i)
			}
			function getSexpreHtml(src, type) {
				var bp;
				switch(type) {
				case 0:
					bp = "-39px 0";
					break;
				case 1:
					bp = "-39px -26px";
					break;
				case 2:
					bp = "-39px -53px";
					break;
				case 3:
					bp = "-39px -81px";
					break
				}
				return '<img src="' + src + '" /><i style="background-position:' + bp + '"></i>'
			}
			function getSexpreCon(type) {
				var bp;
				switch(type) {
				case 0:
					bp = "\u8fd9\u4e2a\u771f\u597d\u73a9\uff0c\u5077\u5077\u7b11\u4e00\u4e2a\uff01";
					break;
				case 1:
					bp = "\u592a\u9017\u4e86\uff0c\u8d5e\u4e00\u4e2a\uff01";
					break;
				case 2:
					bp = "\u6211\u8868\u793a\u5f88\u751f\u6c14\uff01";
					break;
				case 3:
					bp = "\u597d\u559c\u6b22\u5594\uff01";
					break
				}
				return bp
			}
			function addCommUpdate(downPopDom, idArrVal, type, data) {
				var commTitModule = $('<div class="f_comment_more"><a href="javascript:;" title="\u8bc4\u8bba\u5c55\u5f00" id="lmore_' + idArrVal[2] + '" class="comment_arrow_down " rel="comment_arrow_up"><span class="">1\u6761\u8bc4\u8bba</span></a></div>');
				var commItemModule = $('<div class="f_commet_item_wrapper">' + '<dl class="f_comment_item">' + '<dt class="comment_avatar">' + '<a href="/qwe@qwe.com" class="ucard" cuid="' + idArrVal[1] + '">' + '<img src="' + userconfig["avatar"]["s32"] + '">' + "</a>" + "</dt>" + "<dd>" + '<span class="comment_name"><a href="/qwe@qwe.com" class="ucard" cuid="' + idArrVal[1] + '" title="">' + userconfig["realName"] + "</a>\uff1a</span>" + '<span class="comment_cnt">' + getSexpreCon(type) + "</span>" + "</dd>" + "<dd>" + '<a class="comment_del" id="comment_del_btn_' + idArrVal[2] + "_" + data + '" href="javascript:;" style="display: none;" onclick="FUNLR.comment.deltop(this,\'' + $.trim(data) + "')\">\u5220\u9664</a>" + '<a href="javascript:;" class="comment_time"> 19:17</a>' + '<a class="comment_revert" id="comment_revts_btn_' + idArrVal[2] + "_" + data + '" href="javascript:;" onclick="FUNLR.comment.revert(this,"' + idArrVal[2] + "_" + data + '")">\u56de\u590d</a>' + "</dd>" + "</dl>" + "</div>");
				downPopDom.parent().find(".ismin span").html(downPopDom.find(".expre_show .expre_con .expre_item img").length);
				var pDom = downPopDom.parent().parent().parent().parent().parent();
				var commCon = pDom.find(".f_comment_inner");
				if(commCon.find(".f_comment_more").length);
				else {
					var commTit = commTitModule.clone();
					commCon.prepend(commTit);
					var commItem = commItemModule.clone();
					commTit.after(commItem)
				}
				if(homeTMainFun) homeTMainFun.positionUpdate(pDom.parent().parent())
			}
			$(".expre_comm_pop .expre_sel li").live("click", function() {
				var downPopDom = $(this).parent().parent();
				var expre_sel = $(this).parent();
				var expre_btns = expre_sel.children();
				var lastUl = downPopDom.find(".expre_show .expre_con .expre_item").last();
				var lastUlLis = lastUl.children();
				var startBtn = downPopDom.parent().children(".ismin");
				var idArrVal = startBtn.attr("id").split("_");
				var fid = idArrVal[2];
				var type = expre_btns.index(this);
				$.post("/fun/add_express", {
					fid: fid,
					expressId: type
				}, function(data) {
					if(data > 0) {
						getAddPosition(downPopDom, lastUlLis, lastUl).html(getSexpreHtml(userconfig.avatar.s32, type));
						addCommUpdate(downPopDom, idArrVal, type, data, data);
						downPopDom.hide();
						uiPoptips("\u8bc4\u8bba\u6210\u529f\uff01", startBtn, "sur", 10, 5)
					} else if(data === 0) uiPoptips("\u4f60\u5df2\u7ecf\u8bc4\u8bba\u8fc7\u4e86\uff01", startBtn, "exm", 10, 5);
					else uiPoptips("\u8bc4\u8bba\u5931\u8d25\uff01", startBtn, "exm", 10, 5)
				}, "json")
			})
		})();

/**
 * scroll to top
 * 
 * end
 *
 */


		FUNLR.namespace("comment.emotion", function(a) {
			var add_em = ["em_titter", "em_laught", "em_agree", "em_love"];
			var pop_li = ["em_pop_titter", "em_pop_laught", "em_pop_agree", "em_pop_love"];
			var comm_em = ["em_comment_titter", "em_comment_laught", "em_comment_agree", "em_comment_love"];
			var b = {};
			b.build = function(obj) {
				var target = obj,
					fn = this;
				var tpos = target.offset();
				var emtul = {
					left: tpos.left + 50,
					top: tpos.top - 7
				};
				if($(".em_popshow").length) {
					$(".em_popshow").css({
						left: emtul.left,
						top: emtul.top
					}).show();
					fn.addem(target);
					return
				}
				var em_popshow = $("<ul/>", {
					"class": "em_popshow",
					"style": "left:" + emtul.left + "px;top:" + emtul.top + "px;z-index:999;"
				});
				var tpl = '<li><a href="javascript:;" onclick="FUNLR.comment.emotion.addem(this);" title="" rel="{{pop_li_type}}" class="{{pop_li_type}}"></a></li>';
				for(var i = 0; i < pop_li.length; i++) em_popshow.append(tpl.format({
					"pop_li_type": pop_li[i]
				}));
				em_popshow.appendTo("body").show()
			};
			b.addem = function(o) {
				var fn = this,
					obj = $("#" + $("#emcomment_target_id").val());
				var that = $(o);
				var funid = obj.parents("article").attr("funid");
				var tclass = that.attr("rel");
				for(var i = 0; i < pop_li.length; i++) if(tclass == pop_li[i]) {
					var k = i;
					$.post(a.API.Index.fun.addemo, {
						fid: funid,
						expressId: k
					}, function(r) {
						a.log(r);
						if(r > 1) {
							obj.addClass(add_em[k]);
							var Num = +obj.find("span").text();
							obj.find("span").text(Num + 1);
							fn.pushem(obj, comm_em[k])
						} else if(r == 0) uiPoptips("\u4f60\u5df2\u7ecf\u8bc4\u8bba\u8fc7\u4e86\uff01", that, "exm", -220, -70)
					}, "text")
				}
			};
			b.pushem = function(o, type) {
				var that = o,
					emtype = type,
					commouter, fn = this;
				var cwrapper = o.parents(".fun_item_outer").find(".f_comment_outer");
				commouter = cwrapper.find(".f_emotion_comment_inner.clearfix");

				function addcomment(twp) {
					var avtem = $("<a/>", {
						href: "javascript:;",
						alt: "\u263a",
						html: '<img src="' + userconfig["avatar"]["s32"] + '" alt=""><em class="' + emtype + '"></em>'
					});
					twp.append(avtem)
				}
				if(commouter.length) addcomment(commouter);
				else {
					commouter = $("<div/>", {
						"class": "f_emotion_comment_inner clearfix"
					}).prependTo(cwrapper);
					addcomment(commouter)
				}
				fn.hide()
			};
			b.hide = function() {
				$(".em_popshow").fadeOut(600)
			};
			b.init = function() {
				$(".fun_wrpper").on("click", ".cnt_emotion", function() {
					var that = $(this);
					if(that.parents(".common_view").length) return;
					curid = that.attr("id");
					$("#emcomment_target_id").val(curid);
					b.build(that)
				});
				a.fn.docfire(".em_popshow", function() {
					b.hide()
				})
			};
			return b
		});
		FUNLR.namespace("content.fun.comment", function(a) {
			var c = a["face"]["format"],
				type;

			function buildcomment(obj, j) {
				var c_inner = obj.parents(".f_comment_inner"),
					c_item_inner = c_inner.find(".f_commet_item_wrapper"),
					fmore = c_inner.find(".f_comment_more"),
					num;
				var listtmpl = '<dl class="f_comment_item">' + '<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>' + '<dd><span class="comment_name"><a href="javascript:;" title="" class="ucard" cuid="{{uid}}" >{{nickName}}</a>\uff1a</span><span class="comment_cnt">{{context}}</span></dd>' + "<dd>" + '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">\u5220\u9664</a>' + '<a href="javascript:;" class="comment_time">{{timenum}}</a>' + '<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">\u56de\u590d</a>' + "</dd>" + "</dl>";
				var alltmpl = '<div class="f_comment_more">' + '<a href="javascript:;" title="\u8bc4\u8bba\u5c55\u5f00" id="lmore_{{fid}}" class="comment_arrow_down " rel="comment_arrow_up"><span class="">{{funcmtNum}}\u6761\u8bc4\u8bba</span></a>' + "</div>" + '<div class="f_commet_item_wrapper">' + listtmpl + "</div>";
				if(fmore.length) {
					num = parseInt(fmore.find("span").text()); 
					fmore.find("span").text(+num + 1 + "\u6761\u8bc4\u8bba");
					$(listtmpl.format({
						"headFace": j.headFace,
						"nickName": j.nickName,
						"context": j.context,
						"timenum": j.timenum,
						"fid": j.fid,
						"id": j["id"]
					})).appendTo(c_item_inner)
				} else $(alltmpl.format({
					"headFace": j.headFace,
					"nickName": j.nickName,
					"context": j.context,
					"timenum": j.timenum,
					"fid": j.fid,
					"id": j["id"],
					"funcmtNum": 1
				})).prependTo(c_inner)
			}
			function buildrecomment(type, obj, j) {
				var c_inner = obj.parents(".f_comment_item"),
					c_item_inner = c_inner.find(".comment_revert_down");
				var revtlist = '<dl class="revt_list_item">' + '<dt class="revt_comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>' + '<dd><span class="revt_comment_name"><a href="javascript:;" title="" class="ucard" cuid="{{uid}}" >{{nickName}}</a>\uff1a</span><span class="revt_comment_cnt">{{context}}</span></dd>' + '<dd><a href="javascript:;" class="revt_comment_time">{{timenum}}</a><a class="revt_comment_revert" href="javascript:;" id="revt_comment_revts_btn_{{fid}}_{{smtId}}_{{id}}" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{smtId}}_{{id}}\')">\u56de\u590d</a></dd>' + "</dl>";
				var retpl = revtlist.format({
					"headFace": j.headFace,
					"nickName": j.nickName,
					"context": j.context,
					"timenum": j.timenum,
					"fid": j.fid,
					"smtId": j.smtId,
					"id": j["id"]
				});
				if(type == "A") {
					if(c_item_inner.length) if(c_inner.find(".comment_revert_list").children().length) {
						c_inner.find(".comment_revert_list").show();
						c_item_inner.addClass(".comment_revert_up").find("em").text(+c_item_inner.find("em").text() + 1);
						$(retpl).appendTo(c_inner.find(".comment_revert_list"))
					} else c_item_inner.removeClass(".comment_revert_up").find("em").text(+c_item_inner.find("em").text() + 1).end().click();
					else {
						var vretpl = '<dd class="comment_revert_list" style="display: block; ">' + retpl + "</dd>";
						obj.parent().after(vretpl)
					}
					obj.next().find("textarea").val("").parents(".comment_revert_box").hide()
				} else {
					obj.parents(".comment_revert_list").append(retpl);
					c_item_inner.find("em").text(+c_item_inner.find("em").text() + 1);
					obj.parents(".revt_comment_revert_box").hide()
				}
			}
			function tloadmore(j) {
				var retransmtmpl = j.cmtNum ? ' <a href="javascript:;" title="\u56de\u590d\u5c55\u5f00/\u6536\u8d77" class="comment_revert_down" rel="comment_revert_up"><em>{{cmtNum}}</em>\u6761\u56de\u590d<i></i></a></dd>' + '<dd class="comment_revert_list">' : "";
				var previewImg = j.funImg == "" ? "" : '<dd class="ablum_cm"><div class="outer"><div class="inner"><img src="' + imgURL("45x45", j.funImg) + '"/></div></div></dd>';
				var previewst = previewImg == "" ? "" : 'class="ablum_img"';
				var commentdel = j.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.deltop(this,\'{{id}}\')">\u5220\u9664</a>' : "";
				var tramslisttmpl = '<dl class="f_comment_item">' + '<dt class="comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>' + "<dd " + previewst + '><span class="comment_name"><a href="javascript:;" class="ucard" cuid="{{uid}}" title="">{{nickName}}</a>\uff1a</span><span class="comment_cnt">{{context}}</span></dd>' + "<dd>" + commentdel + '<a href="javascript:;" class="comment_time">{{timenum}}</a>' + '<a class="comment_revert" id="comment_revts_btn_{{fid}}_{{id}}" href="javascript:;" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{id}}\')">\u56de\u590d</a>' + retransmtmpl + "</dd>" + previewImg + "</dl>";
				var motpl = tramslisttmpl.format({
					"cmtNum": j.cmtNum,
					"context": c(j.context),
					"fid": j.fid,
					"headFace": a.fn.getHeadFace(j.headFace, 32),
					"id": j["id"],
					"isChild": j.isChild,
					"nickName": j.nickName,
					"pid": j.pid,
					"pushDate": j.pushDate,
					"smtId": j.smtId,
					"state": j.state,
					"timenum": a.fn.DateFormat(j.timenum),
					"uid": j.uid,
					"userName": j.userName
				});
				return motpl
			}
			function revloadmore(j) {
				var commtdelsec = j.uid == userconfig.uid ? '<a class="comment_del" id="comment_del_btn_{{fid}}_{{id}}" href="javascript:;"  style="display:none;" onclick="FUNLR.comment.delchild(this,\'{{id}}\')">\u5220\u9664</a>' : "";
				var revtitem = '<dl class="revt_list_item">' + '<dt class="revt_comment_avatar"><a href="/{{userName}}" class="ucard" cuid="{{uid}}" ><img src="{{headFace}}"></a></dt>' + '<dd><span class="revt_comment_name"><a href="javascript:;" title="" class="ucard" cuid="{{uid}}" >{{nickName}}</a>\uff1a</span><span class="revt_comment_cnt">{{context}}</span></dd>' + "<dd>" + commtdelsec + '<a href="javascript:;" class="revt_comment_time">{{timenum}}</a>' + '<a class="revt_comment_revert" href="javascript:;" id="revt_comment_revts_btn_{{fid}}_{{smtId}}_{{id}}" onclick="FUNLR.comment.revert(this,\'{{fid}}_{{smtId}}_{{id}}\')">\u56de\u590d</a></dd>' + "</dl>";
				var remotpl = revtitem.format({
					"cmtNum": j.cmtNum,
					"context": c(j.context),
					"fid": j.fid,
					"headFace": a.fn.getHeadFace(j.headFace, 32),
					"id": j["id"],
					"isChild": j.isChild,
					"nickName": j.nickName,
					"pid": j.pid,
					"pushDate": j.pushDate,
					"smtId": j.smtId,
					"state": j.state,
					"timenum": a.fn.DateFormat(j.timenum),
					"uid": j.uid,
					"userName": j.userName
				});
				return remotpl
			}


			function getHeight(obj,childh){
				var obj = $(obj);
				return obj.children().length * childh;

			}
			function showAnimate(Jobj,style,before,after){
				if(style) Jobj.css(style);
				if(before) before();
				var height = Jobj.children().outerHeight() + parseInt(Jobj.children().eq(0).css('marginBottom'));
				var xh = getHeight(Jobj,height);
				
				Jobj.animate({
					height:xh
				},400,function(){
					if(after) after()
				})

			}
			function hideAnimate(obj,style,callback){
				obj.css({
					overflow: 'hidden'
				}).animate(style,400,function(){
					if(callback) callback();

				})
			}
			function init(obj, callback) {
				if(callback == undefined) var callback = function() {};
				$(obj).on("click", ".comment_btn", function() {
					var that = $(this),
						thid = that.attr("id"),
						thidarr = thid.split("_"),
						thidrl = thidarr.shift(),
						txtid = "txt_" + thidarr.join("_"),
						fid = thidarr[1];
					if(that.hasClass("comment_btn_disable")) {
						uiPoptips("\u8bf4\u70b9\u4ec0\u4e48\u5148\u5427\uff01", that, "exm", -220, -70);
						return
					}
					var content = $("#" + txtid).val(),
						content = $.trim(content);
					$.post(a.API.Index.fun.commment, {
						fid: fid,
						content: content,
						pid: 0,
						topCmtId: 0,
						isChild: 0
					}, function(r) {
						if(r > 0) {
							uiPoptips("\u53d1\u8868\u6210\u529f\uff01", that, "sur", -220, -70);
							var j = {
								"headFace": userconfig["avatar"]["s32"],
								"nickName": userconfig["realName"],
								"context": c(content),
								"timenum": "\u521a\u521a",
								"fid": fid,
								"id": r
							};
							buildcomment(that, j);
							$("#" + txtid).val("") && $(document).mouseup()
						}
					}, "text")
				}).on("click", ".comment_arrow_down", function() {
					var that = $(this),
						fcinner = that.parent().next(),
						funid = that.attr("id").split("_")[1];
						var container = that.parents('.f_comment_inner').find('.f_commet_item_wrapper');
					if(that.find("i").length == 0) return;

					if(!that.hasClass("comment_arrow_up")) {
						that.addClass("comment_arrow_up");
						if(that.hasClass("iscomment")) {
							that.parents(".timeline_comment").find(".f_comment_item").show();
							return false
						}
					} else {
						that.removeClass("comment_arrow_up");
						if(that.hasClass("iscomment")) {
							that.parents(".timeline_comment").find(".f_comment_item").not(":last").hide();
							return false
						}
						hideAnimate(container,{
							height: '130px'
						},function(){
							container.children().each(function(i,el){
								if(i > 1){
									container.children().eq(i).hide();
								}
							})
							container.removeAttr('style');
						});
						setTimeout(function() {
							callback.call(null, that);
						}, 500);
						return false
					}

					if(that.hasClass('loaded')){
						showAnimate(container,{
									height: '130px',
									overflow: 'hidden'
							},
							function(){
								container.children().show();


							},function(){
							 container.removeAttr('style');
							 callback.call(null, that);
						})

					}else{
						jQuery.ajax({
						  url: a.API.Index.fun.commentlist,
						  type: 'POST',
						  dataType: 'json',
						  data: {fid: funid,page: 0,count: 0},
						  beforeSend: function(xhr, textStatus) {
								that.find('i').css({
									'background': 'url(\''+ THEME_SERVER_URL +'/style/images/loading_16.gif\')',
									 width: '16px',
									 height: '16px'
								})
						  },
						  success: function(r) {
								if(r) {
									var tltmpl = "";
									for(var i = 0; i < r.length - 2; i++) tltmpl += tloadmore(r[i]);
									showAnimate(container,{
											height: '130px',
											overflow: 'hidden'
										},
										function(){
											$(tltmpl).prependTo(fcinner);
										},function(){
											that.find('i').removeAttr('style');
											that.addClass('loaded');
											container.removeAttr('style');
											callback.call(null, that)
									})
								}
						  },
						  error: function(xhr, textStatus, errorThrown) {
						    //called when there is an error
						   
						  }
						});
					}
				}).on("click", ".comment_revert_down", function() {
					var that = $(this),
						ssid = that.prev().attr("id").replace("comment_revts_btn_", ""),
						dirinner = that.parents(".f_comment_item").find(".comment_revert_list"),
						ssidarr = ssid.split("_"),
						cmtid = ssidarr[1];
					if(!that.hasClass("comment_revert_up")) {
						that.addClass("comment_revert_up");
						if(dirinner.is(":hidden")) {
							showAnimate(dirinner,{
								display:'block',
								height:0
							},function(){
							},function(){
								dirinner.removeAttr('style');
								callback.call(null, that)
							})
							return false;
						}
					} else {
						that.removeClass("comment_revert_up");
						hideAnimate(dirinner,{
							height:0
						},function(){
							dirinner.hide();
							callback.call(null, that)
						})
						
						return false;
					}

					if(!that.hasClass('loaded')){
						jQuery.ajax({
						  url: a.API.Index.fun.commentchildlist,
						  type: 'POST',
						  dataType: 'json',
						  data: {cmtid: cmtid,page: 0,count: 0,isChild: 1},
						  beforeSend: function(xhr, textStatus) {
								that.find('i').css({
									'background': 'url(\''+ THEME_SERVER_URL +'/style/images/loading_16.gif\')',
									 width: '16px',
									 height: '16px'
								})
						  },
						  success: function(r) {
								if(r) {
									var tltmpl = "";
									for(var i = 0; i < r.length; i++) tltmpl += revloadmore(r[i]);

									showAnimate(dirinner,{
										display:'block',
										height:0
									},function(){
										$(tltmpl).prependTo(dirinner)

									},function(){
										that.find('i').removeAttr('style');
										that.addClass('loaded');
										dirinner.removeAttr('style');
										callback.call(null, that)
									})
								}
						  },
						  error: function(xhr, textStatus, errorThrown) {
						    //called when there is an error
						  }
						});
					}

				}).on("click", ".comment_revert_btn", function() {
					var that = $(this),
						ssid = that.attr("id").replace("comment_revert_btn_", "");
					ssidarr = ssid.split("_"), fid = ssidarr[0], pid = topCmtId = ssidarr[1], txtiput = $("#comment_revert_t" + ssid), content = txtiput.val();
					if($.trim(content) == "") {
						uiPoptips("\u8bf4\u70b9\u4ec0\u4e48\u5148\u5427\uff01", that, "exm", -220, -70);
						return
					}
					$.post(a.API.Index.fun.commment, {
						fid: fid,
						content: content,
						pid: pid,
						topCmtId: topCmtId,
						isChild: 0
					}, function(r) {
						if(r > 0) {
							uiPoptips("\u53d1\u8868\u6210\u529f\uff01", that, "sur", -220, -70);
							var j = {
								"headFace": userconfig["avatar"]["s32"],
								"nickName": userconfig["realName"],
								"context": c(content),
								"timenum": "\u521a\u521a",
								"fid": fid,
								"smtId": pid,
								"id": r
							};
							buildrecomment("A", that, j)
						}
					}, "text")
				}).on("click", ".revt_comment_revert_btn", function() {
					var that = $(this),
						ssid = that.attr("id").replace("revt_comment_revert_btn_", "");
					ssidarr = ssid.split("_"), fid = ssidarr[0], topCmtId = ssidarr[1], pid = ssidarr[2], txtiput = $("#revt_comment_revert_t" + ssid), content = txtiput.val();
					if($.trim(content) == "") {
						uiPoptips("\u8bf4\u70b9\u4ec0\u4e48\u5148\u5427\uff01", that, "exm", -220, -70);
						return
					}
					$.post(a.API.Index.fun.commment, {
						fid: fid,
						content: content,
						pid: pid,
						topCmtId: topCmtId,
						isChild: 1
					}, function(r) {
						if(r > 0) {
							uiPoptips("\u53d1\u8868\u6210\u529f\uff01", that, "sur", -220, -70);
							var j = {
								"headFace": userconfig["avatar"]["s32"],
								"nickName": userconfig["realName"],
								"context": c(content),
								"timenum": "\u521a\u521a",
								"fid": fid,
								"smtId": pid,
								"id": r
							};
							buildrecomment("B", that, j)
						}
					}, "text")
				})
			}
			return {
				init: init
			}
		});
		FUNLR.extend("comment", function(a) {
			var q = a.ajax.request;
			var b = {},
				d = {};
			b.build = function(obj, id, str) {
				var that = $(obj),
					thatParent = that.parent();
				var type = str == "sub" ? "revt_" : str == "pop" ? "pop_" : "";
				var tpl = '<dd class="{{type}}comment_revert_box clearfix">' + '<a href="javascript:;" title="" id="{{type}}comment_revert_btn_{{id}}" class="common30_btn {{type}}comment_revert_btn"><span>\u56de\u590d</span></a>' + '<div class="{{type}}comment_revert_inbox">' + '<textarea name="{{type}}comment_revert_t" class="{{type}}comment_revert_t" id="{{type}}comment_revert_t{{id}}" range="0|0"></textarea>' + '<a href="javascript:;" onclick="FUNLR.face.show(this, \'{{type}}comment_revert_t{{id}}\');" class="re_emotion"></a>' + "</div>" + "</dd>";
				thatParent.after(tpl.format({
					"id": id,
					"type": type
				}))
			};
			b.revert = function(obj, id) {
				var that = $(obj),
					thatParent = that.parent(),
					textarea, textareabox = thatParent.next();
				var type = textareabox.hasClass("comment_revert_box") ? "" : textareabox.hasClass("revt_comment_revert_box") ? "revt_" : textareabox.hasClass("pop_comment_revert_box") ? "pop_" : undefined;
				if(type != undefined) if(textareabox.is(":hidden")) textareabox.show();
				else {
					textarea = thatParent.next("." + type + "comment_revert_box").find("textarea");
					if(textarea.val() == "") textareabox.hide();
					else $.noop()
				} else if(that.hasClass("revt_comment_revert")) b.build(obj, id, "sub");
				else if(that.hasClass("comment_revert")) b.build(obj, id, "");
				else if(that.hasClass("pop_comment_revert")) b.build(obj, id, "pop")
			};
			d.removeDom = function(obj) {
				$(obj).parents("dl").fadeIn(200).remove();
				uiPoptips("\u5220\u9664\u6210\u529f\uff01", $(obj), "sur", -10, -70)
			};
			d.deltop = function(obj, id) {
				q.delcomment(id, function(r) {
					if(r == 0) {
						var ch_NUM = +parseInt($(obj).parents(".f_comment_inner").find(".comment_arrow_down span").text());
						if(ch_NUM == 1) {
							$(obj).parents(".f_comment_inner").find(".f_comment_more").remove();
							$(obj).parents(".f_comment_inner").find(".f_commet_item_wrapper").remove()
						} else {
							$(obj).parents(".f_comment_inner").find(".f_comment_more").find("span").text(ch_NUM - 1 + "\u6761\u8bc4\u8bba");
							d.removeDom(obj)
						}
						return
					}
				})
			};
			d.delchild = function(obj, id) {
				q.delchildcomment(id, function(r) {
					if(r == 0) {
						d.removeDom(obj);
						return
					}
				})
			};
			d.init = function() {
				$(document).on({
					mouseenter: function() {
						var that = $(this);
						that.find(".comment_del").show()
					},
					mouseleave: function() {
						var that = $(this);
						that.find(".comment_del").hide()
					}
				}, ".f_comment_item").on({
					mouseenter: function() {
						var that = $(this);
						that.find(".child_comment_del").show()
					},
					mouseleave: function() {
						var that = $(this);
						that.find(".child_comment_del").hide()
					}
				}, ".revt_list_item")
			};
			return {
				revert: b.revert,
				deltop: d.deltop,
				delchild: d.delchild,
				init: d.init
			}
		});
		FUNLR.namespace("content.fun.transmit", function(a) {
			var face = a["face"],
				t = a.comtent.transmit.tmpl;
			var b = {
				showtpl: function(fid, username, avatar, content, img, transmitcnt, type) {
					var retpl, tpl = t(img, type, transmitcnt);
					retpl = tpl.format({
						"uid": userconfig.uid,
						"fid": fid,
						"username": username,
						"avatar": avatar,
						"context": content,
						"img": img
					});
					return retpl
				},
				draggopt: function() {
					return {
						handle: ".pop_transmit_head",
						cursor: "move"
					}
				},
				swtichtype: function(obj, callback) {
					var funtype = obj.parents(".fun_item_outer").attr("funtype") || obj.parents(".common_view").attr("funtype");
					var artouter = obj.parents(".f_cnt_inner");
					var username, avatar, content, img, transmitcnt, type;
					if(funtype == 1 || funtype == 3 || funtype == 4 || funtype == 5) {
						type = "origin";
						username = artouter.find(".cnt_author").text();
						avatar = artouter.find(".f_info_wrpper").find("img").attr("src");
						content = funtype == 1 || funtype == 5 || funtype == 4 ? artouter.find(".content_text").html().toString() : artouter.find(".upload_album_tips").html().toString();
						img = funtype == 1 || funtype == 4 ? "" : artouter.find(".cnt_images").find("img").eq(0).attr("src");
						transmitcnt = funtype == 1 || funtype == 4 || funtype == 5 ? "\u8f6c\u53d1\u5206\u4eab" : "\u8f6c\u53d1\u6545\u4e8b"
					} else if(funtype == 2 || funtype == 6) {
						type = "transmit";
						username = artouter.find(".transmit_cnt").find("a").text().replace(/\@/, "").replace(/:/, "");
						avatar = a.fn.getHeadFace(artouter.find(".transmit_cnt_author").find("img").attr("hurl"), 64);
						content = funtype == 2 ? artouter.find(".transmit_cnt").html().toString().replace(/^\<[^\<]+\<\/a\>/, "") : artouter.find(".upload_album_tips").length ? artouter.find(".upload_album_tips").html().toString() : "\u6b64\u6545\u4e8b\u5df2\u88ab\u5220\u9664\uff01";
						img = artouter.find(".cnt_images").find("img").eq(0).attr("src") || "";
						transmitcnt = function() {
							var k = "//" + artouter.find(".cnt_author").text() + ":" + artouter.find(".transmit_reason").html().toString().toLowerCase().replace(/\<[^\<\[]+(\[[^\]]+\])[^\>]*\>/g, function(a, $1) {
								return $1
							});
							k = k.match(/\/\/[^\/]+/g)[0];
							return k
						}()
					}
					var arguments = [username, avatar, content, img, transmitcnt];
					callback.apply(this, arguments)
				}
			};

			function init(obj) {
				$(obj).on("click", ".cnt_transmit", function() {
					var that = $(this),
						tpl, opos = that.offset(),
						artouter = that.parents(".f_cnt_inner"),
						idcache = that.attr("id").replace(/^cmtm_/, "").split("_"),
						fid = idcache[1];
					b.swtichtype(that, function() {
						var arguments = [].slice.call(arguments, 0);
						var username = arguments[0],
							avatar = arguments[1],
							content = arguments[2],
							img = arguments[3],
							transmitcnt = arguments[4];
						tpl = b.showtpl(fid, username, avatar, content, img, transmitcnt);
						req(["jqueryui/draggable"], function() {
							a.layer.mask();
							$(tpl).draggable(b.draggopt()).css({
								left: opos.left - 200,
								top: opos.top - 50,
								position: "absolute"
							}).appendTo("body");
							a.common.Window.center($(".pop_transmit_layer"), $(window).scrollTop())
						})
					})
				});
				$(document).on("click", ".transmit_submit_btn", function() {
					var that = $(this),
						funId = $(".pop_transmit_layer").attr("id").replace(/^pop_transmit_layer_/, ""),
						content = $(".transmit_input").val(),
						content = content;
					if($.trim(content) == "") {
						uiPoptips("\u8bf4\u70b9\u4ec0\u4e48\u5148\u5427\uff01", that, "exm", -220, -70);
						return
					}
					jQuery.post(a.API.Index.fun.transmit, {
						funId: funId,
						content: content
					}, function(r) {
						if(typeof r == "object") {
							uiPoptips("\u8f6c\u53d1\u6210\u529f\uff01", that, "sur", -220, -70);
							a.layer.nomark();
							$(".pop_transmit_layer").remove();
							if($(".fun_wrpper").hasClass("timeline_wrapper")) return;
							tmpl = a.content.tmpl.main(r);
							$(tmpl).prependTo(".fun_wrpper")
						}
					}, "json")
				}).on("click", ".inner_close_btn", function(e) {
					if($(e.target).parents(".pop_transmit_layer").length) {
						a.layer.nomark();
						$(".pop_transmit_layer").remove()
					}
				})
			}
			return {
				init: init
			}
		});
		FUNLR.namespace("users.scard", function(a) {
			var inTimer =  null,
				inTimert = null,
				ouTimer = null;
			var q = a.ajax.request;
			var curr_li_index = 0;

			function getSelectedValues(o, spliter) {
				var $o = $(o).filter(":checked");
				var spliter = spliter || ",";
				var values = [];
				$o.each(function() {
					values.push(this.value)
				});
				return values.join(spliter)
			}
			function reLayoutList() {
				var arr = [];
				$(".timeline_wrapper > .timeline_unit").each(function(i) {
					arr.push($(this).height())
				});
				return arr
			}
			function init(param) {
				var defopts = {};
				var opts = $.extend(defopts, param, {});
				a.fn.docfire(".pop_add_friend_to_group", function() {
					$(".pop_add_friend_to_group").hide()
				});
				$(document).on({
					mouseenter: function() {
						var that = $(this),
							offset = that.offset(),
							oheight = that.innerHeight(),
							owidth = that.innerWidth(),
							friendId = that.attr("cuid");
						if(inTimer) clearTimeout(inTimer);
						var curcard = $("#user_card_" + friendId);
						var ostyle = {
							"top": offset.top + oheight,
							"left": offset.left + owidth / 2 - 30
						};
						$(".ucard_wrap").hide();
						$(" .pop_add_friend_to_group").remove();
						ouTimer = setTimeout(function(){
							if(curcard.length) {
								curcard.css(ostyle).show();
								return
							}
							if(friendId == userconfig.uid) return;
							a.fn.loadCss("card", function() {
								q.scard(friendId, function(r) {
									if(r) {
										$("body").append(r);
										$(".ucard_wrap").css(ostyle)
									} else uiPoptips("\u52a0\u8f7d\u5361\u7247\u5931\u8d25\uff01", that, "exm", -10, -80)
								})
							})
						},600);
					},
					mouseleave: function() {
						var that = $(this),
							friendId = that.attr("cuid");
						if(ouTimer) clearTimeout(ouTimer);
						inTimer = setTimeout(function() {
							$("#user_card_" + friendId).hide()
						}, 400)
					}
				}, ".ucard").on({
					mouseenter: function() {
						if(inTimer) clearTimeout(inTimer)
					},
					mouseleave: function() {
						if(ouTimer) clearTimeout(ouTimer);
						if($("#face_box").is(":visible")) return;
						inTimer = setTimeout(function() {
							$(".ucard_wrap,.pop_add_friend_to_group").hide()
						}, 500)
					}
				}, ".ucard_wrap,.pop_add_friend_to_group").on({
					click: function() {
						var that = $(this);
						$(".pop_add_friend_to_group").remove();
						if(that.parents(".message_pop_outer").length) window.hexq = "pop";
						else if(that.parents(".timeline_inner").length) {
							window.hexq = "timeline";
							curr_li_index = that.parents(".timeline_unit").index()
						} else window.hexq = "ucard";
						var fpos = that.offset(),
							id = that.attr("cuid"),
							accept = that.attr("accept") || 0;
						q.getgrlist(id, accept, function(r) {
							if(r) $(r).css({
								"top": fpos.top + 30,
								"left": fpos.left - 15
							}).appendTo("body")
						})
					}
				}, ".add-friends-btn").on({
					click: function() {
						var that = $(this);
						var id = that.attr("cuid");
						q.ignorefreq(id, function(r) {
							if(r == 0) {
								uiPoptips("\u5ffd\u7565\u6210\u529f\uff01", that, "sur", 0, 0);
								if(hexq == "pop") FUNLR.message.tips.show.update();
								else if(hexq == "timeline") {
									that.closest("li.timeline_unit").remove();
									FUNLR.message.timeline.fix(reLayoutList(), "del")
								}
							} else uiPoptips("\u8bf7\u6c42\u5931\u8d25\uff01", $this, "exm", 0, 0)
						})
					}
				}, ".ignore_friend_request").on({
					click: function() {
						var id = parseInt($(this).attr("cuid"));
						var groupIds = getSelectedValues("#circle-list > li > label > input[type=checkbox]");
						if(!groupIds) {
							uiPoptips("\u81f3\u5c11\u9009\u62e9\u4e00\u4e2a\u5708\u5b50\uff01", $("#circle-list"), "exm", -12, -70);
							return false
						}
						q.acceptfreq(id, groupIds, function(r) {
							if(r == 0) {
								uiPoptips("\u52a0\u5165\u6210\u529f\uff01", $("#circle-list"), "sur", -12, -70);
								$(".pop_add_friend_to_group").remove();
								if(hexq == "pop") FUNLR.message.tips.show.update();
								else if(hexq == "timeline") {
									$("li.timeline_unit").eq(curr_li_index).remove();
									FUNLR.message.timeline.fix(reLayoutList(), "del")
								}
							} else uiPoptips("\u52a0\u5165\u5931\u8d25\uff01", $("#circle-list"), "exm", -12, -70)
						})
					}
				}, ".accept_friend_request").on({
					click: function() {
						var friendId = $(this).attr("cuid");
						var groupId = $('#circle-list > li > label > input[type="radio"]:checked').val();
						if(typeof groupId == undefined) {
							uiPoptips("\u81f3\u5c11\u9009\u62e9\u4e00\u4e2a\u5708\u5b50\uff01", $("#circle-list"), "exm", -12, -70);
							return false
						}
						q.frireq(friendId, groupId, function(r) {
							if(r == 0) {
								uiPoptips("\u7533\u8bf7\u6210\u529f\uff01", $("#circle-list"), "sur", -12, -70);
								$(".pop_add_friend_to_group").remove()
							} else if(r == -2) uiPoptips("\u5df2\u7ecf\u7533\u8bf7\u8fc7\uff01", $("#circle-list"), "exm", -12, -70);
							else uiPoptips("请先选择圈子！", $("#circle-list"), "exm", -12, -70);
							if(hexq == "stranger") {
								var stips = '<a href="javascript:;" title="" class="sur_tips_f"></a>';
								$(".add_btn").after(stips).remove()
							}
						})
					}
				}, ".send_friend_request").on({
					click: function() {
						var groupName = $.trim($("#circle-name").val());
						if(groupName == "" || groupName == "\u8f93\u5165\u5708\u5b50\u540d") {
							uiPoptips("\u5708\u5b50\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a\uff01", $("#circle-list"), "exm", -12, -70);
							return false
						}
						var id = $(this).attr("accept");
						q.addgroup(groupName, function(r) {
							if(r > 0) {
								$size = $("#circle-list>li").size();
								if(id == 1) var html = "<li><label>" + groupName + '<input type="checkbox" name="' + r + '_circle" value="' + r + '"></label></li>';
								else var html = "<li><label>" + groupName + '<input type="radio" name="radio_circle" value="' + r + '"></label></li>';
								$(html).prependTo("#circle-list");
								uiPoptips("\u521b\u5efa\u6210\u529f\uff01", $("#circle-list"), "sur", -12, -70);
								$(".create-circle-box").hide();
								$(".crt_grs_sure").show()
							} else uiPoptips("\u521b\u5efa\u5708\u5b50\u5931\u8d25\uff01", $("#circle-list"), "exm", -12, -70)
						})
					}
				}, ".create_circle_submit").on({
					click: function() {
						$(".create-circle-box").hide();
						$(".crt_grs_sure").show()
					}
				}, ".create_circle_cancel").on({
					click: function() {
						$(this).parent().hide();
						$(".create-circle-box").show()
					}
				}, ".create-circle").on({
					focus: function() {
						var that = $(this),
							val = $.trim(that.val());
						if(val == "\u8f93\u5165\u5708\u5b50\u540d") that.val("")
					}
				}, "#circle-name").on({
					focus: function() {
						$(this).addClass("active");
						$(this).val("")
					},
					blur: function() {
						$(this).removeClass("active")
					}
				}, ".recnt_comment_inp").on("click", ".card_comment_btn", function() {
					var that = $(this),
						tbox = that.parent().prev(),
						cmtval = tbox.val(),
						modid = tbox.attr("id").replace("mood_cm_", "");
					if($.trim(cmtval) == "") {
						uiPoptips("\u8bf4\u4e9b\u4ec0\u4e48\u5148\u5427\uff01", that, "exm", -12, -70);
						return
					}
					q.moodcmt(modid, cmtval, function(r) {
						if(r == 0) {
							uiPoptips("\u53d1\u8868\u6210\u529f\uff01", that, "sur", -12, -70);
							tbox.val("\u6211\u4e5f\u8bf4\u4e00\u53e5").removeClass("on").next().hide()
						}
					})
				})
			}
			return {
				init: init
			}
		});

		/**
		 * namespace : FUNLR.content.album.plugin
		 * param  jqueryObj $obj
		 * param  Number 宽度
		 * param  Number 高度
		 * param  function callback
		 */
		FUNLR.namespace("content.album.plugin", function(a) {
			return function(outobj, mw, mh, cbfns) {
				var callback = callbackhide = function() {};
				if(cbfns) callback = cbfns;
				outobj.on("click", ".zout", function() {
					var that = $(this),
						cimg = that.find("img"),
						box = that.parents(".cnt_images"),
						show_box = box.next(),
						imgindex = cimg.attr("alt"),
						activeli = that.parents(".f_content_wrapper").find(".f_pic_small_list li");
					activeli.removeClass("pic_active");
					activeli.eq(imgindex - 1).addClass("pic_active"), curpos = that.offset(), boxPos = box.offset();
					var antpl = $("<div/>", {
						"class": "show_pic"
					}).css({
						zIndex: 1,
						position: "relative",
						width: mw,
						height: mh,
						display: "block",
						"vertical-align": "middle",
						overflow: "hidden"
					});
					var climg = that.find("img").clone();
					var cSize = {
						wdith: cimg.width(),
						height: cimg.height(),
						left: cimg.offset().left,
						top: cimg.offset().top
					};
					var imgSize, imgWidth, imgHeight;
					var Imgsrc = dirImgUrl(that.data("bigimgsrc"));
					var buildobj = $('<img src="' + Imgsrc + '"/>');
					a.fn.imgReady(Imgsrc, function() {
						var imgW = this.width,
							imgH = this.height;
						var zoomSize = a.fn.getzoomSize(imgW, imgH, mw, mh);
						show_box.find(".show_pic").remove().end().show();
						if(zoomSize.height > mh) {
							show_box.height(zoomSize.height);
							antpl.height(zoomSize.height)
						}
						buildobj.css({
							position: "absolute",
							"vertical-align": "middle",
							width: cSize.width,
							height: cSize.height,
							left: cSize.left - boxPos.left,
							top: cSize.top - boxPos.top
						}).addClass("zin").appendTo(antpl);
						antpl.prependTo(show_box);
						var setPos = {
							left: zoomSize.width == mw ? 0 : (mw - zoomSize.width) / 2,
							top: zoomSize.height >= mh ? 0 : (mh - zoomSize.height) / 2
						};
						box.hide();
						show_box.find(".show_pic").find("img").animate({
							width: zoomSize.width,
							height: zoomSize.height,
							left: setPos.left,
							top: setPos.top
						}, 400, function() {
							callback.call(null, that)
						})
					})
				}).on("click", ".show_pic img", function() {
					var that = $(this);
					$(".show_pic").animate({
						height: that.height()
					}, 600, function() {
						$(".cnt_show_pic").fadeOut("fast", function() {
							$(".cnt_images").removeAttr("style");
							callback.call(null, that)
						})
					})
				}).on("click", ".f_pic_small_list li", function() {
					var that = $(this),
						thatsrc = that.find("img").attr("src"),
						show_box = that.parents(".cnt_show_pic"),
						oldActive = that.siblings(".pic_active");
					if(that.hasClass("pic_active")) return;
					var wpos = that.parents(".cnt_show_pic").offset(),
						lpos = that.offset(),
						anipos = {
							left: lpos.left - wpos.left,
							top: lpos.top - wpos.top + 35
						};
					var Imgsrc = that.find("img").attr("src");
					a.fn.imgReady(Imgsrc, function() {
						var imgW = this.width,
							imgH = this.height;
						var zoomSize = a.fn.getzoomSize(imgW, imgH, mw, mh);
						if(zoomSize.height > mh) {
							show_box.height(zoomSize.height);
							show_box.find(".show_pic").height(zoomSize.height)
						} else {
							show_box.height(mh);
							show_box.find(".show_pic").height(mh)
						}
						var setPos = {
							left: zoomSize.width == mw ? 0 : (mw - zoomSize.width) / 2,
							top: zoomSize.height >= mh ? 0 : (mh - zoomSize.height) / 2
						};
						that.siblings().removeClass("pic_active").end().addClass("pic_active");
						show_box.find(".show_pic img").animate({
							width: 0,
							height: 0,
							left: anipos.left,
							top: anipos.top
						}, 400, function() {
							$(this).attr("src", thatsrc).animate({
								width: zoomSize.width,
								height: zoomSize.height,
								left: setPos.left,
								top: setPos.top
							}, 400, function() {
								callback.call(null, that)
							})
						})
					})
				})
			}
		});
	}) // req
	return FUNLR;

});