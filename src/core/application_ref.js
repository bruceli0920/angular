'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/src/core/di');
var application_tokens_1 = require('./application_tokens');
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var testability_1 = require('angular2/src/core/testability/testability');
var dynamic_component_loader_1 = require('angular2/src/core/linker/dynamic_component_loader');
var exceptions_1 = require('angular2/src/facade/exceptions');
var console_1 = require('angular2/src/core/console');
var profile_1 = require('./profile/profile');
var lang_2 = require('angular2/src/facade/lang');
/**
 * Construct providers specific to an individual root component.
 */
function _componentProviders(appComponentType) {
    return [
        di_1.provide(application_tokens_1.APP_COMPONENT, { useValue: appComponentType }),
        di_1.provide(application_tokens_1.APP_COMPONENT_REF_PROMISE, {
            useFactory: function (dynamicComponentLoader, appRef, injector) {
                // Save the ComponentRef for disposal later.
                var ref;
                // TODO(rado): investigate whether to support providers on root component.
                return dynamicComponentLoader.loadAsRoot(appComponentType, null, injector, function () { appRef._unloadComponent(ref); })
                    .then(function (componentRef) {
                    ref = componentRef;
                    var testability = injector.getOptional(testability_1.Testability);
                    if (lang_1.isPresent(testability)) {
                        injector.get(testability_1.TestabilityRegistry)
                            .registerApplication(componentRef.location.nativeElement, testability);
                    }
                    return componentRef;
                });
            },
            deps: [dynamic_component_loader_1.DynamicComponentLoader, ApplicationRef, di_1.Injector]
        }),
        di_1.provide(appComponentType, {
            useFactory: function (p) { return p.then(function (ref) { return ref.instance; }); },
            deps: [application_tokens_1.APP_COMPONENT_REF_PROMISE]
        }),
    ];
}
/**
 * Create an Angular zone.
 */
function createNgZone() {
    return new ng_zone_1.NgZone({ enableLongStackTrace: lang_1.assertionsEnabled() });
}
exports.createNgZone = createNgZone;
var _platform;
var _platformProviders;
/**
 * Initialize the Angular 'platform' on the page.
 *
 * See {@link PlatformRef} for details on the Angular platform.
 *
 * It is also possible to specify providers to be made in the new platform. These providers
 * will be shared between all applications on the page. For example, an abstraction for
 * the browser cookie jar should be bound at the platform level, because there is only one
 * cookie jar regardless of how many applications on the page will be accessing it.
 *
 * The platform function can be called multiple times as long as the same list of providers
 * is passed into each call. If the platform function is called with a different set of
 * provides, Angular will throw an exception.
 */
function platform(providers) {
    lang_2.lockMode();
    if (lang_1.isPresent(_platform)) {
        if (collection_1.ListWrapper.equals(_platformProviders, providers)) {
            return _platform;
        }
        else {
            throw new exceptions_1.BaseException("platform cannot be initialized with different sets of providers.");
        }
    }
    else {
        return _createPlatform(providers);
    }
}
exports.platform = platform;
/**
 * Dispose the existing platform.
 */
function disposePlatform() {
    if (lang_1.isPresent(_platform)) {
        _platform.dispose();
        _platform = null;
    }
}
exports.disposePlatform = disposePlatform;
function _createPlatform(providers) {
    _platformProviders = providers;
    var injector = di_1.Injector.resolveAndCreate(providers);
    _platform = new PlatformRef_(injector, function () {
        _platform = null;
        _platformProviders = null;
    });
    _runPlatformInitializers(injector);
    return _platform;
}
function _runPlatformInitializers(injector) {
    var inits = injector.getOptional(application_tokens_1.PLATFORM_INITIALIZER);
    if (lang_1.isPresent(inits))
        inits.forEach(function (init) { return init(); });
}
/**
 * The Angular platform is the entry point for Angular on a web page. Each page
 * has exactly one platform, and services (such as reflection) which are common
 * to every Angular application running on the page are bound in its scope.
 *
 * A page's platform is initialized implicitly when {@link bootstrap}() is called, or
 * explicitly by calling {@link platform}().
 */
