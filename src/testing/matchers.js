'use strict';var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var _global = (typeof window === 'undefined' ? lang_1.global : window);
/**
 * Jasmine matching function with Angular matchers mixed in.
 *
 * ## Example
 *
 * {@example testing/ts/matchers.ts region='toHaveText'}
 */
exports.expect = _global.expect;
// Some Map polyfills don't polyfill Map.toString correctly, which
// gives us bad error messages in tests.
// The only way to do this in Jasmine is to monkey patch a method
// to the object :-(
Map.prototype['jasmineToString'] = function () {
    var m = this;
    if (!m) {
        return '' + m;
    }
    var res = [];
    m.forEach(function (v, k) { res.push(k + ":" + v); });
    return "{ " + res.join(',') + " }";
};
_global.beforeEach(function () {
    jasmine.addMatchers({
        // Custom handler for Map as Jasmine does not support it yet
        toEqual: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expected) {
                    return { pass: util.equals(actual, expected, [compareMap]) };
                }
            };
            function compareMap(actual, expected) {
                if (actual instanceof Map) {
                    var pass = actual.size === expected.size;
                    if (pass) {
                        actual.forEach(function (v, k) { pass = pass && util.equals(v, expected.get(k)); });
                    }
                    return pass;
                }
                else {
                    return undefined;
                }
            }
        },
        toBePromise: function () {
            return {
                compare: function (actual, expectedClass) {
                    var pass = typeof actual === 'object' && typeof actual.then === 'function';
                    return { pass: pass, get message() { return 'Expected ' + actual + ' to be a promise'; } };
                }
            };
        },
        toBeAnInstanceOf: function () {
            return {
                compare: function (actual, expectedClass) {
                    var pass = typeof actual === 'object' && actual instanceof expectedClass;
                    return {
                        pass: pass,
                        get message() {
                            return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                        }
                    };
                }
            };
        },
        toHaveText: function () {
            return {
                compare: function (actual, expectedText) {
                    var actualText = elementText(actual);
                    return {
                        pass: actualText == expectedText,
                        get message() { return 'Expected ' + actualText + ' to be equal to ' + expectedText; }
                    };
                }
            };
        },
        toHaveCssClass: function () {
            return { compare: buildError(false), negativeCompare: buildError(true) };
            function buildError(isNot) {
                return function (actual, className) {
                    return {
                        pass: dom_adapter_1.DOM.hasClass(actual, className) == !isNot,
                        get message() {
                            return "Expected " + actual.outerHTML + " " + (isNot ? 'not ' : '') + "to contain the CSS class \"" + className + "\"";
                        }
                    };
                };
            }
        },
        toHaveCssStyle: function () {
            return {
                compare: function (actual, styles) {
                    var allPassed;
                    if (lang_1.isString(styles)) {
                        allPassed = dom_adapter_1.DOM.hasStyle(actual, styles);
                    }
                    else {
                        allPassed = !collection_1.StringMapWrapper.isEmpty(styles);
                        collection_1.StringMapWrapper.forEach(styles, function (style, prop) {
                            allPassed = allPassed && dom_adapter_1.DOM.hasStyle(actual, prop, style);
                        });
                    }
                    return {
                        pass: allPassed,
                        get message() {
                            var expectedValueStr = lang_1.isString(styles) ? styles : JSON.stringify(styles);
                            return "Expected " + actual.outerHTML + " " + (!allPassed ? ' ' : 'not ') + "to contain the\n                      CSS " + (lang_1.isString(styles) ? 'property' : 'styles') + " \"" + expectedValueStr + "\"";
                        }
                    };
                }
            };
        },
        toContainError: function () {
            return {
                compare: function (actual, expectedText) {
                    var errorMessage = actual.toString();
                    return {
                        pass: errorMessage.indexOf(expectedText) > -1,
                        get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                    };
                }
            };
        },
        toThrowErrorWith: function () {
            return {
                compare: function (actual, expectedText) {
                    try {
                        actual();
                        return {
                            pass: false,
                            get message() { return "Was expected to throw, but did not throw"; }
                        };
                    }
                    catch (e) {
                        var errorMessage = e.toString();
                        return {
                            pass: errorMessage.indexOf(expectedText) > -1,
                            get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                        };
                    }
                }
            };
        },
        toMatchPattern: function () {
            return { compare: buildError(false), negativeCompare: buildError(true) };
            function buildError(isNot) {
                return function (actual, regex) {
                    return {
                        pass: regex.test(actual) == !isNot,
                        get message() {
                            return "Expected " + actual + " " + (isNot ? 'not ' : '') + "to match " + regex.toString();
                        }
                    };
                };
            }
        },
        toImplement: function () {
            return {
                compare: function (actualObject, expectedInterface) {
                    var objProps = Object.keys(actualObject.constructor.prototype);
                    var intProps = Object.keys(expectedInterface.prototype);
                    var missedMethods = [];
                    intProps.forEach(function (k) {
                        if (!actualObject.constructor.prototype[k])
                            missedMethods.push(k);
                    });
                    return {
                        pass: missedMethods.length == 0,
                        get message() {
                            return 'Expected ' + actualObject + ' to have the following methods: ' +
                                missedMethods.join(", ");
                        }
                    };
                }
            };
        }
    });
});
function elementText(n) {
    var hasNodes = function (n) {
        var children = dom_adapter_1.DOM.childNodes(n);
        return children && children.length > 0;
    };
    if (n instanceof Array) {
        return n.map(elementText).join("");
    }
    if (dom_adapter_1.DOM.isCommentNode(n)) {
        return '';
    }
    if (dom_adapter_1.DOM.isElementNode(n) && dom_adapter_1.DOM.tagName(n) == 'CONTENT') {
        return elementText(Array.prototype.slice.apply(dom_adapter_1.DOM.getDistributedNodes(n)));
    }
    if (dom_adapter_1.DOM.hasShadowRoot(n)) {
        return elementText(dom_adapter_1.DOM.childNodesAsList(dom_adapter_1.DOM.getShadowRoot(n)));
    }
    if (hasNodes(n)) {
        return elementText(dom_adapter_1.DOM.childNodesAsList(n));
    }
    return dom_adapter_1.DOM.getText(n);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXBPU0NyVzNBLnRtcC9hbmd1bGFyMi9zcmMvdGVzdGluZy9tYXRjaGVycy50cyJdLCJuYW1lcyI6WyJjb21wYXJlTWFwIiwibWVzc2FnZSIsImJ1aWxkRXJyb3IiLCJ0b01hdGNoUGF0dGVybiIsInRvTWF0Y2hQYXR0ZXJuLmJ1aWxkRXJyb3IiLCJlbGVtZW50VGV4dCJdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQWtCLHVDQUF1QyxDQUFDLENBQUE7QUFDMUQscUJBQStCLDBCQUEwQixDQUFDLENBQUE7QUFDMUQsMkJBQStCLGdDQUFnQyxDQUFDLENBQUE7QUE2RmhFLElBQUksT0FBTyxHQUFRLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLGFBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUVyRTs7Ozs7O0dBTUc7QUFDUSxjQUFNLEdBQXFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFHckUsa0VBQWtFO0FBQ2xFLHdDQUF3QztBQUN4QyxpRUFBaUU7QUFDakUsb0JBQW9CO0FBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRztJQUNqQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDUCxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQU8sR0FBRyxDQUFDLElBQUksQ0FBSSxDQUFDLFNBQUksQ0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxNQUFNLENBQUMsT0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFJLENB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QUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7SUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsaUJBQUdBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3pCQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNaQSxDQUFDQTtJQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsaUJBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3hEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM5RUEsQ0FBQ0E7SUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsaUJBQUdBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3pCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDakVBLENBQUNBO0lBRURBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2hCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM5Q0EsQ0FBQ0E7SUFFREEsTUFBTUEsQ0FBQ0EsaUJBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBQ3hCQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7Z2xvYmFsLCBpc1N0cmluZ30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuLyoqXG4gKiBKYXNtaW5lIG1hdGNoZXJzIHRoYXQgY2hlY2sgQW5ndWxhciBzcGVjaWZpYyBjb25kaXRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nTWF0Y2hlcnMgZXh0ZW5kcyBqYXNtaW5lLk1hdGNoZXJzIHtcbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgdmFsdWUgdG8gYmUgYSBgUHJvbWlzZWAuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0JlUHJvbWlzZSd9XG4gICAqL1xuICB0b0JlUHJvbWlzZSgpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFeHBlY3QgdGhlIHZhbHVlIHRvIGJlIGFuIGluc3RhbmNlIG9mIGEgY2xhc3MuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0JlQW5JbnN0YW5jZU9mJ31cbiAgICovXG4gIHRvQmVBbkluc3RhbmNlT2YoZXhwZWN0ZWQ6IGFueSk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgZWxlbWVudCB0byBoYXZlIGV4YWN0bHkgdGhlIGdpdmVuIHRleHQuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVUZXh0J31cbiAgICovXG4gIHRvSGF2ZVRleHQoZXhwZWN0ZWQ6IGFueSk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgZWxlbWVudCB0byBoYXZlIHRoZSBnaXZlbiBDU1MgY2xhc3MuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVDc3NDbGFzcyd9XG4gICAqL1xuICB0b0hhdmVDc3NDbGFzcyhleHBlY3RlZDogYW55KTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXhwZWN0IHRoZSBlbGVtZW50IHRvIGhhdmUgdGhlIGdpdmVuIENTUyBzdHlsZXMuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVDc3NTdHlsZSd9XG4gICAqL1xuICB0b0hhdmVDc3NTdHlsZShleHBlY3RlZDogYW55KTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXhwZWN0IGEgY2xhc3MgdG8gaW1wbGVtZW50IHRoZSBpbnRlcmZhY2Ugb2YgdGhlIGdpdmVuIGNsYXNzLlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqXG4gICAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL21hdGNoZXJzLnRzIHJlZ2lvbj0ndG9JbXBsZW1lbnQnfVxuICAgKi9cbiAgdG9JbXBsZW1lbnQoZXhwZWN0ZWQ6IGFueSk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVjdCBhbiBleGNlcHRpb24gdG8gY29udGFpbiB0aGUgZ2l2ZW4gZXJyb3IgdGV4dC5cbiAgICpcbiAgICogIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgdGVzdGluZy90cy9tYXRjaGVycy50cyByZWdpb249J3RvQ29udGFpbkVycm9yJ31cbiAgICovXG4gIHRvQ29udGFpbkVycm9yKGV4cGVjdGVkOiBhbnkpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFeHBlY3QgYSBmdW5jdGlvbiB0byB0aHJvdyBhbiBlcnJvciB3aXRoIHRoZSBnaXZlbiBlcnJvciB0ZXh0IHdoZW4gZXhlY3V0ZWQuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b1Rocm93RXJyb3JXaXRoJ31cbiAgICovXG4gIHRvVGhyb3dFcnJvcldpdGgoZXhwZWN0ZWRNZXNzYWdlOiBhbnkpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFeHBlY3QgYSBzdHJpbmcgdG8gbWF0Y2ggdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgdGVzdGluZy90cy9tYXRjaGVycy50cyByZWdpb249J3RvTWF0Y2hQYXR0ZXJuJ31cbiAgICovXG4gIHRvTWF0Y2hQYXR0ZXJuKGV4cGVjdGVkTWVzc2FnZTogYW55KTogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW52ZXJ0IHRoZSBtYXRjaGVycy5cbiAgICovXG4gIG5vdDogTmdNYXRjaGVycztcbn1cblxudmFyIF9nbG9iYWwgPSA8YW55Pih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyk7XG5cbi8qKlxuICogSmFzbWluZSBtYXRjaGluZyBmdW5jdGlvbiB3aXRoIEFuZ3VsYXIgbWF0Y2hlcnMgbWl4ZWQgaW4uXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL21hdGNoZXJzLnRzIHJlZ2lvbj0ndG9IYXZlVGV4dCd9XG4gKi9cbmV4cG9ydCB2YXIgZXhwZWN0OiAoYWN0dWFsOiBhbnkpID0+IE5nTWF0Y2hlcnMgPSA8YW55Pl9nbG9iYWwuZXhwZWN0O1xuXG5cbi8vIFNvbWUgTWFwIHBvbHlmaWxscyBkb24ndCBwb2x5ZmlsbCBNYXAudG9TdHJpbmcgY29ycmVjdGx5LCB3aGljaFxuLy8gZ2l2ZXMgdXMgYmFkIGVycm9yIG1lc3NhZ2VzIGluIHRlc3RzLlxuLy8gVGhlIG9ubHkgd2F5IHRvIGRvIHRoaXMgaW4gSmFzbWluZSBpcyB0byBtb25rZXkgcGF0Y2ggYSBtZXRob2Rcbi8vIHRvIHRoZSBvYmplY3QgOi0oXG5NYXAucHJvdG90eXBlWydqYXNtaW5lVG9TdHJpbmcnXSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbSA9IHRoaXM7XG4gIGlmICghbSkge1xuICAgIHJldHVybiAnJyArIG07XG4gIH1cbiAgdmFyIHJlcyA9IFtdO1xuICBtLmZvckVhY2goKHYsIGspID0+IHsgcmVzLnB1c2goYCR7a306JHt2fWApOyB9KTtcbiAgcmV0dXJuIGB7ICR7cmVzLmpvaW4oJywnKX0gfWA7XG59O1xuXG5fZ2xvYmFsLmJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gIGphc21pbmUuYWRkTWF0Y2hlcnMoe1xuICAgIC8vIEN1c3RvbSBoYW5kbGVyIGZvciBNYXAgYXMgSmFzbWluZSBkb2VzIG5vdCBzdXBwb3J0IGl0IHlldFxuICAgIHRvRXF1YWw6IGZ1bmN0aW9uKHV0aWwsIGN1c3RvbUVxdWFsaXR5VGVzdGVycykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICAgICAgICAgIHJldHVybiB7cGFzczogdXRpbC5lcXVhbHMoYWN0dWFsLCBleHBlY3RlZCwgW2NvbXBhcmVNYXBdKX07XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmVNYXAoYWN0dWFsLCBleHBlY3RlZCkge1xuICAgICAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgICAgdmFyIHBhc3MgPSBhY3R1YWwuc2l6ZSA9PT0gZXhwZWN0ZWQuc2l6ZTtcbiAgICAgICAgICBpZiAocGFzcykge1xuICAgICAgICAgICAgYWN0dWFsLmZvckVhY2goKHYsIGspID0+IHsgcGFzcyA9IHBhc3MgJiYgdXRpbC5lcXVhbHModiwgZXhwZWN0ZWQuZ2V0KGspKTsgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9CZVByb21pc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZENsYXNzKSB7XG4gICAgICAgICAgdmFyIHBhc3MgPSB0eXBlb2YgYWN0dWFsID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgYWN0dWFsLnRoZW4gPT09ICdmdW5jdGlvbic7XG4gICAgICAgICAgcmV0dXJuIHtwYXNzOiBwYXNzLCBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuICdFeHBlY3RlZCAnICsgYWN0dWFsICsgJyB0byBiZSBhIHByb21pc2UnOyB9fTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgdG9CZUFuSW5zdGFuY2VPZjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkQ2xhc3MpIHtcbiAgICAgICAgICB2YXIgcGFzcyA9IHR5cGVvZiBhY3R1YWwgPT09ICdvYmplY3QnICYmIGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3M7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhc3M6IHBhc3MsXG4gICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdFeHBlY3RlZCAnICsgYWN0dWFsICsgJyB0byBiZSBhbiBpbnN0YW5jZSBvZiAnICsgZXhwZWN0ZWRDbGFzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICB0b0hhdmVUZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWRUZXh0KSB7XG4gICAgICAgICAgdmFyIGFjdHVhbFRleHQgPSBlbGVtZW50VGV4dChhY3R1YWwpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXNzOiBhY3R1YWxUZXh0ID09IGV4cGVjdGVkVGV4dCxcbiAgICAgICAgICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gJ0V4cGVjdGVkICcgKyBhY3R1YWxUZXh0ICsgJyB0byBiZSBlcXVhbCB0byAnICsgZXhwZWN0ZWRUZXh0OyB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgdG9IYXZlQ3NzQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtjb21wYXJlOiBidWlsZEVycm9yKGZhbHNlKSwgbmVnYXRpdmVDb21wYXJlOiBidWlsZEVycm9yKHRydWUpfTtcblxuICAgICAgZnVuY3Rpb24gYnVpbGRFcnJvcihpc05vdCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYWN0dWFsLCBjbGFzc05hbWUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFzczogRE9NLmhhc0NsYXNzKGFjdHVhbCwgY2xhc3NOYW1lKSA9PSAhaXNOb3QsXG4gICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGBFeHBlY3RlZCAke2FjdHVhbC5vdXRlckhUTUx9ICR7aXNOb3QgPyAnbm90ICcgOiAnJ310byBjb250YWluIHRoZSBDU1MgY2xhc3MgXCIke2NsYXNzTmFtZX1cImA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9IYXZlQ3NzU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBzdHlsZXMpIHtcbiAgICAgICAgICB2YXIgYWxsUGFzc2VkO1xuICAgICAgICAgIGlmIChpc1N0cmluZyhzdHlsZXMpKSB7XG4gICAgICAgICAgICBhbGxQYXNzZWQgPSBET00uaGFzU3R5bGUoYWN0dWFsLCBzdHlsZXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGxQYXNzZWQgPSAhU3RyaW5nTWFwV3JhcHBlci5pc0VtcHR5KHN0eWxlcyk7XG4gICAgICAgICAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goc3R5bGVzLCAoc3R5bGUsIHByb3ApID0+IHtcbiAgICAgICAgICAgICAgYWxsUGFzc2VkID0gYWxsUGFzc2VkICYmIERPTS5oYXNTdHlsZShhY3R1YWwsIHByb3AsIHN0eWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXNzOiBhbGxQYXNzZWQsXG4gICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHtcbiAgICAgICAgICAgICAgdmFyIGV4cGVjdGVkVmFsdWVTdHIgPSBpc1N0cmluZyhzdHlsZXMpID8gc3R5bGVzIDogSlNPTi5zdHJpbmdpZnkoc3R5bGVzKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGBFeHBlY3RlZCAke2FjdHVhbC5vdXRlckhUTUx9ICR7IWFsbFBhc3NlZCA/ICcgJyA6ICdub3QgJ310byBjb250YWluIHRoZVxuICAgICAgICAgICAgICAgICAgICAgIENTUyAke2lzU3RyaW5nKHN0eWxlcykgPyAncHJvcGVydHknIDogJ3N0eWxlcyd9IFwiJHtleHBlY3RlZFZhbHVlU3RyfVwiYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICB0b0NvbnRhaW5FcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkVGV4dCkge1xuICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBhY3R1YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFzczogZXJyb3JNZXNzYWdlLmluZGV4T2YoZXhwZWN0ZWRUZXh0KSA+IC0xLFxuICAgICAgICAgICAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiAnRXhwZWN0ZWQgJyArIGVycm9yTWVzc2FnZSArICcgdG8gY29udGFpbiAnICsgZXhwZWN0ZWRUZXh0OyB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgdG9UaHJvd0Vycm9yV2l0aDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkVGV4dCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhY3R1YWwoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHBhc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIFwiV2FzIGV4cGVjdGVkIHRvIHRocm93LCBidXQgZGlkIG5vdCB0aHJvd1wiOyB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBwYXNzOiBlcnJvck1lc3NhZ2UuaW5kZXhPZihleHBlY3RlZFRleHQpID4gLTEsXG4gICAgICAgICAgICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gJ0V4cGVjdGVkICcgKyBlcnJvck1lc3NhZ2UgKyAnIHRvIGNvbnRhaW4gJyArIGV4cGVjdGVkVGV4dDsgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcblxuICAgIHRvTWF0Y2hQYXR0ZXJuKCkge1xuICAgICAgcmV0dXJuIHtjb21wYXJlOiBidWlsZEVycm9yKGZhbHNlKSwgbmVnYXRpdmVDb21wYXJlOiBidWlsZEVycm9yKHRydWUpfTtcblxuICAgICAgZnVuY3Rpb24gYnVpbGRFcnJvcihpc05vdCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYWN0dWFsLCByZWdleCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXNzOiByZWdleC50ZXN0KGFjdHVhbCkgPT0gIWlzTm90LFxuICAgICAgICAgICAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBgRXhwZWN0ZWQgJHthY3R1YWx9ICR7aXNOb3QgPyAnbm90ICcgOiAnJ310byBtYXRjaCAke3JlZ2V4LnRvU3RyaW5nKCl9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB0b0ltcGxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWxPYmplY3QsIGV4cGVjdGVkSW50ZXJmYWNlKSB7XG4gICAgICAgICAgdmFyIG9ialByb3BzID0gT2JqZWN0LmtleXMoYWN0dWFsT2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgICAgICAgdmFyIGludFByb3BzID0gT2JqZWN0LmtleXMoZXhwZWN0ZWRJbnRlcmZhY2UucHJvdG90eXBlKTtcblxuICAgICAgICAgIHZhciBtaXNzZWRNZXRob2RzID0gW107XG4gICAgICAgICAgaW50UHJvcHMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgICAgICAgaWYgKCFhY3R1YWxPYmplY3QuY29uc3RydWN0b3IucHJvdG90eXBlW2tdKSBtaXNzZWRNZXRob2RzLnB1c2goayk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFzczogbWlzc2VkTWV0aG9kcy5sZW5ndGggPT0gMCxcbiAgICAgICAgICAgIGdldCBtZXNzYWdlKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJ0V4cGVjdGVkICcgKyBhY3R1YWxPYmplY3QgKyAnIHRvIGhhdmUgdGhlIGZvbGxvd2luZyBtZXRob2RzOiAnICtcbiAgICAgICAgICAgICAgICAgICAgIG1pc3NlZE1ldGhvZHMuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBlbGVtZW50VGV4dChuKSB7XG4gIHZhciBoYXNOb2RlcyA9IChuKSA9PiB7XG4gICAgdmFyIGNoaWxkcmVuID0gRE9NLmNoaWxkTm9kZXMobik7XG4gICAgcmV0dXJuIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gIH07XG5cbiAgaWYgKG4gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuLm1hcChlbGVtZW50VGV4dCkuam9pbihcIlwiKTtcbiAgfVxuXG4gIGlmIChET00uaXNDb21tZW50Tm9kZShuKSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGlmIChET00uaXNFbGVtZW50Tm9kZShuKSAmJiBET00udGFnTmFtZShuKSA9PSAnQ09OVEVOVCcpIHtcbiAgICByZXR1cm4gZWxlbWVudFRleHQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KERPTS5nZXREaXN0cmlidXRlZE5vZGVzKG4pKSk7XG4gIH1cblxuICBpZiAoRE9NLmhhc1NoYWRvd1Jvb3QobikpIHtcbiAgICByZXR1cm4gZWxlbWVudFRleHQoRE9NLmNoaWxkTm9kZXNBc0xpc3QoRE9NLmdldFNoYWRvd1Jvb3QobikpKTtcbiAgfVxuXG4gIGlmIChoYXNOb2RlcyhuKSkge1xuICAgIHJldHVybiBlbGVtZW50VGV4dChET00uY2hpbGROb2Rlc0FzTGlzdChuKSk7XG4gIH1cblxuICByZXR1cm4gRE9NLmdldFRleHQobik7XG59XG4iXX0=