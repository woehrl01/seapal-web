<?php

/**
 * Utility class for input validation
 */
final class Valid {

	// Required flags to make a validation more readable.
	public static $REQ = TRUE;
	public static $NOT_REQ = FALSE;

	private function __construct() {}

	/**
	 * Checks if the not required field is empty.
	 * @remark Must be logically OR-connected and must be check at first!
	 * @param value The value to check.
	 * @return TRUE, if the value is NULL or empty. 
	 */
	private static function check_not_required($value) {
		if (strlen($value) == 0) {
			return TRUE;
		}

		return FALSE;
	}

	/**
	 * Checks if the required field is set.
	 * @param value The value to check.
	 * @return TRUE, if the value is not NULL or empty. 
	 */
	public static function is_required($value) {
		if (strlen($value) > 0) {
			return TRUE;
		}

		return FALSE;
	}

	/**
	 * Checks the number range.
	 * @param value The value to check.
	 * @param min The min value.
	 * @param max The max value.
	 * @param required Checks whether the value is required or not.
	 * @return TRUE, if the validation was successfull.
	 */
	public static function is_number_range($value, $min, $max, $required) {
		if (!$required && Valid::check_not_required($value)) {
			return TRUE;
		}

		if (is_numeric($value)) {
			if ($value >= $min && $value <= $max) {
				return TRUE;
			}
		}

		return FALSE;
	}

	/**
	 * Checks the number with a given minimum.
	 * @param value The value to check.
	 * @param min The min value.
	 * @param required Checks whether the value is required or not.
	 * @return TRUE, if the validation was successfull.
	 */
	public static function is_number_min($value, $min, $required) {
		if (!$required && Valid::check_not_required($value)) {
			return TRUE;
		}

		if (is_numeric($value)) {
			if ($value >= $min) {
				return TRUE;
			}
		}

		return FALSE;
	}

	/**
	 * Checks the number with a given maximum.
	 * @param value The value to check.
	 * @param max The max value.
	 * @param required Checks whether the value is required or not.
	 * @return TRUE, if the validation was successfull.
	 */
	public static function is_number_max($value, $min, $required) {
		if (!$required && Valid::check_not_required($value)) {
			return TRUE;
		}
		if (is_numeric($value)) {
			if ($value <= $max) {
				return TRUE;
			}
		}

		return FALSE;
	}

	/**
	 * Checks the number.
	 * @param value The value to check.
	 * @param required Checks whether the value is required or not.
	 * @return TRUE, if the validation was successfull.
	 */
	public static function is_number($value, $required) {
		if (!$required && Valid::check_not_required($value)) {
			return TRUE;
		}

		if (is_numeric($value)) {
			return TRUE;
		}

		return FALSE;
	}
}

?>