var PlatformRef = (function () {
    function PlatformRef() {
    }
    Object.defineProperty(PlatformRef.prototype, "injector", {
        /**
         * Retrieve the platform {@link Injector}, which is the parent injector for
         * every Angular application on the page and provides singleton providers.
         */
        get: function () { throw exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    return PlatformRef;
})();
exports.PlatformRef = PlatformRef;
var PlatformRef_ = (function (_super) {
    __extends(PlatformRef_, _super);
    function PlatformRef_(_injector, _dispose) {
        _super.call(this);
        this._injector = _injector;
        this._dispose = _dispose;
        /** @internal */
        this._applications = [];
        /** @internal */
        this._disposeListeners = [];
    }
    PlatformRef_.prototype.registerDisposeListener = function (dispose) { this._disposeListeners.push(dispose); };
    Object.defineProperty(PlatformRef_.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    PlatformRef_.prototype.application = function (providers) {
        var app = this._initApp(createNgZone(), providers);
        if (async_1.PromiseWrapper.isPromise(app)) {
            throw new exceptions_1.BaseException("Cannot use asyncronous app initializers with application. Use asyncApplication instead.");
        }
        return app;
    };
    PlatformRef_.prototype.asyncApplication = function (bindingFn, additionalProviders) {
        var _this = this;
        var zone = createNgZone();
        var completer = async_1.PromiseWrapper.completer();
        if (bindingFn === null) {
            completer.resolve(this._initApp(zone, additionalProviders));
        }
        else {
            zone.run(function () {
                async_1.PromiseWrapper.then(bindingFn(zone), function (providers) {
                    if (lang_1.isPresent(additionalProviders)) {
                        providers = collection_1.ListWrapper.concat(providers, additionalProviders);
                    }
                    var promise = _this._initApp(zone, providers);
                    completer.resolve(promise);
                });
            });
        }
        return completer.promise;
    };
    PlatformRef_.prototype._initApp = function (zone, providers) {
        var _this = this;
        var injector;
        var app;
        zone.run(function () {
            providers = collection_1.ListWrapper.concat(providers, [
                di_1.provide(ng_zone_1.NgZone, { useValue: zone }),
                di_1.provide(ApplicationRef, { useFactory: function () { return app; }, deps: [] })
            ]);
            var exceptionHandler;
            try {
                injector = _this.injector.resolveAndCreateChild(providers);
                exceptionHandler = injector.get(exceptions_1.ExceptionHandler);
                async_1.ObservableWrapper.subscribe(zone.onError, function (error) {
                    exceptionHandler.call(error.error, error.stackTrace);
                });
            }
            catch (e) {
                if (lang_1.isPresent(exceptionHandler)) {
                    exceptionHandler.call(e, e.stack);
                }
                else {
                    lang_1.print(e.toString());
                }
            }
        });
        app = new ApplicationRef_(this, zone, injector);
        this._applications.push(app);
        var promise = _runAppInitializers(injector);
        if (promise !== null) {
            return async_1.PromiseWrapper.then(promise, function (_) { return app; });
        }
        else {
            return app;
        }
    };
    PlatformRef_.prototype.dispose = function () {
        collection_1.ListWrapper.clone(this._applications).forEach(function (app) { return app.dispose(); });
        this._disposeListeners.forEach(function (dispose) { return dispose(); });
        this._dispose();
    };
    /** @internal */
    PlatformRef_.prototype._applicationDisposed = function (app) { collection_1.ListWrapper.remove(this._applications, app); };
    return PlatformRef_;
})(PlatformRef);
exports.PlatformRef_ = PlatformRef_;
function _runAppInitializers(injector) {
    var inits = injector.getOptional(application_tokens_1.APP_INITIALIZER);
    var promises = [];
    if (lang_1.isPresent(inits)) {
        inits.forEach(function (init) {
            var retVal = init();
            if (async_1.PromiseWrapper.isPromise(retVal)) {
                promises.push(retVal);
            }
        });
    }
    if (promises.length > 0) {
        return async_1.PromiseWrapper.all(promises);
    }
    else {
        return null;
    }
}
/**
 * A reference to an Angular application running on a page.
 *
 * For more about Angular applications, see the documentation for {@link bootstrap}.
 */
var ApplicationRef = (function () {
    function ApplicationRef() {
    }
    Object.defineProperty(ApplicationRef.prototype, "injector", {
        /**
         * Retrieve the application {@link Injector}.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ApplicationRef.prototype, "zone", {
        /**
         * Retrieve the application {@link NgZone}.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ApplicationRef.prototype, "componentTypes", {
        /**
         * Get a list of component types registered to this application.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    return ApplicationRef;
})();
exports.ApplicationRef = ApplicationRef;
var ApplicationRef_ = (function (_super) {
    __extends(ApplicationRef_, _super);
    function ApplicationRef_(_platform, _zone, _injector) {
        var _this = this;
        _super.call(this);
        this._platform = _platform;
        this._zone = _zone;
        this._injector = _injector;
        /** @internal */
        this._bootstrapListeners = [];
        /** @internal */
        this._disposeListeners = [];
        /** @internal */
        this._rootComponents = [];
        /** @internal */
        this._rootComponentTypes = [];
        /** @internal */
        this._changeDetectorRefs = [];
        /** @internal */
        this._runningTick = false;
        /** @internal */
        this._enforceNoNewChanges = false;
        if (lang_1.isPresent(this._zone)) {
            async_1.ObservableWrapper.subscribe(this._zone.onMicrotaskEmpty, function (_) { _this._zone.run(function () { _this.tick(); }); });
        }
        this._enforceNoNewChanges = lang_1.assertionsEnabled();
    }
    ApplicationRef_.prototype.registerBootstrapListener = function (listener) {
        this._bootstrapListeners.push(listener);
    };
    ApplicationRef_.prototype.registerDisposeListener = function (dispose) { this._disposeListeners.push(dispose); };
    ApplicationRef_.prototype.registerChangeDetector = function (changeDetector) {
        this._changeDetectorRefs.push(changeDetector);
    };
    ApplicationRef_.prototype.unregisterChangeDetector = function (changeDetector) {
        collection_1.ListWrapper.remove(this._changeDetectorRefs, changeDetector);
    };
    ApplicationRef_.prototype.bootstrap = function (componentType, providers) {
        var _this = this;
        var completer = async_1.PromiseWrapper.completer();
        this._zone.run(function () {
            var componentProviders = _componentProviders(componentType);
            if (lang_1.isPresent(providers)) {
                componentProviders.push(providers);
            }
            var exceptionHandler = _this._injector.get(exceptions_1.ExceptionHandler);
            _this._rootComponentTypes.push(componentType);
            try {
                var injector = _this._injector.resolveAndCreateChild(componentProviders);
                var compRefToken = injector.get(application_tokens_1.APP_COMPONENT_REF_PROMISE);
                var tick = function (componentRef) {
                    _this._loadComponent(componentRef);
                    completer.resolve(componentRef);
                };
                var tickResult = async_1.PromiseWrapper.then(compRefToken, tick);
                async_1.PromiseWrapper.then(tickResult, null, function (err, stackTrace) {
                    completer.reject(err, stackTrace);
                    exceptionHandler.call(err, stackTrace);
                });
            }
            catch (e) {
                exceptionHandler.call(e, e.stack);
                completer.reject(e, e.stack);
            }
        });
        return completer.promise.then(function (ref) {
            var c = _this._injector.get(console_1.Console);
            if (lang_1.assertionsEnabled()) {
                c.log("Angular 2 is running in the development mode. Call enableProdMode() to enable the production mode.");
            }
            return ref;
        });
    };
    /** @internal */
    ApplicationRef_.prototype._loadComponent = function (componentRef) {
        var appChangeDetector = componentRef.location.internalElement.parentView.changeDetector;
        this._changeDetectorRefs.push(appChangeDetector.ref);
        this.tick();
        this._rootComponents.push(componentRef);
        this._bootstrapListeners.forEach(function (listener) { return listener(componentRef); });
    };
    /** @internal */
    ApplicationRef_.prototype._unloadComponent = function (componentRef) {
        if (!collection_1.ListWrapper.contains(this._rootComponents, componentRef)) {
            return;
        }
        this.unregisterChangeDetector(componentRef.location.internalElement.parentView.changeDetector.ref);
        collection_1.ListWrapper.remove(this._rootComponents, componentRef);
    };
    Object.defineProperty(ApplicationRef_.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationRef_.prototype, "zone", {
        get: function () { return this._zone; },
        enumerable: true,
        configurable: true
    });
    ApplicationRef_.prototype.tick = function () {
        if (this._runningTick) {
            throw new exceptions_1.BaseException("ApplicationRef.tick is called recursively");
        }
        var s = ApplicationRef_._tickScope();
        try {
            this._runningTick = true;
            this._changeDetectorRefs.forEach(function (detector) { return detector.detectChanges(); });
            if (this._enforceNoNewChanges) {
                this._changeDetectorRefs.forEach(function (detector) { return detector.checkNoChanges(); });
            }
        }
        finally {
            this._runningTick = false;
            profile_1.wtfLeave(s);
        }
    };
    ApplicationRef_.prototype.dispose = function () {
        // TODO(alxhub): Dispose of the NgZone.
        collection_1.ListWrapper.clone(this._rootComponents).forEach(function (ref) { return ref.dispose(); });
        this._disposeListeners.forEach(function (dispose) { return dispose(); });
        this._platform._applicationDisposed(this);
    };
    Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
        get: function () { return this._rootComponentTypes; },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    ApplicationRef_._tickScope = profile_1.wtfCreateScope('ApplicationRef#tick()');
    return ApplicationRef_;
})(ApplicationRef);
exports.ApplicationRef_ = ApplicationRef_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vTEpHOXdKYi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fcmVmLnRzIl0sIm5hbWVzIjpbIl9jb21wb25lbnRQcm92aWRlcnMiLCJjcmVhdGVOZ1pvbmUiLCJwbGF0Zm9ybSIsImRpc3Bvc2VQbGF0Zm9ybSIsIl9jcmVhdGVQbGF0Zm9ybSIsIl9ydW5QbGF0Zm9ybUluaXRpYWxpemVycyIsIlBsYXRmb3JtUmVmIiwiUGxhdGZvcm1SZWYuY29uc3RydWN0b3IiLCJQbGF0Zm9ybVJlZi5pbmplY3RvciIsIlBsYXRmb3JtUmVmXyIsIlBsYXRmb3JtUmVmXy5jb25zdHJ1Y3RvciIsIlBsYXRmb3JtUmVmXy5yZWdpc3RlckRpc3Bvc2VMaXN0ZW5lciIsIlBsYXRmb3JtUmVmXy5pbmplY3RvciIsIlBsYXRmb3JtUmVmXy5hcHBsaWNhdGlvbiIsIlBsYXRmb3JtUmVmXy5hc3luY0FwcGxpY2F0aW9uIiwiUGxhdGZvcm1SZWZfLl9pbml0QXBwIiwiUGxhdGZvcm1SZWZfLmRpc3Bvc2UiLCJQbGF0Zm9ybVJlZl8uX2FwcGxpY2F0aW9uRGlzcG9zZWQiLCJfcnVuQXBwSW5pdGlhbGl6ZXJzIiwiQXBwbGljYXRpb25SZWYiLCJBcHBsaWNhdGlvblJlZi5jb25zdHJ1Y3RvciIsIkFwcGxpY2F0aW9uUmVmLmluamVjdG9yIiwiQXBwbGljYXRpb25SZWYuem9uZSIsIkFwcGxpY2F0aW9uUmVmLmNvbXBvbmVudFR5cGVzIiwiQXBwbGljYXRpb25SZWZfIiwiQXBwbGljYXRpb25SZWZfLmNvbnN0cnVjdG9yIiwiQXBwbGljYXRpb25SZWZfLnJlZ2lzdGVyQm9vdHN0cmFwTGlzdGVuZXIiLCJBcHBsaWNhdGlvblJlZl8ucmVnaXN0ZXJEaXNwb3NlTGlzdGVuZXIiLCJBcHBsaWNhdGlvblJlZl8ucmVnaXN0ZXJDaGFuZ2VEZXRlY3RvciIsIkFwcGxpY2F0aW9uUmVmXy51bnJlZ2lzdGVyQ2hhbmdlRGV0ZWN0b3IiLCJBcHBsaWNhdGlvblJlZl8uYm9vdHN0cmFwIiwiQXBwbGljYXRpb25SZWZfLl9sb2FkQ29tcG9uZW50IiwiQXBwbGljYXRpb25SZWZfLl91bmxvYWRDb21wb25lbnQiLCJBcHBsaWNhdGlvblJlZl8uaW5qZWN0b3IiLCJBcHBsaWNhdGlvblJlZl8uem9uZSIsIkFwcGxpY2F0aW9uUmVmXy50aWNrIiwiQXBwbGljYXRpb25SZWZfLmRpc3Bvc2UiLCJBcHBsaWNhdGlvblJlZl8uY29tcG9uZW50VHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0JBQWtDLGdDQUFnQyxDQUFDLENBQUE7QUFDbkUscUJBT08sMEJBQTBCLENBQUMsQ0FBQTtBQUNsQyxtQkFBdUQsc0JBQXNCLENBQUMsQ0FBQTtBQUM5RSxtQ0FNTyxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlCLHNCQUFrRSwyQkFBMkIsQ0FBQyxDQUFBO0FBQzlGLDJCQUEwQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzNELDRCQUErQywyQ0FBMkMsQ0FBQyxDQUFBO0FBQzNGLHlDQUdPLG1EQUFtRCxDQUFDLENBQUE7QUFDM0QsMkJBS08sZ0NBQWdDLENBQUMsQ0FBQTtBQUN4Qyx3QkFBc0IsMkJBQTJCLENBQUMsQ0FBQTtBQUNsRCx3QkFBbUQsbUJBQW1CLENBQUMsQ0FBQTtBQUV2RSxxQkFBdUIsMEJBQTBCLENBQUMsQ0FBQTtBQUdsRDs7R0FFRztBQUNILDZCQUE2QixnQkFBc0I7SUFDakRBLE1BQU1BLENBQUNBO1FBQ0xBLFlBQU9BLENBQUNBLGtDQUFhQSxFQUFFQSxFQUFDQSxRQUFRQSxFQUFFQSxnQkFBZ0JBLEVBQUNBLENBQUNBO1FBQ3BEQSxZQUFPQSxDQUFDQSw4Q0FBeUJBLEVBQ3pCQTtZQUNFQSxVQUFVQSxFQUFFQSxVQUFDQSxzQkFBOENBLEVBQUVBLE1BQXVCQSxFQUN2RUEsUUFBa0JBO2dCQUM3QkEsNENBQTRDQTtnQkFDNUNBLElBQUlBLEdBQWlC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QTs7O09BQUFiO0lBaklqRUEsZ0JBQWdCQTtJQUNUQSwwQkFBVUEsR0FBZUEsd0JBQWNBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsQ0FBQ0E7SUFpSTFFQSxzQkFBQ0E7QUFBREEsQ0FBQ0EsQUFuSUQsRUFBcUMsY0FBYyxFQW1JbEQ7QUFuSVksdUJBQWUsa0JBbUkzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ1pvbmUsIE5nWm9uZUVycm9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuaW1wb3J0IHtcbiAgVHlwZSxcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50LFxuICBhc3NlcnRpb25zRW5hYmxlZCxcbiAgcHJpbnQsXG4gIElTX0RBUlRcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7cHJvdmlkZSwgUHJvdmlkZXIsIEluamVjdG9yLCBPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtcbiAgQVBQX0NPTVBPTkVOVF9SRUZfUFJPTUlTRSxcbiAgQVBQX0NPTVBPTkVOVCxcbiAgQVBQX0lEX1JBTkRPTV9QUk9WSURFUixcbiAgUExBVEZPUk1fSU5JVElBTElaRVIsXG4gIEFQUF9JTklUSUFMSVpFUlxufSBmcm9tICcuL2FwcGxpY2F0aW9uX3Rva2Vucyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyLCBQcm9taXNlQ29tcGxldGVyLCBPYnNlcnZhYmxlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtUZXN0YWJpbGl0eVJlZ2lzdHJ5LCBUZXN0YWJpbGl0eX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvdGVzdGFiaWxpdHkvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBEeW5hbWljQ29tcG9uZW50TG9hZGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9keW5hbWljX2NvbXBvbmVudF9sb2FkZXInO1xuaW1wb3J0IHtcbiAgQmFzZUV4Y2VwdGlvbixcbiAgV3JhcHBlZEV4Y2VwdGlvbixcbiAgRXhjZXB0aW9uSGFuZGxlcixcbiAgdW5pbXBsZW1lbnRlZFxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtDb25zb2xlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jb25zb2xlJztcbmltcG9ydCB7d3RmTGVhdmUsIHd0ZkNyZWF0ZVNjb3BlLCBXdGZTY29wZUZufSBmcm9tICcuL3Byb2ZpbGUvcHJvZmlsZSc7XG5pbXBvcnQge0NoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rvcl9yZWYnO1xuaW1wb3J0IHtsb2NrTW9kZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7RWxlbWVudFJlZl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9lbGVtZW50X3JlZic7XG5cbi8qKlxuICogQ29uc3RydWN0IHByb3ZpZGVycyBzcGVjaWZpYyB0byBhbiBpbmRpdmlkdWFsIHJvb3QgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBfY29tcG9uZW50UHJvdmlkZXJzKGFwcENvbXBvbmVudFR5cGU6IFR5cGUpOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4ge1xuICByZXR1cm4gW1xuICAgIHByb3ZpZGUoQVBQX0NPTVBPTkVOVCwge3VzZVZhbHVlOiBhcHBDb21wb25lbnRUeXBlfSksXG4gICAgcHJvdmlkZShBUFBfQ09NUE9ORU5UX1JFRl9QUk9NSVNFLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VGYWN0b3J5OiAoZHluYW1pY0NvbXBvbmVudExvYWRlcjogRHluYW1pY0NvbXBvbmVudExvYWRlciwgYXBwUmVmOiBBcHBsaWNhdGlvblJlZl8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RvcjogSW5qZWN0b3IpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBDb21wb25lbnRSZWYgZm9yIGRpc3Bvc2FsIGxhdGVyLlxuICAgICAgICAgICAgICAgIHZhciByZWY6IENvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAvLyBUT0RPKHJhZG8pOiBpbnZlc3RpZ2F0ZSB3aGV0aGVyIHRvIHN1cHBvcnQgcHJvdmlkZXJzIG9uIHJvb3QgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgIHJldHVybiBkeW5hbWljQ29tcG9uZW50TG9hZGVyLmxvYWRBc1Jvb3QoYXBwQ29tcG9uZW50VHlwZSwgbnVsbCwgaW5qZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7IGFwcFJlZi5fdW5sb2FkQ29tcG9uZW50KHJlZik7IH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChjb21wb25lbnRSZWYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICByZWYgPSBjb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3RhYmlsaXR5ID0gaW5qZWN0b3IuZ2V0T3B0aW9uYWwoVGVzdGFiaWxpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ByZXNlbnQodGVzdGFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rvci5nZXQoVGVzdGFiaWxpdHlSZWdpc3RyeSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVnaXN0ZXJBcHBsaWNhdGlvbihjb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGVzdGFiaWxpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50UmVmO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZGVwczogW0R5bmFtaWNDb21wb25lbnRMb2FkZXIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rvcl1cbiAgICAgICAgICAgIH0pLFxuICAgIHByb3ZpZGUoYXBwQ29tcG9uZW50VHlwZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlRmFjdG9yeTogKHA6IFByb21pc2U8YW55PikgPT4gcC50aGVuKHJlZiA9PiByZWYuaW5zdGFuY2UpLFxuICAgICAgICAgICAgICBkZXBzOiBbQVBQX0NPTVBPTkVOVF9SRUZfUFJPTUlTRV1cbiAgICAgICAgICAgIH0pLFxuICBdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBBbmd1bGFyIHpvbmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZ1pvbmUoKTogTmdab25lIHtcbiAgcmV0dXJuIG5ldyBOZ1pvbmUoe2VuYWJsZUxvbmdTdGFja1RyYWNlOiBhc3NlcnRpb25zRW5hYmxlZCgpfSk7XG59XG5cbnZhciBfcGxhdGZvcm06IFBsYXRmb3JtUmVmO1xudmFyIF9wbGF0Zm9ybVByb3ZpZGVyczogYW55W107XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgQW5ndWxhciAncGxhdGZvcm0nIG9uIHRoZSBwYWdlLlxuICpcbiAqIFNlZSB7QGxpbmsgUGxhdGZvcm1SZWZ9IGZvciBkZXRhaWxzIG9uIHRoZSBBbmd1bGFyIHBsYXRmb3JtLlxuICpcbiAqIEl0IGlzIGFsc28gcG9zc2libGUgdG8gc3BlY2lmeSBwcm92aWRlcnMgdG8gYmUgbWFkZSBpbiB0aGUgbmV3IHBsYXRmb3JtLiBUaGVzZSBwcm92aWRlcnNcbiAqIHdpbGwgYmUgc2hhcmVkIGJldHdlZW4gYWxsIGFwcGxpY2F0aW9ucyBvbiB0aGUgcGFnZS4gRm9yIGV4YW1wbGUsIGFuIGFic3RyYWN0aW9uIGZvclxuICogdGhlIGJyb3dzZXIgY29va2llIGphciBzaG91bGQgYmUgYm91bmQgYXQgdGhlIHBsYXRmb3JtIGxldmVsLCBiZWNhdXNlIHRoZXJlIGlzIG9ubHkgb25lXG4gKiBjb29raWUgamFyIHJlZ2FyZGxlc3Mgb2YgaG93IG1hbnkgYXBwbGljYXRpb25zIG9uIHRoZSBwYWdlIHdpbGwgYmUgYWNjZXNzaW5nIGl0LlxuICpcbiAqIFRoZSBwbGF0Zm9ybSBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzIGFzIGxvbmcgYXMgdGhlIHNhbWUgbGlzdCBvZiBwcm92aWRlcnNcbiAqIGlzIHBhc3NlZCBpbnRvIGVhY2ggY2FsbC4gSWYgdGhlIHBsYXRmb3JtIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGEgZGlmZmVyZW50IHNldCBvZlxuICogcHJvdmlkZXMsIEFuZ3VsYXIgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGF0Zm9ybShwcm92aWRlcnM/OiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBQbGF0Zm9ybVJlZiB7XG4gIGxvY2tNb2RlKCk7XG4gIGlmIChpc1ByZXNlbnQoX3BsYXRmb3JtKSkge1xuICAgIGlmIChMaXN0V3JhcHBlci5lcXVhbHMoX3BsYXRmb3JtUHJvdmlkZXJzLCBwcm92aWRlcnMpKSB7XG4gICAgICByZXR1cm4gX3BsYXRmb3JtO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcInBsYXRmb3JtIGNhbm5vdCBiZSBpbml0aWFsaXplZCB3aXRoIGRpZmZlcmVudCBzZXRzIG9mIHByb3ZpZGVycy5cIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBfY3JlYXRlUGxhdGZvcm0ocHJvdmlkZXJzKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3Bvc2UgdGhlIGV4aXN0aW5nIHBsYXRmb3JtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcG9zZVBsYXRmb3JtKCk6IHZvaWQge1xuICBpZiAoaXNQcmVzZW50KF9wbGF0Zm9ybSkpIHtcbiAgICBfcGxhdGZvcm0uZGlzcG9zZSgpO1xuICAgIF9wbGF0Zm9ybSA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVBsYXRmb3JtKHByb3ZpZGVycz86IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFBsYXRmb3JtUmVmIHtcbiAgX3BsYXRmb3JtUHJvdmlkZXJzID0gcHJvdmlkZXJzO1xuICBsZXQgaW5qZWN0b3IgPSBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVycyk7XG4gIF9wbGF0Zm9ybSA9IG5ldyBQbGF0Zm9ybVJlZl8oaW5qZWN0b3IsICgpID0+IHtcbiAgICBfcGxhdGZvcm0gPSBudWxsO1xuICAgIF9wbGF0Zm9ybVByb3ZpZGVycyA9IG51bGw7XG4gIH0pO1xuICBfcnVuUGxhdGZvcm1Jbml0aWFsaXplcnMoaW5qZWN0b3IpO1xuICByZXR1cm4gX3BsYXRmb3JtO1xufVxuXG5mdW5jdGlvbiBfcnVuUGxhdGZvcm1Jbml0aWFsaXplcnMoaW5qZWN0b3I6IEluamVjdG9yKTogdm9pZCB7XG4gIGxldCBpbml0czogRnVuY3Rpb25bXSA9IDxGdW5jdGlvbltdPmluamVjdG9yLmdldE9wdGlvbmFsKFBMQVRGT1JNX0lOSVRJQUxJWkVSKTtcbiAgaWYgKGlzUHJlc2VudChpbml0cykpIGluaXRzLmZvckVhY2goaW5pdCA9PiBpbml0KCkpO1xufVxuXG4vKipcbiAqIFRoZSBBbmd1bGFyIHBsYXRmb3JtIGlzIHRoZSBlbnRyeSBwb2ludCBmb3IgQW5ndWxhciBvbiBhIHdlYiBwYWdlLiBFYWNoIHBhZ2VcbiAqIGhhcyBleGFjdGx5IG9uZSBwbGF0Zm9ybSwgYW5kIHNlcnZpY2VzIChzdWNoIGFzIHJlZmxlY3Rpb24pIHdoaWNoIGFyZSBjb21tb25cbiAqIHRvIGV2ZXJ5IEFuZ3VsYXIgYXBwbGljYXRpb24gcnVubmluZyBvbiB0aGUgcGFnZSBhcmUgYm91bmQgaW4gaXRzIHNjb3BlLlxuICpcbiAqIEEgcGFnZSdzIHBsYXRmb3JtIGlzIGluaXRpYWxpemVkIGltcGxpY2l0bHkgd2hlbiB7QGxpbmsgYm9vdHN0cmFwfSgpIGlzIGNhbGxlZCwgb3JcbiAqIGV4cGxpY2l0bHkgYnkgY2FsbGluZyB7QGxpbmsgcGxhdGZvcm19KCkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF0Zm9ybVJlZiB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBwbGF0Zm9ybSBpcyBkaXNwb3NlZC5cbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVyRGlzcG9zZUxpc3RlbmVyKGRpc3Bvc2U6ICgpID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgcGxhdGZvcm0ge0BsaW5rIEluamVjdG9yfSwgd2hpY2ggaXMgdGhlIHBhcmVudCBpbmplY3RvciBmb3JcbiAgICogZXZlcnkgQW5ndWxhciBhcHBsaWNhdGlvbiBvbiB0aGUgcGFnZSBhbmQgcHJvdmlkZXMgc2luZ2xldG9uIHByb3ZpZGVycy5cbiAgICovXG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHRocm93IHVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgYSBuZXcgQW5ndWxhciBhcHBsaWNhdGlvbiBvbiB0aGUgcGFnZS5cbiAgICpcbiAgICogIyMjIFdoYXQgaXMgYW4gYXBwbGljYXRpb24/XG4gICAqXG4gICAqIEVhY2ggQW5ndWxhciBhcHBsaWNhdGlvbiBoYXMgaXRzIG93biB6b25lLCBjaGFuZ2UgZGV0ZWN0aW9uLCBjb21waWxlcixcbiAgICogcmVuZGVyZXIsIGFuZCBvdGhlciBmcmFtZXdvcmsgY29tcG9uZW50cy4gQW4gYXBwbGljYXRpb24gaG9zdHMgb25lIG9yIG1vcmVcbiAgICogcm9vdCBjb21wb25lbnRzLCB3aGljaCBjYW4gYmUgaW5pdGlhbGl6ZWQgdmlhIGBBcHBsaWNhdGlvblJlZi5ib290c3RyYXAoKWAuXG4gICAqXG4gICAqICMjIyBBcHBsaWNhdGlvbiBQcm92aWRlcnNcbiAgICpcbiAgICogQW5ndWxhciBhcHBsaWNhdGlvbnMgcmVxdWlyZSBudW1lcm91cyBwcm92aWRlcnMgdG8gYmUgcHJvcGVybHkgaW5zdGFudGlhdGVkLlxuICAgKiBXaGVuIHVzaW5nIGBhcHBsaWNhdGlvbigpYCB0byBjcmVhdGUgYSBuZXcgYXBwIG9uIHRoZSBwYWdlLCB0aGVzZSBwcm92aWRlcnNcbiAgICogbXVzdCBiZSBwcm92aWRlZC4gRm9ydHVuYXRlbHksIHRoZXJlIGFyZSBoZWxwZXIgZnVuY3Rpb25zIHRvIGNvbmZpZ3VyZVxuICAgKiB0eXBpY2FsIHByb3ZpZGVycywgYXMgc2hvd24gaW4gdGhlIGV4YW1wbGUgYmVsb3cuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIHtAZXhhbXBsZSBjb3JlL3RzL3BsYXRmb3JtL3BsYXRmb3JtLnRzIHJlZ2lvbj0nbG9uZ2Zvcm0nfVxuICAgKiAjIyMgU2VlIEFsc29cbiAgICpcbiAgICogU2VlIHRoZSB7QGxpbmsgYm9vdHN0cmFwfSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBhYnN0cmFjdCBhcHBsaWNhdGlvbihwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IEFwcGxpY2F0aW9uUmVmO1xuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBBbmd1bGFyIGFwcGxpY2F0aW9uIG9uIHRoZSBwYWdlLCB1c2luZyBwcm92aWRlcnMgd2hpY2hcbiAgICogYXJlIG9ubHkgYXZhaWxhYmxlIGFzeW5jaHJvbm91c2x5LiBPbmUgc3VjaCB1c2UgY2FzZSBpcyB0byBpbml0aWFsaXplIGFuXG4gICAqIGFwcGxpY2F0aW9uIHJ1bm5pbmcgaW4gYSB3ZWIgd29ya2VyLlxuICAgKlxuICAgKiAjIyMgVXNhZ2VcbiAgICpcbiAgICogYGJpbmRpbmdGbmAgaXMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGluIHRoZSBuZXcgYXBwbGljYXRpb24ncyB6b25lLlxuICAgKiBJdCBzaG91bGQgcmV0dXJuIGEgYFByb21pc2VgIHRvIGEgbGlzdCBvZiBwcm92aWRlcnMgdG8gYmUgdXNlZCBmb3IgdGhlXG4gICAqIG5ldyBhcHBsaWNhdGlvbi4gT25jZSB0aGlzIHByb21pc2UgcmVzb2x2ZXMsIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGJlXG4gICAqIGNvbnN0cnVjdGVkIGluIHRoZSBzYW1lIG1hbm5lciBhcyBhIG5vcm1hbCBgYXBwbGljYXRpb24oKWAuXG4gICAqL1xuICBhYnN0cmFjdCBhc3luY0FwcGxpY2F0aW9uKGJpbmRpbmdGbjogKHpvbmU6IE5nWm9uZSkgPT4gUHJvbWlzZTxBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVycz86IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFByb21pc2U8QXBwbGljYXRpb25SZWY+O1xuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBBbmd1bGFyIHBsYXRmb3JtIGFuZCBhbGwgQW5ndWxhciBhcHBsaWNhdGlvbnMgb24gdGhlIHBhZ2UuXG4gICAqL1xuICBhYnN0cmFjdCBkaXNwb3NlKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybVJlZl8gZXh0ZW5kcyBQbGF0Zm9ybVJlZiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FwcGxpY2F0aW9uczogQXBwbGljYXRpb25SZWZbXSA9IFtdO1xuICAvKiogQGludGVybmFsICovXG4gIF9kaXNwb3NlTGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIF9kaXNwb3NlOiAoKSA9PiB2b2lkKSB7IHN1cGVyKCk7IH1cblxuICByZWdpc3RlckRpc3Bvc2VMaXN0ZW5lcihkaXNwb3NlOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX2Rpc3Bvc2VMaXN0ZW5lcnMucHVzaChkaXNwb3NlKTsgfVxuXG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9pbmplY3RvcjsgfVxuXG4gIGFwcGxpY2F0aW9uKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogQXBwbGljYXRpb25SZWYge1xuICAgIHZhciBhcHAgPSB0aGlzLl9pbml0QXBwKGNyZWF0ZU5nWm9uZSgpLCBwcm92aWRlcnMpO1xuICAgIGlmIChQcm9taXNlV3JhcHBlci5pc1Byb21pc2UoYXBwKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgXCJDYW5ub3QgdXNlIGFzeW5jcm9ub3VzIGFwcCBpbml0aWFsaXplcnMgd2l0aCBhcHBsaWNhdGlvbi4gVXNlIGFzeW5jQXBwbGljYXRpb24gaW5zdGVhZC5cIik7XG4gICAgfVxuICAgIHJldHVybiA8QXBwbGljYXRpb25SZWY+YXBwO1xuICB9XG5cbiAgYXN5bmNBcHBsaWNhdGlvbihiaW5kaW5nRm46ICh6b25lOiBOZ1pvbmUpID0+IFByb21pc2U8QXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+PixcbiAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvdmlkZXJzPzogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogUHJvbWlzZTxBcHBsaWNhdGlvblJlZj4ge1xuICAgIHZhciB6b25lID0gY3JlYXRlTmdab25lKCk7XG4gICAgdmFyIGNvbXBsZXRlciA9IFByb21pc2VXcmFwcGVyLmNvbXBsZXRlcjxBcHBsaWNhdGlvblJlZj4oKTtcbiAgICBpZiAoYmluZGluZ0ZuID09PSBudWxsKSB7XG4gICAgICBjb21wbGV0ZXIucmVzb2x2ZSh0aGlzLl9pbml0QXBwKHpvbmUsIGFkZGl0aW9uYWxQcm92aWRlcnMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBQcm9taXNlV3JhcHBlci50aGVuKGJpbmRpbmdGbih6b25lKSwgKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KSA9PiB7XG4gICAgICAgICAgaWYgKGlzUHJlc2VudChhZGRpdGlvbmFsUHJvdmlkZXJzKSkge1xuICAgICAgICAgICAgcHJvdmlkZXJzID0gTGlzdFdyYXBwZXIuY29uY2F0KHByb3ZpZGVycywgYWRkaXRpb25hbFByb3ZpZGVycyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5faW5pdEFwcCh6b25lLCBwcm92aWRlcnMpO1xuICAgICAgICAgIGNvbXBsZXRlci5yZXNvbHZlKHByb21pc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY29tcGxldGVyLnByb21pc2U7XG4gIH1cblxuICBwcml2YXRlIF9pbml0QXBwKHpvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFByb21pc2U8QXBwbGljYXRpb25SZWY+fFxuICAgICAgQXBwbGljYXRpb25SZWYge1xuICAgIHZhciBpbmplY3RvcjogSW5qZWN0b3I7XG4gICAgdmFyIGFwcDogQXBwbGljYXRpb25SZWY7XG4gICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgcHJvdmlkZXJzID0gTGlzdFdyYXBwZXIuY29uY2F0KHByb3ZpZGVycywgW1xuICAgICAgICBwcm92aWRlKE5nWm9uZSwge3VzZVZhbHVlOiB6b25lfSksXG4gICAgICAgIHByb3ZpZGUoQXBwbGljYXRpb25SZWYsIHt1c2VGYWN0b3J5OiAoKTogQXBwbGljYXRpb25SZWYgPT4gYXBwLCBkZXBzOiBbXX0pXG4gICAgICBdKTtcblxuICAgICAgdmFyIGV4Y2VwdGlvbkhhbmRsZXI6IEV4Y2VwdGlvbkhhbmRsZXI7XG4gICAgICB0cnkge1xuICAgICAgICBpbmplY3RvciA9IHRoaXMuaW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZUNoaWxkKHByb3ZpZGVycyk7XG4gICAgICAgIGV4Y2VwdGlvbkhhbmRsZXIgPSBpbmplY3Rvci5nZXQoRXhjZXB0aW9uSGFuZGxlcik7XG4gICAgICAgIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh6b25lLm9uRXJyb3IsIChlcnJvcjogTmdab25lRXJyb3IpID0+IHtcbiAgICAgICAgICBleGNlcHRpb25IYW5kbGVyLmNhbGwoZXJyb3IuZXJyb3IsIGVycm9yLnN0YWNrVHJhY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGlzUHJlc2VudChleGNlcHRpb25IYW5kbGVyKSkge1xuICAgICAgICAgIGV4Y2VwdGlvbkhhbmRsZXIuY2FsbChlLCBlLnN0YWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmludChlLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXBwID0gbmV3IEFwcGxpY2F0aW9uUmVmXyh0aGlzLCB6b25lLCBpbmplY3Rvcik7XG4gICAgdGhpcy5fYXBwbGljYXRpb25zLnB1c2goYXBwKTtcbiAgICB2YXIgcHJvbWlzZSA9IF9ydW5BcHBJbml0aWFsaXplcnMoaW5qZWN0b3IpO1xuICAgIGlmIChwcm9taXNlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIudGhlbihwcm9taXNlLCAoXykgPT4gYXBwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFwcDtcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIExpc3RXcmFwcGVyLmNsb25lKHRoaXMuX2FwcGxpY2F0aW9ucykuZm9yRWFjaCgoYXBwKSA9PiBhcHAuZGlzcG9zZSgpKTtcbiAgICB0aGlzLl9kaXNwb3NlTGlzdGVuZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2UoKSk7XG4gICAgdGhpcy5fZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYXBwbGljYXRpb25EaXNwb3NlZChhcHA6IEFwcGxpY2F0aW9uUmVmKTogdm9pZCB7IExpc3RXcmFwcGVyLnJlbW92ZSh0aGlzLl9hcHBsaWNhdGlvbnMsIGFwcCk7IH1cbn1cblxuZnVuY3Rpb24gX3J1bkFwcEluaXRpYWxpemVycyhpbmplY3RvcjogSW5qZWN0b3IpOiBQcm9taXNlPGFueT4ge1xuICBsZXQgaW5pdHM6IEZ1bmN0aW9uW10gPSBpbmplY3Rvci5nZXRPcHRpb25hbChBUFBfSU5JVElBTElaRVIpO1xuICBsZXQgcHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG4gIGlmIChpc1ByZXNlbnQoaW5pdHMpKSB7XG4gICAgaW5pdHMuZm9yRWFjaChpbml0ID0+IHtcbiAgICAgIHZhciByZXRWYWwgPSBpbml0KCk7XG4gICAgICBpZiAoUHJvbWlzZVdyYXBwZXIuaXNQcm9taXNlKHJldFZhbCkpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChyZXRWYWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChwcm9taXNlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLmFsbChwcm9taXNlcyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byBhbiBBbmd1bGFyIGFwcGxpY2F0aW9uIHJ1bm5pbmcgb24gYSBwYWdlLlxuICpcbiAqIEZvciBtb3JlIGFib3V0IEFuZ3VsYXIgYXBwbGljYXRpb25zLCBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHtAbGluayBib290c3RyYXB9LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXBwbGljYXRpb25SZWYge1xuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsaXN0ZW5lciB0byBiZSBjYWxsZWQgZWFjaCB0aW1lIGBib290c3RyYXAoKWAgaXMgY2FsbGVkIHRvIGJvb3RzdHJhcFxuICAgKiBhIG5ldyByb290IGNvbXBvbmVudC5cbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVyQm9vdHN0cmFwTGlzdGVuZXIobGlzdGVuZXI6IChyZWY6IENvbXBvbmVudFJlZikgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIGRpc3Bvc2VkLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVnaXN0ZXJEaXNwb3NlTGlzdGVuZXIoZGlzcG9zZTogKCkgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEJvb3RzdHJhcCBhIG5ldyBjb21wb25lbnQgYXQgdGhlIHJvb3QgbGV2ZWwgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiAjIyMgQm9vdHN0cmFwIHByb2Nlc3NcbiAgICpcbiAgICogV2hlbiBib290c3RyYXBwaW5nIGEgbmV3IHJvb3QgY29tcG9uZW50IGludG8gYW4gYXBwbGljYXRpb24sIEFuZ3VsYXIgbW91bnRzIHRoZVxuICAgKiBzcGVjaWZpZWQgYXBwbGljYXRpb24gY29tcG9uZW50IG9udG8gRE9NIGVsZW1lbnRzIGlkZW50aWZpZWQgYnkgdGhlIFtjb21wb25lbnRUeXBlXSdzXG4gICAqIHNlbGVjdG9yIGFuZCBraWNrcyBvZmYgYXV0b21hdGljIGNoYW5nZSBkZXRlY3Rpb24gdG8gZmluaXNoIGluaXRpYWxpemluZyB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiAjIyMgT3B0aW9uYWwgUHJvdmlkZXJzXG4gICAqXG4gICAqIFByb3ZpZGVycyBmb3IgdGhlIGdpdmVuIGNvbXBvbmVudCBjYW4gb3B0aW9uYWxseSBiZSBvdmVycmlkZGVuIHZpYSB0aGUgYHByb3ZpZGVyc2BcbiAgICogcGFyYW1ldGVyLiBUaGVzZSBwcm92aWRlcnMgd2lsbCBvbmx5IGFwcGx5IGZvciB0aGUgcm9vdCBjb21wb25lbnQgYmVpbmcgYWRkZWQgYW5kIGFueVxuICAgKiBjaGlsZCBjb21wb25lbnRzIHVuZGVyIGl0LlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKiB7QGV4YW1wbGUgY29yZS90cy9wbGF0Zm9ybS9wbGF0Zm9ybS50cyByZWdpb249J2xvbmdmb3JtJ31cbiAgICovXG4gIGFic3RyYWN0IGJvb3RzdHJhcChjb21wb25lbnRUeXBlOiBUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzPzogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogUHJvbWlzZTxDb21wb25lbnRSZWY+O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgYXBwbGljYXRpb24ge0BsaW5rIEluamVjdG9yfS5cbiAgICovXG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiA8SW5qZWN0b3I+dW5pbXBsZW1lbnRlZCgpOyB9O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgYXBwbGljYXRpb24ge0BsaW5rIE5nWm9uZX0uXG4gICAqL1xuICBnZXQgem9uZSgpOiBOZ1pvbmUgeyByZXR1cm4gPE5nWm9uZT51bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIERpc3Bvc2Ugb2YgdGhpcyBhcHBsaWNhdGlvbiBhbmQgYWxsIG9mIGl0cyBjb21wb25lbnRzLlxuICAgKi9cbiAgYWJzdHJhY3QgZGlzcG9zZSgpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBJbnZva2UgdGhpcyBtZXRob2QgdG8gZXhwbGljaXRseSBwcm9jZXNzIGNoYW5nZSBkZXRlY3Rpb24gYW5kIGl0cyBzaWRlLWVmZmVjdHMuXG4gICAqXG4gICAqIEluIGRldmVsb3BtZW50IG1vZGUsIGB0aWNrKClgIGFsc28gcGVyZm9ybXMgYSBzZWNvbmQgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSB0byBlbnN1cmUgdGhhdCBub1xuICAgKiBmdXJ0aGVyIGNoYW5nZXMgYXJlIGRldGVjdGVkLiBJZiBhZGRpdGlvbmFsIGNoYW5nZXMgYXJlIHBpY2tlZCB1cCBkdXJpbmcgdGhpcyBzZWNvbmQgY3ljbGUsXG4gICAqIGJpbmRpbmdzIGluIHRoZSBhcHAgaGF2ZSBzaWRlLWVmZmVjdHMgdGhhdCBjYW5ub3QgYmUgcmVzb2x2ZWQgaW4gYSBzaW5nbGUgY2hhbmdlIGRldGVjdGlvblxuICAgKiBwYXNzLlxuICAgKiBJbiB0aGlzIGNhc2UsIEFuZ3VsYXIgdGhyb3dzIGFuIGVycm9yLCBzaW5jZSBhbiBBbmd1bGFyIGFwcGxpY2F0aW9uIGNhbiBvbmx5IGhhdmUgb25lIGNoYW5nZVxuICAgKiBkZXRlY3Rpb24gcGFzcyBkdXJpbmcgd2hpY2ggYWxsIGNoYW5nZSBkZXRlY3Rpb24gbXVzdCBjb21wbGV0ZS5cbiAgICovXG4gIGFic3RyYWN0IHRpY2soKTogdm9pZDtcblxuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiBjb21wb25lbnQgdHlwZXMgcmVnaXN0ZXJlZCB0byB0aGlzIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgZ2V0IGNvbXBvbmVudFR5cGVzKCk6IFR5cGVbXSB7IHJldHVybiA8VHlwZVtdPnVuaW1wbGVtZW50ZWQoKTsgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUmVmXyBleHRlbmRzIEFwcGxpY2F0aW9uUmVmIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBzdGF0aWMgX3RpY2tTY29wZTogV3RmU2NvcGVGbiA9IHd0ZkNyZWF0ZVNjb3BlKCdBcHBsaWNhdGlvblJlZiN0aWNrKCknKTtcblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2Jvb3RzdHJhcExpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2Rpc3Bvc2VMaXN0ZW5lcnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9yb290Q29tcG9uZW50czogQ29tcG9uZW50UmVmW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9yb290Q29tcG9uZW50VHlwZXM6IFR5cGVbXSA9IFtdO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmczogQ2hhbmdlRGV0ZWN0b3JSZWZbXSA9IFtdO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX3J1bm5pbmdUaWNrOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfZW5mb3JjZU5vTmV3Q2hhbmdlczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybVJlZl8sIHByaXZhdGUgX3pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3pvbmUpKSB7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5fem9uZS5vbk1pY3JvdGFza0VtcHR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfKSA9PiB7IHRoaXMuX3pvbmUucnVuKCgpID0+IHsgdGhpcy50aWNrKCk7IH0pOyB9KTtcbiAgICB9XG4gICAgdGhpcy5fZW5mb3JjZU5vTmV3Q2hhbmdlcyA9IGFzc2VydGlvbnNFbmFibGVkKCk7XG4gIH1cblxuICByZWdpc3RlckJvb3RzdHJhcExpc3RlbmVyKGxpc3RlbmVyOiAocmVmOiBDb21wb25lbnRSZWYpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9ib290c3RyYXBMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH1cblxuICByZWdpc3RlckRpc3Bvc2VMaXN0ZW5lcihkaXNwb3NlOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX2Rpc3Bvc2VMaXN0ZW5lcnMucHVzaChkaXNwb3NlKTsgfVxuXG4gIHJlZ2lzdGVyQ2hhbmdlRGV0ZWN0b3IoY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKTogdm9pZCB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWZzLnB1c2goY2hhbmdlRGV0ZWN0b3IpO1xuICB9XG5cbiAgdW5yZWdpc3RlckNoYW5nZURldGVjdG9yKGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZik6IHZvaWQge1xuICAgIExpc3RXcmFwcGVyLnJlbW92ZSh0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZnMsIGNoYW5nZURldGVjdG9yKTtcbiAgfVxuXG4gIGJvb3RzdHJhcChjb21wb25lbnRUeXBlOiBUeXBlLFxuICAgICAgICAgICAgcHJvdmlkZXJzPzogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogUHJvbWlzZTxDb21wb25lbnRSZWY+IHtcbiAgICB2YXIgY29tcGxldGVyID0gUHJvbWlzZVdyYXBwZXIuY29tcGxldGVyKCk7XG4gICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudFByb3ZpZGVycyA9IF9jb21wb25lbnRQcm92aWRlcnMoY29tcG9uZW50VHlwZSk7XG4gICAgICBpZiAoaXNQcmVzZW50KHByb3ZpZGVycykpIHtcbiAgICAgICAgY29tcG9uZW50UHJvdmlkZXJzLnB1c2gocHJvdmlkZXJzKTtcbiAgICAgIH1cbiAgICAgIHZhciBleGNlcHRpb25IYW5kbGVyID0gdGhpcy5faW5qZWN0b3IuZ2V0KEV4Y2VwdGlvbkhhbmRsZXIpO1xuICAgICAgdGhpcy5fcm9vdENvbXBvbmVudFR5cGVzLnB1c2goY29tcG9uZW50VHlwZSk7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgaW5qZWN0b3I6IEluamVjdG9yID0gdGhpcy5faW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZUNoaWxkKGNvbXBvbmVudFByb3ZpZGVycyk7XG4gICAgICAgIHZhciBjb21wUmVmVG9rZW46IFByb21pc2U8Q29tcG9uZW50UmVmPiA9IGluamVjdG9yLmdldChBUFBfQ09NUE9ORU5UX1JFRl9QUk9NSVNFKTtcbiAgICAgICAgdmFyIHRpY2sgPSAoY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWYpID0+IHtcbiAgICAgICAgICB0aGlzLl9sb2FkQ29tcG9uZW50KGNvbXBvbmVudFJlZik7XG4gICAgICAgICAgY29tcGxldGVyLnJlc29sdmUoY29tcG9uZW50UmVmKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGlja1Jlc3VsdCA9IFByb21pc2VXcmFwcGVyLnRoZW4oY29tcFJlZlRva2VuLCB0aWNrKTtcblxuICAgICAgICBQcm9taXNlV3JhcHBlci50aGVuKHRpY2tSZXN1bHQsIG51bGwsIChlcnIsIHN0YWNrVHJhY2UpID0+IHtcbiAgICAgICAgICBjb21wbGV0ZXIucmVqZWN0KGVyciwgc3RhY2tUcmFjZSk7XG4gICAgICAgICAgZXhjZXB0aW9uSGFuZGxlci5jYWxsKGVyciwgc3RhY2tUcmFjZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBleGNlcHRpb25IYW5kbGVyLmNhbGwoZSwgZS5zdGFjayk7XG4gICAgICAgIGNvbXBsZXRlci5yZWplY3QoZSwgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbXBsZXRlci5wcm9taXNlLnRoZW48Q29tcG9uZW50UmVmPigocmVmOiBDb21wb25lbnRSZWYpID0+IHtcbiAgICAgIGxldCBjID0gdGhpcy5faW5qZWN0b3IuZ2V0KENvbnNvbGUpO1xuICAgICAgaWYgKGFzc2VydGlvbnNFbmFibGVkKCkpIHtcbiAgICAgICAgYy5sb2coXG4gICAgICAgICAgICBcIkFuZ3VsYXIgMiBpcyBydW5uaW5nIGluIHRoZSBkZXZlbG9wbWVudCBtb2RlLiBDYWxsIGVuYWJsZVByb2RNb2RlKCkgdG8gZW5hYmxlIHRoZSBwcm9kdWN0aW9uIG1vZGUuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlZjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2xvYWRDb21wb25lbnQoY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWYpOiB2b2lkIHtcbiAgICB2YXIgYXBwQ2hhbmdlRGV0ZWN0b3IgPVxuICAgICAgICAoPEVsZW1lbnRSZWZfPmNvbXBvbmVudFJlZi5sb2NhdGlvbikuaW50ZXJuYWxFbGVtZW50LnBhcmVudFZpZXcuY2hhbmdlRGV0ZWN0b3I7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWZzLnB1c2goYXBwQ2hhbmdlRGV0ZWN0b3IucmVmKTtcbiAgICB0aGlzLnRpY2soKTtcbiAgICB0aGlzLl9yb290Q29tcG9uZW50cy5wdXNoKGNvbXBvbmVudFJlZik7XG4gICAgdGhpcy5fYm9vdHN0cmFwTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcihjb21wb25lbnRSZWYpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VubG9hZENvbXBvbmVudChjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZik6IHZvaWQge1xuICAgIGlmICghTGlzdFdyYXBwZXIuY29udGFpbnModGhpcy5fcm9vdENvbXBvbmVudHMsIGNvbXBvbmVudFJlZikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy51bnJlZ2lzdGVyQ2hhbmdlRGV0ZWN0b3IoXG4gICAgICAgICg8RWxlbWVudFJlZl8+Y29tcG9uZW50UmVmLmxvY2F0aW9uKS5pbnRlcm5hbEVsZW1lbnQucGFyZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWYpO1xuICAgIExpc3RXcmFwcGVyLnJlbW92ZSh0aGlzLl9yb290Q29tcG9uZW50cywgY29tcG9uZW50UmVmKTtcbiAgfVxuXG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9pbmplY3RvcjsgfVxuXG4gIGdldCB6b25lKCk6IE5nWm9uZSB7IHJldHVybiB0aGlzLl96b25lOyB9XG5cbiAgdGljaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcnVubmluZ1RpY2spIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiQXBwbGljYXRpb25SZWYudGljayBpcyBjYWxsZWQgcmVjdXJzaXZlbHlcIik7XG4gICAgfVxuXG4gICAgdmFyIHMgPSBBcHBsaWNhdGlvblJlZl8uX3RpY2tTY29wZSgpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9ydW5uaW5nVGljayA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZnMuZm9yRWFjaCgoZGV0ZWN0b3IpID0+IGRldGVjdG9yLmRldGVjdENoYW5nZXMoKSk7XG4gICAgICBpZiAodGhpcy5fZW5mb3JjZU5vTmV3Q2hhbmdlcykge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZnMuZm9yRWFjaCgoZGV0ZWN0b3IpID0+IGRldGVjdG9yLmNoZWNrTm9DaGFuZ2VzKCkpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLl9ydW5uaW5nVGljayA9IGZhbHNlO1xuICAgICAgd3RmTGVhdmUocyk7XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICAvLyBUT0RPKGFseGh1Yik6IERpc3Bvc2Ugb2YgdGhlIE5nWm9uZS5cbiAgICBMaXN0V3JhcHBlci5jbG9uZSh0aGlzLl9yb290Q29tcG9uZW50cykuZm9yRWFjaCgocmVmKSA9PiByZWYuZGlzcG9zZSgpKTtcbiAgICB0aGlzLl9kaXNwb3NlTGlzdGVuZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2UoKSk7XG4gICAgdGhpcy5fcGxhdGZvcm0uX2FwcGxpY2F0aW9uRGlzcG9zZWQodGhpcyk7XG4gIH1cblxuICBnZXQgY29tcG9uZW50VHlwZXMoKTogVHlwZVtdIHsgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnRUeXBlczsgfVxufVxuIl19