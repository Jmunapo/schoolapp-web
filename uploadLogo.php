<?php

// Array based on $_FILE as seen in PHP file uploads
	$file = array(
		'name'     => basename($url), // ex: wp-header-logo.png
		'type'     => 'image/png',
		'tmp_name' => $temp_file,
		'error'    => 0,
		'size'     => filesize($temp_file),
	);

	$overrides = array(
		// Tells WordPress to not look for the POST form
		// fields that would normally be present as
		// we downloaded the file from a remote server, so there
		// will be no form fields
		// Default is true
		'test_form' => false,

		// Setting this to false lets WordPress allow empty files, not recommended
		// Default is true
		'test_size' => true,
	);