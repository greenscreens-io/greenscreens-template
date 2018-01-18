/*
 * Copyright (C) 2015, 2016  Green Screens Ltd.
 */

/**
 * Spool data parser. Detect segments from current line and 
 * extracts data which are set to JSON object
 */
var Parser = (function(){

	var step = 0;
	  
	var module = {
		  
		  /**
		   * Reset parser to initial state
		   */
		  init : function(){
			  step = 0;
		  },

		  /**
		   * Main function to parse given text line 
		   */
		  validate: function(v, obj, log) {
			  var me = this;

			   log ? print('<<'+step): null;
			   log ? print(text): null;	   
			  
			  if (typeof me['step' + step] === 'function' ) {
				  step = step + me['step' + step](v, obj);
			  }			  
			  
			  log ? print('>>' + step): null;
		  },
		  
		  step0: function(v, obj){        		  
	  		  if (v.indexOf('Invoice Date')>-1) {
	  			  obj.invoiceDate = v.split(':')[1].trim();
	  			  return 1;
	  		  }
	  		  return 0;
		  },
		
		  step1: function(v, obj){        		  
	  		  if (v.trim().indexOf('To') === 0 && v.trim().endsWith('From')) {        			  
	  			  return 1;
	  		  }
	  		  return 0;
		  },
		  
		  step2: function(v, obj){
			      var t = v.trim().replace(/  +/g, 'Ł').split('Ł');
			  if (t.length>1) {
	  		      obj.clientName = t[0].trim();
	  		      obj.companyName = t[1].trim();
				  return 1;
			  } 
			  return 0;
		  },
		  
		  step3: function(v, obj){
			  var t = v.trim().replace(/  +/g, 'Ł').split('Ł');
			  if (t.length>1) {
				  obj.clientStreet = t[0].trim();
	  		      obj.companyStreet = t[1].trim();
				  return 1;
			  } 
			  return 0;
		  },
		  
		  step4: function(v, obj){
			  var t = v.trim().replace(/  +/g, 'Ł').split('Ł');
			  if (t.length>1) {
				  obj.clientCity = t[0].trim();
	  		      obj.companyCity = t[1].trim();
				  return 1;
			  } 
			  return 0;			
		  },
		  
		  step5: function(v, obj){
			  var t = v.replace(/: /g, ':').replace(/ +/g, 'Ł').split('Ł');
			  if (t.length>1) {
	  		      obj.clientEmail = t[0].split(':')[1].trim();
	  		      obj.companyEmail = t[1].split(':')[1].trim();
				  return 1;
			  } 
			  return 0;
		  },
		  
		  step6: function(v, obj){
			  var t = v.replace(/: /g, ':').replace(/ +/g, 'Ł').split('Ł');
			  if (t.length>1) {
	  		      obj.invoiceID = t[0].split(':')[1].trim();
	  		      obj.companySwift = t[1].split(':')[1].trim();
				  return 1;  
			  }
			  return 0;
		  },
		  
		  step7: function(v, obj){
			  var t = v.replace(/: /g, ':').replace(/  +/g, 'Ł').split('Ł');
			  if (t.length>1) {
	  		      obj.orderID = t[0].split(':')[1].trim();
	  		      obj.companyIBAN = t[1].split(':')[1].trim();
				  return 1;
			  } 
			  return 0;
		  },
		  
		  step8: function(v, obj){
			  obj.paymentDue = v.split(':')[1].trim();
			  return 1;
		  },
		  
		  step9: function(v, obj){
			  if (v.indexOf('--------------')>-1) {
				  return 1;
			  }
			  return 0;
		  },   		 
		  
		  step10: function(v, obj){
			  return this.step9(v, obj);    		  
		  },
		  
		  step11: function(v, obj){
			  // extract row
			  if (v.indexOf('--------------')>-1) {
				  return 1;
			  }
			  obj.items.push(v.trim().replace(/  +/g, 'Ł').split('Ł'));
			  return 0;  
		  },
		  
		  step12: function(v, obj){
			  obj.total = v.split(':')[1].trim();
			  return 1;  
		  }
	};
	
	return module;
}())
