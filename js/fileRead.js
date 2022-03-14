// �ǂݍ��݃{�^����change�ɂȂ�������s
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
     heatmapLabelUnit: '�l',
     heatmapType: 'HRed',
     showHeatlabel: true,
     //Math.max.apply(null,areas.map(function(o){return o.number;}))
     heatmapConditions: ["<5", ">=5",  ">=15"],
     heatmapColors: ["#cccccc", "#FFA500", "#FF0000"],
     onSelect: function(e, data) {
        alert('�����҂� %d �l�ł��B'.replace('%d', (data.option.number).toLocaleString()));
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
    
    // csv�t�@�C���̃`�F�b�N
    if(name.indexOf(pattern) > -1){
        // reader�I�u�W�F�N�g���쐬
        var reader = new FileReader();
        // �t�@�C���ǂݎ��
        reader.readAsText(file);

        // �ǂݍ��܂ꂽ�t�@�C���f�[�^��n��
        reader.onload = function(e) {
            make_view(e.target.result);
            jmapInterface();
            //console.log(inputData);
        };

        // �ǂݍ��݂Ɏ��s�����ꍇ
        reader.onerror = function() {
            alert("�A�b�v���[�h���ꂽ�t�@�C�����ǂݎ��܂���");
        };
    }

}

  /**
   * https://qiita.com/hatorijobs/items/dd0c730e6faba0c84203
   * CSV�̈�s�������Ɏw�肷��ƁA
   * ""�ň͂܂ꂽ�����̃R���}�𕪊������ɁA
   * �R���}�ŕ������Ĕz��̖߂�l��Ԃ��֐�
   * @param {string} line ������
   * @return {Array<string>} �z��
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

    //5�J�����擾:�������C��
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

//���������𔲂��o��
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

//csv�f�[�^��HTML��g��
function append_view(id,no,name,aff,nTake,nAch) {
    $(id).append('<tr>'
               + '<td><a href="https://nrid.nii.ac.jp/ja/nrid/10000'+no+'/" target="_blank">' + name + '</a></td>'
               + '<td>' + aff + '</td>'
               + '<td>' + nTake + '</td>'
               + '<td>' + nAch + '</td>'
               + '</tr>');
}