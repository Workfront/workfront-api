/**
 * Copyright 2015 AtTask
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @namespace
 * @memberOf AtTask
 */
var ApiConstants = {

	/**
	 * Prefix for identifying a Sort field. Value is "_1_Sort" for first sort field, "_2_Sort", "_3_Sort" ... "_n_Sort".
	 * @readonly
	 * @type {String}
	 */
	SORT: '_Sort',

	/**
	 * Suffix for specifying expression operators (ApiConstants.Operators) on a field. Value is "_Mod".
	 * @readonly
	 * @type {String}
	 */
	MOD: '_Mod',

	/**
	 * A delimiter which is used to separate field name and its order key.<br/>
	 * Can be used for filters, sorting, etc.<br/>
	 * Example: <code>{name_1_Sort: 'ASC', id_2_Sort: 'DESC'}</code>
	 * @readonly
	 * @type {String}
	 */
	ORDERDOT: '_',

	/**
	 * Key used to specify the index of the first result to return starting with .
	 * @readonly
	 * @type {String}
	 */
	FIRST: "$$FIRST",

	/**
	 * Key used to specify a limit on the number of results. If this key is present, the value is used.<br/>
	 * If this value cannot be parsed or if it is less than or equal to 0, no limit is enforced.<br/>
	 * Value is "$$LIMIT"<br/>
	 * @readonly
	 * @type {String}
	 */
	LIMIT: "$$LIMIT",

	/**
	 * Prefix used to identify an Data Extension parameter in the Query framework.<br/>
	 * Used for retrieval of custom data fields.<br/>
	 * @readonly
	 * @type {String}
	 */
	DATAEXTENSION: "DE:",

	/**
	 * Suffix for specifying which fields will be added to the GROUP BY clause in a ReportQuery. Value is "_GroupBy".
	 * @readonly
	 * @type {String}
	 */
	GROUPBY: "_GroupBy",

	/**
	 * Suffix for specifying force "_GroupBy". Value is "$$_ForceGroupBy".
	 */
	FORCE_GROUPBY: "$$_ForceGroupBy",

	/**
	 * Suffix for specifying aggregate functions in a ReportQuery. Value is "_AggFunc".
	 */
	AGGFUNC: "_AggFunc",

	/**
	 * Suffix for specifying comma-separated list of aggregated currency fields for the report
	 */
	AGGCURRENCY_FIELDS: "$$AggCurr",
	GROUPCURRENCY_FIELDS: "$$GroupCurr",


	SORTCURRENCY_FIELDS: "$$SortCurr",
	FILTERCURRENCY_FIELDS: "$$FilterCurr",

	/**
	 * Key used to specify that a GROUP BY query should be done WITH ROLLUP. Value is "$$ROLLUP"
	 */
	ROLLUP: "$$ROLLUP",

	/**
	 * Values which can be used as wildcards
	 * @readonly
	 * @enum {String}
	 */
	WildCards: {
		/**
		 * Wildcard value for midnight (12:00AM) of the current Date. Wildcards are useful for Saved Searches.<br/>
		 * If this value is passed in for any search value, it is replaced with the current date.<br/>
		 * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]<br/>
		 *    <code>$$TODAY+1d</code> would equal 12:00AM of the next day<br/>
		 *    <code>$$TODAY-1d</code> would equal 12:00AM of the previous day<br/>
		 *    <code>$$TODAY+2w</code> would equal 12:00AM of 2 weeks from today<br/>
		 *    <code>$$TODAY+2m</code> would equal 12:00AM of 2 months from today<br/>
		 *    <code>$$TODAYb</code> "the beginning of today" would equal 12:00AM today<br/>
		 *    <code>$$TODAYe</code> "the end of today" would equal 12:00AM tomorrow<br/>
		 *    <code>$$TODAYbm</code> "the beginning of the month" would equal 12:00AM of the first day of the month<br/>
		 *    <code>$$TODAYe+1w</code> "the end of next week" would equal 12:00AM Sunday following the Saturday of next week<br/>
		 * Value is "$$TODAY"<br/>
		 */
		TODAY: "$$TODAY",

		/**
		 * Wildcard value for the current time of the current Date. Wildcards are useful for Saved Searches.<br/>
		 * If this value is passed in for any search value, it is replaced with the current date and time.<br/>
		 * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]<br/>
		 *    <code>$$NOW+1d</code> would equal the same time on the next day<br/>
		 *    <code>$$NOW-1d</code> would equal the same time on the previous day<br/>
		 *    <code>$$NOW+2w</code> would equal the same time on 2 weeks from now<br/>
		 *    <code>$$NOW+2m</code> would equal the same time on 2 months from now<br/>
		 * Value is "$$NOW"
		 */
		NOW: "$$NOW",

		/**
		 * Wildcard value for the currently authenticated User. Wildcards are useful for Saved Searches.<br/>
		 * If this value is passed in for any search value, it is replaced with an attribute from the current User.<br/>
		 * The following suffixes can be used: <code>.[ID(default)|homeGroupID|accessLevelID|categoryID|companyID|roleID|roleIDs|otherGroupIDs|accessLevelRank]</code><br/>
		 *    <code>$$USER</code> would equal the current User's ID<br/>
		 *    <code>$$USER.homeGroupID</code> would equal the current User's Home Group ID<br/>
		 *    <code>$$USER.accessLevelID</code> would equal the current User's Access Level ID<br/>
		 *    <code>$$USER.otherGroupIDs</code> would equal the all of the current User's Other Group IDs. This would translate into an "IN" clause for that queried field.<br/>
		 *    <code>$$USER.roleIDs</code> would equal the all of the current User's Roles. This would translate into an "IN" clause for that queried field.<br/>
		 *    <code>$$USER.roleID</code> would equal the all of the current User's Primary Role ID.<br/>
		 * Value is "$$USER"
		 */
		USER: "$$USER",

		/**
		 * Wildcard value for the account Customer. Wildcards are useful for Saved Searches.<br/>
		 * If this value is passed in for any search value, it is replaced with an attribute from the Customer.<br/>
		 */
		CUSTOMER: "$$CUSTOMER",

		/**
		 * Wildcard value for the account representative User. Wildcards are useful for Saved Searches.<br/>
		 * If this value is passed in for any search value, it is replaced with an attribute from the Account representative.<br/>
		 */
		ACCOUNTREP: "$$AR"
	},


	/**
	 * How to sort the result
	 * @readonly
	 * @enum {String}
	 */
	SortOrder: {
		/**
		 * Ascending Sort. Value is "asc".
		 */
		ASC: "asc",

		/**
		 * Descending Sort. Value is "desc".
		 */
		DESC: "desc",

		/**
		 * Case-Insensitive Ascending Sort. Value is "ciasc".
		 */
		CIASC: "ciasc",

		/**
		 * Case-Insensitive Descending Sort. Value is "cidesc".
		 */
		CIDESC: "cidesc"
	},


	/**
	 * Modifiers which can be used with filters (Mod suffix)
	 * @readonly
	 * @enum {String}
	 */
	Operators: {
		/**
		 * Produces the SQL expression <code>field < value</code>. Value is "lt".
		 */
		LESSTHAN: "lt",

		/**
		 * Produces the SQL expression <code>field <= value</code>. Value is "lte".
		 **/
		LESSTHANEQUAL: "lte",

		/**
		 * Produces the SQL expression <code>field > value</code>. Value is "gt".
		 **/
		GREATERTHAN: "gt",

		/**
		 * Produces the SQL expression <code>field >= value</code>. Value is "gte".
		 **/
		GREATERTHANEQUAL: "gte",

		/**
		 * Produces the SQL expression <code>field = value</code><br/>
		 * Note that this is the default Modifier used when 1 value exists. Value is "eq".
		 **/
		EQUAL: "eq",

		/**
		 * Produces the SQL expression <code>UPPER(field) = UPPER(value)</code>. Value is "cieq".
		 **/
		CIEQUAL: "cieq",

		/**
		 * Produces the SQL expression <code>field <> value or field is null</code>. Value is "ne".
		 **/
		NOTEQUAL: "ne",

		/**
		 * Produces the SQL expression <code>field <> value</code>. This differs from NOTEQUAL in that null results are not
		 * returned. Value is "nee".
		 **/
		NOTEQUALEXACT: "nee",

		/**
		 * Produces the SQL expression <code>UPPER(field) <> UPPER(value)</code>. Value is "cine".
		 **/
		CINOTEQUAL: "cine",

		/**
		 * Produces the SQL expression <code>field LIKE '%value%'</code>. Value is "contains".
		 **/
		CONTAINS: "contains",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value%')</code>. Value is "cicontains".
		 **/
		CICONTAINS: "cicontains",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') OR UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
		 **/
		CICONTAINSANY: "cicontainsany",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
		 **/
		CICONTAINSALL: "cicontainsall",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
		 **/
		CINOTCONTAINSALL: "cinotcontainsall",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
		 **/
		CINOTCONTAINSANY: "cinotcontainsany",

		/**
		 * Produces the SQL expression <code>field NOT LIKE '%value%'</code>. Value is "notcontains".
		 **/
		NOTCONTAINS: "notcontains",

		/**
		 * Produces the SQL expression <code>UPPER(field) NOT LIKE UPPER('%value%')</code>. Value is "cinotcontains".
		 **/
		CINOTCONTAINS: "cinotcontains",

		/**
		 * Produces the SQL expression <code>field LIKE 'value'</code>
		 * where value can contain replacement characters such as % and _. Value is "like".
		 **/
		LIKE: "like",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('value')</code>
		 * where value can contain replacement characters such as % and _. Value is "cilike".
		 **/
		CILIKE: "cilike",

		/**
		 * Produces the SQL expression <code>UPPER(field) LIKE UPPER('value%')</code>. Value is "startswith".
		 **/
		STARTSWITH: "startswith",

		/**
		 * Produces the SQL expression <code>SOUNDEX(field) = SOUNDEX(value)</code>. Value is "soundex".
		 **/
		SOUNDEX: "soundex",

		/**
		 * Use of this Modifier requires the inclusion of a <code>value_Range</code> parameter.<br/>
		 * Produces the SQL expression <code>field BETWEEN value AND value_Range</code>.<br/>
		 * Note that this is the default Modifier used when a <code>_Range</code> value exists. Value is "between".
		 **/
		BETWEEN: "between",

		/**
		 * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
		 * Produces the SQL expression <code>UPPER(field) BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cibetween".
		 **/
		CIBETWEEN: "cibetween",

		/**
		 * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
		 * Produces the SQL expression <code>fieldNOT BETWEEN value AND value_Range</code>. Value is "notbetween".
		 **/
		NOTBETWEEN: "notbetween",

		/**
		 * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
		 * Produces the SQL expression <code>UPPER(field)NOT BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cinotbetween".
		 **/
		CINOTBETWEEN: "cinotbetween",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
		 * Produces the SQL expression <code>field IN ( value1, value2, ..., valuen)</code><br/>
		 * Note that this is the default Modifier used when multiple <code>value</code> fields exist. Value is "in".
		 **/
		IN: "in",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
		 * Produces the SQL expression <code>UPPER(field) IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
		 **/
		CIIN: "ciin",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
		 * Produces the SQL expression <code>field NOT IN ( value1, value2, ..., valuen)</code>. Value is "notin".
		 **/
		NOTIN: "notin",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
		 * Produces the SQL expression <code>UPPER(field) NOT IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
		 **/
		CINOTIN: "cinotin",

		/**
		 * Produces the SQL expression <code>field & value > 0</code>. Value is "bitwiseor".<br/>
		 * Useful for checking if any of a group of bits is set.
		 **/
		BITWISE_OR: "bitwiseor",

		/**
		 * Produces the SQL expression <code>field & value = value</code>. Value is "bitwiseand".<br/>
		 * Useful for checking if all of a group of bits is set.
		 **/
		BITWISE_AND: "bitwiseand",

		/**
		 * Produces the SQL expression <code>field & value = 0</code>. Value is "bitwisenand".<br/>
		 * Useful for checking if none of a group of bits is set.
		 **/
		BITWISE_NAND: "bitwisenand",


		/**
		 * By default, searches for a date value generate the following SQL filter <code>field between <00:00:00:000 of day> and <23:59:59:999 of day></code>.<br/>
		 * This is for convenience so that date searches return any match on items that fall on that date.<br/>
		 * However, if it is desired to find an exact match on a specific time of day as well as the date, this Modifier enforces that rule.<br/>
		 * The SQL filter generated by this Modifier is <code>field = value</code>. Value is "exacttime".
		 */
		EXACT_TIME: "exacttime",

		/**
		 * Searches based on the string length of the given field.
		 */
		LENGTH_LT: "length_lt",
		LENGTH_EQ: "length_eq",
		LENGTH_GT: "length_gt",


		/**
		 * Used for DE queries that allow multiple values.<br/>
		 * This Modifier requires that DE fields have all of the specified values. Value is "allof".
		 */
		ALLOF: "allof",


		/**
		 * Produces the SQL expression <code>field IS NULL</code>.<br/>
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isnull".
		 */
		ISNULL: "isnull",

		/**
		 * Produces the SQL expression <code>field IS NOT NULL</code>.<br/>
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notnull".
		 */
		NOTNULL: "notnull",


		/**
		 * Produces the SQL expression <code>field IS NULL OR field = ''</code>.<br/>
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isblank".
		 */
		ISBLANK: "isblank",

		/**
		 * Produces the SQL expression <code>field IS NOT NULL AND field <> ''</code>.<br/>
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notblank".
		 */
		NOTBLANK: "notblank"
	},


	/**
	 * Aggregate functions which can be used with the AGGFUNC suffix.
	 * @readonly
	 * @enum {String}
	 */
	Functions: {
		/**
		 * Maximum value aggregate function.<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "max".
		 */
		MAX: "max",

		/**
		 * Minimum value aggregate function.<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "min".
		 **/
		MIN: "min",
		
		/**
		 * Average value aggregate function.<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "avg".
		 **/
		AVG: "avg",
		
		/**
		 * Summation aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "sum".
		 **/
		SUM: "sum",
		
		/**
		 * Count aggregate function.<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "count".
		 **/
		COUNT: "count",
		
		/**
		 * Standard Deviation aggregate function.<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "std".
		 **/
		STD: "std",
		
		/**
		 * Variance aggregate function.<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "var".
		 **/
		VAR: "var",
		
		/**
		 * Maximum value aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "dmax".
		 **/
		DMAX: "dmax",
		
		/**
		 * Minimum value aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "dmin".
		 **/
		DMIN: "dmin",
		
		/**
		 * Average value aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "davg".
		 **/
		DAVG: "davg",
		
		/**
		 * Summation aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "dsum".
		 **/
		DSUM: "dsum",
		
		/**
		 * Count aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "dcount".
		 **/
		DCOUNT: "dcount",
		
		/**
		 * Standard Deviation aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "dstd".
		 **/
		DSTD: "dstd",
		
		/**
		 * Variance aggregate function (distinct mode).<br/>
		 * Can only be used with the AGGFUNC suffix. Value is "dvar".
		 **/
		DVAR: "dvar"
	}
};


module.exports = ApiConstants;
