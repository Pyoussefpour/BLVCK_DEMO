let curDomain = undefined;

(function findRootDomain() {
  const domain = location.hostname;
  const parts = domain.split('.');
  for (let i = 2; i <= Math.min(parts.length, 4); i++) {
    const testDomain = parts.slice(-i).join('.');
    const cookieStr = `__utest__${i}=1; domain=${testDomain}; path=/; max-age=10`;

    try {
      document.cookie = cookieStr;
      if (document.cookie.includes(`__utest__${i}=1`)) {
        document.cookie = `__utest__${i}=; domain=${testDomain}; path=/; max-age=0`;
        curDomain = testDomain;
        return
      }
    } catch (e) { }
  }
})();

const FF_RESPONSES = Object.freeze({
  FF_ERROR: -1,
  FF_NOT_SENT: 0,
  FF_FETCHING: 1,
  FF_OK: 2,
  FF_FROM_FETCH: 3,
  FF_FROM_COOKIE: 4,
  FF_MAX_RUNS: 5
});
const FXF_GATEWAY_DELAY = 100;

function ReUtils() {
  const storageKeys = {
    _GEPS: '_geps',
    _GERT: '_gert',
    _GEPE: '_gepe',
    _GEPVC: '_gepvc',
    _GEATC: '_geatc',
    _GECOS: '_gecos',
    _GESO: '_geso',
    _GESS: '_gess',
    _GEAOS: '_geaos',
    _GEPPV: '_geppv',
    _GECNTAOS: '_gecntaos'
  };

  const removeKey = (key) => {
    if (curDomain) document.cookie = key + `=;max-age=0;secure;domain=${curDomain};samesite=strict;path=/`;
    // backward support for cookies set without domain
    document.cookie = key + "=;max-age=0;secure;samesite=strict;path=/";
    if (this.has_ls) localStorage.removeItem(key);
  };

  const cleanup = () => Object.keys(storageKeys).forEach(key => removeKey(storageKeys[key]));

  this.handleTrackingEvent = (eventName, event) => {
    if (event.customData.data.label === this.label) {
      this.hasOptout = eventName === "doNotTrack";
      this.store_key(this.OPTOUT_OPTIN_KEY, this.hasOptout ? this.OPTOUT_VALUE : this.OPTIN_VALUE, 60 * 60 * 24 * 365, false, true);
      (_re_utils.hasOptout) ? cleanup() : _re_utils.prep_service();
    } else if (this.do_debug) {
      this.log_error('Invalid script id.');
    }
  };

  this.OPTOUT_OPTIN_KEY = '_EventConsentStatusGE';
  this.OPTOUT_VALUE = 'Optout';
  this.OPTIN_VALUE = 'Optin';
  this.initialize = true;
  this.valid_script = false;
  this.valid_account = false;
  this.valid_domain = false;
  this.limited_ua = false;
  this.has_valid_id = false;
  this.ver = '';
  this.has_ls = false;
  this.do_debug = false;
  this.has_console = (window.console && console.error);
  this.script_url = document.currentScript.src.toLowerCase();
  this.userID = null;
  this.fetch_tries = 0;
  this.suppress_checkout_email = false;
  this.isKlaviyoIdentified = false;

  this.label = "5N0H7K0";
  this.script_number = "u_1.13";

  // Feature set enabled or disabled settings
  this.disable_net_new = true;
  this.include_reclaim = true;
  this.allow_collection_with_fxf = false;
  this.include_pv = true;
  this.include_cv = true;
  this.include_atc = true;
  this.include_checkout = true;
  this.include_orders = true;
  this.include_aos = false;
  this.checkKlaviyoIdentified = false;
  this.suppress_on_email = true;
  this.auto_trigger_collection_after_time = null;
  this.auto_trigger_collection_after_pageviews = 1;
  this.suppress_on_url = ['account/register'];
  this.suppress_on_params = [];
  this.exclude_collection_on_urls = [];
  this.domains = ['blvck.com'];
  this.disable_events = false;
  this.hig_settings = 'None';

  if (this.checkKlaviyoIdentified) {
    if (window.klaviyo) {
      window.klaviyo.isIdentified((r) => { if (r) this.isKlaviyoIdentified = r })
    }
    if (window.klOnsite && !!window.klOnsite?.user?.email) {
      this.isKlaviyoIdentified = true;
    }
    if (window._learnq && window._learnq.some(event => event[0] === 'identify')) {
      this.isKlaviyoIdentified = true;
    }
  }

  this.hasOptout = (() => {
    const self = this;
    try {
      const value = localStorage.getItem(self.OPTOUT_OPTIN_KEY);
      return value === self.OPTOUT_VALUE;
    } catch {
      return document.cookie.split('; ').some(cookie => {
        const [cookieKey, cookieValue] = cookie.split('=');
        return cookieKey === self.OPTOUT_OPTIN_KEY && cookieValue === self.OPTOUT_VALUE;
      })
    }
  })();

  // URLs for the API Gateway
  this.sourl = "vxdq9yx2sd";
  this.liurl = "ckjjzdn8vk";
  this.evurl = "s3shglasfi";
  this.supurl = "uqmscnlvii";

  this.cookieOptionsTemplate = {
    key: "",
    value: null,
    age: 1,
    btao_key: false,
    load_to_local_storage: false
  };
}

ReUtils.prototype.prep_service = function () {
  try { this.ver = geq.SNIPPET_VERSION; } catch { }

  if (location.href.includes("v2_upgrade=true")) {
    this.store_key("_gev2", this.label, 60, true, false);
    return;
  }
  _re_utils.validate_script();
  _re_utils.check_local_storage();
  _re_utils.fetch_keys();
  _re_utils.update_debugger();
  _re_utils.active_on_site();
}

