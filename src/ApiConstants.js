var internalPrefix = '$$';

var ApiConstants = {

	/**
	 * Prefix for identifying a Sort field. Value is "_1_Sort" for first sort field, "_2_Sort", "_3_Sort" ... "_n_Sort".
	 */
	SORT: '_Sort',

	/**
	 * Suffix for specifying expression operators (ApiConstants.Operators) on a field. Value is "_Mod".
	 */
	MOD: '_Mod',

	/**
	 * A delimiter which is used to separate field name and its order key.
	 * Can be used for filters, sorting, etc.
	 * Example: {name_1_Sort: 'ASC', id_2_Sort: 'DESC'}
	 */
	ORDERDOT: '_',

	/**
	 * Key used to specify the index of the first result to return starting with .
	 */
	FIRST: internalPrefix + "FIRST",

	/**
	 * Key used to specify a limit on the number of results. If this key is present, the value is used.
	 * If this value cannot be parsed or if it is less than or equal to 0, no limit is enforced.
	 * Value is "$$LIMIT"
	 */
	LIMIT: internalPrefix + "LIMIT",

	/**
	 * Prefix used to identify an Data Extension parameter in the Query framework.
	 * Used for retrieval of custom data fields.
	 */
	DATAEXTENSION: "DE:",


	Wildcards: {
		/**
		 * Wildcard value for midnight (12:00AM) of the current Date. Wildcards are useful for Saved Searches.
		 * If this value is passed in for any search value, it is replaced with the current date.
		 * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]
		 *    $$TODAY+1d would equal 12:00AM of the next day
		 *    $$TODAY-1d would equal 12:00AM of the previous day
		 *    $$TODAY+2w would equal 12:00AM of 2 weeks from today
		 *    $$TODAY+2m would equal 12:00AM of 2 months from today
		 *    $$TODAYb "the beginning of today" would equal 12:00AM today
		 *    $$TODAYe "the end of today" would equal 12:00AM tomorrow
		 *    $$TODAYbm "the beginning of the month" would equal 12:00AM of the first day of the month
		 *    $$TODAYe+1w "the end of next week" would equal 12:00AM Sunday following the Saturday of next week
		 * Value is "$$TODAY"
		 */
		TODAY: internalPrefix + "TODAY",

		/**
		 * Wildcard value for the current time of the current Date. Wildcards are useful for Saved Searches.
		 * If this value is passed in for any search value, it is replaced with the current date and time.
		 * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]
		 *    $$NOW+1d would equal the same time on the next day
		 *    $$NOW-1d would equal the same time on the previous day
		 *    $$NOW+2w would equal the same time on 2 weeks from now
		 *    $$NOW+2m would equal the same time on 2 months from now
		 * Value is "$$NOW"
		 */
		NOW: internalPrefix + "NOW",

		/**
		 * Wildcard value for the currently authenticated User. Wildcards are useful for Saved Searches.
		 * If this value is passed in for any search value, it is replaced with an attribute from the current User.
		 * The following suffixes can be used: .[ID(default)|homeGroupID|accessLevelID|categoryID|companyID|roleID|roleIDs|otherGroupIDs|accessLevelRank]
		 *    $$USER would equal the current User's ID
		 *    $$USER.homeGroupID would equal the current User's Home Group ID
		 *    $$USER.accessLevelID would equal the current User's Access Level ID
		 *    $$USER.otherGroupIDs would equal the all of the current User's Other Group IDs. This would translate into an "IN" clause for that queried field.
		 *    $$USER.roleIDs would equal the all of the current User's Roles. This would translate into an "IN" clause for that queried field.
		 *    $$USER.roleID would equal the all of the current User's Primary Role ID.
		 * Value is "$$USER"
		 */
		USER: internalPrefix + "USER",

		/**
		 * Wildcard value for the account Customer. Wildcards are useful for Saved Searches.
		 * If this value is passed in for any search value, it is replaced with an attribute from the Customer.
		 */
		CUSTOMER: internalPrefix + "CUSTOMER",

		/**
		 * Wildcard value for the account representative User. Wildcards are useful for Saved Searches.
		 * If this value is passed in for any search value, it is replaced with an attribute from the Account representative.
		 */
		ACCOUNTREP: internalPrefix + "AR"
	},


	/**
	 * How to sort the result
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
		 * Produces the SQL expression <code>field = value</code>
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
		 * Use of this Modifier requires the inclusion of a <code>value_Range</code> parameter.
		 * Produces the SQL expression <code>field BETWEEN value AND value_Range</code>.
		 * Note that this is the default Modifier used when a <code>_Range</code> value exists. Value is "between".
		 **/
		BETWEEN: "between",

		/**
		 * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.
		 * Produces the SQL expression <code>UPPER(field) BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cibetween".
		 **/
		CIBETWEEN: "cibetween",

		/**
		 * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.
		 * Produces the SQL expression <code>fieldNOT BETWEEN value AND value_Range</code>. Value is "notbetween".
		 **/
		NOTBETWEEN: "notbetween",

		/**
		 * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.
		 * Produces the SQL expression <code>UPPER(field)NOT BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cinotbetween".
		 **/
		CINOTBETWEEN: "cinotbetween",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.
		 * Produces the SQL expression <code>field IN ( value1, value2, ..., valuen)</code>
		 * Note that this is the default Modifier used when multiple <code>value</code> fields exist. Value is "in".
		 **/
		IN: "in",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.
		 * Produces the SQL expression <code>UPPER(field) IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
		 **/
		CIIN: "ciin",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.
		 * Produces the SQL expression <code>field NOT IN ( value1, value2, ..., valuen)</code>. Value is "notin".
		 **/
		NOTIN: "notin",

		/**
		 * Use of this Modifier assumes multiple <code>value</code> fields with different values.
		 * Produces the SQL expression <code>UPPER(field) NOT IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
		 **/
		CINOTIN: "cinotin",

		/**
		 * Produces the SQL expression <code>field & value > 0</code>. Value is "bitwiseor".
		 * Useful for checking if any of a group of bits is set.
		 **/
		BITWISE_OR: "bitwiseor",

		/**
		 * Produces the SQL expression <code>field & value = value</code>. Value is "bitwiseand".
		 * Useful for checking if all of a group of bits is set.
		 **/
		BITWISE_AND: "bitwiseand",

		/**
		 * Produces the SQL expression <code>field & value = 0</code>. Value is "bitwisenand".
		 * Useful for checking if none of a group of bits is set.
		 **/
		BITWISE_NAND: "bitwisenand",


		/**
		 * By default, searches for a date value generate the following SQL filter <code>field between <00:00:00:000 of day> and <23:59:59:999 of day></code>.
		 * This is for convenience so that date searches return any match on items that fall on that date.
		 * However, if it is desired to find an exact match on a specific time of day as well as the date, this Modifier enforces that rule.
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
		 * Used for DE queries that allow multiple values.
		 * This Modifier requires that DE fields have all of the specified values. Value is "allof".
		 */
		ALLOF: "allof",


		/**
		 * Produces the SQL expression <code>field IS NULL</code>.
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isnull".
		 */
		ISNULL: "isnull",

		/**
		 * Produces the SQL expression <code>field IS NOT NULL</code>.
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notnull".
		 */
		NOTNULL: "notnull",


		/**
		 * Produces the SQL expression <code>field IS NULL OR field = ''</code>.
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isblank".
		 */
		ISBLANK: "isblank",

		/**
		 * Produces the SQL expression <code>field IS NOT NULL AND field <> ''</code>.
		 * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notblank".
		 */
		NOTBLANK: "notblank"
	},


	/**
	 * Aggregate functions which can be used with the AGGFUNC suffix.
	 */
	Functions: {
		/**
		 * Maximum value aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "max".
		 */
		MAX: "max",

		/**
		 * Minimum value aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "min".
		 **/
		MIN: "min",
		
		/**
		 * Average value aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "avg".
		 **/
		AVG: "avg",
		
		/**
		 * Summation aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "sum".
		 **/
		SUM: "sum",
		
		/**
		 * Count aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "count".
		 **/
		COUNT: "count",
		
		/**
		 * Standard Deviation aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "std".
		 **/
		STD: "std",
		
		/**
		 * Variance aggregate function.
		 * Can only be used with the AGGFUNC suffix. Value is "var".
		 **/
		VAR: "var",
		
		/**
		 * Maximum value aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "dmax".
		 **/
		DMAX: "dmax",
		
		/**
		 * Minimum value aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "dmin".
		 **/
		DMIN: "dmin",
		
		/**
		 * Average value aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "davg".
		 **/
		DAVG: "davg",
		
		/**
		 * Summation aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "dsum".
		 **/
		DSUM: "dsum",
		
		/**
		 * Count aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "dcount".
		 **/
		DCOUNT: "dcount",
		
		/**
		 * Standard Deviation aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "dstd".
		 **/
		DSTD: "dstd",
		
		/**
		 * Variance aggregate function (distinct mode).
		 * Can only be used with the AGGFUNC suffix. Value is "dvar".
		 **/
		DVAR: "dvar"
	}
};

module.exports = ApiConstants;
