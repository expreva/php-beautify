phpcs:set Universal.WhiteSpace.PrecisionAlignment ignoreBlankLines false

<?php
/*
 * This file tests the handling of trailing whitespace on lines which only contain whitespace.
 *
 * BE CAREFUL WHEN SAVING THIS FILE!
 * For the test to be accurate, the trailing whitespace on various blank lines needs to be preserved!
 */

// New line only.
echo 'the line below only contains a new line char';

// Blank line contains trailing whitespace, ignore.
echo 'the line below has 4 spaces trailing whitespace!';
    
// Blank line contains trailing whitespace, ignore, even though it doesn't match the length of a tabstop.
echo 'the line below has 5 spaces trailing whitespace!';
     
/*
 * The line below only contains a new line char. OK.

 * The line below has 4 spaces trailing whitespace! Ignore.
    
 * The line below has 5 spaces trailing whitespace! Ignore, even though not matching tab width.
     
 */

/**
 * The line below only contains a new line char. OK.

 * The line below has 4 spaces trailing whitespace! Ignore.
    
 * The line below has 5 spaces trailing whitespace! Ignore, even though not matching tab width.
     
 */

?>
The line below only contains a new line char. OK.

The line below has 4 spaces trailing whitespace! Ignore.
    
The line below has 5 spaces trailing whitespace! Ignore, even though not matching tab width.
     
<?php

// Same tests, but now with indentation.

    // New line only.
    echo 'the line below only contains a new line char';

    // Blank line contains trailing whitespace, ignore.
    echo 'the line below has 4 spaces trailing whitespace!';
    
    // Blank line contains trailing whitespace, ignore, even though it doesn't match the length of a tabstop.
    echo 'the line between these statement has 5 spaces trailing whitespace!';
     
    /*
     * The line below only contains a new line char. OK.

     * The line below has 4 spaces trailing whitespace! Ignore.
    
     * The line below has 5 spaces trailing whitespace! Ignore, even though not matching tab width.
     
     */

    /**
     * The line below only contains a new line char. OK.
    
     * The line below has 4 spaces trailing whitespace! Ignore.
    
     * The line below has 5 spaces trailing whitespace! Ignore, even though not matching tab width.
     
     */

    ?>
    The line below only contains a new line char. OK.

    The line below has 4 spaces trailing whitespace! Ignore.
    
    The line below has 5 spaces trailing whitespace! Ignore, even though not matching tab width.
     
    <?php
// phpcs:set Universal.WhiteSpace.PrecisionAlignment ignoreBlankLines true
