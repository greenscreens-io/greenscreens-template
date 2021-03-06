/*
 * Copyright (C) 2015, 2016  Green Screens Ltd.
 */

var Integer = Java.type('java.lang.Integer');
var Float = Java.type('java.lang.Float');
var File = Java.type('java.io.File');

var spool = {};
var page = 0;
var altFile = null;

/**
 * Called when new virtual printer is initialized
 */
function onInit() {
   //print(outq);
   //print(template);

   // load scripts
   load(template+'/lib/writer.jsx');
   load(template+'/lib/parser.jsx');
   load(template+'/lib/render.jsx');

   Parser.log = false;

   // 0 - off, 1 - on - driver
   return 1;
}

/**
 * Called when new report is started
 */
function onStartReport() {
   //print(attributes);
   //print(controls);

   // reset states
   Parser.init();
   page = 0;

   var attr = attributes || null;
   var root = ("file:///" + template).replace(/\\/g, '/').replace('/INVOICE', '');

   spool = {
		   "root" : root,
		   "template": attr.getSpoolName(),
		   "outq": attr.getOUTQName(),
		   "origin": attr.getSystem(),
		   "spoolName": attr.getSpoolName(),
		   "spoolNumber": Integer.toString(attr.getSpoolNumber()),
		   "jobName": attr.getJobName(),
		   "jobNumber": attr.getJobNumber(),
		   "jobUser": attr.getJobUser(),
		   "creationDate": attr.getCreateionDate(),
		   "creationTime": attr.getCreationTime(),
		   "attrCpi": Float.toString(attr.getCpi()),
		   "attrLpi": Float.toString(attr.getLpi()),
		   "attrRows": Float.toString(attr.getPageLength()),
		   "attrCols": Float.toString(attr.getPageWidth()),
		   "attrOwf": Float.toString(attr.getOwerflow()),
		   "items": []
   }
}


/**
 * Called when spool file receive is complete
 */
function onEndReport(file) {
   //print(JSON.stringify(spool));

   // convert generated JSON to string and save it
   var data = JSON.stringify(spool);
   FileUtil.save(data, file.toString().replace('pdf','json'));

   // 1. Render will generate HTML from template and generated JSON
   // 2. Report rendering will be submited to the processing queue
   // 3. File is saved with different name (regular PDF can be also generated)
   Render.process(this, template, spool, file.toString());
}

/**
 * Called every time new page processing is started
 */
function onStartPage() {}

/**
 * Called every time page processing is ended
 */
function onEndPage() {
	page++;
}

/**
 * Current line from spool file page
 */
function onLine(page, line, position, overprint, text) {
   //print(text);
   Parser.validate(text || '', spool);
}

/**
 * Alternate file output name.
 * If set, driver will use that file for processing
 * Will wait up to 30 sec. for PDF to become available
 * if available, PDF will receive spool attributes
 * @return String
 */
function getAlternateName() {
  return altFile;
}
