JS.Package.DomLoader = {
  HOST_REGEX: /^https?\:\/\/[^\/]+/i,
  
  usable: function() {
    return !!JS.Package._getObject('window.document.getElementsByTagName');
  },
  
  __FILE__: function() {
    var scripts = document.getElementsByTagName('script');
        src     = scripts[scripts.length - 1].src,
        url     = window.location.href;
    
    if (/^\w+\:\/+/.test(src)) return src;
    if (/^\//.test(src)) return window.location.origin + src;
    return url.replace(/[^\/]*$/g, '') + src;
  },
  
  cacheBust: function(path) {
    var token = new Date().getTime();
    return path + (/\?/.test(path) ? '&' : '?') + token;
  },
  
  fetch: function(path) {
    var originalPath = path;
    if (JS.cacheBust) path = this.cacheBust(path);
    
    this.HOST = this.HOST || this.HOST_REGEX.exec(window.location.href);
    var host = this.HOST_REGEX.exec(path);
    
    if (!this.HOST || (host && host[0] !== this.HOST[0])) return null;
    JS.Package.log('Loading ' + path);
    
    var source = new JS.Package.Deferred(),
        self   = this,
        xhr    = window.ActiveXObject
               ? new ActiveXObject('Microsoft.XMLHTTP')
               : new XMLHttpRequest();
    
    xhr.open('GET', path, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      xhr.onreadystatechange = self._K;
      source.succeed(xhr.responseText + '\n//@ sourceURL=' + originalPath);
      xhr = null;
    };
    xhr.send(null);
    return source;
  },
  
  loadFile: function(path, fireCallbacks, source) {
    if (JS.cacheBust && !source) path = this.cacheBust(path);
    
    var self   = this,
        head   = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
    
    script.type = 'text/javascript';
    
    if (source)
      return source.callback(function(code) {
        JS.Package.log('Executing ' + path);
        eval(code);
        fireCallbacks();
      });
    
    JS.Package.log('Loading and executing ' + path);
    script.src = path;
    
    script.onload = script.onreadystatechange = function() {
      var state = script.readyState, status = script.status;
      if ( !state || state === 'loaded' || state === 'complete' ||
           (state === 4 && status === 200) ) {
        fireCallbacks();
        script.onload = script.onreadystatechange = self._K;
        head   = null;
        script = null;
      }
    };
    head.appendChild(script);
  },
  
  loadStyle: function(path) {
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    
    document.getElementsByTagName('head')[0].appendChild(link);
  },
  
  _K: function() {}
};
