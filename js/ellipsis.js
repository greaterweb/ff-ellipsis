/**
 * Add text-overflow: ellipsis; support to Firefox 4-6
 *
 * @category   CSS Polyfil
 * @author     Ron Edgecomb <ron@greaterwebdesign.com>
 * @copyright  2012 Ron Edgecomb
 * @license    The MIT License http://www.opensource.org/licenses/mit-license.php
 * @version    1.0
 */
(function() {
	
	var s = document.documentElement.style;
	// our best efforts at feature detection but the reality is we are only looking for FF 4-6
	if( !( 'textOverflow' in s || 'OTextOverflow' in s ) && 'MozBinding' in s ) {
		// due to the presence of -moz-binding we can safely assing FF
		// lets cut to the chase and look at the user agent version
		
		// INT will do just fine, only looking at major versions
		var ffVersion = parseInt( navigator.userAgent.split("/").splice(-1,1) );  
		
		if( ffVersion < 7 && ffVersion > 3 ) {
			// FF versions which don't support text-overflow or -moz-binding
			
			var ellipsis = document.querySelectorAll('.ellipsis'), // static list of .ellipsis elements currently on the page
				ellipsisIndex = 0,
				ellipsisInterval = '';
			
			if( ellipsis.length ) {

				// set interval so we don't clog up the page load
				ellipsisInterval = setInterval( function() {
				
					if( ellipsisIndex < ellipsis.length ){ 
				 		cssEllipsis( ellipsis[ellipsisIndex] );
				 	} else {
				 	 	clearInterval( ellipsisInterval );
				 	}
				 	
				 	ellipsisIndex++;
				
				}, 1 );
				
			}
			
			// only add this helper globally in FF 4-6 scenarios
			window.cssEllipsis = function( el ){
			
				// if a jQuery object was sent, revert to DOM element
				if( window.jQuery && el instanceof jQuery ) {
					for( var i=0; i<el.length; i++ ) {
						cssEllipsis( el[ i ] );
					}
					return;
				}
			
				// this trick won't work if the element has any children
				if( el.childNodes.length > 1 ) {
					return false;
				}
			
			 	// reset the element if it had been previously processed.
			 	el.setAttribute( 'class', el.className.replace( /(^|\s)css-ellipsis(\s|$)/g, ' ' ).replace( /(^\s|\s{2,}|\s$)/g, '' ) );
			 	el.removeAttribute( 'data-calculated-width' );
			 	
			 	// clone the element, reset some basic styles 
			 	var clone = el.cloneNode( true );			 	
			 	clone.setAttribute( 'style', "width:auto; maxWidth:none; overflow:visible; display:inline; visibility:hidden;" );
	
			 	// push the node onto the DOM so we can get an accurate size
			 	el.parentNode.appendChild( clone );
			 	el.setAttribute( 'data-calculated-width', clone.offsetWidth );
			 	
			 	// we have the size, let's discard it
			 	el.parentNode.removeChild( clone );
			 	
			 	// if the width is greater than the available space, use our css-ellipsis class
			 	if( el.getAttribute( 'data-calculated-width' ) > el.offsetWidth ){
			 		
				 	el.setAttribute( 'class', el.className + ' css-ellipsis' );
				 	// key part of this solution is replacing all text whitespace with &nbsp;
				 	el.innerHTML = el.textContent.replace(/\s+/g, '&nbsp;');
			 	}
			 
			};
			
		}
		
	}

})();