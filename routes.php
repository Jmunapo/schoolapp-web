<?php 

function save_school_meta($request) {
    $arr = array_keys($_POST); // Get post
    $base64_img = $arr[0]; // base 64 data
    $school_id = sanitize_text_field($_GET['a']);
    
    $type = get_post($school_id)->post_type;
    if($type !== 'school'){
            return new WP_Error( 'invalid_id', 'Invalid School Id', array( 'status' => 404 ) );
        }
        
    $xul_name = sanitize_text_field($_GET['b']);
    $subdomain = sanitize_text_field($_GET['c']);
    $motto = sanitize_text_field($_GET['d']);
    $address = sanitize_text_field($_GET['e']);
    $location = sanitize_text_field($_GET['f']);
    $city = sanitize_text_field($_GET['g']);
    $xul_email = sanitize_text_field($_GET['h']);
    $cell = sanitize_text_field($_GET['i']);
    $tel = sanitize_text_field($_GET['j']);
    $logo = sanitize_text_field($_GET['k']);
    $stamp = sanitize_text_field($_GET['l']);
    
    if(!empty($xul_name)){ info_save_update_school($school_id , 'school-name', $xul_name); }
    if(!empty($subdomain)) { info_save_update_school($school_id , 'school-domain', $subdomain); }
    if(!empty($motto)){ info_save_update_school($school_id , 'school-motto', $motto);}
    if(!empty($address)){ info_save_update_school($school_id , 'school-address', $address); }
    if(!empty($location)) { info_save_update_school($school_id , 'school-location', $location); }
    if(!empty($city)){ info_save_update_school($school_id , 'school-city', $city);}
    if(!empty($xul_email)){ info_save_update_school($school_id , 'school-email', $xul_email); }
    if(!empty($cell)) { info_save_update_school($school_id , 'school-cell', $cell); }
    if(!empty($tel)){ info_save_update_school($school_id , 'school-tel', $tel);}
    if(!empty($logo)){ info_save_update_school($school_id , 'school-logo', $logo);}
    if(!empty($stamp)){ info_save_update_school($school_id , 'school-stamp', $stamp);}
     
    // Getting post meta get_post_meta( $school_id);
    
    return notifyAdmin($xul_name, $cell, $tel, $xul_email, $school_id); 
        
    return $postId;
   }
   
  function notifyAdmin($schoolname, $cell, $tel, $email, $school_id) {

        $subject = 'New school registration';
        $message = "Hi Diamond School Service admin, $schoolname new school registered with ID: $school_id". "\r\n". "Phone: $cell, Tel: $tel";

        // get the blog administrator's email address
        $to = get_option( 'admin_email' );

        $headers = "School name: $schoolname <$email>" . "\r\n";

        // If email has been process for sending, display a success message
        $send_mail = wp_mail( $to, $subject, $message, $headers);
        if($send_mail){
            return 'Sending Email';
            }
        return  'Failed to send Email';
}

 add_action( 'rest_api_init', function(){
        register_rest_route(
            'infoplugin/v1',
            '/addmeta/',
            array(
                'methods'  => 'POST',
                'callback' => 'save_school_meta',
                )
        );
    } );