ReUtils.prototype.validate_script = function () {
  if (!this.script_url.startsWith("https://s3-us-west-2.amazonaws.com/jsstore/a/")
    && !this.script_url.startsWith("https://da1bbbz2bvais.cloudfront.net/a/")
    && !this.script_url.includes("//cdn.shopify.com/proxy/")) {
    this.valid_script = false;
  } else {
    this.valid_script = true;
  }

  if (navigator.cookieEnabled) {
  } else {
    // JS is disabled - don't bother sending anything.
    this.valid_script = false;
  }

  // Check if Global Privacy Control (GPC) is defined
  try {
    if (typeof navigator.globalPrivacyControl !== 'undefined') {
      switch (navigator.globalPrivacyControl) {
        case "1":
        case true:
          // The user has opted out; mark the script as invalid
          this.valid_script = false;
          break;
        default:
          // User has not opted out; proceed normally
          break;
      }
    }
  } catch (e) { }


  this.limited_ua = false;

  var ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
  if ((ua.indexOf("googlebot") > -1) || (ua.indexOf("bingbot") > -1) || (ua.indexOf("msnbot") > -1) || (ua.indexOf("yandex") > -1)) {
    this.valid_script = false;
  } else if (ua.indexOf("instagram") > -1 || ua.indexOf("facebookexternalhit") > -1) {
    this.limited_ua = true;
  }

  var account_id_script = this.script_url.match(/jsstore\/a\/(.*?)\//);
  if (account_id_script && account_id_script[1] === this.label.toLowerCase()) {
    this.valid_account = true;
  }

  if (this.domains.length > 0) {
    for (var i = 0; i < this.domains.length; i++) {
      var domain = this.domains[i];
      if (location.host.includes(domain)) {
        this.valid_domain = true;
      }
    }
  }

  if (location.href.includes("vge=true")) {
    this.do_debug = true;
    _re_utils.log_message("The Script set to debugging mode .....");
  }
}

ReUtils.prototype.process_triggers = function () {
  try {
    // Suppress if we know the user is coming from an email.
    if (this.suppress_on_email) {
      if (location.search.toLowerCase().includes('utm_medium=email')) {
        _re_utils.suppress({ customData: { data: { strategy: 'email_utm_setting' } } });
        return;
      }
    }

    // Suppress if the url has a specific path - set in the app
    if (this.suppress_on_url.length > 0) {
      for (var i = 0; i < this.suppress_on_url.length; i++) {
        var url_comp = this.suppress_on_url[i].toLowerCase();
        if (location.pathname.toLowerCase().includes(url_comp)) {
          _re_utils.suppress({ customData: { data: { strategy: 'url_setting' } } });
          return;
        }
      }
    }

    // Suppress if the url has a specific param - set in the app
    if (this.suppress_on_params.length > 0) {
      for (var i = 0; i < this.suppress_on_params.length; i++) {
        var param_comp = this.suppress_on_params[i].toLowerCase();
        if (location.search.toLowerCase().includes(param_comp)) {
          _re_utils.suppress({ customData: { data: { strategy: 'utm_param_setting' } } });
          return;
        }
      }
    }

    // Auto trigger collection after time or pageviews
    if (this.canCollectOnUrl() && this.auto_trigger_collection_after_time !== null && this.auto_trigger_collection_after_time > 0) {
      setTimeout(function () { _re_utils.page(); }, this.auto_trigger_collection_after_time * 1000);
    }

    if (this.canCollectOnUrl() && this.auto_trigger_collection_after_pageviews !== null && this.auto_trigger_collection_after_pageviews > 0) {
      if (this.auto_trigger_collection_after_pageviews === 1) {
        setTimeout(function () { _re_utils.page(); }, 200);
      } else {
        var pv = this.process_key("_geppv");
        if (pv !== undefined) {
          pv = parseInt(pv) + 1;
          this.store_key("_geppv", pv, 60 * 60);
          if (pv >= this.auto_trigger_collection_after_pageviews) {
            setTimeout(function () { _re_utils.page(); }, 200);
          }
        } else {
          this.store_key("_geppv", 1, 60 * 60);
        }
      }
    }

    // Check if this is a /collections/ page
    if (location.pathname.toLowerCase().includes("/collections/")) {
      _re_utils.shopify_cv();
    }

  } catch { }
}

ReUtils.prototype.check_local_storage = function () {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('re_feature_test', 'yes');
      if (localStorage.getItem('re_feature_test') === 'yes') {
        localStorage.removeItem('re_feature_test');
        this.has_ls = true;
      }
    }
  } catch (e) { }
}

ReUtils.prototype.store_key = function (key, value, age, btao_key, load_to_local_storage) {
  if (btao_key) value = btoa(value);
  this.deleteCookie(key);
  document.cookie = `${key}=${value};max-age=${age};${curDomain ? `domain=${curDomain};` : ''}secure;samesite=strict;path=/`;
  if (load_to_local_storage && this.has_ls) {
    localStorage.setItem(key, value);
  }
}

ReUtils.prototype.createCookieOptions = function (overrides) {
  return Object.assign({}, this.cookieOptionsTemplate, overrides);
};

ReUtils.prototype.process_key = function (key) {
  let value = null;

  if (this.has_ls) {
    value = localStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  }
  return document.cookie.split("; ").find((row) => row.startsWith(key + '='))?.split("=")[1];
}

