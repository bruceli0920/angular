import { isPresent, isFunction, global, stringify } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
export class ReflectionCapabilities {
    constructor(reflect) {
        this._reflect = isPresent(reflect) ? reflect : global.Reflect;
    }
    isReflectionEnabled() { return true; }
    factory(t) {
        switch (t.length) {
            case 0:
                return () => new t();
            case 1:
                return (a1) => new t(a1);
            case 2:
                return (a1, a2) => new t(a1, a2);
            case 3:
                return (a1, a2, a3) => new t(a1, a2, a3);
            case 4:
                return (a1, a2, a3, a4) => new t(a1, a2, a3, a4);
            case 5:
                return (a1, a2, a3, a4, a5) => new t(a1, a2, a3, a4, a5);
            case 6:
                return (a1, a2, a3, a4, a5, a6) => new t(a1, a2, a3, a4, a5, a6);
            case 7:
                return (a1, a2, a3, a4, a5, a6, a7) => new t(a1, a2, a3, a4, a5, a6, a7);
            case 8:
                return (a1, a2, a3, a4, a5, a6, a7, a8) => new t(a1, a2, a3, a4, a5, a6, a7, a8);
            case 9:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9);
            case 10:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
            case 11:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
            case 12:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
            case 13:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
            case 14:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
            case 15:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
            case 16:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16);
            case 17:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17);
            case 18:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18);
            case 19:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19);
            case 20:
                return (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20) => new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20);
        }
        ;
        throw new Error(`Cannot create a factory for '${stringify(t)}' because its constructor has more than 20 arguments`);
    }
    /** @internal */
    _zipTypesAndAnnotations(paramTypes, paramAnnotations) {
        var result;
        if (typeof paramTypes === 'undefined') {
            result = new Array(paramAnnotations.length);
        }
        else {
            result = new Array(paramTypes.length);
        }
        for (var i = 0; i < result.length; i++) {
            // TS outputs Object for parameters without types, while Traceur omits
            // the annotations. For now we preserve the Traceur behavior to aid
            // migration, but this can be revisited.
            if (typeof paramTypes === 'undefined') {
                result[i] = [];
            }
            else if (paramTypes[i] != Object) {
                result[i] = [paramTypes[i]];
            }
            else {
                result[i] = [];
            }
            if (isPresent(paramAnnotations) && isPresent(paramAnnotations[i])) {
                result[i] = result[i].concat(paramAnnotations[i]);
            }
        }
        return result;
    }
    parameters(typeOrFunc) {
        // Prefer the direct API.
        if (isPresent(typeOrFunc.parameters)) {
            return typeOrFunc.parameters;
        }
        if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
            var paramAnnotations = this._reflect.getMetadata('parameters', typeOrFunc);
            var paramTypes = this._reflect.getMetadata('design:paramtypes', typeOrFunc);
            if (isPresent(paramTypes) || isPresent(paramAnnotations)) {
                return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
            }
        }
        // The array has to be filled with `undefined` because holes would be skipped by `some`
        let parameters = new Array(typeOrFunc.length);
        parameters.fill(undefined);
        return parameters;
    }
    annotations(typeOrFunc) {
        // Prefer the direct API.
        if (isPresent(typeOrFunc.annotations)) {
            var annotations = typeOrFunc.annotations;
            if (isFunction(annotations) && annotations.annotations) {
                annotations = annotations.annotations;
            }
            return annotations;
        }
        if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
            var annotations = this._reflect.getMetadata('annotations', typeOrFunc);
            if (isPresent(annotations))
                return annotations;
        }
        return [];
    }
    propMetadata(typeOrFunc) {
        // Prefer the direct API.
        if (isPresent(typeOrFunc.propMetadata)) {
            var propMetadata = typeOrFunc.propMetadata;
            if (isFunction(propMetadata) && propMetadata.propMetadata) {
                propMetadata = propMetadata.propMetadata;
            }
            return propMetadata;
        }
        if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
            var propMetadata = this._reflect.getMetadata('propMetadata', typeOrFunc);
            if (isPresent(propMetadata))
                return propMetadata;
        }
        return {};
    }
    interfaces(type) {
        throw new BaseException("JavaScript does not support interfaces");
    }
    getter(name) { return new Function('o', 'return o.' + name + ';'); }
    setter(name) {
        return new Function('o', 'v', 'return o.' + name + ' = v;');
    }
    method(name) {
        let functionBody = `if (!o.${name}) throw new Error('"${name}" is undefined');
        return o.${name}.apply(o, args);`;
        return new Function('o', 'args', functionBody);
    }
    // There is not a concept of import uri in Js, but this is useful in developing Dart applications.
    importUri(type) { return './'; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGlvbl9jYXBhYmlsaXRpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXhuT3RlcGZ1LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb25fY2FwYWJpbGl0aWVzLnRzIl0sIm5hbWVzIjpbIlJlZmxlY3Rpb25DYXBhYmlsaXRpZXMiLCJSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLmNvbnN0cnVjdG9yIiwiUmVmbGVjdGlvbkNhcGFiaWxpdGllcy5pc1JlZmxlY3Rpb25FbmFibGVkIiwiUmVmbGVjdGlvbkNhcGFiaWxpdGllcy5mYWN0b3J5IiwiUmVmbGVjdGlvbkNhcGFiaWxpdGllcy5femlwVHlwZXNBbmRBbm5vdGF0aW9ucyIsIlJlZmxlY3Rpb25DYXBhYmlsaXRpZXMucGFyYW1ldGVycyIsIlJlZmxlY3Rpb25DYXBhYmlsaXRpZXMuYW5ub3RhdGlvbnMiLCJSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLnByb3BNZXRhZGF0YSIsIlJlZmxlY3Rpb25DYXBhYmlsaXRpZXMuaW50ZXJmYWNlcyIsIlJlZmxlY3Rpb25DYXBhYmlsaXRpZXMuZ2V0dGVyIiwiUmVmbGVjdGlvbkNhcGFiaWxpdGllcy5zZXR0ZXIiLCJSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLm1ldGhvZCIsIlJlZmxlY3Rpb25DYXBhYmlsaXRpZXMuaW1wb3J0VXJpIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFNBQVMsRUFFVixNQUFNLDBCQUEwQjtPQUMxQixFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztBQUk1RDtJQUdFQSxZQUFZQSxPQUFhQTtRQUFJQyxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUFDQSxDQUFDQTtJQUU3RkQsbUJBQW1CQSxLQUFjRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUUvQ0YsT0FBT0EsQ0FBQ0EsQ0FBZUE7UUFDckJHLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ2pCQSxLQUFLQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDdkJBLEtBQUtBLENBQUNBO2dCQUNKQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFPQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNoQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ0pBLE1BQU1BLENBQUNBLENBQUNBLEVBQU9BLEVBQUVBLEVBQU9BLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQzdDQSxLQUFLQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDMURBLEtBQUtBLENBQUNBO2dCQUNKQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUN2RUEsS0FBS0EsQ0FBQ0E7Z0JBQ0pBLE1BQU1BLENBQUNBLENBQUNBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3BGQSxLQUFLQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsS0FDakRBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQzNDQSxLQUFLQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsS0FDMURBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQy9DQSxLQUFLQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsS0FDbkVBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQ25EQSxLQUFLQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsS0FDNUVBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3ZEQSxLQUFLQSxFQUFFQTtnQkFDTEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFDL0VBLEdBQVFBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3RFQSxLQUFLQSxFQUFFQTtnQkFDTEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFDL0VBLEdBQVFBLEVBQUVBLEdBQVFBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3JGQSxLQUFLQSxFQUFFQTtnQkFDTEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFDL0VBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEtBQ3pCQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUN0RUEsS0FBS0EsRUFBRUE7Z0JBQ0xBLE1BQU1BLENBQUNBLENBQUNBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQy9FQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxLQUNuQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLEtBQUtBLEVBQUVBO2dCQUNMQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUMvRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsS0FDN0NBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2hGQSxLQUFLQSxFQUFFQTtnQkFDTEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFDL0VBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEtBQ3ZEQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNyRkEsS0FBS0EsRUFBRUE7Z0JBQ0xBLE1BQU1BLENBQUNBLENBQUNBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQy9FQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxLQUNqRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDMUZBLEtBQUtBLEVBQUVBO2dCQUNMQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUMvRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsS0FDM0VBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQ3JFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUN4QkEsS0FBS0EsRUFBRUE7Z0JBQ0xBLE1BQU1BLENBQUNBLENBQUNBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQUVBLEVBQU9BLEVBQy9FQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUFFQSxHQUFRQSxFQUM5RUEsR0FBUUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFDaEVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQzVDQSxLQUFLQSxFQUFFQTtnQkFDTEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFBRUEsRUFBT0EsRUFDL0VBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQzlFQSxHQUFRQSxFQUFFQSxHQUFRQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUN0REEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDckVBLEtBQUtBLEVBQUVBO2dCQUNMQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUFFQSxFQUFPQSxFQUMvRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFBRUEsR0FBUUEsRUFDOUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQzVDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoR0EsQ0FBQ0E7UUFBQUEsQ0FBQ0E7UUFFRkEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FDWEEsZ0NBQWdDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxzREFBc0RBLENBQUNBLENBQUNBO0lBQzFHQSxDQUFDQTtJQUVESCxnQkFBZ0JBO0lBQ2hCQSx1QkFBdUJBLENBQUNBLFVBQVVBLEVBQUVBLGdCQUFnQkE7UUFDbERJLElBQUlBLE1BQU1BLENBQUNBO1FBRVhBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLFVBQVVBLEtBQUtBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RDQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxnQkFBZ0JBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzlDQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNOQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN4Q0EsQ0FBQ0E7UUFFREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFB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QSxDQUFDQSxDQUFDQTtJQUMzREEsQ0FBQ0E7SUFFRFgsa0dBQWtHQTtJQUNsR0EsU0FBU0EsQ0FBQ0EsSUFBVUEsSUFBWVksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDaERaLENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBUeXBlLFxuICBpc1ByZXNlbnQsXG4gIGlzRnVuY3Rpb24sXG4gIGdsb2JhbCxcbiAgc3RyaW5naWZ5LFxuICBDb25jcmV0ZVR5cGVcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7R2V0dGVyRm4sIFNldHRlckZuLCBNZXRob2RGbn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge1BsYXRmb3JtUmVmbGVjdGlvbkNhcGFiaWxpdGllc30gZnJvbSAnLi9wbGF0Zm9ybV9yZWZsZWN0aW9uX2NhcGFiaWxpdGllcyc7XG5cbmV4cG9ydCBjbGFzcyBSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzIGltcGxlbWVudHMgUGxhdGZvcm1SZWZsZWN0aW9uQ2FwYWJpbGl0aWVzIHtcbiAgcHJpdmF0ZSBfcmVmbGVjdDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHJlZmxlY3Q/OiBhbnkpIHsgdGhpcy5fcmVmbGVjdCA9IGlzUHJlc2VudChyZWZsZWN0KSA/IHJlZmxlY3QgOiBnbG9iYWwuUmVmbGVjdDsgfVxuXG4gIGlzUmVmbGVjdGlvbkVuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XG5cbiAgZmFjdG9yeSh0OiBDb25jcmV0ZVR5cGUpOiBGdW5jdGlvbiB7XG4gICAgc3dpdGNoICh0Lmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gKCkgPT4gbmV3IHQoKTtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIChhMTogYW55KSA9PiBuZXcgdChhMSk7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiAoYTE6IGFueSwgYTI6IGFueSkgPT4gbmV3IHQoYTEsIGEyKTtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55KSA9PiBuZXcgdChhMSwgYTIsIGEzKTtcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55KSA9PiBuZXcgdChhMSwgYTIsIGEzLCBhNCk7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIHJldHVybiAoYTE6IGFueSwgYTI6IGFueSwgYTM6IGFueSwgYTQ6IGFueSwgYTU6IGFueSkgPT4gbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1KTtcbiAgICAgIGNhc2UgNjpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55LCBhNTogYW55LCBhNjogYW55KSA9PlxuICAgICAgICAgICAgICAgICAgIG5ldyB0KGExLCBhMiwgYTMsIGE0LCBhNSwgYTYpO1xuICAgICAgY2FzZSA3OlxuICAgICAgICByZXR1cm4gKGExOiBhbnksIGEyOiBhbnksIGEzOiBhbnksIGE0OiBhbnksIGE1OiBhbnksIGE2OiBhbnksIGE3OiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcpO1xuICAgICAgY2FzZSA4OlxuICAgICAgICByZXR1cm4gKGExOiBhbnksIGEyOiBhbnksIGEzOiBhbnksIGE0OiBhbnksIGE1OiBhbnksIGE2OiBhbnksIGE3OiBhbnksIGE4OiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4KTtcbiAgICAgIGNhc2UgOTpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55LCBhNTogYW55LCBhNjogYW55LCBhNzogYW55LCBhODogYW55LCBhOTogYW55KSA9PlxuICAgICAgICAgICAgICAgICAgIG5ldyB0KGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTkpO1xuICAgICAgY2FzZSAxMDpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55LCBhNTogYW55LCBhNjogYW55LCBhNzogYW55LCBhODogYW55LCBhOTogYW55LFxuICAgICAgICAgICAgICAgIGExMDogYW55KSA9PiBuZXcgdChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5LCBhMTApO1xuICAgICAgY2FzZSAxMTpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55LCBhNTogYW55LCBhNjogYW55LCBhNzogYW55LCBhODogYW55LCBhOTogYW55LFxuICAgICAgICAgICAgICAgIGExMDogYW55LCBhMTE6IGFueSkgPT4gbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEpO1xuICAgICAgY2FzZSAxMjpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55LCBhNTogYW55LCBhNjogYW55LCBhNzogYW55LCBhODogYW55LCBhOTogYW55LFxuICAgICAgICAgICAgICAgIGExMDogYW55LCBhMTE6IGFueSwgYTEyOiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsIGExMik7XG4gICAgICBjYXNlIDEzOlxuICAgICAgICByZXR1cm4gKGExOiBhbnksIGEyOiBhbnksIGEzOiBhbnksIGE0OiBhbnksIGE1OiBhbnksIGE2OiBhbnksIGE3OiBhbnksIGE4OiBhbnksIGE5OiBhbnksXG4gICAgICAgICAgICAgICAgYTEwOiBhbnksIGExMTogYW55LCBhMTI6IGFueSwgYTEzOiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsIGExMiwgYTEzKTtcbiAgICAgIGNhc2UgMTQ6XG4gICAgICAgIHJldHVybiAoYTE6IGFueSwgYTI6IGFueSwgYTM6IGFueSwgYTQ6IGFueSwgYTU6IGFueSwgYTY6IGFueSwgYTc6IGFueSwgYTg6IGFueSwgYTk6IGFueSxcbiAgICAgICAgICAgICAgICBhMTA6IGFueSwgYTExOiBhbnksIGExMjogYW55LCBhMTM6IGFueSwgYTE0OiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsIGExMiwgYTEzLCBhMTQpO1xuICAgICAgY2FzZSAxNTpcbiAgICAgICAgcmV0dXJuIChhMTogYW55LCBhMjogYW55LCBhMzogYW55LCBhNDogYW55LCBhNTogYW55LCBhNjogYW55LCBhNzogYW55LCBhODogYW55LCBhOTogYW55LFxuICAgICAgICAgICAgICAgIGExMDogYW55LCBhMTE6IGFueSwgYTEyOiBhbnksIGExMzogYW55LCBhMTQ6IGFueSwgYTE1OiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsIGExMiwgYTEzLCBhMTQsIGExNSk7XG4gICAgICBjYXNlIDE2OlxuICAgICAgICByZXR1cm4gKGExOiBhbnksIGEyOiBhbnksIGEzOiBhbnksIGE0OiBhbnksIGE1OiBhbnksIGE2OiBhbnksIGE3OiBhbnksIGE4OiBhbnksIGE5OiBhbnksXG4gICAgICAgICAgICAgICAgYTEwOiBhbnksIGExMTogYW55LCBhMTI6IGFueSwgYTEzOiBhbnksIGExNDogYW55LCBhMTU6IGFueSwgYTE2OiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsIGExMiwgYTEzLCBhMTQsIGExNSwgYTE2KTtcbiAgICAgIGNhc2UgMTc6XG4gICAgICAgIHJldHVybiAoYTE6IGFueSwgYTI6IGFueSwgYTM6IGFueSwgYTQ6IGFueSwgYTU6IGFueSwgYTY6IGFueSwgYTc6IGFueSwgYTg6IGFueSwgYTk6IGFueSxcbiAgICAgICAgICAgICAgICBhMTA6IGFueSwgYTExOiBhbnksIGExMjogYW55LCBhMTM6IGFueSwgYTE0OiBhbnksIGExNTogYW55LCBhMTY6IGFueSwgYTE3OiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsIGExMiwgYTEzLCBhMTQsIGExNSwgYTE2LFxuICAgICAgICAgICAgICAgICAgICAgICAgIGExNyk7XG4gICAgICBjYXNlIDE4OlxuICAgICAgICByZXR1cm4gKGExOiBhbnksIGEyOiBhbnksIGEzOiBhbnksIGE0OiBhbnksIGE1OiBhbnksIGE2OiBhbnksIGE3OiBhbnksIGE4OiBhbnksIGE5OiBhbnksXG4gICAgICAgICAgICAgICAgYTEwOiBhbnksIGExMTogYW55LCBhMTI6IGFueSwgYTEzOiBhbnksIGExNDogYW55LCBhMTU6IGFueSwgYTE2OiBhbnksIGExNzogYW55LFxuICAgICAgICAgICAgICAgIGExODogYW55KSA9PiBuZXcgdChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5LCBhMTAsIGExMSwgYTEyLCBhMTMsIGExNCwgYTE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhMTYsIGExNywgYTE4KTtcbiAgICAgIGNhc2UgMTk6XG4gICAgICAgIHJldHVybiAoYTE6IGFueSwgYTI6IGFueSwgYTM6IGFueSwgYTQ6IGFueSwgYTU6IGFueSwgYTY6IGFueSwgYTc6IGFueSwgYTg6IGFueSwgYTk6IGFueSxcbiAgICAgICAgICAgICAgICBhMTA6IGFueSwgYTExOiBhbnksIGExMjogYW55LCBhMTM6IGFueSwgYTE0OiBhbnksIGExNTogYW55LCBhMTY6IGFueSwgYTE3OiBhbnksXG4gICAgICAgICAgICAgICAgYTE4OiBhbnksIGExOTogYW55KSA9PiBuZXcgdChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5LCBhMTAsIGExMSwgYTEyLCBhMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhMTQsIGExNSwgYTE2LCBhMTcsIGExOCwgYTE5KTtcbiAgICAgIGNhc2UgMjA6XG4gICAgICAgIHJldHVybiAoYTE6IGFueSwgYTI6IGFueSwgYTM6IGFueSwgYTQ6IGFueSwgYTU6IGFueSwgYTY6IGFueSwgYTc6IGFueSwgYTg6IGFueSwgYTk6IGFueSxcbiAgICAgICAgICAgICAgICBhMTA6IGFueSwgYTExOiBhbnksIGExMjogYW55LCBhMTM6IGFueSwgYTE0OiBhbnksIGExNTogYW55LCBhMTY6IGFueSwgYTE3OiBhbnksXG4gICAgICAgICAgICAgICAgYTE4OiBhbnksIGExOTogYW55LCBhMjA6IGFueSkgPT4gbmV3IHQoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwLCBhMTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYTEyLCBhMTMsIGExNCwgYTE1LCBhMTYsIGExNywgYTE4LCBhMTksIGEyMCk7XG4gICAgfTtcblxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYENhbm5vdCBjcmVhdGUgYSBmYWN0b3J5IGZvciAnJHtzdHJpbmdpZnkodCl9JyBiZWNhdXNlIGl0cyBjb25zdHJ1Y3RvciBoYXMgbW9yZSB0aGFuIDIwIGFyZ3VtZW50c2ApO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfemlwVHlwZXNBbmRBbm5vdGF0aW9ucyhwYXJhbVR5cGVzLCBwYXJhbUFubm90YXRpb25zKTogYW55W11bXSB7XG4gICAgdmFyIHJlc3VsdDtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1UeXBlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJlc3VsdCA9IG5ldyBBcnJheShwYXJhbUFubm90YXRpb25zLmxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IG5ldyBBcnJheShwYXJhbVR5cGVzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIFRTIG91dHB1dHMgT2JqZWN0IGZvciBwYXJhbWV0ZXJzIHdpdGhvdXQgdHlwZXMsIHdoaWxlIFRyYWNldXIgb21pdHNcbiAgICAgIC8vIHRoZSBhbm5vdGF0aW9ucy4gRm9yIG5vdyB3ZSBwcmVzZXJ2ZSB0aGUgVHJhY2V1ciBiZWhhdmlvciB0byBhaWRcbiAgICAgIC8vIG1pZ3JhdGlvbiwgYnV0IHRoaXMgY2FuIGJlIHJldmlzaXRlZC5cbiAgICAgIGlmICh0eXBlb2YgcGFyYW1UeXBlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVzdWx0W2ldID0gW107XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtVHlwZXNbaV0gIT0gT2JqZWN0KSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IFtwYXJhbVR5cGVzW2ldXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IFtdO1xuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudChwYXJhbUFubm90YXRpb25zKSAmJiBpc1ByZXNlbnQocGFyYW1Bbm5vdGF0aW9uc1tpXSkpIHtcbiAgICAgICAgcmVzdWx0W2ldID0gcmVzdWx0W2ldLmNvbmNhdChwYXJhbUFubm90YXRpb25zW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHBhcmFtZXRlcnModHlwZU9yRnVuYzogVHlwZSk6IGFueVtdW10ge1xuICAgIC8vIFByZWZlciB0aGUgZGlyZWN0IEFQSS5cbiAgICBpZiAoaXNQcmVzZW50KCg8YW55PnR5cGVPckZ1bmMpLnBhcmFtZXRlcnMpKSB7XG4gICAgICByZXR1cm4gKDxhbnk+dHlwZU9yRnVuYykucGFyYW1ldGVycztcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9yZWZsZWN0KSAmJiBpc1ByZXNlbnQodGhpcy5fcmVmbGVjdC5nZXRNZXRhZGF0YSkpIHtcbiAgICAgIHZhciBwYXJhbUFubm90YXRpb25zID0gdGhpcy5fcmVmbGVjdC5nZXRNZXRhZGF0YSgncGFyYW1ldGVycycsIHR5cGVPckZ1bmMpO1xuICAgICAgdmFyIHBhcmFtVHlwZXMgPSB0aGlzLl9yZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHR5cGVPckZ1bmMpO1xuICAgICAgaWYgKGlzUHJlc2VudChwYXJhbVR5cGVzKSB8fCBpc1ByZXNlbnQocGFyYW1Bbm5vdGF0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ppcFR5cGVzQW5kQW5ub3RhdGlvbnMocGFyYW1UeXBlcywgcGFyYW1Bbm5vdGF0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRoZSBhcnJheSBoYXMgdG8gYmUgZmlsbGVkIHdpdGggYHVuZGVmaW5lZGAgYmVjYXVzZSBob2xlcyB3b3VsZCBiZSBza2lwcGVkIGJ5IGBzb21lYFxuICAgIGxldCBwYXJhbWV0ZXJzID0gbmV3IEFycmF5KCg8YW55PnR5cGVPckZ1bmMubGVuZ3RoKSk7XG4gICAgcGFyYW1ldGVycy5maWxsKHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHBhcmFtZXRlcnM7XG4gIH1cblxuICBhbm5vdGF0aW9ucyh0eXBlT3JGdW5jOiBUeXBlKTogYW55W10ge1xuICAgIC8vIFByZWZlciB0aGUgZGlyZWN0IEFQSS5cbiAgICBpZiAoaXNQcmVzZW50KCg8YW55PnR5cGVPckZ1bmMpLmFubm90YXRpb25zKSkge1xuICAgICAgdmFyIGFubm90YXRpb25zID0gKDxhbnk+dHlwZU9yRnVuYykuYW5ub3RhdGlvbnM7XG4gICAgICBpZiAoaXNGdW5jdGlvbihhbm5vdGF0aW9ucykgJiYgYW5ub3RhdGlvbnMuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgYW5ub3RhdGlvbnMgPSBhbm5vdGF0aW9ucy5hbm5vdGF0aW9ucztcbiAgICAgIH1cbiAgICAgIHJldHVybiBhbm5vdGF0aW9ucztcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9yZWZsZWN0KSAmJiBpc1ByZXNlbnQodGhpcy5fcmVmbGVjdC5nZXRNZXRhZGF0YSkpIHtcbiAgICAgIHZhciBhbm5vdGF0aW9ucyA9IHRoaXMuX3JlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Fubm90YXRpb25zJywgdHlwZU9yRnVuYyk7XG4gICAgICBpZiAoaXNQcmVzZW50KGFubm90YXRpb25zKSkgcmV0dXJuIGFubm90YXRpb25zO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwcm9wTWV0YWRhdGEodHlwZU9yRnVuYzogYW55KToge1trZXk6IHN0cmluZ106IGFueVtdfSB7XG4gICAgLy8gUHJlZmVyIHRoZSBkaXJlY3QgQVBJLlxuICAgIGlmIChpc1ByZXNlbnQoKDxhbnk+dHlwZU9yRnVuYykucHJvcE1ldGFkYXRhKSkge1xuICAgICAgdmFyIHByb3BNZXRhZGF0YSA9ICg8YW55PnR5cGVPckZ1bmMpLnByb3BNZXRhZGF0YTtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKHByb3BNZXRhZGF0YSkgJiYgcHJvcE1ldGFkYXRhLnByb3BNZXRhZGF0YSkge1xuICAgICAgICBwcm9wTWV0YWRhdGEgPSBwcm9wTWV0YWRhdGEucHJvcE1ldGFkYXRhO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb3BNZXRhZGF0YTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9yZWZsZWN0KSAmJiBpc1ByZXNlbnQodGhpcy5fcmVmbGVjdC5nZXRNZXRhZGF0YSkpIHtcbiAgICAgIHZhciBwcm9wTWV0YWRhdGEgPSB0aGlzLl9yZWZsZWN0LmdldE1ldGFkYXRhKCdwcm9wTWV0YWRhdGEnLCB0eXBlT3JGdW5jKTtcbiAgICAgIGlmIChpc1ByZXNlbnQocHJvcE1ldGFkYXRhKSkgcmV0dXJuIHByb3BNZXRhZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgaW50ZXJmYWNlcyh0eXBlOiBUeXBlKTogYW55W10ge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiSmF2YVNjcmlwdCBkb2VzIG5vdCBzdXBwb3J0IGludGVyZmFjZXNcIik7XG4gIH1cblxuICBnZXR0ZXIobmFtZTogc3RyaW5nKTogR2V0dGVyRm4geyByZXR1cm4gPEdldHRlckZuPm5ldyBGdW5jdGlvbignbycsICdyZXR1cm4gby4nICsgbmFtZSArICc7Jyk7IH1cblxuICBzZXR0ZXIobmFtZTogc3RyaW5nKTogU2V0dGVyRm4ge1xuICAgIHJldHVybiA8U2V0dGVyRm4+bmV3IEZ1bmN0aW9uKCdvJywgJ3YnLCAncmV0dXJuIG8uJyArIG5hbWUgKyAnID0gdjsnKTtcbiAgfVxuXG4gIG1ldGhvZChuYW1lOiBzdHJpbmcpOiBNZXRob2RGbiB7XG4gICAgbGV0IGZ1bmN0aW9uQm9keSA9IGBpZiAoIW8uJHtuYW1lfSkgdGhyb3cgbmV3IEVycm9yKCdcIiR7bmFtZX1cIiBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgcmV0dXJuIG8uJHtuYW1lfS5hcHBseShvLCBhcmdzKTtgO1xuICAgIHJldHVybiA8TWV0aG9kRm4+bmV3IEZ1bmN0aW9uKCdvJywgJ2FyZ3MnLCBmdW5jdGlvbkJvZHkpO1xuICB9XG5cbiAgLy8gVGhlcmUgaXMgbm90IGEgY29uY2VwdCBvZiBpbXBvcnQgdXJpIGluIEpzLCBidXQgdGhpcyBpcyB1c2VmdWwgaW4gZGV2ZWxvcGluZyBEYXJ0IGFwcGxpY2F0aW9ucy5cbiAgaW1wb3J0VXJpKHR5cGU6IFR5cGUpOiBzdHJpbmcgeyByZXR1cm4gJy4vJzsgfVxufVxuIl19