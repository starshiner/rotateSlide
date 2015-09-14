;(function($){
	var Carousel = function(poster){
		this.poster = poster;
		this.posterItemMain = poster.find(".poster-list");
		this.nextBtn = poster.find(".poster-next-btn");
		this.prevBtn = poster.find(".poster-prev-btn");
		this.posterItems = poster.find("li.poster-item");
		if(this.posterItems.size()%2 == 0){
			this.posterItemMain.append(this.posterItems.eq(0).clone());
			this.posterItems = this.posterItemMain.children();
		}
		this.posterFirstItem = this.posterItemMain.find('li').first();
		this.posterLastItem = this.posterItemMain.find('li').last();
		this.rotateFlag = true;

		//默认配置参数
		this.setting = {
			"width":1000,//幻灯片宽
			"height":270,//幻灯片高
			"posterWidth":800,//第一帧宽
			"posterHeight":270,//第一帧高
			"scale":0.9,
			"speed":500,
			"autoPlay":true,
			"delay":2000,
			"verticalAlign":"middle"
		};
		$.extend(this.setting,this.getSetting());
		this.setSettingValue();
		this.setPosterPos();
		var self = this;
		this.nextBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("left");
			}
		});
		this.prevBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("right");
			}
		});
		if(this.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function(){
				window.clearInterval(self.timer);
			},function(){
				self.autoPlay();
			});
		}
	};
	Carousel.prototype = {
		autoPlay : function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},self.setting.delay);
		},
		//获取人工配置参数
		getSetting : function(){
			var setting = this.poster.attr("data-setting");
			if(setting && setting != ''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		},
		//基本参数控制宽高
		setSettingValue : function(){
			this.poster.css({
				width : this.setting.width,
				height : this.setting.height
			});
			this.posterItemMain.css({
				width : this.setting.width,
				height : this.setting.height
			});
			var w = (this.setting.width - this.setting.posterWidth)/2;
			this.nextBtn.css({
				width : w,
				height:this.setting.height,
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.prevBtn.css({
				width : w,
				height:this.setting.height,
				zIndex : Math.ceil(this.posterItems.size()/2)
			});
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex : Math.floor(this.posterItems.size()/2)
			});
		},
		setVerticalAlign : function(height){
			var verticalType = this.setting.verticalAlign,
			top = 0;
			if(verticalType === 'middle'){
				top = (this.setting.height - height)/2;
			}else if(verticalType === 'top'){
				top = 0;
			}else if(verticalType === 'bottom'){
				top = this.setting.height - height;
			}else{
				top = (this.setting.height - height)/2;
			}
			return top;	
		},
		setPosterPos : function(){
			var self = this;
			var sliceItems = this.posterItems.slice(1),
			sliceSize      = sliceItems.size()/2,
			rightSlices    = sliceItems.slice(0,sliceSize),
			leftSlices    = sliceItems.slice(sliceSize),
			level          = Math.floor(this.posterItems.size()/2);
			var rw = this.setting.posterWidth;		
			var rh = this.setting.posterHeight;	
			var gap = ((this.setting.width-this.setting.posterWidth)/2)/level;
			var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
			var fixOffsetLeft = firstLeft + rw;
			rightSlices.each(function(i){
				level--;
				rw = rw*self.setting.scale;
				rh = rh*self.setting.scale;
				var j = i;
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++j),
					left:fixOffsetLeft + (++i)*gap - rw,
					// top:(self.setting.height - rh)/2
					top:self.setVerticalAlign(rh)
				});
			});
			var lw = rightSlices.last().width(),
			lh = rightSlices.last().height(),
			oloop = Math.floor(this.posterItems.size()/2);
			leftSlices.each(function(i){
				var j = i;
				$(this).css({
					zIndex:i,
					width:lw,
					height:lh,
					opacity:1/(oloop--),
					left:(i)*gap,
					top:self.setVerticalAlign(lh)
				});
				lw = lw/self.setting.scale;
				lh = lh/self.setting.scale;
			});

		},
		carouseRotate : function(dir){
			var _this_ = this;
			var zIndexArr = [];
			if(dir === 'left'){
				this.posterItems.each(function(){
					var self = $(this),
					prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
					width = prev.width(),
					height = prev.height(),
					zIndex = prev.css('zIndex'),
					opacity = prev.css('opacity'),
					left = prev.css('left'),
					top = prev.css('top');
					zIndexArr.push(zIndex);
					self.animate({
						width : width,
						height : height,
						// zIndex : zIndex,
						opacity : opacity,
						left : left,
						top : top
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}else if(dir === 'right'){
				this.posterItems.each(function(){
					var self = $(this),
					next = self.next().get(0)?self.next():_this_.posterFirstItem,
					width = next.width(),
					height = next.height(),
					zIndex = next.css('zIndex'),
					opacity = next.css('opacity'),
					left = next.css('left'),
					top = next.css('top');
					zIndexArr.push(zIndex);
					self.animate({
						width : width,
						height : height,
						// zIndex : zIndex,
						opacity : opacity,
						left : left,
						top : top
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}			
		}
	};
	Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this));
		});
	};
	window['Carousel'] = Carousel;
})(jQuery);