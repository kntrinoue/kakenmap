// 読み込みボタンがchangeになったら実行
var read_btn = document.querySelector("#demo_btn");
read_btn.addEventListener("change", file_upload, false);

var inputData;
function file_upload(event) {
    var file = event.target.files[0];
    file_read(file);
}

function jmapInterface(){
    checkAreas();
	
	$('#jmap').jmap({
     //viewType: 'grid',
     skew: '5',
     showHeatmap: true,
     heatmapLabelUnit: '人',
     heatmapType: 'HRed',
     showHeatlabel: true,
     //Math.max.apply(null,areas.map(function(o){return o.number;}))
     heatmapConditions: ["<5", ">=5",  ">=15"],
     heatmapColors: ["#cccccc", "#FFA500", "#FF0000"],
     onSelect: function(e, data) {
        alert('研究者は %d 人です。'.replace('%d', (data.option.number).toLocaleString()));
     },
    areas: areas
    });

}
function checkAreas(){
 var freq = [];
 var n =0;
 for(var i=0;i<47;i++){
  freq[i] = 0;
 }
 
 for(var i=0;i<inputData.length;i++){
  for(var j=0;j<univplace.length;j++){
   if(inputData[i][4]==univplace[j][1]){
    freq[univplace[j][0]-1] = freq[univplace[j][0]-1] + 1;
    n = n +1;
    break;
   }
  }
 }
 
 for(var i=0;i<47;i++){
  areas[i].number = freq[i];
 }
}

function file_read(file) {
    var name = file.name;
    var pattern = '.csv';
    
    // csvファイルのチェック
    if(name.indexOf(pattern) > -1){
        // readerオブジェクトを作成
        var reader = new FileReader();
        // ファイル読み取り
        reader.readAsText(file);

        // 読み込まれたファイルデータを渡す
        reader.onload = function(e) {
            make_view(e.target.result);
            jmapInterface();
            //console.log(inputData);
        };

        // 読み込みに失敗した場合
        reader.onerror = function() {
            alert("アップロードされたファイルが読み取れません");
        };
    }

}

  /**
   * https://qiita.com/hatorijobs/items/dd0c730e6faba0c84203
   * CSVの一行を引数に指定すると、
   * ""で囲まれた内部のコンマを分割せずに、
   * コンマで分割して配列の戻り値を返す関数
   * @param {string} line 文字列
   * @return {Array<string>} 配列
   */
function csvSplit(line) {
 var c = "";
 var s = new String();
 var data = new Array();
 var tmp = new Array();
 var singleQuoteFlg = false;
 var f = false;
 //var n = 0;

 for (var i = 0; i < line.length; i++) {
   c = line.charAt(i);
   if (c == "," && !singleQuoteFlg) {
     tmp.push(s.toString());
     s = "";
   }  else if (c == '"') {
     singleQuoteFlg = !singleQuoteFlg;
     if(!f){
      f = !f;
     }
   } else if (singleQuoteFlg) {
     s = s + c;
   } else if (f && !singleQuoteFlg ){
     tmp.push(s.toString());
     s = "";
     data.push(tmp);
     tmp = new Array();
     f = !f;
   } 
   
 }
 return data;
}

function make_view(csvarr){
    inputData = csvSplit(csvarr);

    //5カラム取得:現所属修正
    for (var i = 1; i < inputData.length; i++) {
        inputData[i][4] = get_aff(inputData[i][4]);
    }

	$("#list_table").append('<div id="list_table_content"></div>');
    $("#list_table_content").append('<table id="table1"></table>');
    $("#table1").append('<tr><th>'+inputData[0][1]+'</th><th>'+inputData[0][4]+'</th><th>'+
                            inputData[0][10]+'</th><th>'+inputData[0][11]+'</th></tr>');

    for (var i = 1; i < inputData.length; i++) {
        append_view("#table1",inputData[i][0],inputData[i][1],inputData[i][4],inputData[i][10],inputData[i][11]);
    }

}

//所属だけを抜き出す
function get_aff(aff){
 var c = "";
 var s = new String();
 var f = false;
 for (var i = 0; i < aff.length; i++) {
   c = aff.charAt(i);
   if (c == " ") {
     f = !f;
   } else if(c == ","){
     break;
   } else if(f){
     s = s + c;
   } 
 }
 return s;
}

//csvデータでHTMLを組む
function append_view(id,no,name,aff,nTake,nAch) {
    $(id).append('<tr>'
               + '<td><a href="https://nrid.nii.ac.jp/ja/nrid/10000'+no+'/" target="_blank">' + name + '</a></td>'
               + '<td>' + aff + '</td>'
               + '<td>' + nTake + '</td>'
               + '<td>' + nAch + '</td>'
               + '</tr>');
}