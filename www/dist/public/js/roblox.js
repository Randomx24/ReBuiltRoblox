var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function (window, undefined) {

    var document = window.document,
        firstScript = document.getElementsByTagName('script')[0],
        isString = function (o) {
            return typeof o == 'string';
        },
        isArray = function (o) {
            return Object.prototype.toString.call(o) == '[object Array]';
        },
        isFunction = function (o) {
            return Object.prototype.toString.call(o) == '[object Function]';
        },
        resourceMap = {},
        config = {
            baseUrl: '/',
            modulePath: 'js/modules/',
            externalResources: []
        };


    function deepGet(object, property) {
        var parts = property.split('.');
        for (property = parts.shift(); parts.length > 0; object = object[property], property = parts.shift()) {
            if (object[property] === undefined)
                return undefined;
        }
        return object[property];
    }

    function deepSet(object, property, value) {
        var parts = property.split('.');
        for (property = parts.shift(); parts.length > 0; object = object[property], property = parts.shift()) {
            if (object[property] === undefined)
                object[property] = {};
        }
        object[property] = value;
    }

    function loadCss(href, onload) {
        var link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        firstScript.parentNode.insertBefore(link, firstScript);
        onload();
    }

    function loadJs(src, onload) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = script.onreadystatechange = function () {
            if (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete') {
                onload();

                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
            }
        };
        firstScript.parentNode.insertBefore(script, firstScript);
    }

    function getExtension(url) {
        return url.split('.').pop().split('?').shift();
    }

    function getResourceName(url) {
        // Check if it's already a name
        if (url.indexOf('.js') < 0)
            return url;

        // Pull out the name if it's a module
        if (url.indexOf(config.modulePath) >= 0)
            return url.split(config.modulePath).pop().split('.js').shift().replace('/', '.');

        // Resource isn't a module, use url for name
        return url;
    }

    function getResourceUrl(name) {
        // Check if it's already a url
        if (name.indexOf('.js') >= 0 || name.indexOf('.css') >= 0)
            return name;

        // Construct url from name
        return config.baseUrl + config.modulePath + name.replace('.', '/') + '.js';
    }

    function getModules(resources) {
        var module, modules = [];
        for (var i = 0; i < resources.length; i++) {
            module = deepGet(Roblox, getResourceName(resources[i]));
            if (module !== undefined)
                modules.push(module);
        }
        return modules;
    }

    function resolveResource(name) {
        var resource = resourceMap[name];
        if (!resource.loaded || !resource.depsLoaded)
            return;

        // Notify listeners
        while (resource.listeners.length > 0) {
            (resource.listeners.shift())();
        }
    }

    function loadResource(nameOrUrl, onload) {
        if (!isString(nameOrUrl) || config.externalResources.toString().indexOf(nameOrUrl) >= 0)
            return onload();

        var name = getResourceName(nameOrUrl);
        if (resourceMap[name] === undefined) {
            resourceMap[name] = {
                loaded: false,
                depsLoaded: true,
                listeners: []
            };
            resourceMap[name].listeners.push(onload);

            var load = getExtension(nameOrUrl) == 'css' ? loadCss : loadJs;
            load(getResourceUrl(nameOrUrl), function () {
                resourceMap[name].loaded = true;
                resolveResource(name);
            });
        }
        else {
            // Wait for resource to load
            resourceMap[name].listeners.push(onload);
            resolveResource(name);
        }
    }

    function loadResourceChain(urls, onload) {
        var first = urls.shift(),
            chainload = (urls.length == 0) ? onload : function () { loadResourceChain(urls, onload) };

        loadResource(first, chainload);
    }

    /**
    *
    *  Ensures all dependencies are loaded before executing the callback
    *
    *  @param {String|Array} - One or more dependencies to wait for
    *  @param {Function} - The callback to execute when all dependencies are ready
    *
    **/
    function require(dependencies, onready) {
        if (!isArray(dependencies))
            dependencies = [dependencies];

        var onload = function () {
            onready.apply(null, getModules(dependencies));
        };

        // Load resources from copy array
        loadResourceChain(dependencies.slice(0), onload);
    }

    /**
    *
    *  Defines a module onto the global Roblox object
    *
    *  @param {String} - The name of the module (MUST correlate to path in modules folder, i.e. modules/Pagelets/BestFriends.js would be named Pagelets.BestFriends)
    *  @param {String|Array} - An optional list of dependencies
    *  @param {Function} - Factory function to create the module
    *
    **/
    function define(name, dependencies, factory) {
        // Check for no dependency alternate syntax
        if (isFunction(dependencies)) {
            factory = dependencies;
            dependencies = [];
        }
        else if (!isArray(dependencies)) {
            dependencies = [dependencies];
        }

        resourceMap[name] = resourceMap[name] || { loaded: true, listeners: [] };
        resourceMap[name].depsLoaded = false;
        resourceMap[name].listeners.unshift(function () {
            // Add module to Roblox object
            deepSet(Roblox, name, factory.apply(null, getModules(dependencies)));
        });

        require(dependencies, function () {
            resourceMap[name].depsLoaded = true;
            resolveResource(name);
        });
    }

    if (typeof Roblox === 'undefined') {
        Roblox = {};
    }

    Roblox.config = config;
    Roblox.require = require;
    Roblox.define = define;

})(window);

}
/*
     FILE ARCHIVED ON 03:23:02 May 11, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:36:21 Jul 24, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots: 0.357
  captures_list: 166.469
  RedisCDXSource: 6.468
  exclusion.robots.policy: 0.342
  LoadShardBlock: 139.171 (3)
  PetaboxLoader3.resolve: 141.118 (4)
  PetaboxLoader3.datanode: 130.62 (4)
  load_resource: 139.634
  CDXLines.iter: 16.832 (3)
  esindex: 0.029
*/