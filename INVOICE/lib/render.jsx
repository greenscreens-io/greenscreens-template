/*
 * Copyright (C) 2015, 2016  Green Screens Ltd.
 */

/**
 * Renderer which use HTML template and fill it with data from generated JSON object
 */
var Render = (function(){

	var Printer = Java.type('io.greenscreens.scripts.Printer');
	
	var module = {
			
		/**
		 * Main function
		 * @path - template directory
		 * @obj - generated JSOn from spool data
		 * @file - expected pdf location 
		 */
		process: function(ctx, path, obj, file){
			var me = this;
			var page = me.generateHTML(path, obj);		
			var htmlFile = file.replace('pdf', 'html');
			
			// for demo purpose when both drivers are in use (script and pdf)
			var pdfFile =  file.replace('pdf', 'html.pdf');

			FileUtil.save(page, htmlFile);
			me.convert(ctx, obj.outq, htmlFile, pdfFile);
			return pdfFile;
		},
		
		/**
		 * Convert JSON object into HTML
		 * @path - template directory
		 * @obj - generated JSOn from spool data
		 * @return - generated html page as string  
		 */
		generateHTML: function(path, obj){

			var page = FileUtil.read(path + '/design/index.html');
			var record = FileUtil.read(path + '/design/record.html');

			var tmp, table = '';
			var cols = record.match(/<%.*?%>/g);
			
			// generate record lines
			obj.items.every(function(r){
				tmp = record;
				cols.every(function(v, i){
					var s = v.split(' ')[1].trim();
					var d = r[parseInt(s)] || '';
					tmp = tmp.replace(v, d);
					return true;
				});
				table = table + tmp;	
				return true;
			}); 
			
			// generate report, inject regenerated record lines
			var items = page.match(/<%.*?%>/g);
			items.every(function(v){
				
				var s = v.split(' ')[1].trim();
				var d = obj[s] || '';
								
				if (s!== 'records') {
					page = page.replace(v, d);
				} else {
					page = page.replace(v, table);
				}
				
				return true;
			});
			
			return page;
		},		
		
		/**
		 * Convert HTML file to PDF document
		 * Optionally to image files
		 * NOTE: PDF and images are generated asynchronously 
		 */
		convert: function(ctx, outq, htmlFile, pdfFile) {

			// QUEUE, infile html, outfile pdf, auto print, auto email
			Printer.renderPDF(ctx, outq, htmlFile, pdfFile, false, false);

			// supported types - bmp, jpg, png, svg
			var imageFile = pdfFile.replace('pdf', 'svg');
			Printer.renderImage(ctx, outq, htmlFile, imageFile, false, false);

		}

	};

	return module;
}())