ReUtils.prototype.updateCookie = function (key, value, age) {
  if (!key) return;

  this.deleteCookie(key);
  this.store_key(key, value.toString(), age);
};

ReUtils.prototype.deleteCookie = function (cookieName) {
  if (curDomain) document.cookie = cookieName + `=;max-age=0;secure;domain=${curDomain};samesite=strict;path=/`;
  // backward support for cookies set without domain
  document.cookie = cookieName + "=;max-age=0;secure;samesite=strict;path=/";
  if (this.has_ls) localStorage.removeItem(cookieName);
}

ReUtils.prototype.fetch_keys = function () {
  this.has_alt_id = false;
  this.uuid = _re_utils.process_key("_geuid");
  this.userID = _re_utils.process_key("_gepi");
  this.re_md5 = _re_utils.process_key("_geli");
  this.re_sha2 = _re_utils.process_key("_gelisha");
  this.re_td = _re_utils.process_key("_getd");
  this.re_ff = _re_utils.process_key("_geff");
  this.kx = _re_utils.process_key("_gekx");
  this.xp = _re_utils.get_xp();
  this.kf = _re_utils.process_key("_gekf");
  this.rt = _re_utils.process_key("_gert");
  this.fbp = _re_utils.process_key("_fbp");
  this.fbc = _re_utils.process_key("_fbc");
  this.ttp = _re_utils.process_key("_ttp");
  this.twclid = _re_utils.process_key("twclid");
  this.li_sugr = _re_utils.process_key("li_sugr");
  this.rdt_uuid = _re_utils.process_key("rdt_uuid");
  this.sc_cookie1 = _re_utils.process_key("sc_cookie1");
  this.epik = _re_utils.process_key("epik");
  this.derived_epik = _re_utils.process_key("_derived_epik");
  this.ga_client_id = _re_utils.process_key("_ga");
  this.referrer = _re_utils.process_key("_geref");
  this.id_rs = _re_utils.process_key("_gers");
  this.id_rs_alt = _re_utils.process_key("_getdran");
  this.ff_response = parseInt(_re_utils.process_key("_geffresponse")) || (this.re_ff ? FF_RESPONSES.FF_FROM_COOKIE : FF_RESPONSES.FF_NOT_SENT);
  this.id_script_number = _re_utils.process_key("_reidsn");
  let do_debug = _re_utils.process_key("_gedebug");

  if (do_debug !== undefined) this.do_debug = true;

  // If any of the cookies are set - we have a valid ID.
  if ((this.re_md5 !== undefined && this.re_md5 !== '')
    || (this.kx !== undefined && this.kx !== '')
    || (this.xp !== undefined && this.xp !== '')
    || (this.kf !== undefined && this.kf !== '')
    || (this.rt !== undefined && this.rt !== '')
    || (this.re_td !== undefined && this.re_td !== '')
    || (this.re_ff !== undefined && this.re_ff !== '')) {
    this.has_valid_id = true;
  }

  if ((this.re_md5 !== undefined && this.re_md5 !== '')
    || (this.kf !== undefined && this.kf !== '')
    || (this.rt !== undefined && this.rt !== '')
    || (this.re_td !== undefined && this.re_td !== '')
    || (this.re_ff !== undefined && this.re_ff !== '')) {
    this.has_valid_id_for_order_event = true;
  }

  if ((this.kx !== undefined && this.kx !== '') || (this.xp !== undefined && this.xp !== '') || (this.kf !== undefined && this.kf !== '') || (this.rt !== undefined && this.rt !== '')) {
    this.has_alt_id = true;
  }
}

ReUtils.prototype.shopify_cv = function (event) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message(`Optout true, Viewed Category Reclaim event not sent.`);
    return;
  };
  let url = location.href;
  url = url.replace(/\/[^\/]+?\/[^\/]+?\/sandbox\/modern/, "");
  url = url.replace(/wpm@\w+\//, "");

  // Clean up the page title/category name
  let page_title = url.split('?')[0];
  page_title = page_title.split("/").at(-1);
  page_title = _re_utils.title_case(page_title)

  var event_obj = {
    url: url,
    name: page_title
  }

  //Add custom details for HIG
  if(!this.has_alt_id && this.hig_settings === 'All Contacts'){
    event_obj.hig = true;
    event_obj.hig_source = 'CVR';
  }

  _re_utils.event('Viewed Category Reclaim', event_obj, '_gepvc', this.include_cv && this.include_reclaim, this.evurl, 'ev', null);
}

ReUtils.prototype.shopify_vp = function (event) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message(`Optout true, Viewed Product Reclaim event not sent.`);
    return;
  };
  if (!event || !event.data || !event.data.productVariant || !event.data.productVariant.product.id ||
    event.data.productVariant.product.id === 'undefined')
    return;

  var event_obj = {
    product_id: event.data.productVariant.product.id,
    name: event.data.productVariant.product.title,
    price: event.data.productVariant.price.amount,
    currency: event.data.productVariant.price.currencyCode,
    variant_id: event.data.productVariant.id,
    variant: event.data.productVariant.title,
    url: event.context.window.location.href
  };

  // Add the item category if it is defined by Shopify
  if (event.data.productVariant.product.type) {
    event_obj.item_category = event.data.productVariant.product.type;
  }

  if (event.data.productVariant.image && event.data.productVariant.image.src) {
    event_obj.image_url = normalizeImageURL(event.data.productVariant.image.src);
  }

  //Add custom details for HIG
  if(!this.has_alt_id && this.hig_settings === 'All Contacts'){
    event_obj.hig = true;
    event_obj.hig_source ='VPR';
  }

  _re_utils.event('Viewed Product Reclaim', event_obj, '_gepe', this.include_pv && this.include_reclaim, this.evurl, 'ev', event.id);
}

