'use strict';/**
 * @module
 * @description
 * This module provides a set of common Pipes.
 */
var async_pipe_1 = require('./pipes/async_pipe');
exports.AsyncPipe = async_pipe_1.AsyncPipe;
var date_pipe_1 = require('./pipes/date_pipe');
exports.DatePipe = date_pipe_1.DatePipe;
var json_pipe_1 = require('./pipes/json_pipe');
exports.JsonPipe = json_pipe_1.JsonPipe;
var slice_pipe_1 = require('./pipes/slice_pipe');
exports.SlicePipe = slice_pipe_1.SlicePipe;
var lowercase_pipe_1 = require('./pipes/lowercase_pipe');
exports.LowerCasePipe = lowercase_pipe_1.LowerCasePipe;
var number_pipe_1 = require('./pipes/number_pipe');
exports.NumberPipe = number_pipe_1.NumberPipe;
exports.DecimalPipe = number_pipe_1.DecimalPipe;
exports.PercentPipe = number_pipe_1.PercentPipe;
exports.CurrencyPipe = number_pipe_1.CurrencyPipe;
var uppercase_pipe_1 = require('./pipes/uppercase_pipe');
exports.UpperCasePipe = uppercase_pipe_1.UpperCasePipe;
var replace_pipe_1 = require('./pipes/replace_pipe');
exports.ReplacePipe = replace_pipe_1.ReplacePipe;
var i18n_plural_pipe_1 = require('./pipes/i18n_plural_pipe');
exports.I18nPluralPipe = i18n_plural_pipe_1.I18nPluralPipe;
var i18n_select_pipe_1 = require('./pipes/i18n_select_pipe');
exports.I18nSelectPipe = i18n_select_pipe_1.I18nSelectPipe;
var common_pipes_1 = require('./pipes/common_pipes');
exports.COMMON_PIPES = common_pipes_1.COMMON_PIPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9MSkc5d0piLnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL3BpcGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCwyQkFBd0Isb0JBQW9CLENBQUM7QUFBckMsMkNBQXFDO0FBQzdDLDBCQUF1QixtQkFBbUIsQ0FBQztBQUFuQyx3Q0FBbUM7QUFDM0MsMEJBQXVCLG1CQUFtQixDQUFDO0FBQW5DLHdDQUFtQztBQUMzQywyQkFBd0Isb0JBQW9CLENBQUM7QUFBckMsMkNBQXFDO0FBQzdDLCtCQUE0Qix3QkFBd0IsQ0FBQztBQUE3Qyx1REFBNkM7QUFDckQsNEJBQWlFLHFCQUFxQixDQUFDO0FBQS9FLDhDQUFVO0FBQUUsZ0RBQVc7QUFBRSxnREFBVztBQUFFLGtEQUF5QztBQUN2RiwrQkFBNEIsd0JBQXdCLENBQUM7QUFBN0MsdURBQTZDO0FBQ3JELDZCQUEwQixzQkFBc0IsQ0FBQztBQUF6QyxpREFBeUM7QUFDakQsaUNBQTZCLDBCQUEwQixDQUFDO0FBQWhELDJEQUFnRDtBQUN4RCxpQ0FBNkIsMEJBQTBCLENBQUM7QUFBaEQsMkRBQWdEO0FBQ3hELDZCQUEyQixzQkFBc0IsQ0FBQztBQUExQyxtREFBMEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBtb2R1bGUgcHJvdmlkZXMgYSBzZXQgb2YgY29tbW9uIFBpcGVzLlxuICovXG5cbmV4cG9ydCB7QXN5bmNQaXBlfSBmcm9tICcuL3BpcGVzL2FzeW5jX3BpcGUnO1xuZXhwb3J0IHtEYXRlUGlwZX0gZnJvbSAnLi9waXBlcy9kYXRlX3BpcGUnO1xuZXhwb3J0IHtKc29uUGlwZX0gZnJvbSAnLi9waXBlcy9qc29uX3BpcGUnO1xuZXhwb3J0IHtTbGljZVBpcGV9IGZyb20gJy4vcGlwZXMvc2xpY2VfcGlwZSc7XG5leHBvcnQge0xvd2VyQ2FzZVBpcGV9IGZyb20gJy4vcGlwZXMvbG93ZXJjYXNlX3BpcGUnO1xuZXhwb3J0IHtOdW1iZXJQaXBlLCBEZWNpbWFsUGlwZSwgUGVyY2VudFBpcGUsIEN1cnJlbmN5UGlwZX0gZnJvbSAnLi9waXBlcy9udW1iZXJfcGlwZSc7XG5leHBvcnQge1VwcGVyQ2FzZVBpcGV9IGZyb20gJy4vcGlwZXMvdXBwZXJjYXNlX3BpcGUnO1xuZXhwb3J0IHtSZXBsYWNlUGlwZX0gZnJvbSAnLi9waXBlcy9yZXBsYWNlX3BpcGUnO1xuZXhwb3J0IHtJMThuUGx1cmFsUGlwZX0gZnJvbSAnLi9waXBlcy9pMThuX3BsdXJhbF9waXBlJztcbmV4cG9ydCB7STE4blNlbGVjdFBpcGV9IGZyb20gJy4vcGlwZXMvaTE4bl9zZWxlY3RfcGlwZSc7XG5leHBvcnQge0NPTU1PTl9QSVBFU30gZnJvbSAnLi9waXBlcy9jb21tb25fcGlwZXMnO1xuIl19