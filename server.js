var express = require("express");
var app     = express();
var bodyParser = require('body-parser');
var request = require('request');
var jsdom = require('jsdom');
var http = require('http');
var ejs = require('ejs');
var fs = require('fs');
var json2csv = require('json2csv').Parser;
var newline = "\r\n";
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

var fields = ["Name of the website","Full Load Time","Full Load Time with adblock", "Requests", "Requests with adblock", "Number of Bytes rendered", "Number of bytes rendered with adblock"];
const json2csvParser = new json2csv({ fields });
var counter = 0;
var data = [];

app.use(express.bodyParser());
// app.use(app.router);

var url_name;

app.get('/',function(req,res){
  res.sendfile('./page_analyzer.html');
});

app.post('/',function(req,res){
     url_name = req.body.urlname;
     console.log(url_name);

     http://www.webpagetest.org/runtest.php?url=guru99.com&runs=1&f=xml&k=<your-api-key>

     // getJsonUrl(url);
     var easy_list = `https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_block.txt`;
     request(easy_list,function (err, response, body) {
          if(err) console.log("There is an err " + err);
          else{
               lines = response.body.split("\n");
               modified_EasyList = preprocess(lines);
               // modified_EasyList = modified_EasyList.slice(0,1000);
               modified_EasyList = modified_EasyList.join(' ');

               var ttfb_ad;
               var st_render_ad;
               var visual_comp_ad;
               var full_load_ad;
               var loadtime_ad;
               var ttfb;
               var st_render;
               var visual_comp;
               var full_load;
               var loadtime;
               var doctime;
               var doctime_ad;
               var req_docs;
               var req_docs_ad;
               var bytes_in_doc;
               var bytes_in_doc_ad;
               var fully_loaded;
               var fully_loaded_ad;
               var bytes_in;
               var bytes_in_ad;
               var requests;
               var requests_ad;
               var domain, domain_ad;
               var html_req, js_req, css_req, image_req, flash_req, font_req, video_req, other_req;
		   var html_bytes, js_bytes, css_bytes, image_bytes, flash_bytes, font_bytes, video_bytes, other_bytes;
		   var html_req_ad, js_req_ad, css_req_ad, image_req_ad, flash_req_ad, font_req_ad, video_req_ad, other_req_ad;
		   var html_bytes_ad, js_bytes_ad, css_bytes_ad, image_bytes_ad, flash_bytes_ad, font_bytes_ad, video_bytes_ad, other_bytes_ad;
               // url=${url_name}&runs=1&f=json&k=A.afa14290389eedf7bc951f8186ae0fe9&block=${modified_EasyList}
               var options = {
                    uri:`http://www.webpagetest.org/runtest.php?`,
                    method:'POST',
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    formData: {
                         'url' : url_name,
                         'f' : 'json',
                         'k' : 'A.2aa6b9a1ae69ac5a763c33f4b788ddb5',
                         'block': modified_EasyList,
                         'fvonly' : 1
                    }
               }

               var options_ad = {
                    uri:`http://www.webpagetest.org/runtest.php?`,
                    method:'POST',
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    formData: {
                         'url' : url_name,
                         'f' : 'json',
                         'k' : 'A.2aa6b9a1ae69ac5a763c33f4b788ddb5',
                         'fvonly' : 1
                    }
               }
               // var blk_list = `http://www.webpagetest.org/runtest.php?url=${url_name}&runs=1&f=json&k=A.afa14290389eedf7bc951f8186ae0fe9&block=${modified_EasyList}`;
               request.post(options, function (err, response, body) {
                    if(err) console.log("There is an err " + err);
                    else{
                         var data = JSON.parse(response.body);
                         var test_url = data.data.jsonUrl;
                         console.log(test_url);
                         sleep(60000).then(() => {
                              var required = {
                                   uri: test_url,
                                   method: 'POST',
                                   headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                   },
                                   formData: {
                                        'breakdown' : 1,
                                        'domains':1
                                   }
                              }
                              request(required,function (err, response, body) {
                                   if(err) console.log("There is an err " + err);
                                   else{
                                       // console.log(response.body);
                                       var test_data = JSON.parse(response.body);
                                       var firstView = test_data.data.average.firstView;
                                       var firstView_new = test_data.data.runs["1"].firstView;
                                       console.log("Time with ad block " + firstView.loadTime);
                                       loadtime = firstView.loadTime;
                                       ttfb = firstView.TTFB;
                                       st_render = firstView.render;
                                       visual_comp = firstView.visualComplete;
                                       full_load = firstView.fullyLoaded;
                                       doctime = firstView.docTime;
                                       req_docs = firstView.requestsDoc;
                                       bytes_in_doc = firstView.bytesInDoc;
                                       fully_loaded = firstView.fullyLoaded;
                                       bytes_in = firstView.bytesIn;
                                       requests = firstView.requestsFull;
                                       if(firstView_new.domains != null && firstView_new.domains != undefined) domain = firstView_new.domains;
                                       else domain = 0;
                                       // domain = firstView_new.domains;

                                       var breakdown = test_data.data.runs[1].firstView.breakdown;

							   html_req = breakdown.html.requests;
							   html_bytes = breakdown.html.bytes;

							   js_req = breakdown.js.requests;
							   js_bytes = breakdown.js.bytes;

							   css_req = breakdown.css.requests;
							   css_bytes = breakdown.css.bytes;

							   image_req = breakdown.image.requests;
							   image_bytes = breakdown.image.bytes;

							   flash_req = breakdown.flash.requests;
							   flash_bytes = breakdown.flash.bytes;

							   font_req = breakdown.font.requests;
							   font_bytes = breakdown.font.bytes;

							   video_req = breakdown.video.requests;
							   video_bytes = breakdown.video.bytes;

							   other_req = breakdown.other.requests;
							   other_bytes = breakdown.other.bytes;

                                        // res.send("The test data is " + test_data.data.average.firstView.loadTime);
                                        // fs.readFile('page_analyzer.html','utf-8',function(err,content){
                                        //      if(err) {
                                        //           res.end(err);
                                        //           return;
                                        //      }
                                        //      var renderedhtml = ejs.render(content,{
                                        //           loadtime:loadtime,
                                        //           ttfb:ttfb,
                                        //           st_render:st_render,
                                        //           visual_comp:visual_comp,
                                        //           full_load:full_load
                                        //      });
                                        //      res.end(renderedhtml);
                                        // });
                                   }
                              });
     				});
                    }
               }); // end of oprions

               request.post(options_ad, function (err, response, body) {
                    if(err) console.log("There is an err " + err);
                    else{
                         var data_ad = JSON.parse(response.body);
                         var test_url_ad = data_ad.data.jsonUrl;
                         console.log(test_url_ad);
                         sleep(60000).then(() => {
                              var required = {
                                   uri: test_url_ad,
                                   method: 'POST',
                                   headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                   },
                                   formData: {
                                        'breakdown' : 1,
                                        'domains':1
                                   }
                              }
                              request(required,function (err, response, body) {
                                   if(err) console.log("There is an err " + err);
                                   else{
                                       // console.log(response.body);
                                       var test_data = JSON.parse(response.body);
                                       var firstView = test_data.data.average.firstView;
                                       var firstView_new = test_data.data.runs["1"].firstView;
                                       console.log("Tiem without ad block " + firstView.loadTime);
                                       loadtime_ad = firstView.loadTime;
                                       ttfb_ad = firstView.TTFB;
                                       st_render_ad = firstView.render;
                                       visual_comp_ad = firstView.visualComplete;
                                       full_load_ad = firstView.fullyLoaded;
                                       doctime_ad = firstView.docTime;
                                       req_docs_ad = firstView.requestsDoc;
                                       bytes_in_doc_ad = firstView.bytesInDoc;
                                       fully_loaded_ad = firstView.fullyLoaded;
                                       bytes_in_ad = firstView.bytesIn;
                                       requests_ad = firstView.requestsFull;
                                       if(firstView_new.domains != null && firstView_new.domains != undefined) domain_ad = firstView_new.domains;
                                       else domain_ad = 0;
                                       var breakdown = test_data.data.runs[1].firstView.breakdown;

							   html_req_ad = breakdown.html.requests;
							   html_bytes_ad = breakdown.html.bytes;

							   js_req_ad = breakdown.js.requests;
							   js_bytes_ad = breakdown.js.bytes;

							   css_req_ad = breakdown.css.requests;
							   css_bytes_ad = breakdown.css.bytes;

							   image_req_ad = breakdown.image.requests;
							   image_bytes_ad = breakdown.image.bytes;

							   flash_req_ad = breakdown.flash.requests;
							   flash_bytes_ad = breakdown.flash.bytes;

							   font_req_ad = breakdown.font.requests;
							   font_bytes_ad = breakdown.font.bytes;

							   video_req_ad = breakdown.video.requests;
							   video_bytes_ad = breakdown.video.bytes;

							   other_req_ad = breakdown.other.requests;
							   other_bytes_ad = breakdown.other.bytes;
                                        // res.send("The test data is " + test_data.data.average.firstView.loadTime);
                                        fs.readFile('page_analyzer.html','utf-8',function(err,content){
                                             if(err) {
                                                  res.end(err);
                                                  return;
                                             }

                                             var renderedhtml = ejs.render(content,{
                                                  loadtime_ad:loadtime_ad,
                                                  ttfb_ad:ttfb_ad,
                                                  st_render_ad:st_render_ad,
                                                  visual_comp_ad:visual_comp_ad,
                                                  full_load_ad:full_load_ad,
                                                  loadtime:loadtime,
                                                  ttfb:ttfb,
                                                  st_render:st_render,
                                                  visual_comp:visual_comp,
                                                  full_load:full_load,
                                                  doctime:doctime,
                                                  doctime_ad:doctime_ad,
                                                  req_docs:req_docs,
                                                  req_docs_ad:req_docs_ad,
                                                  bytes_in_doc:bytes_in_doc,
                                                  bytes_in_doc_ad:bytes_in_doc_ad,
                                                  fully_loaded:fully_loaded,
                                                  bytes_in:bytes_in,
                                                  requests:requests,
                                                  fully_loaded_ad:fully_loaded_ad,
                                                  bytes_in_ad:bytes_in_ad,
                                                  requests_ad:requests_ad,
                                                  html_req:html_req,
									  js_req:js_req,
									  css_req:css_req,
									  image_req:image_req,
									  flash_req:flash_req,
									  font_req:font_req,
									  video_req:video_req,
									  other_req:other_req,
									  html_bytes:html_bytes,
									  js_bytes:js_bytes,
									  css_bytes:css_bytes,
									  image_bytes:image_bytes,
									  flash_bytes:flash_bytes,
									  font_bytes:font_bytes,
									  video_bytes:video_bytes,
									  other_bytes:other_bytes,

									  html_req_ad:html_req_ad,
									  js_req_ad:js_req_ad,
									  css_req_ad:css_req_ad,
									  image_req_ad:image_req_ad,
									  flash_req_ad:flash_req_ad,
									  font_req_ad:font_req_ad,
									  video_req_ad:video_req_ad,
									  other_req_ad:other_req_ad,
									  html_bytes_ad:html_bytes_ad,
									  js_bytes_ad:js_bytes_ad,
									  css_bytes_ad:css_bytes_ad,
									  image_bytes_ad:image_bytes_ad,
									  flash_bytes_ad:flash_bytes_ad,
									  font_bytes_ad:font_bytes_ad,
									  video_bytes_ad:video_bytes_ad,
									  other_bytes_ad:other_bytes_ad,

                                             });

                                             console.log(domain);

                                             if(counter < 1){
                                             var appendThis =
                                                  {
                                                       "Name of the website":url_name,
                                                       "Full Load Time with adblock":fully_loaded,
                                                       "Full Load Time":fully_loaded_ad,
                                                       "Requests with adblock":requests,
                                                       "Requests":requests_ad,
                                                       "Number of bytes rendered with adblock":bytes_in,
                                                       "Number of Bytes rendered":bytes_in_ad,
                                                       // "Domains":Object.keys(domain_ad).length,
                                                       // "Domains with adblock":Object.keys(domain).length
                                                  };
                                                  data.push(appendThis);
                                                  counter++;
                                             }
                                             else{

                                                  const csv = json2csvParser.parse(data);
                                                  // var csv = json2csv(toCsv)+newline;
                                                  fs.writeFile('stats_data_10.csv',csv,function(err){
                                                       if(err) throw err;
                                                       console.log("Data written successfully");
                                                  });

                                                  // fs.stat('stats_data.csv',function(err,stat){
                                                  //      if(err == null) {
                                                  //           console.log('File exists');
                                                  //           const csv = json2csvParser.parse(data);
                                                  //           // var csv = json2csv(toCsv)+newline;
                                                  //           fs.appendFile('stats_data.csv',csv,function(err){
                                                  //                if(err) throw err;
                                                  //                console.log("Data appended successfully");
                                                  //           });
                                                  //      }
                                                  //      else {
                                                  //           console.log('Error appending');
                                                  //           }
                                                  //      });
                                                  }

                                             console.log(data);
                                             console.log(bytes_in);
                                             console.log(bytes_in_ad);
                                             // var toCsv = {
                                             //      data:appendThis,
                                             //      fields:fields,
                                             //      hasCSVColumnTitle:false
                                             // };


                                             res.end(renderedhtml);
                                        });
                                   }
                              });
     				});
                    }
               }); // end of options_ad

               // fs.readFile('page_analyzer.html','utf-8',function(err,content){
               //      if(err) {
               //           res.end(err);
               //           return;
               //      }
               //      var renderedhtml = ejs.render(content,{
               //           loadtime_ad:loadtime_ad,
               //           ttfb_ad:ttfb_ad,
               //           st_render_ad:st_render_ad,
               //           visual_comp_ad:visual_comp_ad,
               //           full_load_ad:full_load_ad,
               //           loadtime:loadtime,
               //           ttfb:ttfb,
               //           st_render:st_render,
               //           visual_comp:visual_comp,
               //           full_load:full_load
               //      });
               //      res.end(renderedhtml);
               // });

               // console.log(modified_EasyList);
          }
     });
});

