        
        if (typeof gsf_analytics == 'undefined') {
            gsf_analytics = {};
        }
        if (typeof gsf_init == 'undefined') {
            gsf_init = {};
        }
        
                if (typeof gsf_api == 'undefined') {
                    gsf_api = {};
                }
            
        let fb_data_processing_options = {};
        window.dataLayer = window.dataLayer || [];
        
            let gsf_page_type = '';
            
                let gsf_pinterest_page_visit = true;
                
        
        function gtag(){dataLayer.push(arguments);}
        
        var gsfCustomGenerateProductItemsIds = function (items, type = 'google') {
            var gsf_pids = [];
            for (var gsf_item_i = 0; gsf_item_i < items.length; gsf_item_i++) { 
                var gsf_item = items[gsf_item_i];
                const gsf_variant_item = gsf_item.merchandise || gsf_item.variant || gsf_item;
                var gsf_items = {product_id: gsf_variant_item.product.id,variant_id: gsf_variant_item.id,sku: gsf_variant_item.sku};
                var gsf_pid = gsfCustomGenerateProductItemsId(gsf_items,type);
                if (gsf_pid) {
                    if (type == 'google_drms') {
                        gsf_pids.push({
                            'id': gsf_pid,
                            'value': gsf_variant_item.price.amount,
                            'currency': gsf_variant_item.price.currencyCode,
                            'google_business_vertical': 'retail'
                        });
                    } else if (type == 'google_drm') {
                        gsf_pids.push({
                            'id': gsf_pid,
                            'google_business_vertical': 'retail'
                        });
                    } else {
                        gsf_pids.push(gsf_pid);
                    }
                }
            }
            return gsf_pids;
        };
            
        var gsfCustomGenerateProductItemsId = function (items, channel = 'google') {
            var bing_sku_as_product_id = '-1';
            var gsf_item_pid = 'shopify_US' + '_' + items.product_id + '_' + items.variant_id;
            if (channel == 'bing' && bing_sku_as_product_id != -1) {
                if (parseInt('-1') === 1) {
                    gsf_item_pid = items.sku;
                } else if (parseInt('-1') === 2) {
                    gsf_item_pid = items.variant_id;
                }
            } else {              
                if (parseInt('0') === 1) {
                    gsf_item_pid = items.sku;
                } else if (parseInt('0') === 2) {
                    gsf_item_pid = items.variant_id;
                } else if (parseInt('0') === 3) {
                    gsf_item_pid = items.product_id + '_' + items.variant_id;
                }
            }
            return gsf_item_pid;                   
        };
        
        var gsfGetShopCurrency = function (items) {
            var gsf_shop_currency = '';
            if (typeof items != 'undefined' && items.shop_currency != '') {
                gsf_shop_currency = items.shop_currency;
            }                
            return gsf_shop_currency;
        };
        
        var gsfCustomGetShopProductData = function (items,type) {           
            var gsf_shop_pdata = '';
            var gsf_shop_pids = [];
            for (var i = 0; i < items.length; i++) {
                var gsf_item = items[i];
                if (type == 'name' || type == 'title') {                    
                    var gsf_shop_pdata = (type == 'title') ? gsf_item.product_title : gsf_item.name;
                } else if(type == 'category') {
                    var gsf_shop_pdata = gsf_item.category;
                } else if(type == 'product_id') {
                    var gsf_shop_pdata = gsf_item.product_id || '';
                } else if(type == 'variant_id') {
                    var gsf_shop_pdata = gsf_item.variant_id || '';
                } else if(type == 'sku') {
                    var gsf_shop_pdata = gsf_item.sku || '';
                } else if(type == 'vendor') {
                    var gsf_shop_pdata = gsf_item.brand || '';
                } else if(type == 'type') {
                    var gsf_shop_pdata = gsf_item.category || '';
                } else if(type == 'variant_title') {
                    var gsf_shop_pdata = gsf_item.variant || '';
                } else if(type == 'id') {                        
                    gsf_shop_pids.push(gsf_item.variant?.product?.id || gsf_item.product.id);
                } else if(type == 'v_id') {                        
                    gsf_shop_pids.push(gsf_item.variant_id);
                }              
            } 
            return (type == 'id' || type == 'v_id') ? gsf_shop_pids : gsf_shop_pdata;             
        };
        
        function gsfGetLineItems(items, channel = 'google') {
            var gsf_product_items = [];
            for (var gsf_item_i in items) {
                var gsf_item = items[gsf_item_i];
                var gsf_product_item = {};
                const gsf_variant = gsf_item.merchandise || gsf_item.variant || gsf_item;
                const gsf_product = gsf_item.merchandise?.product || gsf_item.variant?.product || gsf_item.product;
                
                var gsf_items = {
                    product_id: gsf_product.id,
                    variant_id: gsf_variant.id,
                    sku: gsf_variant.sku
                };
    
                //checkout_started, payment_info_submitted, checkout_completed
                if (channel == 'google') {
                    var gsf_p_item_id = gsfCustomGenerateProductItemsId(gsf_items);
                    if (gsf_item.variant.product) {
                        gsf_product_item.id = gsf_p_item_id;              
                    }
                    if (gsf_item.variant.price) {
                        gsf_product_item.price = gsf_item.variant.price.amount;
                    }          
                    if (gsf_item.quantity) {
                        gsf_product_item.quantity = gsf_item.quantity;
                    }
                } else if (channel == 'bing') {
                    var gsf_p_item_id = gsfCustomGenerateProductItemsId(gsf_items, 'bing');
                    if (gsf_item.variant.product) {
                        gsf_product_item.id = gsf_p_item_id;              
                    }
                    if (gsf_item.variant.price) {
                        gsf_product_item.price = gsf_item.variant.price.amount;
                    }          
                    if (gsf_item.quantity) {
                        gsf_product_item.quantity = gsf_item.quantity;
                    }
                } else if (channel == 'pinterest') {                                        
                    if (gsf_product) {
                        gsf_product_item.product_id = gsf_product.id;              
                        gsf_product_item.product_name = gsf_product.title;              
                        gsf_product_item.product_brand = gsf_product.vendor;              
                        gsf_product_item.product_category = gsf_product.type;              
                    }                    
                    if (gsf_variant) {
                        gsf_product_item.product_variant_id = gsf_variant.id;              
                        gsf_product_item.product_variant = gsf_variant.title;
                    }
                    if (gsf_variant.price) {
                        gsf_product_item.product_price = gsf_variant.price.amount;
                    }
                    if (gsf_item.quantity) {
                        gsf_product_item.product_quantity = gsf_item.quantity;
                    }
                } else if (channel == 'google_analytics') {
                    var gsf_p_item_id = gsfCustomGenerateProductItemsId(gsf_items);                        
                    if (gsf_variant.product) {
                        gsf_product_item.item_id = gsf_p_item_id;              
                        gsf_product_item.item_name = gsf_product.title;              
                        gsf_product_item.item_brand = gsf_product.vendor;              
                        gsf_product_item.item_category = gsf_product.type;              
                    }                    
                    if (gsf_variant) {                                      
                        gsf_product_item.item_variant = gsf_variant.title;
                    }
                    if (gsf_variant.price) {
                        gsf_product_item.price = gsf_variant.price.amount;
                    }
                    if (gsf_item.quantity) {
                        gsf_product_item.quantity = gsf_item.quantity;
                    }
                }
                gsf_product_items.push(gsf_product_item);
            }
            return gsf_product_items;
        }
        

        function gsfGetItemsDiscounts(items) {
            var gsf_items_discount = [];
            for (var gsf_item_i in items) {
                var gsf_item = items[gsf_item_i];
                var gsf_item_discount = {};
                
                var gsf_discount_allocations = gsf_item.discountAllocations;
                for (var gsf_item_j in gsf_discount_allocations) {
                    var gsf_discount_allocation = gsf_discount_allocations[gsf_item_j];
                    if (gsf_discount_allocation.amount) {
                        gsf_item_discount = gsf_discount_allocation.amount;
                    }
                }
                if (Object.keys(gsf_item_discount).length > 0) {
                    gsf_items_discount.push(gsf_item_discount);
                }
            }
            return gsf_items_discount;
        }
        
        function gsfCustomConversionRecordData (event) {
            var gsf_shopify_cr_context = event.context || '';
            var gsf_shopify_cr_data = event.data || '';
            var gsf_shopify_cr_checkout = gsf_shopify_cr_data.checkout || '';
            if (gsf_shopify_cr_checkout) {
                var gsf_shopify_cr_order_id = gsf_shopify_cr_checkout.order.id || '';
                var gsf_shopify_cr_order_number = gsf_shopify_cr_checkout.number || '';
                
                var gsf_shopify_cr_total_price = gsf_shopify_cr_checkout.totalPrice || '';
                var gsf_shopify_cr_total_price_amount = gsf_shopify_cr_total_price.amount || 0;
                var gsf_shopify_cr_total_price_currency = gsf_shopify_cr_total_price.currencyCode || '';
                
                var gsf_shopify_cr_document = gsf_shopify_cr_context.document || '';
                var gsf_shopify_cr_document_location = gsf_shopify_cr_document.location || '';
                var gsf_shopify_cr_url = gsf_shopify_cr_document_location.href || '';
                    gsf_shopify_cr_url = (gsf_shopify_cr_url != '') ? gsf_shopify_cr_url : location.href;
                var gsf_shopify_cr_url = encodeURIComponent(location.href);    
                
                var conversion_track_url = 'https://conversions-gsf.simpshopifyapps.com/record-conversion?order_id=' +  gsf_shopify_cr_order_id +'&order_number=' + gsf_shopify_cr_order_number +'&order_value=' +  gsf_shopify_cr_total_price_amount + 
                    '&order_currency=' +  gsf_shopify_cr_total_price_currency + '&label=AW-11245869408/gvo8CLam5ecYEOCyufIp&url=' + gsf_shopify_cr_url +
                    '&shop=raphg27.myshopify.com&ad_id=4991782015&bing_ad_id=&bing_uet_tag_id=';
                    
                var xhttp = new XMLHttpRequest();
                    xhttp.open('GET', conversion_track_url, true);
                    xhttp.send();
            }
        }
        
        function gsfCallAWS(gsf_aws_data, gsf_aws_url) {
                let consent_granted = handleFacebookConsent(gsf_init);
                if(!consent_granted){
                    return false;
                }
            var gsf_aws_data_payload = JSON.stringify({'MessageBody': gsf_aws_data});
            fetch(gsf_aws_url, {
                method: 'PUT',
                body: gsf_aws_data_payload
            }).then(response => {
                //console.log('AWS this_responseText: ', JSON.stringify(response));
            }).catch((exception) => {
                console.log('error:', exception.message);
            });
        }
        
            function gsfCallCustomPurchase (event, fbp, fbc, shopify_sa_p) {

                let gsf_custom_purchase_log = {};

                var is_submit_subtotal = 0;
                var bing_is_submit_subtotal = 0;
                var ga4_is_submit_subtotal = 0;

                var gsf_shopify_data = event.data || '';
                var gsf_shopify_data_checkout = gsf_shopify_data.checkout || '';

                var gsf_shopify_order = gsf_shopify_data_checkout.order || '';
                var gsf_shopify_order_id = gsf_shopify_order.id || '';
                var gsf_shopify_order_customer = gsf_shopify_order.customer || '';
                var gsf_shopify_order_customer_id = gsf_shopify_order_customer.id || '';

                var gsf_shopify_total_price = gsf_shopify_data_checkout.totalPrice || '';
                var gsf_shopify_total_price_amount = gsf_google_total_price = gsf_bing_total_price = gsf_ga4_total_price = gsf_shopify_total_price.amount || 0;
                var gsf_shopify_total_price_currency = gsf_shopify_total_price.currencyCode || '';

                var gsf_shopify_subtotal_price = gsf_shopify_data_checkout.subtotalPrice || '';
                var gsf_shopify_subtotal_price_amount = gsf_shopify_subtotal_price.amount || 0;
                var gsf_shopify_subtotal_price_currency = gsf_shopify_subtotal_price.currencyCode || '';

                if (is_submit_subtotal) {
                    gsf_google_total_price = gsf_shopify_subtotal_price_amount;
                }
                if (bing_is_submit_subtotal) {
                    gsf_bing_total_price = gsf_shopify_subtotal_price_amount;
                }
                if (ga4_is_submit_subtotal) {
                    gsf_ga4_total_price = gsf_shopify_subtotal_price_amount;
                }

                var gsf_shopify_line_items = gsf_shopify_data_checkout.lineItems || '';

                var gsf_shopify_total_tax = gsf_shopify_data_checkout.totalTax || '';
                var gsf_shopify_total_tax_amount = gsf_shopify_total_tax.amount || '';

                var gsf_shopify_shipping_line = gsf_shopify_data_checkout.shippingLine || '';
                var gsf_shopify_shipping_line_price = gsf_shopify_shipping_line.price || '';
                var gsf_shopify_shipping_line_price_amount = gsf_shopify_shipping_line_price.amount || '';

                var gsf_shopify_discount_codes = gsf_shopify_data_checkout.discountApplications.map((discount) => {
                    if (1 || discount.type === 'DISCOUNT_CODE' || discount.type === 'AUTOMATIC') {
                        return discount.title;
                    }
                });
                
                var gsf_shopify_discounts = gsfGetItemsDiscounts(gsf_shopify_line_items);
                
                        var gsf_google_purchase_remarketing_event_data = {
                            'send_to': 'AW-11245869408',
                            'value': gsf_google_total_price,
                            'currency': gsf_shopify_total_price_currency,
                            'items': gsfCustomGenerateProductItemsIds(gsf_shopify_line_items, 'google_drms')
                        };
                        gtag('event', 'purchase', gsf_google_purchase_remarketing_event_data);
                            
                    var gsf_google_purchase_event_data = {
                        'send_to': 'AW-11245869408/gvo8CLam5ecYEOCyufIp',
                        'value': gsf_google_total_price,
                        'currency': gsf_shopify_total_price_currency,
                        'transaction_id': gsf_shopify_order_id,
                        //'discount': gsf_shopify_discount_amount,    
                        'items': gsfGetLineItems(gsf_shopify_line_items),
                        'aw_merchant_id': '199550582',
                        'aw_feed_country': 'US',
                        'aw_feed_language': 'en',
                    };
                    if (gsf_shopify_discounts.length > 0 && typeof gsf_shopify_discounts[0] != 'undefined' && gsf_shopify_discounts[0]) {
                        gsf_google_purchase_event_data.discount = gsf_shopify_discounts[0].amount;
                    }
                    
                        if (shopify_sa_p != '') {
                            function gsfGetParameterByName(name, url = window.location.href) {
                                name = name.replace(/[[]]/g, "\$&");
                                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                                    results = regex.exec(url);
                                if (!results) return null;
                                if (!results[2]) return '';
                                return decodeURIComponent(results[2].replace(/\+/g, " "));
                            }
                            var gclid = gsfGetParameterByName('gclid', decodeURIComponent((shopify_sa_p + '').replace(/\+/g, '%20')));
                            if (gclid != null) {
                                gsf_google_purchase_event_data.gclid = gclid;
                            }
                        }
                        
                    gtag('event', 'purchase', gsf_google_purchase_event_data);
                    gsf_custom_purchase_log['google_ads'] = gsf_google_purchase_event_data;
                    
                    var gsf_facebook_purchase_event_data = {
                        value: gsf_shopify_total_price_amount,
                        currency: gsf_shopify_total_price_currency,
                        content_ids: gsfCustomGetShopProductData(gsf_shopify_line_items,'id'),
                        content_type: 'product_group',
                    };
                    
                    if (fbp != '') {
                        gsf_facebook_purchase_event_data.fbp = fbp;
                    }
                    if (fbc == '') {
                        gsf_facebook_purchase_event_data.fbc = fbc;
                    }
                    
                    fbq('track', 'Purchase', gsf_facebook_purchase_event_data, {
                        eventID: gsf_shopify_order_id,
                        }
                    );
                    gsf_facebook_purchase_event_data.dpo = fb_data_processing_options; 
                    gsf_facebook_purchase_event_data.eventID = gsf_shopify_order_id;
                    gsf_custom_purchase_log['facebook'] = gsf_facebook_purchase_event_data;
                    
                    var gsf_pinterest_purchase_event_data =  {
                        value: gsf_shopify_total_price_amount,
                        currency: gsf_shopify_total_price_currency,
                        order_id: gsf_shopify_order_id,
                        line_items: gsfGetLineItems(gsf_shopify_line_items, 'pinterest'),
                    };
                    if (gsf_shopify_discount_codes.length > 0 && typeof gsf_shopify_discount_codes[0] != 'undefined' && gsf_shopify_discount_codes[0]) {
                        gsf_pinterest_purchase_event_data.promo_code = gsf_shopify_discount_codes[0];
                    }
                    pintrk('track', 'checkout', gsf_pinterest_purchase_event_data);
                    gsf_custom_purchase_log['pinterest'] = gsf_pinterest_purchase_event_data;
                    
                    if (JSON.stringify(gsf_custom_purchase_log) !== '{}') {
                        gsf_custom_purchase_log = {
                            ...gsf_custom_purchase_log,
                            shopify_store: '6a208057f42504ca15c0c9ea682de76041cc90927c8a50a3ab13bf8615b42b842b739688864efee0e3c360e30a3b762f873b4c00b1811a2375c7ff3ccb3b29c6',
                            order_id: gsf_shopify_order_id.toString(),
                            shop_domain: gsf_init.data.shop.myshopifyDomain,
                            event_data: event,
                            event_status: 'success',
                            user_agent: gsf_init.context.navigator.userAgent,
                            init_data: gsf_init
                        };
                        fetch('https://conversions-gsf.simpshopifyapps.com/store-event-logs', {
                            method: 'POST',
                            body: JSON.stringify(gsf_custom_purchase_log),
                            keepalive: true,
                        }).catch(exception => {
                            console.log('purchase_log error:', exception.message);
                        });
                    }
                    
            }
            
            function gsfCallCustomBeginCheckout (event, gsf_fbp, gsf_fbc) {
                const gsf_event_data = event?.data || '';
                const gsf_checkout_token = gsf_init.data?.cart?.id;
                
                const currency = event.data.checkout.currencyCode;
                const total_price = event.data.checkout.totalPrice?.amount;
                const product_id = event.data.checkout.lineItems.map((lineItems) => {
                    return lineItems.variant.product.id;
                });
                const variant_id = event.data.checkout.lineItems.map((lineItems) => {
                    return lineItems.variant.id;
                });
                const first_name = gsf_init.data?.customer?.firstName || event?.data?.checkout?.billingAddress?.firstName || '';
                const last_name = gsf_init.data?.customer?.lastName || event?.data?.checkout?.billingAddress?.lastName || '';
                const email = gsf_init.data?.customer?.email || event?.data?.checkout?.email || '';
                const phone = gsf_init.data?.customer?.phone || event.data.checkout.billingAddress.phone;
                const gsf_custom_customer_data = {email, phone, first_name, last_name};
                const province = event.data.checkout.billingAddress.province || event.data.checkout.shippingAddress.province;
                const city = event.data.checkout.billingAddress.city || event.data.checkout.shippingAddress.city;
                const zip = event.data.checkout.billingAddress.zip || event.data.checkout.shippingAddress.zip;
                const country = event.data.checkout.billingAddress.country || event.data.checkout.shippingAddress.country;
                const gsf_custom_customer_address_data = {province, phone, city, zip, country};
                
                var gsf_shopify_line_items = event.data.checkout.lineItems || '';
                const gsf_cart_total_quantity = gsf_init.data?.cart?.totalQuantity;
                
                var gsf_google_begin_checkout_event_data =  {
                    'send_to': 'AW-11245869408/FaN8CMWm5ecYEOCyufIp',
                    'value': total_price,
                    'currency': currency,
                };
                gtag('event', 'conversion', gsf_google_begin_checkout_event_data);
                    var gsf_facebook_initiate_checkout_args = {
                        content_type: 'product_group',
                        content_ids: product_id,
                        value: total_price,
                        currency,
                        num_items : gsf_cart_total_quantity,
                    };
                    
                    if (gsf_fbp) {
                        gsf_facebook_initiate_checkout_args.fbp = gsf_fbp;
                    }
                    if (gsf_fbc) {
                        gsf_facebook_initiate_checkout_args.fbc = gsf_fbc;
                    }
                    
                    fbq('track', 'InitiateCheckout', gsf_facebook_initiate_checkout_args );
                       
                    var gsf_pinterest_begin_checkout_event_data = {
                        currency: currency,
                        value: total_price,
                        order_quantity: gsf_cart_total_quantity,
                        lead_type: 'begincheckout',
                        line_items: gsfGetLineItems(gsf_shopify_line_items, 'pinterest'),
                    };
                    pintrk('track', 'lead', gsf_pinterest_begin_checkout_event_data);
                    
            }
            
            function gsfCallCustomAddToCart (event, gsf_fbp, gsf_fbc, gsf_checkout_token) {
            const gsf_cart_line = event?.data?.cartLine;
            
            const gsf_currency_code = gsf_cart_line?.cost?.totalAmount?.currencyCode;
            const gsf_total_price = gsf_cart_line?.cost?.totalAmount?.amount;
            
            const gsf_cart_line_merchandise = gsf_cart_line?.merchandise;
            const gsf_variant_id = gsf_cart_line_merchandise?.id;
            const gsf_variant_sku = gsf_cart_line_merchandise?.sku;
            const gsf_variant_title = gsf_cart_line_merchandise?.title;
            const gsf_variant_price_amount = gsf_cart_line_merchandise?.price?.amount;
            const gsf_variant_price_currency_code = gsf_cart_line_merchandise?.price?.currencyCode;
            const gsf_product_id = gsf_cart_line_merchandise?.product?.id;
            const gsf_product_title = gsf_cart_line_merchandise?.product?.title;
            const gsf_product_vendor = gsf_cart_line_merchandise?.product?.vendor;
            const gsf_product_type = gsf_cart_line_merchandise?.product?.type;
            const gsf_cart_total_quantity = gsf_cart_line?.quantity;

            const gsf_first_name = gsf_init.data?.customer?.firstName || '';
            const gsf_last_name = gsf_init.data?.customer?.lastName || '';
            const gsf_email = gsf_init.data?.customer?.email || '';
            const gsf_phone = gsf_init.data?.customer?.phone || ''; 
                
            const gsf_province = gsf_cart_line?.billingAddress?.province || gsf_cart_line?.shippingAddress?.province || '';
            const gsf_city = gsf_cart_line?.billingAddress?.city || gsf_cart_line?.shippingAddress?.city || '';
            const gsf_zip = gsf_cart_line?.billingAddress?.zip || gsf_cart_line?.shippingAddress?.zip || '';
            const gsf_country = gsf_cart_line?.billingAddress?.country || gsf_cart_line?.shippingAddress?.country || '';
            const gsf_custom_customer_data = {email: gsf_email, phone: gsf_phone, first_name: gsf_first_name, last_name: gsf_last_name};
            const gsf_custom_customer_address_data = {province: gsf_province, phone: gsf_phone, city: gsf_city, zip: gsf_zip, country: gsf_country};
            
            var gsf_line_items = {
                product_id: gsf_product_id,
                variant_id: gsf_variant_id,
                sku: gsf_variant_sku,
            };        
            
                var gsf_google_add_to_cart_remarketing_data = {
                    'send_to': 'AW-11245869408',
                    'value': gsf_total_price,
                    'currency': gsf_currency_code,
                    'items': gsfCustomGenerateProductItemsIds([gsf_cart_line_merchandise], 'google_drm')
                };
                gtag('event', 'add_to_cart', gsf_google_add_to_cart_remarketing_data);
                
                var gsf_google_add_to_cart_event_data = {
                    'send_to': 'AW-11245869408/UEz9CMKm5ecYEOCyufIp',
                    'value': gsf_total_price,
                    'currency': gsf_currency_code,
                };        
                gtag('event', 'conversion', gsf_google_add_to_cart_event_data);   
                
                var gsf_facebook_add_to_cart_event_data = {
                    value: gsf_total_price,
                    content_ids: gsf_product_id,
                    content_name: gsf_product_title,
                    content_type: 'product_group',
                    currency: gsf_currency_code,
                    num_items: gsf_cart_total_quantity,
                };
                
                if (gsf_fbp) {
                    gsf_facebook_add_to_cart_event_data.fbp = gsf_fbp;
                }
                if (gsf_fbc) {
                    gsf_facebook_add_to_cart_event_data.fbc = gsf_fbc;
                }
                
                fbq('track', 'AddToCart', gsf_facebook_add_to_cart_event_data );
                  
                var gsf_pinterest_add_to_cart_event_data = {
                    currency: gsf_currency_code,
                    value: gsf_total_price,
                    order_quantity: gsf_cart_total_quantity,
                    line_items: [{
                        product_id: gsf_product_id,
                        product_name: gsf_product_title,
                        product_category: gsf_product_type,
                        product_variant_id: gsf_variant_id,
                        product_variant: gsf_variant_title,   
                        product_price: gsf_variant_price_amount,
                        product_quantity: gsf_cart_total_quantity,
                        product_brand: gsf_product_vendor,
                    }],
                };
                pintrk('track', 'addtocart', gsf_pinterest_add_to_cart_event_data);
                
            }
            function gsfMakeRandomID(gsf_length) {
                var gsf_random_ID = '';
                const gsf_characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const gsf_characters_length = gsf_characters.length;
                let gsf_counter = 0;
                while (gsf_counter < gsf_length) {
                    gsf_random_ID += gsf_characters.charAt(Math.floor(Math.random() * gsf_characters_length));
                    gsf_counter += 1;
                }
                return gsf_random_ID;
            }
            
            function gsfCallCustomViewSearchResults(event) {
                
                const gsf_google_drm_items = gsfCustomGenerateProductItemsIds(event.data.searchResult.productVariants, 'google_drms');
                const gsf_google_drm_search_args = {
                    'send_to': 'AW-11245869408',
                    'items': gsf_google_drm_items
                };
                gtag('event', 'view_search_results', gsf_google_drm_search_args);
                
                    let gsf_fb_retag_search_args = {
                        search_string: event.data.searchResult.query,
                        content_type: 'product_group',
                    };
                    const gsf_fb_content_ids = gsfCustomGetShopProductData(event.data.searchResult.productVariants,'id');
                    if (gsf_fb_content_ids.length > 0) {
                        gsf_fb_retag_search_args.content_ids = gsf_fb_content_ids;
                    }
                    fbq('track', 'Search', gsf_fb_retag_search_args);
                    
                pintrk('track', 'search', {
                    search_query: event.data.searchResult.query
                });
                
            }

            function gsfCallCustomViewItemList(event) {
                
                const gsf_google_drm_items = gsfCustomGenerateProductItemsIds(event.data.collection.productVariants, 'google_drms');
                const gsf_google_drm_catalog_args = {
                    'send_to': 'AW-11245869408',
                    'items': gsf_google_drm_items
                };
                gtag('event', 'view_item_list', gsf_google_drm_catalog_args);
                
                pintrk('track', 'viewcategory');  
                
            }

            function gsfCallCustomViewItem(event, gsf_fbp, gsf_fbc) {
                const gsf_line_item = event?.data?.productVariant;

                const gsf_variant_id = gsf_line_item?.id;
                const gsf_product_id = gsf_line_item?.product?.id;
                const gsf_product_title = gsf_line_item?.product?.title;
                const gsf_product_type = gsf_line_item?.product?.type;

                const gsf_item_price = gsf_line_item?.price?.amount
                const gsf_currency_code = gsf_line_item?.price?.currencyCode
                
                const gsf_google_drm_items = gsfCustomGenerateProductItemsIds([gsf_line_item], 'google_drm');
                const gsf_google_drm_product_args = {
                    'send_to': 'AW-11245869408',
                    'value': gsf_item_price,
                    'currency': gsf_currency_code,
                    'items': gsf_google_drm_items
                };
                gtag('event', 'view_item', gsf_google_drm_product_args);
                
                
                let gsf_facebook_view_content_args = {
                    value: gsf_item_price,
                    currency: gsf_currency_code,
                    content_ids: gsf_product_id,
                    content_name : gsf_product_title,
                    content_category : gsf_product_type,
                    content_type: 'product_group',
                };gsf_facebook_view_content_args = {...gsf_facebook_view_content_args, fbp: gsf_fbp, fbc: gsf_fbc};
                fbq('track', 'ViewContent', gsf_facebook_view_content_args );
                
            }
            
            function gsfCallAllStandardEvents(event) {
                
                if (gsf_pinterest_page_visit) {
                    if (event.name == 'product_viewed') {
                        const gsf_line_item = event?.data?.productVariant;

                        const gsf_variant_id = gsf_line_item?.id;
                        const gsf_product_id = gsf_line_item?.product?.id;
                        const gsf_product_title = gsf_line_item?.product?.title;
                        const gsf_product_type = gsf_line_item?.product?.type;

                        const gsf_item_price = gsf_line_item?.price?.amount
                        const gsf_currency_code = gsf_line_item?.price?.currencyCode
                        pintrk('track', 'pagevisit', {
                            currency: gsf_currency_code,
                            value: gsf_item_price,
                            line_items: gsfGetLineItems([gsf_line_item], 'pinterest'),
                        });
                    } else {
                        pintrk('track', 'pagevisit');
                    }
                    gsf_pinterest_page_visit = false;
                }
                
            }
            
            function gsfCallCustomPageViewed(event) {
                // adding LDU parameter
                if(readCookieForLDU()){
                    fb_data_processing_options = {};
                    fb_data_processing_options.data_processing_options = 'LDU';
                    fb_data_processing_options.data_processing_options_country = 0;
                    fb_data_processing_options.data_processing_options_state = 0 ;
                    fbq('dataProcessingOptions', [fb_data_processing_options.data_processing_options], fb_data_processing_options.data_processing_options_country,fb_data_processing_options.data_processing_options_state);
                }else{
                    fbq('dataProcessingOptions', []);
                }
                fbq('init', '993513961087157', {'external_id': event.clientId});
                const gsf_timestamp = Math.floor((new Date()).getTime() / 1000);
                const gsf_fb_random_ID = gsfMakeRandomID(10);
                const gsf_facebook_event_ID = gsf_timestamp + '_' + gsf_fb_random_ID;
                fbq('track', 'PageView'  ,{}, {
                    eventID: gsf_facebook_event_ID,
                });
            }
            
        let product_added_to_cart_event_id = '';
        function gsfCustomInitTrackerJSCode () {
            let shopify_sa_p = '';
            
                let event_data = {};
                
            gsf_analytics.subscribe('all_standard_events', async (event) => {
            
                    event_data = event;
                    setTimeout(function () {
                        gsfCallAllStandardEvents(event_data)
                    });
                    
                let fbp = fbc = '';
                let gsf_checkout_token = gsf_init.data?.cart?.id;
                if (typeof gsf_browser !== 'undefined') {
                    
                        fbp = await gsf_browser.cookie.get('_fbp');
                        fbc = await gsf_browser.cookie.get('_fbc');
                        
                        const gsf_url = event.context.document.location.href;
                        if (event.name == 'page_viewed' && (gsf_url.includes('/checkouts') && gsf_url.includes('/processing'))) {
                            shopify_sa_p = await gsf_browser.cookie.get('_shopify_sa_p');
                        }
                        
                    if (typeof(gsf_checkout_token) == 'undefined' || gsf_checkout_token == '') {
                        gsf_checkout_token = await gsf_browser.cookie.get('cart');
                    }
                }
                switch (event.name) {
                    
                        case 'page_viewed':
                            gsfCallCustomPageViewed(event);
                            break;
                        
                    case 'search_submitted':
                        gsfCallCustomViewSearchResults(event);
                        break;
                    case 'collection_viewed':
                        gsfCallCustomViewItemList(event);
                        break;
                    case 'product_viewed':
                        gsfCallCustomViewItem(event, fbp, fbc);
                        break;
                    
                        case 'product_added_to_cart':
                            if (product_added_to_cart_event_id != event.id) {
                                product_added_to_cart_event_id = event.id;
                                gsfCallCustomAddToCart(event, fbp, fbc, gsf_checkout_token);
                            }
                            break;
                        
                        case 'checkout_started':
                            gsfCallCustomBeginCheckout(event, fbp, fbc);
                            break;
                        
                    case 'checkout_completed':
                        
                        gsfCallCustomPurchase(event, fbp, fbc, shopify_sa_p);
                        gsfCustomConversionRecordData(event);
                        break;
                    
                }
            
            });
        }
        function gsfCustomInitTrackerJS () {
            var gsf_is_thank_you_page = true;
            
                gsf_is_thank_you_page = true;
                 
                if (gsf_is_thank_you_page) {
                var gsf_script = document.createElement('script');
                 gsf_script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-11245869408'; 
                document.head.append(gsf_script);
                gtag('js', new Date());
                gtag('set', 'page_location', gsf_init.context.document.location.href);
                 gtag('config', 'AW-11245869408' ); 
                }
                
                if (gsf_is_thank_you_page) { 
                        !function(f,b,e,v,n,t,s) {
                        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)
                        }
                        (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                        
                }
                
                if (gsf_is_thank_you_page) {!function(e) {
                        if(!window.pintrk) {
                        window.pintrk = function () {
                        window.pintrk.queue.push(Array.prototype.slice.call(arguments))
                        };
                        var n=window.pintrk;n.queue=[],n.version='3.0';
                        var t=document.createElement('script');t.async=!0,t.src=e;
                        var r=document.getElementsByTagName('script')[0];
                        r.parentNode.insertBefore(t,r)
                        }
                    }
                    ('https://s.pinimg.com/ct/core.js');
                    pintrk('load', '2614278991939');
                    pintrk('page');
                    }
                    
        }

        function gsfCustomInitTrackerFunction () {
            gsfCustomInitTrackerJS();
            gsfCustomInitTrackerJSCode();
        }
        
        (function() {
            gsfCustomInitTrackerFunction();
        })();
         
                function loadFacebookFbqScript(global_consent_json) {
                    !function(f, b, e, v, n, t, s) {
                        if (f.fbq) return;
                        n = f.fbq = function () {
                            n.callMethod ?
                                n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                        };
                        if (!f._fbq) f._fbq = n;
                        n.push = n;
                        n.loaded = true;
                        n.version = '2.0';
                        n.queue = [];
                        t = b.createElement(e);
                        t.async = true;
                        t.src = v;
                
                        // Wait until script loads to safely call fbq
                        t.onload = function () {
                            handleFacebookConsent(global_consent_json);
                        };
                
                        s = b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t, s);
                    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                }
                // added by Ax - facebook consent mode script load - Ax 16-05-25
                function handleFacebookConsent(global_consent_json) 
                {
                            return true;
                        
                }
                function readCookieForLDU() {
                    try {
                        // Get the cookie value
                        const privacy = gsf_init?.customerPrivacy;
                        const shouldUseLDU =
                            privacy?.marketingAllowed &&
                            privacy?.analyticsProcessingAllowed &&
                            privacy?.saleOfDataAllowed === false;
                        if (shouldUseLDU) {
                            return true;
                        }
                    } catch (error) {
                        console.warn('Error reading LDU cookie:', error);
                    }
                    return false;
                }
                 
        function gsfSetCookie(name, value, minutes) {
           var cookie = name + '=' + value + ';';
           if (minutes) {
             var expires = new Date(new Date().getTime() + parseInt(minutes) * 1000 * 60);
             cookie += 'expires=' + expires.toGMTString() + ';';
           } else {
             cookie += 'expires=0;';
           }
           cookie += 'path=/;';
           document.cookie = cookie;
         }
        function gsfGetCookie(cookie_name) {
           if (document.cookie.length > 0) {
             var cookie_start = document.cookie.indexOf(cookie_name + '=');
             if (cookie_start !== -1) {
               cookie_start = cookie_start + cookie_name.length + 1;
               var cookie_end = document.cookie.indexOf(';', cookie_start);
               if (cookie_end === -1) {
                 cookie_end = document.cookie.length;
               }
               return unescape(document.cookie.substring(cookie_start, cookie_end));
             }
           }
           return '';
        }