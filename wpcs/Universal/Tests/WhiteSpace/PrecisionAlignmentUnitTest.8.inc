phpcs:set Universal.WhiteSpace.PrecisionAlignment indent 2

<?php
/*
 * File with mostly tab based indentation.
 * Using an explicit custom indent value of 2 with tab-width 2.
 */
	function exampleFunctionA() {} // OK: [tab].

/*
 * OK: [tab][space][space][space][space]. This sniff is not concerned with tabs vs spaces.
 */
	    function exampleFunctionB() {}

/*
 * OK: [tab][space][space][tab][space][tab]. Comes down to four tabs. This sniff is not concerned with tabs vs spaces.
 */
	  	 	function exampleFunctionC() {}

	/**
	 * OK: Doc comment is indented with tabs and one space for the star alignment.
	 *
	  * @var string  <= NO Warning as this is still a multiple of 2.
	 * @access private
	 */

	/*
		OK: Multi-line comment is indented with 2 tabs for the text alignment.
	 <= Warning, no star, but also not indented by multiples of 2 spaces.
	    OK: Another line of text [tab][space][space][space][space].
	 */

	/*
	 * OK: Multi-line comment is indented with tabs and one space for the star alignment.
	 *
	   * <= NO Warning as this is still a multiple of 2 (plus 1 space for the star).
	 */

	 function exampleFunctionD() {} // Warning: [tab][space].
		 function exampleFunctionE() {} // Warning: [tab][tab][space].
			 function exampleFunctionF() {} // Warning: [tab][tab][tab][space].

	$object->functioncall()
		-> chained()
		-> anothermethod();

	$object->functioncall()
		   -> chained()        // Warning: [tab][tab][space][space][space].
		   -> anothermethod(); // Warning: [tab][tab][space][space][space].

   ?> <!-- Warning: three spaces. -->

	<p>
	 Warning: Some inline HTML with precision alignment.
	</p>

 <?php // Warning: one space.

// Testing empty line within a comment.
/*

*/

// Testing that incorrectly aligned docblocks and multi-line inline comments do not trigger errors.
// The incorrectly star alignment is not the concern of this sniff.
	/**
	* Provision some options
	*/

	/*
	* Provision some options
	*/

?>

<script type="text/javascript">
	/*
	 * Multi-line javascript comment should not trigger this sniff.
	 */
	alert('OK');
	 alert('bad'); <!-- Warning. -->
</script>

<?php

// phpcs:set Universal.WhiteSpace.PrecisionAlignment indent
