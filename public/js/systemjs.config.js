/**
* System configuration for Angular 2 samples
* Adjust as necessary for your application needs.
*/
var isPublic = typeof window != "undefined";

(function(global) {
  var ngVer = '@2.0.0-rc.2';
  // map tells the System loader where to look for things
  var mymap = {
    'app':                        'client', // 'dist',
    '@angular':                   (isPublic)? '@angular' : 'node_modules/@angular',
    '@angular/router':            (isPublic)? '@angular/router' : 'node_modules/@angular/router',
    'rxjs':                       (isPublic)? 'rxjs' : 'node_modules/rxjs',
     'ng-semantic':                 (isPublic)? 'ng-semantic' :'node_modules/ng-semantic',
     'ng2-charts':                 (isPublic)? 'ng2-charts' :'node_modules/ng2-charts'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'ng-semantic': {
            main: './ng-semantic.js',
            defaultExtension: 'js'
        },
    'ng2-charts': {
            main: './ng2-charts.js',
            defaultExtension: 'js'
        }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: mymap,
    packages: packages
  };
  System.config(config);
})(this);
