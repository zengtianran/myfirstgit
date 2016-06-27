!(function($){
	$.fn.ztrCalendar = function(opts){
		  var el = this,
		      ops = opts || {};
		  new ztrCalendar(el, ops);
		};
   function ztrCalendar(elem, config){
	     this.el = elem;
		 this.config = config;
		 this.init();
	   }
    ztrCalendar.prototype = {
		el : null,
		dayEl : null,
		config : null,
		isLoad : false,
		yearRange : 15,
		startYear : 1970,
		endYear : 2020,
		init : function(){
			   var self = this;
			    self.bulid();
			},
		 bulid : function(curYear){
			  var self = this,
			    todyParam = self.dateTodayParam(),
				_calendarArr = [],
				_year = curYear || todyParam['year'];
				_selHtml = self.calendarSelect(todyParam['year'], _year) || '';
				_calendarArr.push(_selHtml);
				_calendarArr.push("<div class='line clearfix'>");
				for(var i = 0; i < 12; i++){
					   var _mon = i,
					       _firstDay = self.firstDay(new Date(_year, _mon, 1)),
						   _date = '';
						   if(_year === todyParam['year'] && _mon === todyParam['month']){
							   _date = todyParam['date'];
							 }else{
								   _date = '';
								 }
					if(i % 3 === 0 && i > 1){
						   _calendarArr.push("</div><div class='line clearfix'>");
						}
					   _calendarArr.push(self.calendarHtml(_year, _mon, _date, _firstDay));
					}
					_calendarArr.push("</div>");
					$(self.el).html(_calendarArr.join(''));
				if(!self.isLoad){
					 self.initEven();
				     self.isLoad = true;
					}
			 },
		 cnlendarEl : null,
		 calendarSelect : function(year, curYear){
			    var self = this,
				    _strYear = parseInt(year) - self.yearRange,
					_endYear = parseInt(year) + self.yearRange;
					self.startYear = _strYear;
					self.endYear = _endYear;
				var _html = "<div class='ztrcalendar-sel'>\n<ul>\n<li><a class='ztr-yearprev'><</a>\n<span class='ztr-year'>"+ curYear +"年</span><select class='sel-ztryear' name='ztryear'>";
				  for(var i = _strYear; i <= _endYear; i ++){
					if(i == curYear){
						_html += "<option value='"+ i +"' selected='selected'>"+ i +"</option>";
					}else{
						_html += "<option value='"+ i +"'>"+ i +"</option>";
					}
				  }
				_html += "</select><a class='ztr-yearnext'>></a></li></ul></div>";
				return _html;
			 },
		  setSelectVal : function(selEl, val){
			    // selEl[0].selectedIndex = $("option[value="+val+"]", selEl).index();
				 selEl.find("option[value="+ val +"]").attr("selected", "selected").siblings().removeAttr("selected");
			  },
		 calendarHtml : function(year, mon, day, firstDay){
			    var self = this,
				    showMon = mon + 1,
					_week = self.weekDay,
				    row = self.calendarRow(firstDay, year, mon);
			    var _html = "<div class='ztrcalendar-warp'><table id='ztrcalendar-"+ showMon +"'>\n<tr class='nowmonth'>\n<td colspan=7><div class='clsMonth'>"+ self.showMonth[mon] +"</div>\n</td>\n</tr>\n\n"
                  +"<tr class='week'>\n<td>\n<ul>\n<li class='weekend'>"+ _week[0] +"</li>\n<li>"+ _week[1] +"</li>\n<li>"+ _week[2] +"</li>\n<li>"+ _week[3] +"</li>\n<li>"+ _week[4] +"</li>\n<li>"+ _week[5] +"</li>\n<li class='weekend'>"+ _week[6] +"</li>\n</ul>\n</td>\n</tr>\n\n<tr class='day'>\n<td colspan=7>\n";
			
				 for(var m = 0; m < 6; m ++){
					 //日期共 4-6 行
						if(row <= m){
						  //第五、六行是否隐藏				
							 _html += "<ul class='daylist hide daylist"+ m +"'>\n";
						}else{
							 _html += "<ul class='daylist daylist"+ m +"'>\n";
						}
				     for(var n = 0; n < 7; n++){
						   //日历列
							if((7 * m + n) < firstDay || (7 * m + n) >= (firstDay + self.monthDays(year, mon))){
								//某月日历中不存在的日期(头尾)
								_html += "<li class='' data-date=''></li>";
							}else{
								var _theDay =  7 * m + n + 1 - firstDay,
								    _dataDate = year +"/"+ showMon +"/"+ _theDay,
									_gHoliday = self.readGholiday(mon, _theDay),
									_gHolidayCls = _gHoliday.length ? 'weekend' : '',
									_mHoliday = self.readMholiday(mon, _theDay) || {},
									_mHolidayCls = _mHoliday.isHoliday ? 'weekend' : '',
									_mHolidayHtl = _mHoliday.info || '';
								if((_theDay == day)&&(((7 * m + n) % 7 == 0) || ((7 * m + n) % 7 == 6))){
									  _html += "<li class='core todayweekend "+ _gHolidayCls +" "+ _mHolidayCls +"' data-date='"+ _dataDate +"'>"+ _theDay +""+ _mHolidayHtl +""+ _gHoliday +"</li>";
								}else if((( 7 * m + n )%7 == 0) || ((7 * m + n)%7 == 6)){
									 _html += "<li class='core weekended  "+ _gHolidayCls +" "+ _mHolidayCls +"' data-date='"+ _dataDate +"'>"+ _theDay +""+ _mHolidayHtl +""+ _gHoliday +"</li>";
								}else if(_theDay == day){
									 _html += "<li class='core today "+ _gHolidayCls +"  "+ _mHolidayCls +"' data-date='"+ _dataDate +"'>"+ _theDay +""+ _mHolidayHtl +""+ _gHoliday +"</li>";
								}else{
									 _html += "<li class='core "+ _gHolidayCls +"  "+ _mHolidayCls +"' data-date='"+ _dataDate +"'>"+ _theDay +""+ _mHolidayHtl +""+ _gHoliday +"</li>";
								}
							}
						}
					   _html += "</ul>\n";
					}
					  _html += "</td>\n</tr>\n</table></div>";
					return _html; 
			 },
		 initEven : function(){
			    var self = this,
				    conF = self.config;
				    $(self.el).on('click', '.core', function(){
						var me = $(this);
						  self.dayEl ? self.dayEl.removeClass('active') : '';
						  self.dayEl = me;
						  me.addClass('active');
						  if($.type(conF.onClickDay) === 'function'){
								   conF.onClickDay(me, conF);
								}
						  return false;
						});
				  $(self.el).on('click', '.ztr-yearprev', function(){
						var me = $(this),
						    selEl = $('.sel-ztryear');
						var	_nowYear = parseInt(selEl.val()),
						    _prevYear = _nowYear - 1;
							if(_prevYear < self.startYear){
								return false;
								}
							if($.type(conF.yearPrevClick) === 'function'){
								   conF.yearPrevClick(_prevYear, conF);
								   self.setSelectVal(selEl, _prevYear);
						           self.bulid(_prevYear);	
								}else{
								 conF.gHoliday = {};
								 self.setSelectVal(selEl, _prevYear);
						         self.bulid(_prevYear);	
							  }
						  return false;
						});
				 $(self.el).on('click', '.ztr-yearnext', function(){
						var me = $(this),
						    selEl = $('.sel-ztryear');
							var	_nowYear = parseInt(selEl.val()),
						        _nextYear = _nowYear + 1;
							if(_nextYear > self.endYear){
								return false;
								}
							if($.type(conF.yearNextClick) === 'function'){
								   conF.yearNextClick(_nextYear, conF);
								   self.setSelectVal(selEl, _nextYear);
						           self.bulid(_nextYear);	
								}else{
								  conF.gHoliday = {};
								  self.setSelectVal(selEl, _nextYear);
						          self.bulid(_nextYear);
							  }
						   return false;
						});
				$(self.el).on('change', '.sel-ztryear', function(){
						var me = $(this);
						var	_nowYear = parseInt(me.val());
							self.setSelectVal(me, _nowYear);
						    self.bulid(_nowYear);
						   return false;
						});
				$(document).on('click', function(){
					  if(self.dayEl){
						  self.dayEl.removeClass('active');
						}
					});
			 },
		 readGholiday : function(mon, day){
			 var self = this,
			     _gHoliday = self.config.gHoliday || {},
				 _gMonHoliday = _gHoliday[""+mon+""] || [];
				 if(_gMonHoliday.length === 0){
					    return "";
					 }
				 if(self.isInArray(day, _gMonHoliday)){
					 return "<em class='ztr-icon icon-g'>假</em><em class='ztr-icon icon-x'>薪</em>"; 
				  }else{
					  return "";
				  }
			 },
		 readMholiday : function(mon, day){
			   var self = this,
			     _jHoliday = self.config.jHoliday || {},
				 _jMonHoliday = _jHoliday[""+mon+""] || [],
				 _bHoliday = self.config.bHoliday || {},
				 _bMonHoliday = _bHoliday[""+mon+""] || [];
				 if(_jMonHoliday.length === 0 && _bMonHoliday.length === 0){
					    return {};
					 }
				 if(self.isInArray(day, _jMonHoliday)){
					 return {"isHoliday" : true, "info" : "<em class='ztr-icon mholiday icon-j'>休</em>"};
				  }else{
					 return {"isHoliday" : false, "info" : "<em class='ztr-icon mholiday icon-b'>班</em>"};
				  }
			 },
		 isInArray : function(str, arr){
			var type = typeof str;  
		    if((type == 'string' || type =='number') && arr.length > 0) {  
		        for(var i in arr) {  
		            if(arr[i] === str) {  
		                return true;  
		            }  
		        }  
		    }  
		      return false;
			},
	     isleap : function(year){
               return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            },
		//返回每月天数
		 leapYear : function(year){
			    var self = this;
			    var fbDay =  self.isleap(year) ? 29 : 28;
				return [31, fbDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			 },
		 calendarRow : function(firstDay, year, mon){
			 var self = this;
			   return Math.ceil((firstDay + self.monthDays(year, mon))/7);
			 },
		 monthDays : function(year, mon){
			   var self = this,
			       yearArr = self.leapYear(year);
			   return yearArr[mon];
			 },
		  //当月1号星期几
	     firstDay : function(date){
			   return date.getDay();
			 },
		 showMonth : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	     weekDay : ['日', '一', '二', '三', '四', '五', '六'],
	     dateTodayParam : function(){
			 var self = this,
			     date = new Date(),
			     todayArr = new Array();
			 todayArr['year'] = date.getFullYear();
			 todayArr['month'] = date.getMonth();
			 todayArr['date'] = date.getDate();
			 todayArr['hour'] = date.getHours();
			 todayArr['minute'] = date.getMinutes();
			 todayArr['second'] = date.getSeconds();
			 todayArr['week'] = date.getDay();
			 todayArr['firstDay'] = self.firstDay(new Date(todayArr['year'], todayArr['month'], 1));
		       return todayArr; 
			 }
	};
})(jQuery)


$(function(){
   var workCalendar = {};
       workCalendar.init = function(){
		   this.initEven();
		   };
	   workCalendar.initEven = function(){
		   $(document).on('click', function(){
			var holidayTip = $('.holiday-tip');
			  if(holidayTip.length){
				  holidayTip.fadeOut();
				  }
			});
			$('.holiday-tip').on('click', '.ck-xin', function(){
				  var me = $(this),
				      parTip = me.parents('.holiday-tip'),
				      liEl = parTip.data('liEl');
				  if(me.hasClass('active')){
					  $(liEl).find('.icon-x').hide();
					  me.removeClass('active');
				   }else{
					   $(liEl).find('.icon-x').show();
					   me.addClass('active');  
				   }
				return false;
			  });
			 $('.holiday-tip').on('click', '[data-mholiday]', function(){
				  var me = $(this),
				      _type = me.attr('data-mholiday'),
					  _reverseType = _type === 'b' ? 'j' : 'b',
					  _typeTxt = _type === 'b' ? '班' : '休',
				      parTip = me.parents('.holiday-tip'),
				      liEl = parTip.data('liEl');
                    if(!me.hasClass('active')){
						me.addClass('active');
						$('em[data-mholiday="'+ _reverseType +'"]').removeClass('active');
					  $(liEl).find('.mholiday').removeClass('icon-'+ _reverseType +'').addClass('icon-'+ _type +'').html(_typeTxt);
				   } 
				return false;
			  });
		   };
       workCalendar.getHolidayInfo = function(year){
		     if(year === 2016){
				 return {'0':[1, 2, 3], '1':[7, 8, 9, 10, 11, 12, 13], '2':[], '3':[2, 3, 4, 30], '4':[1, 2], '5':[9,10,11], '6':[], '7':[], '8':[15,16,17], '9':[1,2,3,4,5,6,7], '10':[], '11':[]};
				 }else if(year === 2015){
					return {'0':[1, 2, 3], '1':[18, 19, 20, 21, 22, 23, 24], '2':[], '3':[4, 5, 6], '4':[1, 2, 3], '5':[20, 21, 22], '6':[], '7':[], '8':[3,4,5,26,27], '9':[1,2,3,4,5,6,7], '10':[], '11':[]};
				  }else{
					   return {};
				  }
		   };
	  workCalendar.ckXin = function(){
		 // ck-xin
		  };
	 workCalendar.init();
	$('#mywrap').ztrCalendar({
			   gHoliday : workCalendar.getHolidayInfo(2015),
			   jHoliday : {'0':[1,2,3,4,10,11,17,18,24,25,31], '1':[1,7,8,14,15,18,19,20,21,22,23,24,28], '2':[1,7,8,14,15,21,22,28,29], '3':[8, 15], '4':[8, 15], '5':[8, 15], '6':[8, 15], '7':[8, 15], '8':[8, 15], '9':[1,2,3,4,5,6,7,11,17,18,24,25,31], '10':[1,7,8,14,15,21,22,28,29], '11':[5,6,12,13,19,20,26,27]},
			   onClickDay : function(el, fig){
				      var me = el,
					      meOffset = me.offset(),
						  holidayTip = $('.holiday-tip'),
						  _gHoliday = me.find('.icon-g'),
						  _holidayLi =  holidayTip.find('li'),
						  _xinDis = me.find('.icon-x').css('display') === 'none' ? '' : 'active';
						  _gHoliday.length ? (_holidayLi.eq(0).find('.ck-xin').removeClass('active').addClass(_xinDis), _holidayLi.eq(0).show()) : _holidayLi.eq(0).hide();
						  holidayTip.css({
							     "top" : meOffset.top + 49,
								 "left" : meOffset.left - 15
							  }).show();
					    $('em[data-mholiday]', holidayTip).removeClass('active');  
						if(me.find('.mholiday').hasClass('icon-b')){
							   $('em[data-mholiday="b"]', holidayTip).addClass('active');
							}else{
								$('em[data-mholiday="j"]', holidayTip).addClass('active');
							 }
					   holidayTip.data('liEl', me);
				   },
			   yearPrevClick : function(year, fig){
				      fig.gHoliday = workCalendar.getHolidayInfo(year);
				   },
			   yearNextClick : function(year, fig){
				      fig.gHoliday = workCalendar.getHolidayInfo(year);
				   },
			   yearSelectClick : function(){
				   
				   }
		}); 
});