app.listen(3000);

console.log("Running at Port 3000");

function preprocess(lines) {
	modified_lines = [];
	for(i = 0; i < lines.length; i++){
		var line = lines[i];
		var punctuations = ['&', '?', '=', '.', '-', '_','@', '|', '#', ';', '{', '/', '\\', '(', ']', '`', '~', '%', '[', '^', '}', '<', '*', '!', '+', '>', "'", ')', '$', '"', ':', ','];
		if (punctuations.some(function(v) { return line.indexOf(v) == line.length-1; }))
			line = line.slice(0,line.length-1);
		modified_lines.push(line);
	}
	return modified_lines;
}

// function getJsonUrl(pageUrl) {
// 	$.ajax({
// 			url: 'https://www.webpagetest.org/runtest.php?',
// 			data: {'url': pageUrl, 'f': 'json', 'k': 'A.afa14290389eedf7bc951f8186ae0fe9'},
// 			type: 'POST',
// 			crossDomain: true,
// 			dataType: 'jsonp',
// 			success: function(response) {
// 				console.log(response.data.jsonUrl);
// 				jsonUrl = response.data.jsonUrl;
//                     console.log("Json successfully called");
// 				sleep(50000).then(() => {
// 					// Do something after the sleep!
// 					getResultJson(jsonUrl);
//                          // console.log(jsonData);
// 				});
// 			},
// 			error: function() { alert('Failed!'); },
// 		});
// }
//
// function getResultJson(jsonUrl) {
// 	$.ajax({
// 			url: jsonUrl,
// 			type: 'GET',
// 			crossDomain: true,
// 			dataType: 'jsonp',
// 			success: function(response) {
// 				console.log(response);
//                     jsonData = response;
//                     console.log(jsonData);
// 			},
// 			error: function() { alert('Failed!'); },
// 		});
// }

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
