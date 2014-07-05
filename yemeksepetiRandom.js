/*
---------------------
Copyright © klivk.com
---------------------
*/

var STRINGS = {
	TR: {
		title: chrome.i18n.getMessage("extName")
		,startMessage: 'Önce bir semt seçin'
		,pickRestaurantTitle: 'Rastgele restoran'
		,pickProductTitle: 'Rastgele yemek'
	}
	,EN: {
		title: chrome.i18n.getMessage("extName")
		,startMessage: 'Pick a region to start'
		,pickRestaurantTitle: 'Random restaurant'
		,pickProductTitle: 'Random food'
	}
};

var pickedProductAnchor;

var excludedCategories = [
	'İçecekler'
	,'Içecekler'
	,'Tatlılar'
	,'Çorbalar'
	,'Yan Ürünler'
	,'Vitamin Bar'
	,'Soslar'
	,'Paket Soslar'
	,'Salatalar'
	,'Salatalar & Mezeler'
];

var PICK_PRODUCT_HASH = '#ysPickProduct';

//better to get page language instead of depending on the browser language and use extension locales
var pageLanguage = getPageLanguage();

var TEMPLATE_MENU = '<div class="ysRandomPicker"></div>';
var TEMPLATE_PICK_RESTAURANT = '<div class="item pickRestaurant"></div>';
var TEMPLATE_PICK_PRODUCT = '<div class="item pickProduct"></div>';
var TEMPLATE_START = '<div class="item start"></div>';
var TEMPLATE_START_TOOLTIP = '<div class="ysTooltip"><div>'+STRINGS[pageLanguage].startMessage+'</div><span>▼</span></div>';

initExtension();


////////////////////////////////
//
// initExtension
//
////////////////////////////////
function initExtension() {

	$('.ContentLeft').css({position:'relative'});
	$('.ContentLeft .logo').before(TEMPLATE_MENU);
	
	if ( $('.ContentLeft .logo').css('position') != 'fixed' ) {
		$('.ysRandomPicker').css({position:'static'});
	}
	
	if (onRestaurantListPage()) {
		$('.ysRandomPicker').append(TEMPLATE_PICK_RESTAURANT);
		$('.ysRandomPicker .pickRestaurant').on('click', function(){
			pickRestaurant();
		});
	}
	else if (onProductListPage()) {
		$('.ysRandomPicker').append(TEMPLATE_PICK_PRODUCT);
		$('.ysRandomPicker .pickProduct').on('click', function(){
			pickProduct();
		});
		
		//check if we need to pick a product when page loads
		if (window.location.href.indexOf(PICK_PRODUCT_HASH) != -1) {
			pickProduct();
		}
	}
	else {
		$('.ysRandomPicker').append(TEMPLATE_START);
		
		$('.ysRandomPicker').prepend(TEMPLATE_START_TOOLTIP);
		
		var tooltipTimeout = false;
		var tooltipAnimFlag = false;
		
		$('.ysRandomPicker .item.start').on('click', function(e){
			
			e.preventDefault();
			
			clearTimeout(tooltipTimeout);
			
			var tooltipBox = $('.ysRandomPicker .ysTooltip');
			
			tooltipTimeout = setTimeout(function(){
				
				tooltipBox.animate({
					marginTop: 20
					,opacity: 0
				},200);
				
				tooltipAnimFlag = false;
			},2000);
			
			if (tooltipAnimFlag) {return false;}
			tooltipAnimFlag = true;
			
			tooltipBox.css({
				marginTop: 20
				,opacity: 0
			});
			
			tooltipBox.show();
			
			tooltipBox.animate({
				marginTop: 0
				,opacity: 1
			},200);
			
			return false;
			
		});
		
	}
	
}

////////////////////////////////
//
// onRestaurantListPage
//
////////////////////////////////
function onRestaurantListPage() {

	if ($('.restoranListe').length) {
		return true;
	}
	return false;
	
}

////////////////////////////////
//
// onProductListPage
//
////////////////////////////////
function onProductListPage() {

	if ($('#restaurant-detail-head').length) {
		return true;
	}
	return false;
	
}

////////////////////////////////
//
// pickProduct
//
////////////////////////////////
function pickProduct() {
	
	var productsArray = $('.rmd_product');
	var pickedProduct;
	var productFoundFlag = false;
	
	while (productFoundFlag == false) {
	
		var productIndex = getRandomInteger(0, productsArray.length - 1);
		pickedProduct = $('.rmd_product').eq(productIndex);
		
		var productCategory = pickedProduct.closest('td').find('.rmd_header .rmd_hard').text();
		productCategory = $.trim(productCategory);
		
		if ($.inArray(productCategory, excludedCategories) == -1) {
			productFoundFlag = true;
		}
		
	}
	
	if (pickedProductAnchor) { pickedProductAnchor.removeClass('pickedProduct'); }
	pickedProductAnchor = pickedProduct.find('#AddToBasketHyperLink');
	pickedProductAnchor.addClass('pickedProduct');
	$('.pickedProduct')[0].click();
	
}

////////////////////////////////
//
// pickRestaurant
//
////////////////////////////////
function pickRestaurant() {
	
	var restaurantsList = $('.restoranListe .rmd_item');
	var restaurantLinks = $('.restoranListe .rmd_item .productName a');
	
	var min = 1; //1 instead of 0 to exclude fastPay 
	var max = restaurantLinks.length - 1;
	var restaurantIndex = getRandomInteger(min, max);
	
	var pickedRestaurant = $(restaurantLinks[restaurantIndex]);
	var pickedRestaurantLink = pickedRestaurant.attr('href');
	
	window.location = pickedRestaurantLink + PICK_PRODUCT_HASH;
	
	return false;
	
}

////////////////////////////////
//
// getRandomInteger
//
////////////////////////////////
function getRandomInteger(min,max) {

	return Math.floor(Math.random() * (max - min + 1)) + min;
	
}

////////////////////////////////
//
// getPageLanguage
//
////////////////////////////////
function getPageLanguage() {
	
	if (  $('#ctl00_ctl00_RightHeader_imgbtnLanguage').attr('src').indexOf('Default_tr-TR') == -1 ) {
		return 'EN';
	}
	return 'TR';

}