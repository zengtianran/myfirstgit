!(function($){
	$.fn.ztrDatePicker = function(opts){
		var curSetting = {
			  warpCls : 'ztrdatepicker-warp',
			};
		  var el = this,
		      ops = opts || curSetting;
		  new ztrDatePicker(el, ops);
		};
   function ztrDatePicker(elem, config){
	     this.el = elem;
		 this.config = config;
		 this.init();
	   }
    ztrDatePicker.prototype = {
		el : null,
		dom : {
			  warp : null,
			  month : null,
			  week : null,
			  day : null
			},
		config : null,
		isLoad : false,
		yearRange : 15,
		startYear : 1970,
		endYear : 2020,
		init : function(){
			   var self = this,
			       todayParm = self.dateTodayParam();
			    self.bulid(todayParm["year"], todayParm["month"], todayParm["date"], todayParm["firstDay"]);
				//self.bulid(2016, 0, 5, 5);
			},
		bulid : function(year, mon, day, firstDay){
			    var self = this,
				    config = self.config,
					dom = self.dom,
				    showMon = mon + 1,
					_warp = null,
					_warpHtml = [];
				 _warpHtml.push("<div class='"+ config.warpCls +"'>");
				 _warpHtml.push("<table id='ztrdatepicker-"+ showMon +"'>");
				 _warpHtml.push("<tr class='ztrdatepicker-month'>");
				 _warpHtml.push("<td colspan='7'></td></tr>");
				 _warpHtml.push("<tr class='ztrdatepicker-week'>");
				 _warpHtml.push("<td colspan='7'></td></tr>");
				 _warpHtml.push("<tr class='ztrdatepicker-day'>");
				 _warpHtml.push("<td colspan='7'></td></tr>");
				 _warpHtml.push("</table>");
				 _warpHtml.push("</div>");
				 _warp = $(_warpHtml.join('')).appendTo('body');
				 dom.warp = _warp;
				 dom.month = _warp.find('.ztrdatepicker-month');
				 dom.week = _warp.find('.ztrdatepicker-week');
				 dom.day = _warp.find('.ztrdatepicker-day');
				 self.selectYearMonthAndWeek(year, mon);
				 self.dayDraw(year, mon, day, firstDay);
				 self.initEvents();
			 },
		 selectYearMonthAndWeek : function(year, mon){
			    var self = this,
				    dom = self.dom,
					_selectHtml = [],
					_weekHtml = [],
					_week = self.weekDay;
					_selectHtml.push("<div class='prev-month'><a></a></div>");
					_selectHtml.push("<div class='sel-year-month'>");
					_selectHtml.push("<span class='cur-month'>"+ self.showMonth[mon] +"</span>");
					_selectHtml.push("<span class='cur-year'>"+ year +"</span></div>");
					_selectHtml.push("<div class='next-month'><a></a></div>");
					_weekHtml.push("<ul>");
					_weekHtml.push("<li class='weekend'>"+ _week[0] +"</li>");
					_weekHtml.push("<li>"+ _week[1] +"</li>");
					_weekHtml.push("<li>"+ _week[2] +"</li>");
					_weekHtml.push("<li>"+ _week[3] +"</li>");
					_weekHtml.push("<li>"+ _week[4] +"</li>");
					_weekHtml.push("<li>"+ _week[5] +"</li>");
					_weekHtml.push("<li class='weekend'>"+ _week[6] +"</li>");
					_weekHtml.push("</ul>");
				dom.month.find("td").html(_selectHtml.join(''));
				dom.week.find("td").html(_weekHtml.join(''));
			 },
		 dayDraw : function(year, mon, day, firstDay){
			   var self = this,
				    config = self.config,
					dom = self.dom,
				    showMon = mon + 1,
					_week = self.weekDay,
				    _row = self.calendarRow(firstDay, year, mon),
					_monthDays = self.monthDays(year, mon),
					_dayHtml = [],
					_prevYear = year,
					_nextYear = year,
					_prevMon = mon - 1 < 0 ? 11 : (mon - 1),
					_nextMon = mon + 1 > 11 ? 0 : (mon + 1);
					_prevYear = mon - 1 < 0 ? --_prevYear : _prevYear;
					_nextYear = mon + 1 > 11 ? ++_nextYear : _nextYear;
					var _prevMonDays = self.monthDays(_prevYear, _prevMon);
			    for(var m = 0; m < 6; m ++){
						if(_row <= m){
						   _dayHtml.push("<ul class='daylist hide daylist"+ m +"'>");
						}else{
						   _dayHtml.push("<ul class='daylist daylist"+ m +"'>");
						}
				     for(var n = 0; n < 7; n++){
							if((7 * m + n) < firstDay || (7 * m + n) >= (firstDay + _monthDays)){
								//某月日历中不存在的日期(头尾)
								if((7 * m + n) < firstDay){
									_dayHtml.push("<li class='core-dark' data-date='"+ _prevYear +"/"+ (_prevMon + 1) +"/"+ (_prevMonDays - firstDay + (7 * m + n) + 1) +"'>"+ (_prevMonDays - firstDay + (7 * m + n) + 1) +"</li>");
								}else{
									_dayHtml.push("<li class='core-dark' data-date='"+ _nextYear +"/"+ (_nextMon + 1) +"/"+ ((7 * m + n) - _monthDays - firstDay + 1) +"'>"+((7 * m + n) - _monthDays - firstDay + 1)+"</li>");
								}
							}else{
								var _theDay =  7 * m + n + 1 - firstDay,
								    _dataDate = year +"/"+ showMon +"/"+ _theDay;
								if((_theDay == day)&&(((7 * m + n) % 7 == 0) || ((7 * m + n) % 7 == 6))){
									  _dayHtml.push("<li class='core todayweekend' data-date='"+ _dataDate +"'>"+ _theDay +"</li>");
								}else if((( 7 * m + n )%7 == 0) || ((7 * m + n)%7 == 6)){
									 _dayHtml.push("<li class='core weekended' data-date='"+ _dataDate +"'>"+ _theDay +"</li>");
								}else if(_theDay == day){
									 _dayHtml.push("<li class='core today' data-date='"+ _dataDate +"'>"+ _theDay +"</li>");
								}else{
									 _dayHtml.push("<li class='core' data-date='"+ _dataDate +"'>"+ _theDay +"</li>");
								}
							}
						}
					   _dayHtml.push("</ul>");
					}
					dom.day.find("td").html(_dayHtml.join(''));
			 },
		 initEvents : function(){
			     var self = this,
				     dom = self.dom,
				     doc = $(document);
				  self.el.on("focus", function(){
					     self.show();
					 });
			      dom.day.on('click', 'li', function(){
					   var me = $(this),
					       _day = me.attr('data-date') || '';
					   self.el.val(_day);  
					   self.hide();
				   });
				  doc.on("mouseup", function(e){
					   var tar = e.target;
					  !self.el.is(tar) && !dom.warp.is(tar) && dom.warp.has(tar).length == 0 && dom.warp.is(":visible") && self.hide();
					  });
				 //上下个月
				 dom.month.on('click', '.prev-month', function(){
					  self.dayDraw(year, mon, day, firstDay);
					    return false;
					 });
				 dom.month.on('click', '.next-month', function(){
					  self.dayDraw(year, mon, day, firstDay);
					    return false;
					 });
			 },
		 show : function(){
			    var self = this,
				    dom = self.dom;
				self.position();
				dom.warp.fadeIn("fast");
			 },
		 hide : function(){
			    var self = this,
				    dom = self.dom;
				dom.warp.hide();
			 },
		position : function(){
			   var self = this,
			        dom = self.dom;
			   var elOffset = self.el.offset() || {},
			       elOutheight = self.el.outerHeight();
				 dom.warp.css({
					    "top" : elOffset.top + elOutheight + 2,
						"left" : elOffset.left
					 });
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
		 showMonth : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
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
	 $('#dateInp').ztrDatePicker();
});