ReUtils.prototype.shopify_atc = function (event) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message(`Optout true, Add To Cart Reclaim event not sent.`);
    return;
  };

  if (!event) return;

  if (!event.data && event.customData && event.customData.data) {
    event.data = event.customData.data;
    event.data.internalTrigger = 'custom';
  }

  if (!event.data || !event.data.cartLine || !event.data.cartLine.merchandise.product ||
    !event.data.cartLine.merchandise.product.id || event.data.cartLine.merchandise.product.id === 'undefined') return;

  if (!event.data.cartLine.merchandise.product || !event.data.cartLine.merchandise.product.id) return;

  let event_obj = {
    product_id: event.data.cartLine.merchandise.product.id,
    name: event.data.cartLine.merchandise.product.title,
    price: event.data.cartLine.merchandise.price.amount,
    currency: event.data.cartLine.merchandise.price.currencyCode,
    variant_id: event.data.cartLine.merchandise.id,
    variant: event.data.cartLine.merchandise.title,
    quantity: event.data.cartLine.quantity,
    url: event.context.window.location.href
  };

  if (event.data.internalTrigger) { event_obj.internalTrigger = event.data.internalTrigger; }

  // Add the item category if it is defined by Shopify
  if (event.data.cartLine.merchandise.product.type) {
    event_obj.item_category = event.data.cartLine.merchandise.product.type;
  }

  if (event.data.cartLine.merchandise.image && event.data.cartLine.merchandise.image.src) {
    event_obj.image_url = normalizeImageURL(event.data.cartLine.merchandise.image.src);
  }

  //Add custom details for HIG
  if(!this.has_alt_id && this.hig_settings === 'All Contacts'){
    event_obj.hig = true;
    event_obj.hig_source ='ATCR';
  }

  _re_utils.event('Add To Cart Reclaim', event_obj, '_geatc', this.include_atc && this.include_reclaim, this.sourl, 'so', event.id);
}

function normalizeImageURL(url) {
  if (url) {
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
  }
  return url;
}

ReUtils.prototype.shopify_checkout_started = function (event) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message(`Optout true, Checkout Started Reclaim event not sent.`);
    return;
  };
  if (!event || !event.data || !event.data.checkout)
    return;

  if (_re_utils.is_valid_email(event.data.checkout.email)) {
    this.has_alt_id = true;
    this.suppress_checkout_email = true;
    this.rt = btoa(event.data.checkout.email.toLowerCase());
    _re_utils.store_key("_gert", event.data.checkout.email.toLowerCase(), 60 * 60 * 24 * 365, true, true);
    _re_utils.suppress({ customData: { data: { strategy: 'checkout_event' } } });
  }

  let new_line_items = [];
  let line_items = JSON.parse(JSON.stringify(event.data.checkout.lineItems));

  // We want to reformat the object a little.
  if (line_items) {
    for (let i = 0; i < line_items.length; i++) {
      new_line_items[i] = {};
      new_line_items[i].quantity = line_items[i].quantity;
      new_line_items[i].line_price = line_items[i].quantity * line_items[i].variant.price.amount;
      new_line_items[i].product = line_items[i].variant.product;
      new_line_items[i].product.handle = line_items[i].variant.product.url.replace('/products/', '');
      new_line_items[i].product.price = line_items[i].variant.price;
      new_line_items[i].product.variant = line_items[i].variant;
      delete new_line_items[i].product.variant.product;

      let img = line_items[i].variant.image;
      if (img && Object.keys(img).length > 0 && img.src) {
        img = img.src;
        img = img.replace(/_\d{0,4}x\d{0,4}\./, '.')
        new_line_items[i].product.images = [{}];
        new_line_items[i].product.images[0].src = img;
        new_line_items[i].product.images[0].thumb_src = img.replace(/\.([^.]*)$/, '_x240' + '.$1');
      }
    }
  }

  let event_obj = {
    cart_id: event.data.checkout.token,
    cart_amount: event.data.checkout.totalPrice.amount,
    currency: event.data.checkout.totalPrice.currencyCode,
    extra: { line_items: new_line_items, checkout_url: event.context.document.location.href }
  };

  //Add custom details for HIG
  if(!this.has_alt_id && this.hig_settings === 'All Contacts'){
    event_obj.hig = true;
    event_obj.hig_source ='CSR';
  }
  _re_utils.event('Checkout Started Reclaim', event_obj, '_gecos', this.include_checkout && this.include_reclaim, this.evurl, 'ev', event.id);
}

ReUtils.prototype.shopify_order = function (event) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message(`Optout true, Placed Order event not sent.`);
    return;
  };
  if (!event || !event.data || !event.data.checkout || !event.data.checkout.order ||
    !event.data.checkout.order.id || event.data.checkout.order.id === 'undefined')
    return;

  if (_re_utils.is_valid_email(event.data.checkout.email)) {
    this.rt = btoa(event.data.checkout.email.toLowerCase());
    _re_utils.store_key("_gert", event.data.checkout.email.toLowerCase(), 60 * 60 * 24 * 365, true, true);
  }

  var event_obj = {
    order_id: event.data.checkout.order.id.replace("gid://shopify/OrderIdentity/", ""),
    order_email: event.data.checkout.email.toLowerCase(),
    order_amount: event.data.checkout.totalPrice.amount,
    currency: event.data.checkout.totalPrice.currencyCode
  };

  _re_utils.event('Placed Order', event_obj, '_geso', this.include_orders, this.sourl, 'so', event.id);
}

