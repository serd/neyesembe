/**
 * serdar.work
 *
 */

var STRINGS = {
	TR: {
		title: chrome.i18n.getMessage("extName"),
		startMessage: 'Önce bir semt seçin.',
		pickRestaurantTitle: 'Rastgele restoran',
		pickProductTitle: 'Rastgele yemek',
        excludedCategories: [
        	'İçecekler',
        	'Içecekler',
        	'Tatlılar',
        	'Çorbalar',
        	'Yan Ürünler',
        	'Vitamin Bar',
        	'Soslar',
        	'Paket Soslar',
        	'Salatalar',
        	'Salatalar & Mezeler',
            'Diğer Lezzetler',
            'Tatlı & Dondurmalar',
            'Başlangıçlar'
        ]
	}
	,EN: {
		title: chrome.i18n.getMessage("extName"),
		startMessage: 'Pick a region to start.',
		pickRestaurantTitle: 'Random restaurant',
		pickProductTitle: 'Random food',
        excludedCategories: [
        	'İçecekler',
        	'Içecekler',
        	'Tatlılar',
        	'Çorbalar',
        	'Yan Ürünler',
        	'Vitamin Bar',
        	'Soslar',
        	'Paket Soslar',
        	'Salatalar',
        	'Salatalar & Mezeler',
            'Diğer Lezzetler',
            'Tatlı & Dondurmalar',
            'Başlangıçlar'
        ]
	}
};

var pickedProductAnchor;



var PICK_PRODUCT_HASH = '#ys-random-picker';

var pageLanguage = getPageLanguage();

var excludedCategories = STRINGS[pageLanguage]['excludedCategories'];

var TEMPLATE_MENU = '<div class="ysRandomPicker"></div>';
var TEMPLATE_PICK_RESTAURANT = '<div class="item pickRestaurant"></div>';
var TEMPLATE_PICK_PRODUCT = '<div class="item pickProduct"></div>';
var TEMPLATE_START = '<div class="item start"></div>';
var TEMPLATE_START_TOOLTIP = '<div class="ysTooltip"><div>'+STRINGS[pageLanguage].startMessage+'</div><span>▼</span></div>';

initExtension();



/**
 * initExtension
 *
 */
function initExtension() {
    
    var TEMPLATE_BUTTON = '<button class="ys-btn ys-btn-block ys-random-picker-main-button">NE YESEM?</button>';
    
    $('.ys-basket').before(TEMPLATE_BUTTON);
    
    if (onRestaurantListPage()) {
    
    	$('.ys-random-picker-main-button').on('click', function(){
            
            pickRestaurant();
    	
        });
    
    }
    else if (onProductListPage()) {
        
    	$('.ys-random-picker-main-button').on('click', function(){
    		pickProduct();
    	});
        
		//check if we need to pick a product when page loads
		if (window.location.href.indexOf(PICK_PRODUCT_HASH) != -1) {
			pickProduct();
		}
    
    }
    else {
    
        var infoTimeout;
        
    	$('.ys-random-picker-main-button').on('click', function(){
    		
            var thisButton = $(this);
            thisButton.html(STRINGS[pageLanguage].startMessage);
            clearTimeout(infoTimeout);
            infoTimeout = setTimeout(function(){
                
                thisButton.html('NE YESEM?');
            
            }, 2000);
            
    	});
    
    }   
    
}

/**
 * onRestaurantListPage
 *
 */
function onRestaurantListPage() {

	if ($('.ys-RestaurantList .ys-reslist-items').length) {
        
		return true;
	
    }
	
    return false;
	
}

/**
 * onProductListPage
 *
 */
function onProductListPage() {

	if ($('.RestaurantMenu .restaurantDetailBox').length) {
        
		return true;
	
    }
	
    return false;
	
}

/**
 * pickProduct
 *
 */
function pickProduct() {
	
    //select product group
    
    var productGroups = $('.RestaurantMenu .restaurantDetailBox');
    
    if (productGroups.length == 0) {
        
        return;
    
    }
    
    productGroupFound = false;
    
    var productGroupIndex = getRandomInteger(0, productGroups.length - 1);
    var productGroup = productGroups.eq(productGroupIndex);
    var productGroupCategory = productGroup.find('.head h2').text();
    
    
    if ($.inArray(productGroupCategory, excludedCategories) == -1) {
        
        productGroupFound = true;
    
    }
    else {
        
        var i = 0;
        var maxCount = 50;
        
        while(productGroupFound == false && i < maxCount) {

            productGroupIndex = getRandomInteger(0, productGroups.length - 1);
            productGroup = productGroups.eq(productGroupIndex);
            productGroupCategory = productGroup.find('.head h2').text();
            
            if ($.inArray(productGroupCategory, excludedCategories) == -1) {

                productGroupFound = true;

            }
            
            i++;
        
        }
        
    }
    
    // find product list
    
    var productsList = productGroups.eq(productGroupIndex).find('.listBody > ul > li');
    
    if (productsList.length == 0) {
        return;
    }
    
    //get random product
    
    var productIndex = getRandomInteger(0, productsList.length - 1);
    pickedProduct = productsList.eq(productIndex);
    pickedProductAnchor = pickedProduct.find('.table-row > .productName > a');
    
    if (pickedProductAnchor.length > 0) {
        pickedProductAnchor[0].click();
    }
	
}

/**
 * pickRestaurant
 *
 */
function pickRestaurant() {
	
	var restaurantLinks = $('.ys-reslist-items .ys-item a.restaurantName');
	
	var min = 0;
	var max = restaurantLinks.length - 1;
	var restaurantIndex = getRandomInteger(min, max);
	
	var pickedRestaurant = $(restaurantLinks[restaurantIndex]);
	var pickedRestaurantLink = pickedRestaurant.attr('href');
	
	window.location = pickedRestaurantLink + PICK_PRODUCT_HASH;
	
	return false;
	
}

/**
 * getRandomInteger
 *
 */
function getRandomInteger(min,max) {

	return Math.floor(Math.random() * (max - min + 1)) + min;
	
}

/**
 * getPageLanguage
 *
 */
function getPageLanguage() {
    
    //better to get page language instead of depending on the browser language and use extension locales
    
	if (  $('head').attr('lang').indexOf('en') != -1 ) {
		return 'EN';
	}
	return 'TR';

}