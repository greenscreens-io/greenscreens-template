/*
 * Copyright (C) 2015, 2016  Green Screens Ltd.
 */

/**
 * File data writer
 */
var FileUtil = (function(){

	var String = Java.type('java.lang.String');
	var Files = Java.type('java.nio.file.Files');
	var Paths = Java.type('java.nio.file.Paths');
	var PrintWriter = Java.type('java.io.PrintWriter');
	
	var module = {
					
		/**
		 * Save HTML page content to file
		 */
		save: function(page, file){
			var pw = new PrintWriter(file);
			pw.print(page);
			pw.flush();
			pw.close();			
		},
		
		read: function(file) {
			return new String(Files.readAllBytes(Paths.get(file)));
		}
		
	};
	
	return module;
}())