ReUtils.prototype.active_on_site = function (event) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message('Optout true, Active on Site Reclaim not sent.');
    this.do_debug && this.update_debugger('Active on Site Reclaim', {});
    return;
  };
  if (!this.include_aos) return;

  if (this.isKlaviyoIdentified) {
    this.do_debug && this.log_message('Visitor known to Klaviyo, Active on Site event not sent.');
    return;
  }

  const eventKey = "_geaos";
  const countCookieKey = "_gecntaos";
  const eventCookie = this.process_key(eventKey);

  // If the event cookie is present and not expired, do not send the event
  if (!this.do_debug && !!eventCookie) return;

  let visits = parseInt(this.process_key(countCookieKey)) || 0;
  visits++;

  if (this.do_debug) {
    this.update_debugger('Active on Site Reclaim', {});
    this.log_message("Sending 'Active on Site Reclaim' event for visit number: " + visits);
    return;
  }

  // Update cookie with visit count with a longer expiration time
  this.updateCookie(countCookieKey, visits, 60 * 60 * 24 * 365);

  // Store/update cookie with visit count
  const cookieDuration = 60 * 30;
  const event_obj = this.build_active_on_site_payload(visits);

  //Add custom details
  if (event && event.customData && event.customData.data && event.customData.data['HIG']) event_obj.hig = true;
  if (event && event.customData && event.customData.data && event.customData.data['HIG Source']) event_obj.hig_source = event.customData.data['HIG Source'];

  this.event('Active on Site Reclaim', event_obj, eventKey, this.include_aos && this.include_reclaim, this.evurl, 'ev', null, cookieDuration);
};

ReUtils.prototype.build_active_on_site_payload = function (visits) {
  // Check if navigator.userAgentData is available
  const browserInfo = this.getBrowserInfo();

  let url = window.location.href

  url = url.replace(/\/[^\/]+?\/[^\/]+?\/sandbox\/modern/, "");
  url = url.replace(/wpm@\w+\//, "");

  // Construct the event object
  return {
    page: url,
    page_title: document.title,
    domain: window.location.hostname,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    browser: browserInfo.browser,
    browser_version: browserInfo.version,
    mobile: browserInfo.mobile,
    platform: browserInfo.platform,
    visits: parseInt(visits) || 1
  };
};

ReUtils.prototype.getBrowserInfo = function () {
  if (navigator.userAgentData && navigator.userAgentData.brands) {
    // For modern browsers supporting navigator.userAgentData
    let brand = navigator.userAgentData.brands.find(b => b.brand);
    return {
      browser: brand ? brand.brand : 'Unknown',
      version: brand ? brand.version : 'Unknown',
      mobile: navigator.userAgentData.mobile,
      platform: navigator.userAgentData.platform
    };
  } else {
    // Fallback for older browsers using userAgent string
    let userAgent = navigator.userAgent;
    let tmpBrowser = 'Unknown';
    let tmpVersion = 'Unknown';
    let mobile = /Mobi|Android/i.test(userAgent);

    if (userAgent.indexOf("Chrome") > -1) {
      tmpBrowser = "Chrome";
      tmpVersion = userAgent.substring(userAgent.indexOf("Chrome") + 7).split(" ")[0];
    } else if (userAgent.indexOf("Firefox") > -1) {
      tmpBrowser = "Firefox";
      tmpVersion = userAgent.substring(userAgent.indexOf("Firefox") + 8);
    }

    return {
      browser: tmpBrowser,
      version: tmpVersion,
      mobile: mobile,
      platform: navigator.platform
    };
  }
};

ReUtils.prototype.event = function (eventName, event_obj, cName, event_enabled, gateway_url, gateway_endpoint, event_id, cookieDuration = (60 * 4)) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message(`Optout true, ${eventName} not sent.`);
    this.do_debug && _re_utils.update_debugger(eventName, event_obj);
    return;
  };
  if (!this.valid_script || !this.valid_account || !this.valid_domain || !event_enabled) {
    return;
  }

  if ((eventName === undefined || eventName === "") || (event_obj === undefined || event_obj === "" || Object.keys(event_obj).length === 0)) {
    _re_utils.log_error("The Script - invalid object or event name.");
    return;
  }

  if (this.do_debug) {
    _re_utils.update_debugger(eventName, event_obj);
  } else {
    if (document.cookie.indexOf(cName + "=") >= 0) return;
    _re_utils.fetch_keys();

    const noValidIdForEvent = (eventName === 'Placed Order')
      ? !this.has_valid_id_for_order_event
      : !this.has_valid_id;
    if (noValidIdForEvent && (this.id_rs === undefined || this.id_rs_alt === undefined || this.ff_response == FF_RESPONSES.FF_FETCHING || this.ff_response == FF_RESPONSES.FF_NOT_SENT) && this.fetch_tries < 15) {
      this.fetch_tries++;
      setTimeout(() => { _re_utils.event(eventName, event_obj, cName, event_enabled, gateway_url, gateway_endpoint, event_id, cookieDuration); }, 100 * this.fetch_tries);
    }

    if (this.fetch_tries >= 15 && this.has_console && this.do_debug) {
      console.log("Max runs reached for event.");
    }

    if (noValidIdForEvent) return;

    if (this.userID && this.userID !== 'undefined') {
      event_obj.user_id = this.userID;
    }

    let ge_event = _re_utils.append_keys(event_obj, eventName, event_id);

    let cookieOptions = _re_utils.createCookieOptions({
      // Set to a 4 minute cookie or from the function call if provided (in seconds)
      key: cName, value: true, age: cookieDuration
    });

    // Check for re_ff and ff_response before calling send_to_gateway with a delay
    if (!this.re_ff && (this.ff_response == FF_RESPONSES.FF_FETCHING || this.ff_response == FF_RESPONSES.FF_NOT_SENT)) {
      setTimeout(() => {
        this.re_ff = _re_utils.process_key("_geff");
        if (this.re_ff) ge_event.account_data.ff_md5 = atob(this.re_ff);

        this.ff_response = parseInt(_re_utils.process_key("_geffresponse")) || this.ff_response || (this.re_ff ? FF_RESPONSES.FF_FROM_COOKIE : FF_RESPONSES.FF_NOT_SENT);
        ge_event.extra_data.ff_response = this.ff_response;

        _re_utils.send_to_gateway(ge_event, gateway_url, gateway_endpoint, cookieOptions);
      }, FXF_GATEWAY_DELAY);
    } else {
      _re_utils.send_to_gateway(ge_event, gateway_url, gateway_endpoint, cookieOptions);
    }
  }
};

