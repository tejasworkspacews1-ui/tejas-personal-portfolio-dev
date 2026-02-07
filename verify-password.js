/* =========================================
   VERIFICATION LOGIC - DIRECT DELIVERY
========================================= */

$(document).ready(function() {
    // The "DUMMY" trick password
    const correctKey = "2026"; 
    
    const $form = $('#verify-form');
    const $input = $('#pass-key');
    const $hint = $('#hint-text');

    $form.on('submit', function(e) {
        e.preventDefault();
        
        const enteredValue = $input.val();

        if (enteredValue === correctKey) {
            // Access Granted - Neon feedback
            $input.css('border-color', 'var(--neon-cyan)');
            
            // Your Supabase Link
            const secureUrl = "https://mudrfauiwmxbeiedlizv.supabase.co/storage/v1/object/public/secure-cv/Tejas_CV_2026.pdf";

            $('.verify-card').fadeOut(400, function() {
                // Redirect the CURRENT tab to the PDF
                window.location.href = secureUrl;
            });
            
        } else {
            // Failure - Shake and Hint
            $input.addClass('shake');
            $hint.fadeIn();
            
            setTimeout(() => {
                $input.removeClass('shake');
            }, 400);
            
            $input.val('');
        }
    });
});
