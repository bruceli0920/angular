'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var metadata_1 = require('angular2/src/core/metadata');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var reflector_reader_1 = require('angular2/src/core/reflection/reflector_reader');
function _isDirectiveMetadata(type) {
    return type instanceof metadata_1.DirectiveMetadata;
}
/*
 * Resolve a `Type` for {@link DirectiveMetadata}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
var DirectiveResolver = (function () {
    function DirectiveResolver(_reflector) {
        if (lang_1.isPresent(_reflector)) {
            this._reflector = _reflector;
        }
        else {
            this._reflector = reflection_1.reflector;
        }
    }
    /**
     * Return {@link DirectiveMetadata} for a given `Type`.
     */
    DirectiveResolver.prototype.resolve = function (type) {
        var typeMetadata = this._reflector.annotations(di_1.resolveForwardRef(type));
        if (lang_1.isPresent(typeMetadata)) {
            var metadata = typeMetadata.find(_isDirectiveMetadata);
            if (lang_1.isPresent(metadata)) {
                var propertyMetadata = this._reflector.propMetadata(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
            }
        }
        throw new exceptions_1.BaseException("No Directive annotation found on " + lang_1.stringify(type));
    };
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
        var inputs = [];
        var outputs = [];
        var host = {};
        var queries = {};
        collection_1.StringMapWrapper.forEach(propertyMetadata, function (metadata, propName) {
            metadata.forEach(function (a) {
                if (a instanceof metadata_1.InputMetadata) {
                    if (lang_1.isPresent(a.bindingPropertyName)) {
                        inputs.push(propName + ": " + a.bindingPropertyName);
                    }
                    else {
                        inputs.push(propName);
                    }
                }
                if (a instanceof metadata_1.OutputMetadata) {
                    if (lang_1.isPresent(a.bindingPropertyName)) {
                        outputs.push(propName + ": " + a.bindingPropertyName);
                    }
                    else {
                        outputs.push(propName);
                    }
                }
                if (a instanceof metadata_1.HostBindingMetadata) {
                    if (lang_1.isPresent(a.hostPropertyName)) {
                        host[("[" + a.hostPropertyName + "]")] = propName;
                    }
                    else {
                        host[("[" + propName + "]")] = propName;
                    }
                }
                if (a instanceof metadata_1.HostListenerMetadata) {
                    var args = lang_1.isPresent(a.args) ? a.args.join(', ') : '';
                    host[("(" + a.eventName + ")")] = propName + "(" + args + ")";
                }
                if (a instanceof metadata_1.ContentChildrenMetadata) {
                    queries[propName] = a;
                }
                if (a instanceof metadata_1.ViewChildrenMetadata) {
                    queries[propName] = a;
                }
                if (a instanceof metadata_1.ContentChildMetadata) {
                    queries[propName] = a;
                }
                if (a instanceof metadata_1.ViewChildMetadata) {
                    queries[propName] = a;
                }
            });
        });
        return this._merge(dm, inputs, outputs, host, queries, directiveType);
    };
    DirectiveResolver.prototype._merge = function (dm, inputs, outputs, host, queries, directiveType) {
        var mergedInputs = lang_1.isPresent(dm.inputs) ? collection_1.ListWrapper.concat(dm.inputs, inputs) : inputs;
        var mergedOutputs;
        if (lang_1.isPresent(dm.outputs)) {
            dm.outputs.forEach(function (propName) {
                if (collection_1.ListWrapper.contains(outputs, propName)) {
                    throw new exceptions_1.BaseException("Output event '" + propName + "' defined multiple times in '" + lang_1.stringify(directiveType) + "'");
                }
            });
            mergedOutputs = collection_1.ListWrapper.concat(dm.outputs, outputs);
        }
        else {
            mergedOutputs = outputs;
        }
        var mergedHost = lang_1.isPresent(dm.host) ? collection_1.StringMapWrapper.merge(dm.host, host) : host;
        var mergedQueries = lang_1.isPresent(dm.queries) ? collection_1.StringMapWrapper.merge(dm.queries, queries) : queries;
        if (dm instanceof metadata_1.ComponentMetadata) {
            return new metadata_1.ComponentMetadata({
                selector: dm.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: dm.exportAs,
                moduleId: dm.moduleId,
                queries: mergedQueries,
                changeDetection: dm.changeDetection,
                providers: dm.providers,
                viewProviders: dm.viewProviders
            });
        }
        else {
            return new metadata_1.DirectiveMetadata({
                selector: dm.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: dm.exportAs,
                queries: mergedQueries,
                providers: dm.providers
            });
        }
    };
    DirectiveResolver = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [reflector_reader_1.ReflectorReader])
    ], DirectiveResolver);
    return DirectiveResolver;
})();
exports.DirectiveResolver = DirectiveResolver;
exports.CODEGEN_DIRECTIVE_RESOLVER = new DirectiveResolver(reflection_1.reflector);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vTEpHOXdKYi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2RpcmVjdGl2ZV9yZXNvbHZlci50cyJdLCJuYW1lcyI6WyJfaXNEaXJlY3RpdmVNZXRhZGF0YSIsIkRpcmVjdGl2ZVJlc29sdmVyIiwiRGlyZWN0aXZlUmVzb2x2ZXIuY29uc3RydWN0b3IiLCJEaXJlY3RpdmVSZXNvbHZlci5yZXNvbHZlIiwiRGlyZWN0aXZlUmVzb2x2ZXIuX21lcmdlV2l0aFByb3BlcnR5TWV0YWRhdGEiLCJEaXJlY3RpdmVSZXNvbHZlci5fbWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLG1CQUE0QyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ25FLHFCQUFrRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQzdFLDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdELDJCQUE0QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTdFLHlCQVdPLDRCQUE0QixDQUFDLENBQUE7QUFDcEMsMkJBQXdCLHlDQUF5QyxDQUFDLENBQUE7QUFDbEUsaUNBQThCLCtDQUErQyxDQUFDLENBQUE7QUFFOUUsOEJBQThCLElBQVM7SUFDckNBLE1BQU1BLENBQUNBLElBQUlBLFlBQVlBLDRCQUFpQkEsQ0FBQ0E7QUFDM0NBLENBQUNBO0FBRUQ7Ozs7OztHQU1HO0FBQ0g7SUFJRUMsMkJBQVlBLFVBQTRCQTtRQUN0Q0MsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZ0JBQVNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzFCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDTkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0Esc0JBQVNBLENBQUNBO1FBQzlCQSxD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QSxFQUFFQSxFQUFFQSxDQUFDQSxhQUFhQTthQUNoQ0EsQ0FBQ0EsQ0FBQ0E7UUFFTEEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDTkEsTUFBTUEsQ0FBQ0EsSUFBSUEsNEJBQWlCQSxDQUFDQTtnQkFDM0JBLFFBQVFBLEVBQUVBLEVBQUVBLENBQUNBLFFBQVFBO2dCQUNyQkEsTUFBTUEsRUFBRUEsWUFBWUE7Z0JBQ3BCQSxPQUFPQSxFQUFFQSxhQUFhQTtnQkFDdEJBLElBQUlBLEVBQUVBLFVBQVVBO2dCQUNoQkEsUUFBUUEsRUFBRUEsRUFBRUEsQ0FBQ0EsUUFBUUE7Z0JBQ3JCQSxPQUFPQSxFQUFFQSxhQUFhQTtnQkFDdEJBLFNBQVNBLEVBQUVBLEVBQUVBLENBQUNBLFNBQVNBO2FBQ3hCQSxDQUFDQSxDQUFDQTtRQUNMQSxDQUFDQTtJQUNIQSxDQUFDQTtJQXRJSEo7UUFBQ0EsZUFBVUEsRUFBRUE7OzBCQXVJWkE7SUFBREEsd0JBQUNBO0FBQURBLENBQUNBLEFBdklELElBdUlDO0FBdElZLHlCQUFpQixvQkFzSTdCLENBQUE7QUFFVSxrQ0FBMEIsR0FBRyxJQUFJLGlCQUFpQixDQUFDLHNCQUFTLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZUZvcndhcmRSZWYsIEluamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7VHlwZSwgaXNQcmVzZW50LCBpc0JsYW5rLCBzdHJpbmdpZnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcG9uZW50TWV0YWRhdGEsXG4gIElucHV0TWV0YWRhdGEsXG4gIE91dHB1dE1ldGFkYXRhLFxuICBIb3N0QmluZGluZ01ldGFkYXRhLFxuICBIb3N0TGlzdGVuZXJNZXRhZGF0YSxcbiAgQ29udGVudENoaWxkcmVuTWV0YWRhdGEsXG4gIFZpZXdDaGlsZHJlbk1ldGFkYXRhLFxuICBDb250ZW50Q2hpbGRNZXRhZGF0YSxcbiAgVmlld0NoaWxkTWV0YWRhdGFcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge1JlZmxlY3RvclJlYWRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVmbGVjdGlvbi9yZWZsZWN0b3JfcmVhZGVyJztcblxuZnVuY3Rpb24gX2lzRGlyZWN0aXZlTWV0YWRhdGEodHlwZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0eXBlIGluc3RhbmNlb2YgRGlyZWN0aXZlTWV0YWRhdGE7XG59XG5cbi8qXG4gKiBSZXNvbHZlIGEgYFR5cGVgIGZvciB7QGxpbmsgRGlyZWN0aXZlTWV0YWRhdGF9LlxuICpcbiAqIFRoaXMgaW50ZXJmYWNlIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHRoZSBhcHBsaWNhdGlvbiBkZXZlbG9wZXIgdG8gY3JlYXRlIGN1c3RvbSBiZWhhdmlvci5cbiAqXG4gKiBTZWUge0BsaW5rIENvbXBpbGVyfVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlUmVzb2x2ZXIge1xuICBwcml2YXRlIF9yZWZsZWN0b3I6IFJlZmxlY3RvclJlYWRlcjtcblxuICBjb25zdHJ1Y3RvcihfcmVmbGVjdG9yPzogUmVmbGVjdG9yUmVhZGVyKSB7XG4gICAgaWYgKGlzUHJlc2VudChfcmVmbGVjdG9yKSkge1xuICAgICAgdGhpcy5fcmVmbGVjdG9yID0gX3JlZmxlY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVmbGVjdG9yID0gcmVmbGVjdG9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4ge0BsaW5rIERpcmVjdGl2ZU1ldGFkYXRhfSBmb3IgYSBnaXZlbiBgVHlwZWAuXG4gICAqL1xuICByZXNvbHZlKHR5cGU6IFR5cGUpOiBEaXJlY3RpdmVNZXRhZGF0YSB7XG4gICAgdmFyIHR5cGVNZXRhZGF0YSA9IHRoaXMuX3JlZmxlY3Rvci5hbm5vdGF0aW9ucyhyZXNvbHZlRm9yd2FyZFJlZih0eXBlKSk7XG4gICAgaWYgKGlzUHJlc2VudCh0eXBlTWV0YWRhdGEpKSB7XG4gICAgICB2YXIgbWV0YWRhdGEgPSB0eXBlTWV0YWRhdGEuZmluZChfaXNEaXJlY3RpdmVNZXRhZGF0YSk7XG4gICAgICBpZiAoaXNQcmVzZW50KG1ldGFkYXRhKSkge1xuICAgICAgICB2YXIgcHJvcGVydHlNZXRhZGF0YSA9IHRoaXMuX3JlZmxlY3Rvci5wcm9wTWV0YWRhdGEodHlwZSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9tZXJnZVdpdGhQcm9wZXJ0eU1ldGFkYXRhKG1ldGFkYXRhLCBwcm9wZXJ0eU1ldGFkYXRhLCB0eXBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgTm8gRGlyZWN0aXZlIGFubm90YXRpb24gZm91bmQgb24gJHtzdHJpbmdpZnkodHlwZSl9YCk7XG4gIH1cblxuICBwcml2YXRlIF9tZXJnZVdpdGhQcm9wZXJ0eU1ldGFkYXRhKGRtOiBEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU1ldGFkYXRhOiB7W2tleTogc3RyaW5nXTogYW55W119LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVR5cGU6IFR5cGUpOiBEaXJlY3RpdmVNZXRhZGF0YSB7XG4gICAgdmFyIGlucHV0cyA9IFtdO1xuICAgIHZhciBvdXRwdXRzID0gW107XG4gICAgdmFyIGhvc3Q6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgdmFyIHF1ZXJpZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG5cbiAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2gocHJvcGVydHlNZXRhZGF0YSwgKG1ldGFkYXRhOiBhbnlbXSwgcHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgbWV0YWRhdGEuZm9yRWFjaChhID0+IHtcbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBJbnB1dE1ldGFkYXRhKSB7XG4gICAgICAgICAgaWYgKGlzUHJlc2VudChhLmJpbmRpbmdQcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChgJHtwcm9wTmFtZX06ICR7YS5iaW5kaW5nUHJvcGVydHlOYW1lfWApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChwcm9wTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBPdXRwdXRNZXRhZGF0YSkge1xuICAgICAgICAgIGlmIChpc1ByZXNlbnQoYS5iaW5kaW5nUHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKGAke3Byb3BOYW1lfTogJHthLmJpbmRpbmdQcm9wZXJ0eU5hbWV9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dHMucHVzaChwcm9wTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBIb3N0QmluZGluZ01ldGFkYXRhKSB7XG4gICAgICAgICAgaWYgKGlzUHJlc2VudChhLmhvc3RQcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICBob3N0W2BbJHthLmhvc3RQcm9wZXJ0eU5hbWV9XWBdID0gcHJvcE5hbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhvc3RbYFske3Byb3BOYW1lfV1gXSA9IHByb3BOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgSG9zdExpc3RlbmVyTWV0YWRhdGEpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGlzUHJlc2VudChhLmFyZ3MpID8gKDxhbnlbXT5hLmFyZ3MpLmpvaW4oJywgJykgOiAnJztcbiAgICAgICAgICBob3N0W2AoJHthLmV2ZW50TmFtZX0pYF0gPSBgJHtwcm9wTmFtZX0oJHthcmdzfSlgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBDb250ZW50Q2hpbGRyZW5NZXRhZGF0YSkge1xuICAgICAgICAgIHF1ZXJpZXNbcHJvcE5hbWVdID0gYTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgVmlld0NoaWxkcmVuTWV0YWRhdGEpIHtcbiAgICAgICAgICBxdWVyaWVzW3Byb3BOYW1lXSA9IGE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIENvbnRlbnRDaGlsZE1ldGFkYXRhKSB7XG4gICAgICAgICAgcXVlcmllc1twcm9wTmFtZV0gPSBhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBWaWV3Q2hpbGRNZXRhZGF0YSkge1xuICAgICAgICAgIHF1ZXJpZXNbcHJvcE5hbWVdID0gYTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuX21lcmdlKGRtLCBpbnB1dHMsIG91dHB1dHMsIGhvc3QsIHF1ZXJpZXMsIGRpcmVjdGl2ZVR5cGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWVyZ2UoZG06IERpcmVjdGl2ZU1ldGFkYXRhLCBpbnB1dHM6IHN0cmluZ1tdLCBvdXRwdXRzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgaG9zdDoge1trZXk6IHN0cmluZ106IHN0cmluZ30sIHF1ZXJpZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgICAgICAgICAgICBkaXJlY3RpdmVUeXBlOiBUeXBlKTogRGlyZWN0aXZlTWV0YWRhdGEge1xuICAgIHZhciBtZXJnZWRJbnB1dHMgPSBpc1ByZXNlbnQoZG0uaW5wdXRzKSA/IExpc3RXcmFwcGVyLmNvbmNhdChkbS5pbnB1dHMsIGlucHV0cykgOiBpbnB1dHM7XG5cbiAgICB2YXIgbWVyZ2VkT3V0cHV0cztcbiAgICBpZiAoaXNQcmVzZW50KGRtLm91dHB1dHMpKSB7XG4gICAgICBkbS5vdXRwdXRzLmZvckVhY2goKHByb3BOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKExpc3RXcmFwcGVyLmNvbnRhaW5zKG91dHB1dHMsIHByb3BOYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgICBgT3V0cHV0IGV2ZW50ICcke3Byb3BOYW1lfScgZGVmaW5lZCBtdWx0aXBsZSB0aW1lcyBpbiAnJHtzdHJpbmdpZnkoZGlyZWN0aXZlVHlwZSl9J2ApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1lcmdlZE91dHB1dHMgPSBMaXN0V3JhcHBlci5jb25jYXQoZG0ub3V0cHV0cywgb3V0cHV0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lcmdlZE91dHB1dHMgPSBvdXRwdXRzO1xuICAgIH1cblxuICAgIHZhciBtZXJnZWRIb3N0ID0gaXNQcmVzZW50KGRtLmhvc3QpID8gU3RyaW5nTWFwV3JhcHBlci5tZXJnZShkbS5ob3N0LCBob3N0KSA6IGhvc3Q7XG4gICAgdmFyIG1lcmdlZFF1ZXJpZXMgPVxuICAgICAgICBpc1ByZXNlbnQoZG0ucXVlcmllcykgPyBTdHJpbmdNYXBXcmFwcGVyLm1lcmdlKGRtLnF1ZXJpZXMsIHF1ZXJpZXMpIDogcXVlcmllcztcblxuICAgIGlmIChkbSBpbnN0YW5jZW9mIENvbXBvbmVudE1ldGFkYXRhKSB7XG4gICAgICByZXR1cm4gbmV3IENvbXBvbmVudE1ldGFkYXRhKHtcbiAgICAgICAgc2VsZWN0b3I6IGRtLnNlbGVjdG9yLFxuICAgICAgICBpbnB1dHM6IG1lcmdlZElucHV0cyxcbiAgICAgICAgb3V0cHV0czogbWVyZ2VkT3V0cHV0cyxcbiAgICAgICAgaG9zdDogbWVyZ2VkSG9zdCxcbiAgICAgICAgZXhwb3J0QXM6IGRtLmV4cG9ydEFzLFxuICAgICAgICBtb2R1bGVJZDogZG0ubW9kdWxlSWQsXG4gICAgICAgIHF1ZXJpZXM6IG1lcmdlZFF1ZXJpZXMsXG4gICAgICAgIGNoYW5nZURldGVjdGlvbjogZG0uY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgICBwcm92aWRlcnM6IGRtLnByb3ZpZGVycyxcbiAgICAgICAgdmlld1Byb3ZpZGVyczogZG0udmlld1Byb3ZpZGVyc1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgIHNlbGVjdG9yOiBkbS5zZWxlY3RvcixcbiAgICAgICAgaW5wdXRzOiBtZXJnZWRJbnB1dHMsXG4gICAgICAgIG91dHB1dHM6IG1lcmdlZE91dHB1dHMsXG4gICAgICAgIGhvc3Q6IG1lcmdlZEhvc3QsXG4gICAgICAgIGV4cG9ydEFzOiBkbS5leHBvcnRBcyxcbiAgICAgICAgcXVlcmllczogbWVyZ2VkUXVlcmllcyxcbiAgICAgICAgcHJvdmlkZXJzOiBkbS5wcm92aWRlcnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdmFyIENPREVHRU5fRElSRUNUSVZFX1JFU09MVkVSID0gbmV3IERpcmVjdGl2ZVJlc29sdmVyKHJlZmxlY3Rvcik7XG4iXX0=