ReUtils.prototype.suppress = function (event = {}) {
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    this.do_debug && this.log_message('Optout true, Suppression not sent.');
    this.do_debug && _re_utils.update_debugger('Suppression', event);
    return;
  };
  if (!this.valid_script || !this.valid_account || !this.valid_domain) {
    return;
  }

  if (this.do_debug) {
    _re_utils.update_debugger('Suppression', event);
  } else {

    if (this.disable_net_new) { return; }

    if (document.cookie.indexOf("_gess=") >= 0) return;

    _re_utils.fetch_keys();

    if (this.re_md5 === undefined &&
      this.re_td === undefined &&
      (this.id_rs === undefined || this.id_rs_alt === undefined) &&
      this.fetch_tries < 15) {
      this.fetch_tries++;
      setTimeout(() => { _re_utils.suppress(event); }, 100 * this.fetch_tries);
      return;
    }

    if (this.fetch_tries >= 15 && this.has_console && this.do_debug) {
      console.log("Max runs reached for suppression.");
    }

    if (!this.kf && !this.re_md5 && !this.re_td) return;

    let ge_event = _re_utils.append_keys(event, 'suppression', null);
    let cookieOptions = _re_utils.createCookieOptions({
      key: "_gess", value: true, age: 60 * 60 * 24 * 180
    });

    if (this.limited_ua && !this.kf) return;

    // Check for re_ff and ff_response before calling send_to_gateway with a delay
    if (!this.re_ff && (this.ff_response == FF_RESPONSES.FF_FETCHING || this.ff_response == FF_RESPONSES.FF_NOT_SENT)) {
      setTimeout(() => {
        this.re_ff = _re_utils.process_key("_geff");
        this.ff_response = parseInt(_re_utils.process_key("_geffresponse")) || this.ff_response || (this.re_ff ? FF_RESPONSES.FF_FROM_COOKIE : FF_RESPONSES.FF_NOT_SENT);

        if (this.re_ff) ge_event.account_data.ff_md5 = atob(this.re_ff);
        ge_event.extra_data.ff_response = this.ff_response;

        _re_utils.send_to_gateway(ge_event, this.supurl, 'suppression', cookieOptions);
      }, FXF_GATEWAY_DELAY);
    } else {
      _re_utils.send_to_gateway(ge_event, this.supurl, 'suppression', cookieOptions);
    }
  }
};

ReUtils.prototype.page = function (source) {
  if (!this.canCollectOnUrl()) return;
  if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
    _re_utils.update_debugger('Collection', {});
    this.do_debug && this.log_message('Optout true, Collection not sent.');
    return;
  };
  if (!this.valid_script || !this.valid_account || !this.valid_domain) {
    return;
  }

  if (this.limited_ua) { return; }

  if (this.do_debug) {
    _re_utils.update_debugger('Collection', {});
  } else {

    if (this.disable_net_new) { return; }

    if (document.cookie.indexOf("_geps=") >= 0) return;

    _re_utils.fetch_keys();
    if (this.has_alt_id) return;

    if (this.re_md5 === undefined && this.re_td === undefined && (this.re_ff === undefined || !this.allow_collection_with_fxf) &&
      (this.id_rs === undefined || this.id_rs_alt === undefined) &&
      this.fetch_tries < 15) {
      this.fetch_tries++;
      setTimeout(() => { _re_utils.page(source); }, 100 * this.fetch_tries);
      return;
    }

    if (this.fetch_tries >= 15 && this.has_console && this.do_debug) {
      console.log("Max runs reached for page.");
    }
    // Event must have either a li or td, but it's acceptable to only have a ff if the account's allow_collection_with_fxf is set to true
    if (!this.re_md5 && !this.re_td && (!this.re_ff || (this.re_ff && !this.allow_collection_with_fxf))) return;

    let ge_event = _re_utils.append_keys({}, 'collect', null);
    ge_event.extra_data = ge_event.extra_data || {};
    if (source) {
      ge_event.extra_data.hig = true;
      ge_event.extra_data.hig_source = source;
    }

    let cookieOptions = _re_utils.createCookieOptions({
      key: "_geps", value: true, age: (60 * 60 * 24 * 180)
    });

    // by this point we have at least td or li, or ff, but if we do not have ff, check response to see if we should wait for it
    // realistically if not sent yet 100ms delay will probably not be enough
    if (!this.re_ff && (this.ff_response == FF_RESPONSES.FF_FETCHING || this.ff_response == FF_RESPONSES.FF_NOT_SENT)) {
      setTimeout(() => {
        this.re_ff = _re_utils.process_key("_geff");
        if (this.re_ff) ge_event.account_data.ff_md5 = atob(this.re_ff);

        this.ff_response = parseInt(_re_utils.process_key("_geffresponse")) || this.ff_response || (this.re_ff ? FF_RESPONSES.FF_FROM_COOKIE : FF_RESPONSES.FF_NOT_SENT);
        ge_event.extra_data.ff_response = this.ff_response;

        _re_utils.send_to_gateway(ge_event, this.liurl, 'li', cookieOptions);
      }, FXF_GATEWAY_DELAY);
    } else {
      _re_utils.send_to_gateway(ge_event, this.liurl, 'li', cookieOptions);
    }
  }
};

