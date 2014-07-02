/*
---------------------
Copyright © klivk.com
---------------------
*/

var STRINGS= {
	'title':chrome.i18n.getMessage("extName")
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

var TEMPLATE_MENU = '<div class="ysRandomPicker"></div>';
var TEMPLATE_PICK_RESTAURANT = '<div class="item pickRestaurant" title="'+chrome.i18n.getMessage("pickRestaurantTitle")+'"></div>';
var TEMPLATE_PICK_PRODUCT = '<div class="item pickProduct" title="'+chrome.i18n.getMessage("pickProductTitle")+'"></div>';
var TEMPLATE_START = '<div class="item start" title="'+chrome.i18n.getMessage("startMessage")+'"></div>';

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
// getRandomInteger
//
////////////////////////////////
function getRandomInteger(min,max) {

	return Math.floor(Math.random() * (max - min + 1)) + min;
	
}

////////////////////////////////
//
// pickRestaurant
//
////////////////////////////////
function pickRestaurant() {
	
	var restaurantsList = $('.restoranListe .rmd_item');
	var restaurantLinks = $('.restoranListe .rmd_item .productName a');
	
	var i;
	var min = 1; //1 instead of 0 to exclude fastPay 
	var max = restaurantLinks.length - 1;
	var restaurantIndex = Math.floor(Math.random()*(max-min+1)+min);
	
	var pickedRestaurant = $(restaurantLinks[restaurantIndex]);
	var pickedRestaurantLink = pickedRestaurant.attr('href');
	
	window.location = pickedRestaurantLink + PICK_PRODUCT_HASH;
	
	return false;
	
}