ReUtils.prototype.send_to_gateway = function (event_obj, url, endpoint, cookieOptions) {
  if (this.has_valid_id && !this.disable_events && !this.hasOptout) {
    let u = "https://" + url + ".execute-api.us-west-2.amazonaws.com/" + endpoint;

    let d = btoa(_re_utils.clean_string(JSON.stringify(event_obj)));

    fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: d })

    if (cookieOptions) {
      _re_utils.store_key(cookieOptions.key, cookieOptions.value, cookieOptions.age, cookieOptions.btao_key, cookieOptions.load_to_local_storage);
    }
  } else {
    if (this.do_debug) {
      this.log_message(`Event not sent! ->
        Has_valid_id: ${this.has_valid_id}
        Disable all events: ${this.disable_events}
        Opt-Out Status: ${this.process_key(this.OPTOUT_OPTIN_KEY)}
      `);
    }
  }
}

ReUtils.prototype.append_keys = function (obj, eventName, event_id) {
  let ge_obj = { account_data: {}, event_data: {}, extra_data: {} };

  ge_obj.label = this.label;
  if (eventName) ge_obj.type = eventName;

  if (this.re_md5 !== undefined) {
    ge_obj.account_data.md5 = atob(this.re_md5);
  }
  if (this.re_sha2 !== undefined) {
    ge_obj.account_data.sha256 = atob(this.re_sha2);
  }
  if (this.re_td !== undefined) {
    ge_obj.account_data.td_md5 = atob(this.re_td);
  }
  if (this.re_ff !== undefined) {
    ge_obj.account_data.ff_md5 = atob(this.re_ff);
  }
  ge_obj.account_data.kx = this.kx;
  ge_obj.account_data.kf = this.kf;
  ge_obj.account_data.rt = this.rt;
  ge_obj.account_data.xp = this.xp;
  if (eventName === 'suppression') {
    ge_obj.event_data = obj.customData?.data || {};
  } else {
    ge_obj.event_data = obj;
  }

  if (event_id !== null) ge_obj.extra_data.event_id = event_id;
  ge_obj.extra_data.xp = this.xp;
  ge_obj.extra_data.fbp = this.fbp;
  ge_obj.extra_data.fbc = this.fbc;
  ge_obj.extra_data.ttp = this._ttp;
  ge_obj.extra_data.twclid = this.twclid;
  ge_obj.extra_data.li_sugr = this.li_sugr;
  ge_obj.extra_data.rdt_uuid = this.rdt_uuid;
  ge_obj.extra_data.sc_cookie1 = this.sc_cookie1;
  ge_obj.extra_data.epik = this.epik;
  ge_obj.extra_data.derived_epik = this.derived_epik;
  ge_obj.extra_data.ga_client_id = this.ga_client_id;
  ge_obj.extra_data.guid = this.uuid;
  ge_obj.extra_data.user_id = this.userID;
  ge_obj.extra_data.version = this.ver;
  ge_obj.extra_data.script_url = this.script_url;
  ge_obj.extra_data.referrer = this.referrer;
  ge_obj.extra_data.limited_ua = this.limited_ua;
  ge_obj.extra_data.ff_response = this.ff_response;
  ge_obj.extra_data.alt_script_number = this.id_script_number;
  ge_obj.extra_data.script_number = this.script_number;
  if (document.title) ge_obj.extra_data.title = _re_utils.clean_string(document.title);

  let url = location.href;
  url = url.replace(/\/[^\/]+?\/[^\/]+?\/sandbox\/modern/, "");
  url = url.replace(/wpm@\w+\//, "");
  ge_obj.extra_data.url = url;

  return ge_obj
}

ReUtils.prototype.title_case = function (str) {
  str = str.toLowerCase().split(/[_-]+/);
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

ReUtils.prototype.clean_string = function (input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}

ReUtils.prototype.is_valid_email = function (email) {
  if (email === undefined || email === null || email === "") return false

  var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(validEmail)) {
    return false;
  }

  return true;
}

ReUtils.prototype.update_debugger = function (eventName, event_obj) {
  if (this.do_debug) {
    var debugger_info = this.valid_script + '|' + this.valid_account + '|' + this.valid_domain + '|' + (this.ver === "2.0.0");
    if (eventName !== undefined && eventName !== "") {
      debugger_info += '|' + eventName + '|' + (this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE);
      _re_utils.log_message("The Script called the event: " + eventName);
      _re_utils.log_message(event_obj)
    }
    this.store_key("_ge_debugger_data", debugger_info, 20);
  }
};

ReUtils.prototype.log_error = function (message) {
  if (this.has_console) {
    console.log(message);
  }
};

ReUtils.prototype.log_message = function (message) {
  if (this.has_console) {
    console.log(message);
  }
};

ReUtils.prototype.all_events = function (event) {
  // if (this.hasOptout || (this.hasOptout = this.process_key(this.OPTOUT_OPTIN_KEY) === this.OPTOUT_VALUE)) {
  //   return;
  // }

  if (!event) return;

  const eventName = event.customData?.name || event.name;
  if (!eventName) return;

  const mappedEventName = _re_utils.getEventMapping(eventName);

  switch (mappedEventName) {
    case "page":
      let sourceParam = event?.customData?.source;
      _re_utils.page(sourceParam);
      break;
    case "suppress":
      _re_utils.suppress(event);
      break;
    case "shopify_vp":
    case "product_viewed":
      _re_utils.shopify_vp(event);
      break;
    case "shopify_atc":
      _re_utils.shopify_atc(event);
      break;
    case "shopify_checkout_started":
    case "checkout_contact_info_submitted":
      _re_utils.shopify_checkout_started(event);
      break;
    case "shopify_order":
      _re_utils.shopify_order(event);
      break;
    case "active_on_site":
      _re_utils.active_on_site();
      break;
    case "beacon":
      _re_utils.load_beacon(event);
      break;
    case "doNotTrack":
    case "track":
      _re_utils.handleTrackingEvent(mappedEventName, event);
      break;
  }

};

ReUtils.prototype.run_pending_jobs = function (queue) {
  if (!this.valid_script || !this.valid_account || !this.valid_domain) {
    return;
  }

  if (!this.hasOptout) _re_utils.process_triggers();

  if (queue === undefined) {
    return;
  }

  if (queue && Array.isArray(queue)) {
    queue.forEach(function (item) {
      var fn = item.shift();
      var eventName = _re_utils.getEventMapping(fn) || fn; //mapped event name or original if not mapped (Backward compatibility)

      if (this.do_debug) {
        _re_utils.log_message(eventName, item);
      }
      const event = item[0];
      switch (eventName) {
        case "page":
          let sourceParam = event?.customData?.source;
          _re_utils.page(sourceParam);
          break;
        case "suppress":
          _re_utils.suppress(event);
          break;
        case "shopify_vp":
        case "product_viewed":
          _re_utils.shopify_vp(event);
          break;
        case "shopify_atc":
          _re_utils.shopify_atc(event);
          break;
        case "shopify_checkout_started":
        case "checkout_contact_info_submitted":
          _re_utils.shopify_checkout_started(event);
          break;
        case "shopify_order":
          _re_utils.shopify_order(event);
          break;
        case "active_on_site":
          _re_utils.active_on_site();
          break;
        case "beacon":
          _re_utils.load_beacon(event);
          break;
        case "all_events":
          _re_utils.all_events(event);
          break;
      }
    });
  }
};

ReUtils.prototype.getEventMapping = function (event) {
  const eventList = {
    "page_viewed_ge": "page",
    "collection_viewed": "shopify_cv",
    "suppress": "suppress",
    "suppress_email": "suppress",
    "beacon": "beacon",
    "product_viewed": "shopify_vp",
    "product_added_to_cart": "shopify_atc",
    "checkout_started": "shopify_checkout_started",
    "checkout_contact_info_submitted": "shopify_checkout_started",
    "checkout_completed": "shopify_order",
    "active_on_site": "active_on_site",
    "track": "track",
    "doNotTrack": "doNotTrack"
  };

  return eventList[event] || null;
};

ReUtils.prototype.get_xp = function () {
  const gexp = _re_utils.process_key("_gexp")
  if (gexp) {
    return gexp;
  } else {
    const _gexp = _re_utils.process_key("__kla_id");
    try {
      const key = ((gexp) => {
        if (!gexp) return null;
        try {
          return JSON.parse(atob(gexp))
        } catch {
          return null;
        }
      })(_gexp);

      if (key && key.$exchange_id) {
        _re_utils.store_key("_gexp", key.$exchange_id, 60 * 60 * 24 * 365, true, true);
        return btoa(key.$exchange_id);
      };
    } catch (e) { }
  }
};

ReUtils.prototype.canCollectOnUrl = function () {
  if (!Array.isArray(this.exclude_collection_on_urls) || this.exclude_collection_on_urls.length === 0) {
    return true;
  }

  const path = location.pathname.toLowerCase();

  for (let i = 0; i < this.exclude_collection_on_urls.length; i++) {
    const urlComp = this.exclude_collection_on_urls[i].toLowerCase();
    if (path.includes(urlComp)) {
      return false;
    }
  }

  return true;
};

ReUtils.prototype.load_beacon = function (event) {
  if (this.hasOptout) return;
  const url_host = atob("aHR0cHM6Ly9hcGkucmV0ZW50aW9uLmNvbQ==");
  const url_path = atob('L2FwaS92MS9zY3JpcHRfYmVhY29u');
  const host = event.customData.data.host;
  const pathname = event.customData.data.pathname;
  const location = event.customData.data.location;
  if (!host || !this.label) return;
  let data = `host=${host}&location=${location}&a_id=${this.label}`;
  if (this.script_url) {
    data += "&sc=" + this.script_url;
  }
  try { navigator.sendBeacon(url_host + url_path, data); } catch { }
};

_re_utils = new ReUtils();
_re_utils.prep_service();
_re_utils.run_pending_jobs(window.geq);
window.geq = _re_utils;
